---
title: 'Tanagram Roadmap: February 2024'
date: '2024-02-06'
updated: '2024-02-06'
slug: 'tanagram-roadmap:-february-2024'
excerpt: >-
  Tanagram remains a nights-and-weekends project. My progress pace during
  January averaged about 1.0 workdays per week.
---


Tanagram remains a nights-and-weekends project. My progress pace during January averaged about 1.0 workdays per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: January 2024
I spent most of my development time in January rewriting the way Tanagram provides source/compilation information to SourceKit-LSP. Previously, Tanagram [used](https://feifan.blog/posts/how-to-use-sourcekit-lsp) a compilation database — a JSON file listing every compiled source code file and the compiler arguments used to compile each file. However, Xcode doesn’t generate compilation databases by default, and there’s no easy/obvious way to make it do so. My previous implementation therefore relied on manually running a clean build (to make sure all source files were compiled), parsing Xcode’s build log, and generating a compilation database from that. It worked, but it was a terrible user experience: Tanagram wouldn’t know about source code changes until/unless the user remembered to manually run a clean build again (with Tanagram-specific settings); clean builds usually take a very long time; and it adds additional steps to users’ workflows. 

I’d wanted Tanagram to be able to automatically update its reference graph when it detected changes to source files. The next best option would be for Tanagram to update its reference graph upon Xcode builds, including incremental builds (the kind that users make all the time with ⌘B or ⌘R). The latter was more realistic because SourceKit-LSP itself only updates its index [upon builds](https://github.com/apple/sourcekit-lsp?tab=readme-ov-file#indexing-while-building). 

To achieve this, [Alex Hoppen](https://alexhoppen.de) suggested I look at [xcode-build-server](https://github.com/SolaWing/xcode-build-server). This project takes advantage of SourceKit-LSP’s [Build Server Protocol](https://build-server-protocol.github.io/docs/specification/) support to provide compilation information for Xcode projects on-the-fly. Effectively, instead of having a static compilation database file, SourceKit-LSP can request compilation information for specific files from a build server at runtime, and this build server parses Xcode build logs to provide that information. xcode-build-server automatically loaded information from Xcode’s most recent build log, allowing SourceKit-LSP to update its response dynamically as the underlying source code changed. I posted [a demo](https://twitter.com/tanagram_/status/1752896120752324900): here, the “Incoming References” for a particular symbol, whose results come from SourceKit-LSP changed upon refresh as I changed the source in Xcode and ran an incremental build with ⌘B — no clean build required.

This user experience is a lot better than before. I’m really happy with this change. It also allows me to remove some complex UI code guiding users through creating a compilation database, which is a nice bonus.

# Roadmap: February 2024
I don't yet have a specific aspect I want to work on in February. Instead, I'm going to spend some time talking to more people about the problems they face searching and navigating code. I'll gather notes and my personal experiences to make a list of end-to-end use cases i want to support, and sketch/prototype UI to make them easy to use.