---
title: 'Tanagram Roadmap: November 2023'
date: '2023-11-05'
updated: '2023-11-05'
slug: 'tanagram-roadmap:-november-2023'
excerpt: >-
  This is my 22nd monthly public roadmap update for Tanagram development (see
  previous updates here). Tanagram remains a nights-and-weekends project. My
  progress pace over the past month has averaged...
---


This is my 22nd monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.0 workdays per week; some personal errands and day-job projects have kept me busier than usual.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: October 2023
I spent my development time this month implementing some foundational pieces.

First, I built a debug UI to see the requests being sent to my language server as well as their responses. It looks like this:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2023-11-roadmap/lsp-requests-responses-window.png)

It's already helped me debug a few bugs, mostly around deduplicating items in the sidebar as well as figuring out why some results that were in the JSON response were not showing up in the UI.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2023-11-roadmap/sidebar.png?)

I also re-wrote my LSP client code to turn it into a Swift actor and correctly use structured concurrency. It's made that part of the codebase a lot cleaner, but it took a while to fix all the compiler errors and shake out all the bugs. This rewrite will give me a solid foundation to tackle a major usability problem: Sourcekit-LSP is very slow to load incoming/outgoing references the first time those methods are requested — on Tanagram's own codebase, as of a few weeks ago, it took about 80 seconds. Instruments shows that it's all single-threaded and CPU-bound, doing something involving ASTs and constraint-solving. SourceKit itself is closed-source, and the Instruments data tells me it's a slow algorithm that I likely can't do much about, so I have to adapt by preloading such a request as soon as the user opens a project in Tanagram. Having a strong concurrency foundation allows me to avoid race conditions as the user clicks around the app while that initial request is loading.

At this point, I've only rewritten my Swift client code; I haven't updated my Typescript or Ruby client. However, all my callsites have been updated to expect the new client shape, so Tanagram now only supports Swift projects. Long-term, I do intend to add support for additional languages, but I think it makes sense to narrow my focus to exclusively supporting Swift for now. I've had to introduce plenty of language-specific logic.

I didn't get to have user-research conversations with new potential users, but I did have a few discussions with friends/colleagues/potential future collaborators. A few takeaways from those conversations:
* In one conversation, we agreed that attempting to render the whole reference graph for a codebase from the start would be overwhelming (both technically and visually). One alternative to consider is the idea of "fog of war" from video games — the user can explore out from a focus area in the graph, and areas further away are hidden or rendered in less detail. 
* We explored the idea of some generic way to identify patterns in any programming language — e.g. if a comment is written immediately before a block of code, then you could reasonably create a link between that comment and the subsequent block of code.
* It's important that users can easily create or adopt pattern definitions without needing a lot of upfront investment to create definitions; at larger companies, where there may be "developer infrastructure" teams, they would be unlikely to invest a lot in setting up a tool without being able to demonstrate value along the way.
* Rolling out a new tool across a team/company necessitates some internal stakeholder(s) who will agree to provide support for that tool.
* Combined, the above supports my hypothesis that Tanagram will have a better chance of finding initial users in individuals who may work in larger teams, rather than trying to sell to whole teams up-front.

# Roadmap: November 2023
My working hours will continue to be a bit more limited this month.

On the development front, I'm focusing on top issues limiting usability, starting with the slow-initial-request I described above. I expect that implementing pre-loading will improve usability once the user actually starts clicking around. After that, I'll work on usability improvements for the reference graph search.

I'll continue to have user-research conversations, focusing on people who work on larger codebases where navigating and understanding are more of a challenge.

Finally, I'm giving [a talk](https://www.meetup.com/swift-language/events/296958216) about the Language Server Protocol and Sourcekit (featuring Tanagram cameos) this Thursday (November 9th). I think that will lead to more people I can talk to about Tanagram and what they'll find useful.