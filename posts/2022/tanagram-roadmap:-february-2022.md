---
title: 'Tanagram Roadmap: February 2022'
date: '2022-02-07'
updated: '2022-02-07'
slug: 'tanagram-roadmap:-february-2022'
excerpt: >-
  This is my second monthly public roadmap for Tanagram development (see
  January's here). As with last time, I'm publishing this roadmap because I
  believe doing so will increase my accountability for...
---


This is my second monthly public roadmap for Tanagram development ([see January's here](/posts/tanagram-roadmap:-january-2022)). As with last time, I'm publishing this roadmap because I believe doing so will increase my accountability for progress. It also gives me a place to write a paragraph or two about the mildly-to-moderately interesting bits I'm building away from the terseness of Twitter or the temptation to add more padding for a full-length blog post. 

Tanagram remains a nights-and-weekends project. Throughout January, my progress pace was roughly 1 workday per week, compared to my previous range of 0.5–1. This is a slight improvement at the low end (i.e. fewer zero-progress days), but not much at the high end. I'm continuing to look for more opportunities to work smarter (i.e. finding more hours in a week where my brain is naturally energized and wants to make progress), not harder (i.e. by grinding through more hours at night).

# Results: January 2022
I got through roughly half of what I set out to do in January:
0. UI to create and edit HTTP servers and routes (✅).
1. Input UI to run a command (✅).
2. UI (⏳) and server support (✅) for editing the implementation of a command.
3. UI and server support (✅) for creating new commands.
4. UI and server support for showing the run history of each command.
5. Server support for de-retaining command run history.
6. UI and server support for creating/deploying a new run instance.

(✅ means "done"; ⏳ means "currently in-progress").

I also completed two refactors that I hadn't entirely planned for up-front.

The first was for `CommandExecutionInstanceView`, my input UI to run a command. This is a re-implementation of the UI from [demo 1](/posts/tanagram-demo-1), now written in Swift using AppKit controls. After I'd gotten it working the first time, I spent most of a Sunday pulling apart a tangle of code for UI rendering, data transforming, and network requesting, and extracting a ViewModel from that.

The second has to do with how I model commands in the kernel server. Up until recently, commands (introduced in [demo 1](/posts/tanagram-demo-1)) had been hard-coded into the Tanagram codebase as ordinary code modules, and they were identified by their [fully-qualified module names](https://stackoverflow.com/a/49361467/472768). I don't think units of code should be uniquely identified by names[^1]; instead, units of code in Tanagram will be identified by stable IDs (just like any other [object in a database](https://feifan.blog/posts/tanagram-creating-a-database-based-codebase)). Therefore, I added hard-coded IDs to every existing hard-coded command and changed lots of places in the codebase that previously operated on command names to operate on command ID instead. This also made it possible to introduce a `Command.Item` model representing user-defined commands and add methods to creating and editing them.

# Roadmap: February 2022
I don't have any directional changes or new features planned for February — I like the direction I set in January for [Alpha 1](/posts/tanagram-roadmap:-january-2022), and I plan to continue on with it. Therefore, my plan for February is just the stuff I haven't finished in January, albeit with a small swap in the order (it's easier to build the UI for editing a command _after_ building the UI to create it in the first place, since the former will be a subset of the latter):

1. UI for creating new commands.
2. UI support for editing the implementation of a command (⏳).
3. UI and server support for showing the run history of each command.
4. Server support for de-retaining command run history.
5. UI and server support for creating/deploying a new run instance.

As before, it's likely that I won't finish _all_ of these in February. In particular, I expect that #5 might take me a month or longer on its own.

[^1]: I don't like names as durable identifiers for at least two reasons. First, names tend to be inconsistent, both in their syntatical structure (e.g. [noun-first or verb-first](http://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html)) and in how different people might give different names to the same concept. Second, names are fundamentally not good at being durable identifiers — either you resist changing names (to preserve the accuracy of documentation, version control history, etc) and end up with inaccurate names, or you change names and end up with inaccurate documentation.