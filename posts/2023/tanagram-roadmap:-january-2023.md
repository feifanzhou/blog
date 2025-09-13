---
title: 'Tanagram Roadmap: January 2023'
date: '2023-01-09'
updated: '2023-01-09'
slug: 'tanagram-roadmap:-january-2023'
excerpt: >-
  This is my twelfth monthly public roadmap update for Tanagram development (see
  previous updates here). Tanagram remains a nights-and-weekends project. My
  progress pace over the past month has...
---


This is my twelfth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1 workday per week for two weeks; the rest of my time was spent on vacation, packing, and resting over the holidays.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: December 2022
From last month:

> I'll work on UI for doing more with codebase items — specifically, letting users define custom item types (i.e. rows in the sidebar) and fields for item types (i.e. columns in the table). If I have time, I'll also un-hardcode the source directory and LSP settings and allow users to open any (Ruby) code directory.

I worked on letting users define custom item types: 

<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">Demo: Defining custom item type collections. Say you have a bunch of different types of “Pins” in your codebase, each of which is its own class. You could build a query to find them, and have a list that stays up-to-date with your codebase. <a href="https://t.co/byYJDcpz9W">https://t.co/byYJDcpz9W</a> <a href="https://t.co/UNV0udp4gS">pic.twitter.com/UNV0udp4gS</a></p>&mdash; Tanagram (@tanagram_) <a href="https://twitter.com/tanagram_/status/1601065904498184193?ref_src=twsrc%5Etfw">December 9, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The UI doesn't yet support actually persisting custom rows in the sidebar yet because the rows are hard-coded; I didn't have the concept of a "project" into which I could persist data.

I started working on that later in the month, and now have a file format for a "project config" that's meant to live at the root directory of a bunch of code. Currently, it just specifies a project's language (only Ruby is supported for now), the language server to use (only Solargraph is supported for now), and some flags and settings for running the language server. 

# 2022: Looking Back
In 2022, Tanagram evolved through three phases, corresponding to three separate codebases:
1. I started the year working on demoware for a "batteries-included" programming environment. I envisioned Tanagram as a development and deployment IDE for creating and running server applications, with "kernels" (server instances) and "commands" (functions/endpoints) as the initial primitives. This effort culminated in [Demo #3](https://feifan.blog/posts/tanagram-roadmap:-may-2022-demo-3), but I was unhappy with the UI — I had a strong gut feeling that the "right" UI for creating software (a creative process that requires referencing lots of disparate pieces of information) looks more like a canvas UI showing small, somewhat-atomic pieces of information and functionality.
2. I created some [mocks](https://feifan.blog/posts/tanagram-roadmap:-july-2022) for what this might look like, and spent a few months building it. This effort culminated in the tweets linked [here](https://feifan.blog/posts/tanagram-roadmap:-october-2022). However, by this time, I was starting to feel that the minimum surface area I'd need to build for a useful IDE was way too much to start. I realized that I might be doing things backwards — whenever I'd describe Tanagram to new people, I'd be talking about the benefits of a block-based IDE ([for example](https://twitter.com/tanagram_/status/1601065909476413440?s=61&t=fkyYmUIGefoLqHRcHrAurA)) … but I probably didn't need to build a whole IDE and expect users to build whole projects with it to realize some of those benefits.
3. One of those benefits (and, in fact, the core idea behind Tanagram) is that you can think of a [codebase as a database](https://feifan.blog/posts/the-database-inside-your-codebase). [Visualize](https://twitter.com/tanagram_/status/1596962385721376768?s=61&t=-Pij_ur0ZDt6E7P7T2khyQ) is a product that relies on a language server to power this for existing codebases. This is much less product surface area to build, but I think it will still let me implement and test this core idea. Visualize is what I'm currently working on.

After Demo #3, which took a while to produce (and subjected me to listening to my own voice), I switched to posting smaller screen-recording demos on Twitter. Some of them became rather popular and, along with some unsolicited (but much appreciated) mentions, helped [@tanagram_](https://twitter.com/tanagram_)add about 140 followers this year. I don't remember exactly how many I started with, but I think it was around 40; I crossed 100 followers [in September](https://twitter.com/tanagram_/status/1565730541550219265?s=61&t=uBS8qzVPGN2Uh9DkumQx8A). Given that I'm just tweeting work-in-progress without doing anything promotional or growth-hacky, that's a lot more than I could've hopeld for, and I really appreciate that.

My main challenge with Tanagram is finding the time each day to work on it and managing my time and emotions when I do. It's frustrating when I don't make as much progress as I'd like in a given working block. That gets magnified when I'm deciding between different things to work on or different ways to build some functionality — if I'm deciding between doing something novel (but which might not work well or end up being a time-suck), or doing some quick-and-simple, it's hard to know which to pick.

Finally, I'd like to think a few people who've been particularly helpful to me this year:
* [Alexander Obenauer](https://twitter.com/alexobenauer) for conversations about the indie building process and a big shoutout.
* [Justin Duke](https://twitter.com/jmduke) for feedback on my ideas and solo-builder inspiration.
* [Majd Taby](https://twitter.com/jtaby) for chatting with me about building with small teams and bootstrapping (or not).
* [Tanishq Kancharla](https://twitter.com/moonriseTK) for feedback on my ideas and reviewing blog posts.
* [Zach Tratar](https://twitter.com/zachtratar) for lots of feedback and advice on my ideas and building products.

# 2023: Looking Forward
My top goal for 2023 is to get a usable build of Visualize into the hands of a few friends to get their feedback about what functionality they find compelling. It'll have at least the following functionality (the scope of what I'd consider an MVP):
* Open any existing codebase in a supported language (I'll start with Ruby, Python, and Typescript), and it'll automatically run a language server to analyze the code.
* Browse a listing of codebase items, organized by lexical types or user-defined filters.
* Preview and edit codebase items' source.
* Browse and edit notes linked to codebase items. Sync notes to code as comments.
* Browse and edit prose documentation, supporting extended Markdown syntax for bi-directional links to codebase items and notebook-style embedded code blocks and item queries.

Along with developing the product MVP, I'd also like to figure out who'd be willing to pay for this, and how much they'd be willing to pay.

Looking a bit further out, these are some additional ideas that I'm excited to build once I have the chance:
* More expressive ways of querying for codebase items (e.g. using SQL or maybe Datalog).
* Synthesized codebase items (like materalized views, but for a codebase).
* User-defined links between items (e.g. link HTTP endpoints to their implementations, or linking tests to production code).
* VSCode extension for seeing item notes without having to add and sync comments to the source code itself.
* Tanagram itself storing the canonical implementation of a program as an item graph, with plain-text code as a form of generated output.

Finally, I'd like to find other people who are also interested in building Tanagram with me.

# Roadmap: January 2023
I'll spend the rest of this month building UI to open a code directory — it'll read an existing project config file if one exists (or create a new one if it doesn't), and then spawn a language server process pointing to that directory. I'll also show some status information about that language server. Next, I'll work on persisting [user-defined item types](https://twitter.com/tanagram_/status/1601065904498184193?s=61&t=TM0-hmmVwaTSnZ0AOgNyVA) so that they can be saved in the sidebar. Finally, I'll start implementing filesystem events to update the list of codebase items when the underlying code is edited.