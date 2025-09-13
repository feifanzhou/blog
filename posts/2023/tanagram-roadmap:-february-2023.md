---
title: 'Tanagram Roadmap: February 2023'
date: '2023-02-06'
updated: '2023-02-06'
slug: 'tanagram-roadmap:-february-2023'
excerpt: >-
  This is my thirteenth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my thirteenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.5 workday per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: January 2023
From last month:

> I'll spend the rest of this month building UI to open a code directory — it'll read an existing project config file if one exists (or create a new one if it doesn't), and then spawn a language server process pointing to that directory. I'll also show some status information about that language server. Next, I'll work on persisting [user-defined item types](https://twitter.com/tanagram_/status/1601065904498184193?s=61&t=TM0-hmmVwaTSnZ0AOgNyVA) so that they can be saved in the sidebar. Finally, I'll start implementing filesystem events to update the list of codebase items when the underlying code is edited.

I got to most of this:

[Here's a demo](https://twitter.com/tanagram_/status/1616928992308924417?s=61&t=UdkPXebrqynTgZoqTPO5Kw) of the UI to open a code directory, with which it'll spawn a language server process. Showing the server's status in the status bar required a pretty big refactor of how I was invoking the server. In particular:
* I run Solargraph over a TCP socket (rather than using stdio), so there's a brief moment when the process has started but the socket isn't ready to accept connections yet. I previously didn't care about this, because by the time I started interacting (manually) with Solargraph, it'd already be ready. But I wanted to indicate this transition as a status change (from "Not started" to "Starting…"), so I had to add code to detect this.
* Some state is a property of the server process itself (e.g. when it's ready to accept connections); other state is more of a property of a client (e.g. whether the client is waiting on a request, or the server's indexing progress, which is indicated to the client as [notifications](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#progress) but otherwise isn't observable). I had to unify these into a "manager" that managed both a server instance (i.e. a sub-process) as well as a client.
* I initially defined the status as an enum, and I wrote some logic for validating transitions between states. This felt brittle, and I ran into a few small bugs where the status got wedged into an unexpected state. So instead, I switched to defining a bunch of distinct properties (`serverProcessStarted`, `serverAcceptingConnections`, etc), each of which would be toggled by some distinct behavior. The displayed status then became a conditional over all these properties.

As part of the above, I also introduced "projects" as a first-class concept, backed by files on disk, and this provided a place to store additional data like user-defined item types. Doing so was therefore more straightforward; [here's what it looks like](https://twitter.com/tanagram_/status/1621937579104030720?s=61&t=OATlmOrWKrXVO6rsvMmS9w). This did also involve [migrating](https://developer.apple.com/documentation/swiftui/migrating-to-new-navigation-types) from `NavigationView` to SwiftUI's new `NavigationSplitView` so that I could programatically select the newly-created custom item type in the sidebar.

I didn't get to working on filesystem events, and I've decide to push that further down my priority list. Instead, I'll first work on integrating Swift support.

# Roadmap: February 2023
I'll first work on integrating Swift support using [sourcekit-lsp](https://github.com/apple/sourcekit-lsp). This way, I can dogfood the product as I work on Tanagram itself. The main challenge here, I think, will be working with the language server over stdio. I'd initially integrated Solargraph using a TCP socket because I struggled to get stdio working in my very early prototypes. However, sourcekit-lsp (like most other language servers) only operate over stdio, so I'll have to refactor some existing code — my goal is to have a unified interface that can support language servers over both stdio and sockets, so I can easily plug in additional servers in the future.

After that, I do think live-updating as the underlying code changes is important, so I'll work on that.