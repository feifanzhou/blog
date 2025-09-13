---
title: 'Tanagram Roadmap: March 2024'
date: '2024-03-05'
updated: '2024-03-05'
slug: 'tanagram-roadmap:-march-2024'
excerpt: "Tanagram remains a nights-and-weekends project. My progress pace during February averaged about 1.5 workdays per week.\r\n\r\nWould you like to receive these updates over email? I'm also publishing these..."
---


Tanagram remains a nights-and-weekends project. My progress pace during February averaged about 1.5 workdays per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: February 2024
On the development side, I made a few improvements this month:
* When the user opens a project, Tanagram automatically starts loading all references for all symbols in the background (and shows a progress bar). This gets Tanagram closer to "zero setup required", which I believe is an important user-experience goal.
* As part of that automatic loading, I fixed some bugs with reloading/updating references.
* When the user builds their project in Xcode, Tanagram now automatically determines which files were changed as part of that build, and reloads references for files in that build. [Here's a demo](https://twitter.com/tanagram_/status/1762665550562652160).

At this point, Tanagram has a version (albeit buggy and slow) of the foundational infrastructure it needs to serve as a [reference graph](https://feifan.blog/posts/tanagram-roadmap:-august-2023). I'm now coming back to the question I've been putting off recently — what (small) set of features should I build to make Tanagram into a cohesive and useful product?

After a few conversations with friends and potential users this month, as well as some friction I've encountered in my day job,  I've come up with three potential product "shapes":

* A code search tool that understands the code and supports queries like "what are the test helper methods that return an instance of `SomeComplicatedModel`", or "what are all the methods available on this object that take an argument of type `Foo` and return an object of type `Bar`". Tanagram could also be used to find examples of how a given method is used in the context of an entire callstack, including (perhaps with a bit of setup) asynchronous event-consumer code. I imagine it would mostly be used by individual developers as part of their day-to-day work, or by some developers on a centralized team looking to enforce certain conventions and patterns. 
* A source-of-truth for code-related information, used across teams or even an entire company. Tanagram would be able to keep track of how code is used across modules, libraries and repos, enabling developers to identify infrequently-used code (which could potentially be removed to reduce build times) and avoid inadvertent breaking changes across libraries/repos. Tanagram would also allow teams to plug in other data sources, such as their feature flag system, observability tooling, and org chart to enable queries like "which team toggled a feature flag in the past day that would affect a given stack trace". 
* A tool for better collaboration and sharing understanding of code, used across teams and across companies, especially those with distributed developers. Developers could use Tanagram to generate programmatic diagrams or documentation based on queries of the codebase that automatically update when the code updates; these diagrams and documentation could also contain validations that notify someone when a particular condition is no longer programmatically true (so that the notified can make necessary updates). If someone asks a colleague to explain how some functionality works in the code, a developer could easily compile a list of positions in the codebase, along with annotations, and share that as a sort of "guided tour" through the codebase. Tanagram could also provide better ways of understanding and previewing/reviewing changes (e.g. capturing an existing invocation of some code and replaying it with a particular set of changes).

# Roadmap: March 2024
I'm on vacation during the first half of March. When I return, I'll explore each of these product shapes in more detail — mocking up designs for what they could look like and gathering feedback from friends and potential users.