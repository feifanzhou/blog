---
title: 'Tanagram Roadmap: October 2022'
date: '2022-10-03'
updated: '2022-10-03'
slug: 'tanagram-roadmap:-october-2022'
excerpt: >-
  This is my ninth monthly public roadmap update for Tanagram development (see
  previous updates here). I'm publishing this update to document my progress and
  hold myself accountable, and also provide a...
---


This is my ninth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1 workday per week, with some weeks being a bit higher.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: September 2022
I've continued to build demo-able UIs, enough to post a few screen recordings to Twitter:

<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en" dir="ltr">Putting the “I” in “IDE”: Define a data model, generate code for it (and UI to run that code), and write to the database all in one place. <a href="https://t.co/N3ZRlSbzVQ">pic.twitter.com/N3ZRlSbzVQ</a></p>&mdash; Tanagram (@tanagram_) <a href="https://twitter.com/tanagram_/status/1569052242384416768?ref_src=twsrc%5Etfw">September 11, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Here, I'm creating a Data Model item for a `Post` data structure, and then automatically generating a command to create one. Tanagram introspects the command to automatically generate a UI to collect inputs, and I fill out tho input fields to add a row to the data model storage.

These are the most interesting aspects of this, in my opinion:
- Being able to browse records for a data model alongside seeing its definition — this helps you get a better sense of what the data looks like than just seeing the schema. For example, in a codebase I work on, a bunch of data models have a field named `bin` of type `string`. A "bin" is an identifier used by an external system, but this codebase also has its own `Bin` model that wraps this external identifier with internal-use properties. For these data models with a `bin` field, some of them refer to the external identifier itself, whereas others refer to the ID of the internal `Bin` model, and it's impossible to determine which is the case for a given data model unless I pull up some example data records.
- Automatically generating a 'create' command — the code generation itself isn't particularly interesting, but I like the idea of giving a command the role of "one that creates a `Post` data model". It's like the idea of "initializer methods" in object-oriented languages — a class might have more than one of them, but they all serve the role of creating-an-instance. This generalizes to other roles — e.g. commands that are identified as one that publishes or consumes a particular event, or commands that are the top-level handler for an API endpoint. 
- Automatically generating UI from a command — I've [built this before](https://feifan.blog/posts/tanagram-demo-1), but I continue to think it's a great idea for generating CRUD UIs. There's no reason this should be limited to generating UIs _within_ the Tanagram IDE; it could generate an HTML form and serve it up over HTTP so that a user can define a data model and than instantly get a UI that they can distribute and use to gather responses.

Here's another demo:

<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en" dir="ltr">Querying codebase constructs that are stored as objects with properties: what was that command for creating favorites? What can I do with a `User`? How can I get a `User` instance in the first place? This feels more approachable than trying to grep for the right source code. <a href="https://t.co/bJfN64CuQW">pic.twitter.com/bJfN64CuQW</a></p>&mdash; Tanagram (@tanagram_) <a href="https://twitter.com/tanagram_/status/1571557723439005697?ref_src=twsrc%5Etfw">September 18, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Here, I'm querying the commands in this codebase using predicates over _properties_ of commands (in this case, properties are `id`, `title`, `description`, `inputTypes`, and `outputType`).

These are the most interesting aspects of this, in my opinion (and why [a strictly-typed language and IDE doesn't solve this](https://twitter.com/vivalapanda_/status/1571571631906258944?s=21&t=o6nMHoI17p_khS2rZT-T5w)):
- Codebase constructs having well-defined properties — in this example, it's not a stretch to say that a command is _supposed_ to have those properties list above. If you wanted to insist that commands have descriptions, or even enforce a particular description format, you could imagine surfacing that in a visually-apparent way directly in the UI. Attributing properties to codebase constructs also allows you to go beyond features that are supported syntactically in a language itself. For example, in most programming languages, there's not an official way to mark a method as deprecated or to indicate which alternative(s) to use instead. In a well-maintained codebase, there may be a code comment saying "this is deprecated" or "don't use this" or "here be dragons", and in your brain you may implicitly set the "isDeprecated" property of a method to "true". It would be valuable to have a canonical place to officially link such an attribute to any item in a codebase, even if there's no way to do so in the programming language itself.
	- One particularly important property is `id`, which is separate from the "name" or "title" of a code item. Names (and filepaths, which are almost always just the same name plus a prefix) change somewhat frequently as a result of refactors and reorgs. Without stable identifiers to refer to a code item, docs and diagrams quickly fall out-of-date.
- Being able to query codebase constructs in complex ways — this example shows some simple boolean predicates, but that's only constrained by the extent of my demo data structures and UI. With a well-defined property schema, you could write more complex queries, including queries that involve data that exists outside the textual source code itself. Here are some hypothetical examples using SQL:
	- You could enforce a naming convention where all commands that return a boolean have names starting with `is`: `SELECT id, name FROM commands WHERE outputType = 'boolean' AND name NOT LIKE 'is%';`
	- You could join commands to execution history to find out how frequently a command is executed: `SELECT date_trunc('day', execution_history.started), count(*) FROM execution_history JOIN commands on execution_history.command = commands.id GROUP BY 1;`.
	- You could find commands added recently that modifies the `content_md` field on `Post` data models (building on the "role" idea from above): `SELECT id FROM commands JOIN version_control WHERE command.role = 'update' AND command.role_target = 'post.content_md' AND version_control.action = 'add' AND version_control.timestamp > now() - interval '1' day;`.

And finally, this one:

<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en" dir="ltr">Queries can be parameterized: create a Datum item (basically a fancy constant), and have users modify that instead of the query itself. <a href="https://t.co/yv6xPmRt2O">pic.twitter.com/yv6xPmRt2O</a></p>&mdash; Tanagram (@tanagram_) <a href="https://twitter.com/tanagram_/status/1576652425510891520?ref_src=twsrc%5Etfw">October 2, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Here, I'm extending the demo above by parameterizing the query with a Datum item. I've [talked about Datum items before](https://feifan.blog/posts/tanagram-roadmap:-july-2022); I think they're interesting for a few reasons:
- In many projects, some config is defined in source code, in a mix of programming-language constants and YAML/JSON/XML config files. Other config is defined as database records. There's advantages and disadvantages to both approaches, but it's _weird_ to have different ways of defining things (and to access/modify those definitions). To use an example from above, if I want to find how a `bin` with the external ID `123456` is defined, it's unclear whether I should be searching the source code or the database. That distinction doesn't exist in my brain — the notion of "the definition for bin `123456`" is its own thing.
- In a project where ~everything is built in Tanagram, the Datum item type can become the canonical way to parameterize things. Rather than using environment variables or config files to parameterize running code, you can use a datum. Rather than giving a non-technical coworker an example of a SQL query and explaining how to modify it for their needs without breaking the syntax, parameterize it with a datum.

# Roadmap: October 2022
I've been doing some more thinking about my product strategy. The fully-integrated IDE I've been sketching — in which I envision that users will build programs by combining items of about a dozen different types, and managing the entire deployment and runtime experience within the same IDE — is probably not the right product to build **at first**, for a few reasons:
- It's a lot to build, and I'm hesitant to spend _that_ much effort building before even being able to use it myself. I've struggled to identify a small vertical slice within that product vision that I think would be a compelling tool.
- It doesn't really integrate with existing programs and tools, written as plain-text files in an editor like VSCode. My answer to this so far has been that Tanagram could be integrated into an existing _project_ by using it to build a new service. I don't think that's wrong, but it does significantly constrain the set of potential users (probably too much for an early-stage product).
- It's hard to explain to people — a lot of developers have a strong predilection to thinking of programs in terms of files and lines of text instead of the conceptual items they represent. Explaining a programming environment where the primary interaction is clicking around to create items and the source code is somewhat of a secondary consideration is a difficult proposition when presented all at once.

I'm still excited about the integrated IDE idea, but I think that's a longer-term product that I can incrementally build towards. In the meantime, these are some more specific problems with the task of programming that are within the scope of what I want Tanagram to solve and also resonate with people:
- The ability to document and explain a (meaningful chunk of a) codebase in a durable way that doesn't depend on links to specific lines of code or names that could fall out-of-sync.
	- An extension of this idea is to be able to define a property schema and "overlay" those properties alongside the codebase without having to change the code itself.
	- The documentation and schema can be shared and collaboratively edited by a team.
	- I'd love for it to be able to generate visual diagrams where nodes, edges, and annotations can be programmatically determined so they stay in sync with, and can link back to, the codebase.
- The ability to record and replay logical actions — essentially being able to load a code invocation that's already happened into a debugger and step through it.
	- You could add comments to any part of the execution trace and share a link to it — a coworker could see and run the code exactly as it happened during the original execution to help with debugging.
- The ability to understand what a particular change is doing more robustly than eyeballing a pull-request diff and trying to think through the consequences.

I envision all of these laddering up to an eventual version of Tanagram as an item-based IDE coupled to a custom runtime. The runtime will make this version of Tanagram incompatible with existing codebases, but it would enable things like being able to replay an execution recording using the original inputs, but running code from a pull-request. Tanagram could have its own pull-request/change-management interface where, as part of CI, the system finds relevant execution records that exercise the changed items and outputs the results that _would have happened_ with the new code.

I'm still incredibly excited about building a programming environment that could do things like that. I think I'll need to build some incremental products along the way (to earn some distribution and refine the individual ideas). I'll spend October working on the first of these.