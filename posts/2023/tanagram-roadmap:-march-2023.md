---
title: 'Tanagram Roadmap: March 2023'
date: '2023-03-05'
updated: '2023-03-05'
slug: 'tanagram-roadmap:-march-2023'
excerpt: >-
  This is my fourteenth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my fourteenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged a bit less than 1 workday per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: February 2023
Progress in February was slow, in part because I was moving and traveling throughout the month, and also because I was blocked on figuring out how to actually get results from SourceKit-LSP for a while.

After a few months of nomading, I've moved back to San Francisco proper, and I'm really excited to be back in the city. It feels vibrant (most of the time), and I love being able to walk everywhere. If you're in SF (or, really, anywhere around the bay) and are working on creating new programming environments, I'd love to chat! Twitter is the best way to reach me, but you can also email my first name at hey.com. Coffee will be on me. 

From last month, I commited to working on integrating Swift support, and I predicted that the hardest part would be working with the language server over stdio (mainly because of the attendant refactor I'd have to do to make it work alongside a socket-based approach). This turned out to be mostly straightforward; I was able to send an `initialize` request and receive a response (without breaking existing code) after a few evenings. However, I was consistently getting an empty array back for `workspace/symbol` requests, and it took me a few (sporadic) weeks — with access to the SourceKit-LSP source and `print`-laden debug builds — to figure out how to get the response I was actually looking for. I've [written a post](https://feifan.blog/posts/how-to-use-sourcekit-lsp) about what I've learned. But by the end of the month, I was able to load [all the symbols in the Tanagram codebase](https://twitter.com/tanagram_/status/1630743906169274368?s=61&t=kgpvC_l38QqEC5a05cZd_A)!

It's not great yet. The results take a while to load (partly because of an ugly hack I used to get it to return _all_ the symbols), and I think it's loading too many symbols — it's including symbols from package dependencies, which is _not_ what I'm looking for most of the time. So I'll have to clean that up.

# Roadmap: March 2023
Dogfooding Tanagram on its own codebase has already already shown me something I can improve — this weekend, I'm working on a scope bar to limit symbols to certain parts of the codebase. At first, this will allow me to filter out symbols from my package dependencies and limit results to the code I've actually written. Eventually, users should be able to define custom scopes, which should be useful for larger repos (e.g. monorepos containing multiple projects) with clearly-defined boundaries.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2023-03-roadmap/scope-bar.png)

After that, I continue to think live-updating as the underlying code changes is part of Tanagram's minimum viable functionality, so I'll work on that.

I also have some ideas that I think are compelling for code documentation, and I think I'll end the month with that in-progress.

Finally, I've had friends ask for Typescript and Python support so they can start using Tanagram with their existing codebases. I don't think I'll get to that in March, but adding language server integrations for those languages will probably happen in April.