---
title: There’s More to Coding than Just Writing Code
date: '2018-03-26'
updated: '2018-03-26'
slug: theres-more-to-coding-than-just-writing-code
excerpt: >-
  For most of my life I firmly believed that a Computer Science degree wasn’t
  necessary to work as a software engineer; there exists a massive amount of
  resources and practice opportunities to learn...
hero_image: 'https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/more-to-coding.jpg'
---


For most of my life I firmly believed that a Computer Science degree wasn’t necessary to work as a software engineer; there exists a massive amount of resources and practice opportunities to learn outside of the context and cost of a university degree. I maintained this perspective even after I ended up getting a CS degree, partly because of the [lack of practical skills in a typical CS program](https://medium.com/@feifanz/hello-real-world-b3592150339).

I still don’t think a CS degree is a requirement, but more recently I’ve realized that it’s a very good proxy for a baseline of skills and ways of thinking. If nothing else, a CS degree indicates that someone has spent a lot of time understanding software patterns, becoming familiar with a range of patterns, and developing the basic abstractions necessary to understand more complex problems.

This post is based on observations from my personal life and interviewing junior and mid-level engineers for work. I taught myself to code in high school from a few books, got a CS degree along the way, and continue to refine my software thinking through higher-level books and videos. I work at Trustwork, a seed-stage startup in San Francisco with four engineers. For the near future, we’ve made the choice to prioritize shipping speed over harnesses and processes to train very junior engineers; at our size we don’t believe it’s possible to be great at both. This perspective underlies this post. This post is not intended to be specific to any technology, language, or library. This post doesn’t split semantic hairs — I use the terms _code_ and _software_, _developer and engineer_, etc interchangeably. 

# Understanding Software

At a first approximation, learning to code simply means learning to write code — the act of manual code generation. The much more valuable component is learning to think about software. In my experience, the latter is almost completely overlooked by existing resources.

The former approach conflates the skill of coding with the act of typing code. This approach generally consists of a rough project description, code listings, and descriptions of what the code literally does. The teaching approach is essentially “write this code, in the right place, and you’ll have a working project, which means you’ll understand what we did”. Success comes from carefully following instructions, and understanding rarely happens. The outcome for going through this form of training is someone who is very good at rote syntax pattern matching, someone who is good at putting network calls in the relevant framework-provided method and filling in boilerplate.

Admittedly, a lot of software is little more than boilerplate, but that’s a different topic.

Pattern-matching on syntax breaks down as soon as the syntax or framework looks unfamiliar. Instead, being able to pattern-match concepts and abstractions is much more valuable. For example, both snippets below represent a network request, even though they look very different.

```javascript
// Stub a network request
new Promise((resolve, reject) => {
  const dummyUser = {
    name: 'Test User',
    birthdate: '2001-01-01',
    address: '3547 23rd St'
  };
  const waitTime = Math.random() * 2 + 3; // Between 3–5 seconds
  setTimeout(() => resolve(dummyUser), waitTime);
});

// A real network request
request.get(true, usersShowPath(user.id));
```

Put differently, concepts and abstractions are the vernacular of software. As with human languages, an intuitive understanding of constructs and slang are a core part of being a native speaker.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/more-to-coding-1.gif)

# Building Software

Syntax pattern-matching facilitates _building up_: writing software from a foundation to successively higher levels of abstraction. For each layer, the developer can take advantage of an intuitive understanding of the layer below because she just wrote it. She understands the abstraction, and can therefore make progress.

However, this doesn’t work if she’s asked to build down: plugging code into existing use cases or implementing an interface. During our interviews, we test this by showing candidates a code snippet and describing its intended behavior, and asking them to implement the API being used to make the code snippet work. Candidates who do well here are able to identify the functional concepts in the code snippet, as well as the potential seams in the stack of abstractions where they can insert their implementations. In other words, they’re comfortable being dropped in the middle of a stack of abstractions and building both up and down.

# Thinking about Software

Beyond building software is building _great_ software. There are many ways to define great code (elegant, clear, performant, well-documented, etc), but producing any kind of great software requires thinking about the code both granularly (perhaps in picking the best name for a function) and abstractly (perhaps when refactoring for readability or better performance).

Across the spectrum, this can only be done with a deep, intuitive understanding of both the application code at hand, and the breadth of existing software implementations and developer expectations.

A deep, intuitive understanding is characterized by simplicity — the hallmark of such an understanding is the ability to explain the subject in one short, clear sentence. It comes from wallowing in the complexity, understanding the subject one line or short chunk at a time, pattern-matching ideas and abstractions, until the whole subject becomes something you can hold in mind all at once. You can inspect the idea from different angles, zoom in to confirm details, and use it as a building block to understand a bigger subject. Some would call it _grokking_ the subject.

# Bonus: CS as a Common Language

_Credit to [David Ko](https://twitter.com/davidjosephko) for this line of thought_

Practicality aside, the traditional CS topics form a common foundation and vocabulary when talking about software.

For data structures, a deep, intuitive understanding of how strings, arrays, hashes, and sets covers 99% of the code we write. A “deep, intuitive understanding” might be defined as being able to implement each of those data structures and some of their common functionality using the primitives of a language like C (where there are no existing standard library to hide behind).

For algorithms, I think being able to evaluate performance is more important to knowing how to implement any of the traditional ones. This means understanding what Big-O represents, and, crucially, choosing the relevant N. This also means knowing [common latencies](https://people.eecs.berkeley.edu/%7Ercs/research/interactive_latency.html) to within an order of magnitude, and being able to identify bottlenecks in an implementation.