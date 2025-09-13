---
title: 'Tanagram Roadmap: September 2023'
date: '2023-09-04'
updated: '2023-09-04'
slug: 'tanagram-roadmap:-september-2023'
excerpt: >-
  This is my twentieth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my twentieth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1 workdays per week, maybe a little more.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: August 2023
I spent about half of my development time this month improving and fixing the Swift compilation database creation wizard that I had started in July. It's a pre-req to supporting Swift projects, so it was important that I got it right … and there were many details and edge cases to get right. This was also the first part of my codebase where I started using [TCA](https://github.com/pointfreeco/swift-composable-architecture), which was a bit of a rabbit hole (albeit pleasant). TCA effects are `async` by default, so this was also my first foray into Swift's structured concurrency. I liked using TCA, and I would like to extend its use to other parts of my codebase, although I'm not explicitly planning to rewrite existing code anytime soon.

During the remainder of my development time, I started implementing the reference graph that I described [last month](https://feifan.blog/posts/tanagram-roadmap:-august-2023), which has involved several sub-plots (I've only explored this with SourceKit-LSP so far):
* Understanding the language server's behavior characteristics: after some experimentation, it turns out that SourceKit-LSP is not built for low-latency or concurrent requests. When I open Tanagram's own codebase, which is about 1500 global symbols (classes, methods, enums, etc) over about 50 source files, the first `prepareCallHierarchy` request (which is a prerequisite step to loading references) takes about 70 *seconds* to return a result. Subsequent calls take about 300ms on my computer (plus about 50ms more to actually get references after `prepareCallHierarchy`). SourceKit apparently doesn't support concurrent `prepareCallHierarchy` requests; making such a request will cancel any previous requests. These times are prohibitively slow for loading all references in a straightforward way; I will have to come up with a more clever/complicated solution.
* References returned for a particular symbol might include symbols from the standard library or other libraries (i.e. if one of my methods invokes a standard-library method), but these symbols weren't included in the original symbol database. I had to add support for these built-in symbols.
* SourceKit's references are not bi-directional: e.g. a method might have an outgoing reference to a class (because it invokes a method on that class), but the class would not have an incoming reference to that method. That doen't seem right to me — I think all such references should be bidirectional — so I had to fill in the gaps in my database logic.
* I started rendering these references in a graph view. I'm not entirely convinced that a graph UI is actually useful, especially once it gets busy, but it might be for smaller sections of a codebase, and it demos well. After some struggles with trigonometry and inverted coordinate systems, this is what it currently looks like:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2023-09-roadmap/references-graph-preview.png)

I sent an updated build to some friends this month, but they ran into an issue with the compilation-database generation that I hadn't encountered myself. I've realized that, at this early stage, sending builds to friends remotely isn't a good way to gather feedback; instead, I'll start testing with people IRL once I have a product that's a bit more useful. I think I'll cross that threshold once I have this reference graph browser.

In the meantime, I've continued talking to potential users. Some takeaways from my three conversations this month:
* There's definitely value in being able to browse reference graphs across codebases: one friend described Google's internal code-search tool which has such functionality; another friends leads a whole team working to bringing visibility to data flow across their (very distributed) systems. This tooling is complex and enterprise-y though, so I think there's room for something that provides functionality like that in a much easier-to-use package.
* Most developers work on teams where code search is limited to regex, and they make do using a combination of regex hacks and mental memory or a scratch pad of results.
* One person described a project that was built on a robust library; they figured that if they were more familiar with the full extent of what the library could do, they'd be able to reduce the amount of code they've manually written by 10×. I'm not sure what to do about this feedback specifically, but it echoes a refrain I've heard a few times about wanting to understand semantic/structural patterns in a codebase, or the "spookiness" of making broad changes.

# Roadmap: September 2023
I'll continue to do user-research conversations this month, focusing on people who work on larger teams/companies with established codebases.

On the development front, I'll continue working on the reference graph browser — rendering the reference graph, implementing traversals/searches through the graph, and perhaps additional UI for viewing the results of searches.

I'll also update my JS/TS support to make it work with my reference-graph code, which will enable me to reach more friends, many of whom are building in JS/TS rather than Swift.