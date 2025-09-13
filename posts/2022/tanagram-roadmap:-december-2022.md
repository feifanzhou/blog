---
title: 'Tanagram Roadmap: December 2022'
date: '2022-12-04'
updated: '2022-12-04'
slug: 'tanagram-roadmap:-december-2022'
excerpt: >-
  This is my eleventh monthly public roadmap update for Tanagram development
  (see previous updates here). I'm publishing this update to document my
  progress and hold myself accountable, and also...
---


This is my eleventh monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1 workday per week — the Thanksgiving weekend, and my improved energy from taking some time off from work, helped me make some more time for Tanagram.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: November 2022
I left my plans pretty open-ended in last month's update, giving myself some flexibility to do what felt right. I talked to a couple more people to get their initial impressions, but I ran into the challenge of trying to describe a rather abstract idea and not having the right words to fully convey what I'm trying to build. I think I might be able to mitigate that by sharing demo videos and, eventually, live prototypes — so I turned my attention to doing so.

In mid-November, I started building the Visualize UI (based on the mocks from [last month](https://feifan.blog/posts/tanagram-roadmap:-november-2022)) in AppKit, but immediately ran into glitches that I had no idea how to resolve[^0]. On a whim, I gave myself a few days to learn SwiftUI, and then try building a UI with it to see if it would be better. The [Introducing SwiftUI](https://developer.apple.com/tutorials/swiftui) tutorial was mind-blowingly cool — the Live Previews, and ability to edit the UI to see changes reflected back in the code, while finicky, were a compelling indicator of what's possible with a truly _integrated_ development environment.

A few days later, I'd learned enough SwiftUI to put together this UI:

<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">Sunday demo: a GUI for exploring symbols in a codebase as atomic entities. Load symbols from a language server, filter them, preview them, and open their source in an editor if you need to. <a href="https://t.co/25yqwRKfCe">pic.twitter.com/25yqwRKfCe</a></p>&mdash; Tanagram (@tanagram_) <a href="https://twitter.com/tanagram_/status/1596962385721376768?ref_src=twsrc%5Etfw">November 27, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Earlier in the month, I'd started playing around with language servers to see what was possible. I got a copy of [Solargraph](https://solargraph.org) (I like Ruby and have a lot of experience with it) and ran it from source. Despite a lack of documentation, I figured out how to connect to the server, initialize it with a directory, and get a list of `workspace/symbol`s — first in a Ruby script to get the details right, and later in Swift. The video above shows actual data coming from a Solargraph language server (indexing its own source code).

This past week, I improved my client implementation to [notifications](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#notificationMessage), [server-initiated requests](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#serverInitiatedProgress), responses arriving out-of-order, and multiple response bodies slurped up in one socket read.

# Roadmap: December 2022

In December, I'll work on UI for doing more with codebase items — specifically, letting users define custom item types (i.e. rows in the sidebar) and fields for item types (i.e. columns in the table). If I have time, I'll also un-hardcode the source directory and LSP settings and allow users to open any (Ruby) code directory.

December will be a short work month for me. Between the holidays and my vacation plans, I'll have about two work weeks' worth of time available during the month. I'll post demos [on Twitter](https://twitter.com/tanagram_) as they're ready.

Thank you for reading, your interest, and your support this year; I genuinely appreciate it. See you next year!

[^0]: Specifically: I'd created an `NSOutlineView` (and later tried with `NSTableView`), but as soon as I started scrolling the list, the cells would go blank. This happened inconsistently — with an `NSTableView`, it would only happen after I resized the split view in which the table view was contained. I was also into challenges setting the widths I wanted for each side of the split view.