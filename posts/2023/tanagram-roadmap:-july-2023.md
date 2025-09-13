---
title: 'Tanagram Roadmap: July 2023'
date: '2023-06-28'
updated: '2023-06-28'
slug: 'tanagram-roadmap:-july-2023'
excerpt: >-
  This is my eighteenth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my eighteenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.5 workdays per week. This month's update is out early because I'm going on vacation for the next few weeks, possibly with limited internet. I'll be back in mid-July.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: June 2023
I spent June fixing a bunch of bugs and fixing some egregious performance issues:
* Throttle UI updates when loading all project symbols to avoid maxing out a CPU core on SwiftUI updates.
* Slightly speed up the wall-clock time of processing each source file.
* Limit the length of source code previews to avoid blocking the main UI thread for too long when trying to render long chunks of source code for the selected item.
* Add an ID-keyed dictionary to avoid list traversals when loading details for the selected item.
* Properly handle a truncated `Content-Length` header in a chunked response from the language server.
* Fix a lot of jankiness in my initial implementation of custom item type regex matchers.
* Add top-level directories to the scope bar to make the scope bar a bit more useful.
* Add a view to configure settings for Typescript projects, including support for excluding files and folders.
* Show a user-facing error message if the language server executable can't be found or if `typescript-language-server` can't find `node` in its environment.
* Add a mechanism for checking for updates.
* Fix table rows opening the wrong file because of table view cell reuse.
* Fix some mis-aligned text because of text-wrapping.

I also designed a [new icon](https://twitter.com/tanagram_/status/1672081887622496256?s=61&t=Xm_cOGbhNsBnXSluOvJliQ), wrote a [feature guide](https://feifan.blog/posts/tanagram-features-guide), and uploaded a release build to my server. I've sent it to two friends for feedback so far.

# Roadmap: July 2023
I spent last Sunday afternoon cuming up with a ton of feature ideas that I could build, but I need to spend more time talking to potential users about what would be valuable (and if what I've built so far makes sense). I plan to spend the latter half of July (once I get back from vacation) doing research with friends and acquaintences, and doing some refactoring if I feel Xcode calling to me.