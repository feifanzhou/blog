---
title: 'Tanagram Roadmap: January 2022'
date: '2022-01-03'
updated: '2022-01-03'
slug: 'tanagram-roadmap:-january-2022'
excerpt: >-
  I've been writing monthly roadmaps for Tanagram development in private for a
  few months. For 2022 I've decided to publish them, in part because I believe
  doing so will increase accountability for...
---


I've been writing monthly roadmaps for Tanagram development in private for a few months. For 2022 I've decided to publish them, in part because I believe doing so will increase accountability for progress, and also because writing these for an audience will force me to be more precise with what I have in mind and enable clearer did-I-or-didn't-I comparisons.

Tanagram remains a nights-and-weekends project. In 2021, my progress pace was roughly 0.5–1 workdays per week (i.e. I got as much done each week as I would've gotten done in 0.5–1 regular workdays if I was working full-time). Some weeks came in around 0 when my day job, urgent errands, or the occasional fun mini-project[^0] occupied all my brain space; some other weeks I had very productive Sundays and clocked closer to 1.5 workdays per week. 

For 2022, I have some ideas for how to rearrange my weekday routine to carve out more high-energy time for Tanagram. I'll see how well those ideas work over the next few weeks.

On to the roadmap update:

# Alpha 1
Alpha 1 will be the first release of Tanagram (although it'll probably be limited to a few close friends to start). It'll have the following functionality:

You'll be able to deploy an instance of the Tanagram kernel server on any server[^1] or connect to an existing server. Each server is called a "run instance"[^2].

Each run instance will have its own set of [commands](https://feifan.blog/posts/tanagram-demo-1)[^3]. You can create or edit commands or run them with a [form-input UI](https://twitter.com/tanagram_/status/1476659476627275790?s=21) that is automatically generated from the command's implementation.

Edits to commands sync immediately to the server once you press save and the code is live-reloaded for the next time you run the command; there's no waiting for a deploy[^4].

You can view the run history of each command and search by input or output values[^5].

You'll be able to assemble commands into [HTTP servers](https://feifan.blog/posts/tanagram-demo-2) with basic URL routing support.

All these pieces technically exist and are [powering this blog](https://feifan.blog/posts/tanagram-creating-a-database-based-codebase), but much of it is very manual (e.g. I deploy code changes by SFTPing the source code onto my server and compiling a build) and, in short, Alpha 1 is all about building a user-friendly interface around all that.

Tanagram is designed to be self-hosted. "Owning your system" is important for developers, especially when that system is also a runtime for your code. It's also straightforward to offer a cloud-hosted version of a self-hosted product if I decide that I want to do so as part of the business model. The kernel server runs on anything [Elixir supports](https://elixir-lang.org/install.html) and has an API for all of the functionality listed above. I'm also building a client interface that is a native Mac app (i.e. AppKit) because I like native Mac apps, but the kernel API exists so that other people can build their own UIs if they don't like mine.

# Roadmap: January 2022
These roadmap updates will be a listing of functionality that I know I'll need to build. I don't yet have enough predictability in my working schedule to make a timeboxed "sprint commitment", i.e. it's likely that not all these will be done in January 2022. They are, however, listed in the order I plan to build them.

0. UI to create and edit HTTP servers and routes (✅).
1. Input UI to run a command (⏳).
2. UI and server support for editing the implementation of a command.
3. UI and server support for creating new commands.
4. UI and server support for showing the run history of each command.
5. Server support for de-retaining command run history.
6. UI and server support for creating/deploying a new run instance.

(✅ means "done"; ⏳ means "currently in-progress").

[^0]: I spent a bunch of time this past week selecting and laying out a photo album (the printed kind) for 2021. It was a lot of fun!
[^1]: Realistically, Alpha 1 will probably ship with support for a single cloud/VPS provider, but that part of the code will be designed to be pluggable so other providers can be integrated as extensions.
[^2]: I intend for "run instances" to be logical groupings of server instances. Run instances are meant to be an atomic deploy target (e.g. you might have a `production` run instance or `qa-1` run instance), even though they might consist of multiple fungible server instances.
[^3]: I'm actually not entirely sure of this. The alternative is that you have a single library of commands, and you could execute any command on any run instance (unless e.g. the command is explicitly designated for or not-for particular run instances). I'm currently choosing to build per-run-instance commands as an implementation convenience — this way, I can store commands in each run instance's database rather than in a separate store, but I don't have a strong opinion on what the right product direction is. If you have thoughts, please let me know!
[^4]: Of course, there's room here for various extensions, e.g. a way to stage and atomically upload changes, or a CI/code review workflow. Those will come later and will be implemented as an extension point for plug-ins.
[^5]: I'm mostly ignoring the storage space problem for now. I'll probably start with a simple time-based retention policy (e.g. only saving history for the past _x_ days).