---
title: An Introduction to jscodeshift
date: '2018-07-07'
updated: '2018-07-07'
slug: an-introduction-to-jscodeshift
excerpt: >-
  Recently, I had to make a straightforward change over dozens of files spread
  across our entire frontend codebase. I didn’t like the idea of finding all the
  files and manually make the change; in the...
---


Recently, I had to make a straightforward change over dozens of files spread across our entire frontend codebase. I didn’t like the idea of finding all the files and manually make the change; in the spirit of laziness-driven-development, I decided to figure out a way to script it. I’d discovered [jscodeshift](https://github.com/facebook/jscodeshift) a few months ago as an interesting tool to explore and bookmarked it for “later”, and this was a perfect opportunity to actually do that.

# Background

jscodeshift didn’t include many details on how to get started with the tool and get things done, so I had to figure things out based on source code, other blog posts, and background. Before diving into my task and a solution, some general background will help explain the concepts involved.

In any programming language, the source code is a way of representing ASTs in text. ASTs (“abstract syntax trees”) are data structures that describe the intent of some code. Take this code, for example:

```javascript
const getProjectStats = {
  type: GET_PROJECT_STATS,
  promise: request(true, getProjectStatsRoute(), 'GET'),
};
```

In human terms, we might describe this code as a constant declaration whose value is an object with two properties; the value for the second property is a function call with three arguments — a literal value, a function call, and another literal value.

The "real" AST is more pedantic, but has the same shape:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/jscodeshift-ast.png)

jscodeshift provides a way to work with AST data structures: finding and editing code as objects and arrays, rather than strings. For example, with an AST data structure, the arguments to a function call are available as an array; the third argument is accessible as `callExpression.arguments[2]`. This is a much more reliable way of working with code than by trying to parse split it as a string or capturing with regexes — imagine, for example, that the function call was sometimes on one line, and sometimes spread out across multiple lines.

The AST for a given piece of code usually isn’t obvious, but a tool like [astexplorer.net](http://astexplorer.net/) provides an interactive way to discover the AST for a piece of code.

![The AST is interactive — hover over an AST node to highlight the corresponding code; click on a piece of code to highlight the corresponding AST node(s).
](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/jscodeshift-astexplorer.png)

# Using jscodeshift

Jscodeshift is really easy to install:

```shell
npm install -g jscodeshift
```

Once installed, it’ll be available as a CLI tool. It works by taking a transformation function and applying it independently to a set of files.

# Transformation function

The transformation function is defined in a file that exports a function like this:

```javascript
module.exports = function(fileInfo, api, options) {
  // transform `fileInfo.source` here
  // ...
  // return changed source
  return fileInfo.source.toSource();
};
```

A transformation function operates on one file; `fileInfo` contains two properties: `path`, which is the filesystem path to the file, and `source`, which is the source in the file.

`api` contains two properties: `stats`, which is a function that can be used to help in debugging, and `jscodeshift`, which is a reference to a library containing many useful things for working with ASTs. This intro will use the functionality provided by the library, but you don’t have to use them — since ASTs are just data structures (arrays and objects), you can modify them in any way.

`options` contains parsed versions of command-line arguments to a `jscodeshift` run in the terminal. It’s useful for passing custom options to your function.

The function should return the new source code — typically, this involves calling the `toSource()` method on the AST data structure once you’re done with it. However, if the file should be unchanged, it’s ok to return nothing (as in, `if (notRelevantFile) return;`).

# An example

```javascript
/*
 * Slightly modified from jscodeshift`s README:
 * This renames every occurrence of variable "foo" with "bar".
 */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const doc = j(fileInfo.source);
  return doc
    .findVariableDeclarators('foo')
    .renameTo('bar')
    .toSource();
}
```

A few things to note with this example:

* `api.jscodeshift` is aliased to `j`, which makes it easy to type in subsequent examples. It doesn’t matter as much in this example, but most real-world transformations will be extensive use of the functionality exposed in `api.jscodeshift`. `j` is somewhat of a convention (as far as I can tell, looking at code examples online).
* `api.jscodeshift` itself is a function that, when invoked with the `source` of the file, returns the root of the AST tree. All operations on any sub-node are possible from this root, and at the end, simply return the result of calling `toSource()` on the root.
* Most of the functions exposed by `api.jscodeshift` and its result are chainable; each step in a transformation will typically involve a chain of a few functions.

The results of calling `api.jscodeshift` on a file source is a `Collection` object. The documentation for this is [in the jscodeshift repo](https://github.com/facebook/jscodeshift/tree/master/docs), although it doesn’t appear to be published anywhere. You can clone the repo and open the HTML files to view the available methods. In the example above, `findVariableDeclarators` is a method on `Collection` objects, as is `find` and `forEach` (used below).

# To business

In our codebase, we had been using promises in our Redux actions for network requests (and a promise middleware to execute them). [Basic Redux stuff](https://redux.js.org/advanced/example-reddit-api). However, promises didn’t reify *what* they did, which made them more difficult to test (give a promise, it’s not possible to easily determine what URL it’s requesting, what payload it might be passing, or if it is in fact a network request at all). As a result, we recently introduced a data structure for representing network requests, which exposed all the relevant attributes as properties with initializers and getters.

I wanted to replace the old promises with the new data structure. The code would look like this:

```javascript
// Before:
export const getTemplates = () => ({
  type: GET_TEMPLATES,
  promise: request(AuthHelper.isUserLoggedIn(), getTemplatesroute(), 'GET'),
});
 
// After:
export const getTemplates = () => ({
  type: GET_TEMPLATES,
  request: new TWRequest({
    auth: AuthHelper.isUserLoggedIn(),
    method: 'GET',
    path: getTemplatesRoute(),
  }),
});
```

Essentially, the `promise` key in the action object should be requested with a `request` key and an instance of `TWRequest`, which would be initialized with an object containing the same values that were passed to the `request` function before.

# The codemod

Getting started, the first thing I attempted was to try replacing the `promise` key name with `request`.

```javascript
// codemods/1529784668147-replace-action-promises-with-requests.js
module.exports = function(fileInfo, api, options) {
  // In our codebase, this change is only relevant to files named actions.js
  if (!fileInfo.path.match(/actions\.js$/)) return null;
  const j = api.jscodeshift;
  return j(fileInfo.source)
    .find(j.ObjectExpression)  // Find a list of object literals
    .forEach(obj =>            // For each object literal …
      obj.value.properties.forEach(property => {
        // … go through each property …
        if (property.type !== 'Property') return;
        if (property.key.name !== 'promise') return;
        // … and if the key is 'promise', change it to 'request'
        property.key.name = 'request';
      });
    )
    .toSource();
};
```

To run this:

```shell
jscodeshift ./web/src/shared/containers/AdminStats -t codemods/1529784668147-replace-action-promises-with-requests.js -dp -v 2 --parser flow
```

The first argument is the directory in which you want to run the transformation; `jscodeshift` will recursively apply the transformation to all files within. I specified a specific directory while testing because I knew it would only apply to one file, which would keep the output small and perusable.

The other options:

* `-t` specifies the transform file
* `-d` indicates a dry run (it won’t write changes to files),
* `-p` prints the transformed output to the console
* `-v` specifies the verbosity of the output
* `--parser flow` indicates that [Flow](http://flow.org/) should be used to parse our code — this adds support for Flow-specific syntax, such as type annotations.

![The output looks like this. jscodeshift skips files for which we return nothing.](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/jscodeshift-1.png)

Pleasantly surprised that it worked, the next thing was to replace the the call to `request` with `TWRequest` instances. In prosaic terms, we want to take the arguments to `request`, move them into values in an object literal with the corresponding keys, initialize a `TWRequest` instance with the object literal, and set that as the value of the property in the action.


```javascript
module.exports = function(fileInfo, api, options) {
  if (!fileInfo.path.match(/actions\.js$/)) return null;
  const j = api.jscodeshift;
  return j(fileInfo.source)
    .find(j.ObjectExpression)
    .forEach(obj =>
      obj.value.properties.forEach(property => {
        if (property.type !== 'Property') return;
        if (property.key.name !== 'promise') return;
        const requestCall = property.value;
        // 5th arg to `request` is `options`, which TWRequest doesn't yet support
        if (requestCall.arguments.length > 4) return;
        // Ignore non-direct call to `request`; can't reliably transform syntax yet
        if (requestCall.callee.name !== 'request') return;
        property.key.name = 'request';
        const twRequestParams = [
          // TWRequest params
          j.property('init', j.identifier('method'), requestCall.arguments[2]), // Method param
          j.property('init', j.identifier('path'), requestCall.arguments[1]), // Path param
        ];
        if (requestCall.arguments[0].value !== true) {
          // First argument to `request` is authRequired
          // TWRequest defaults to auth: true
          // Only need to set auth on TWRequest instance if it's not `true` in original call
          twRequestParams.unshift(
            j.property('init', j.identifier('auth'), requestCall.arguments[0])
          );
        }
        if (requestCall.arguments[3]) {
          // 4th argument to `request` would be the body (payload)
          twRequestParams.push(
            j.property(
              'init',
              j.identifier('payload'),
              requestCall.arguments[3]
            )
          );
        }
        property.value = j.newExpression(j.identifier('TWRequest'), [
          j.objectExpression(twRequestParams),
        ]);
      })
    )
    .toSource();
}
```

![The output looks like this, which is exactly what we want.](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/jscodeshift-2.png)

Once the test output has been verified, we can run the codemod on the real files:

```shell
jscodeshift ./web/src/ -t codemods/1529784668147-replace-action-promises-with-requests.js -v 2 --parser flow
```

Here, we have to create new AST nodes to replace the existing ones that correspond to the call to `request`. `api.jscodeshift` provides methods to create nodes — for example, `j.objectExpression` creates an AST node that represents an object literal, and `j.property` creates an AST node that represents a property within an object literal.

[astexplorer.net](http://astexplorer.net/) can be used to figure out which types of nodes need to be created. Input the code you want on the left, and the output on the right shows the types of nodes you’ll want to create and the data structure you’ll want to assemble.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/jscodeshift-3.png)

`jscodeshift` is built on top of the [ast-types](https://github.com/benjamn/ast-types) library, and the node constructors follow the structure defined in the [`def`](https://github.com/benjamn/ast-types/tree/master/def) folder. For example, an object expression node is [defined as](https://github.com/benjamn/ast-types/blob/master/def/core.js#L206-L209):

```javascript
def("ObjectExpression")
  .bases("Expression")
  .build("properties")
  .field("properties", [def("Property")]);
```

The relevant lines are the `.build`, which corresponds to the arguments the constructor expects, and the `.field`, which define the type of each field. Therefore, an `ObjectExpression` constructor expects one argument, which is an array of `Property` nodes — this corresponds to `j.objectExpression(twRequestParams)` in the example above.

Similarly, `Property` nodes are [defined as](https://github.com/benjamn/ast-types/blob/master/def/core.js#L212-L217):

```javascript
def("Property")
  .bases("Node")
  .build("kind", "key", "value")
  .field("kind", or("init", "get", "set"))
  .field("key", or(def("Literal"), def("Identifier")))
  .field("value", def("Expression"));
```

Therefore, a `Property` constructor expects three arguments. The first is one of `"init"`, `"get"`, or `"set"`, and represents the kind of property. In our example. the [astexplorer.net](http://astexplorer.net/) output indicates that we want `"init"`. The second argument is either a `Literal` node or an `Identifier` node (we’re using `Identifier`s), and the third argument is an `Expression` node. This is how we create `Property` nodes in our example: `j.property('init', j.identifier('auth'), requestCall.arguments[0])`. We know the arguments to the original `request` call are `Expression` nodes because they are [defined as such](https://github.com/benjamn/ast-types/blob/master/def/core.js#L304).

It’s not immediately obvious where the definition for a particular node type lives. Fortunately, it’s easy to search the ast-types repo on Github, and Cmd+F helps narrow down results within a file.

# Summary

jscodeshift is a tool; there are many ways to use it once you figure out the primitives. For me, the hardest part was understanding that its usage is basically manipulating AST nodes, and that the nodes are simply normal Javascript objects and arrays, which can be created using the definitions in the ast-types repo.