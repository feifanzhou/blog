---
title: 'Tanagram Roadmap: August 2023'
date: '2023-08-06'
updated: '2023-08-06'
slug: 'tanagram-roadmap:-august-2023'
excerpt: >-
  This is my nineteenth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my nineteenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.5 workdays per week, maybe a little more. I was on vacation in the beginning of the month and came back to Tanagram in mid-July.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: July 2023
I'd sent builds of Tanagram to two friends, but they were unable to try it because they developed primarily in Swift, and Swift support in my first build was limited to my own computer — I'd hard-coded a path to a custom build of [sourcekit-lsp](https://github.com/apple/sourcekit-lsp/) with changes I'd made a few months ago when I was first getting familiar with the language server protocol and Swift tooling. I switched Tanagram to use an unmodified version of sourcekit-lsp, and spent most of my coding time in July trial-and-erroring the way I invoked it to actually get non-empty responses (I mostly struggled with this for incoming and outgoing references). I got things working, but it requires users to create a compilation database (a JSON file listing files and a compilation command for each file). Xcode and Swift tooling don't provide an automatic way to create such a file, as far as I can tell, so I've been working on a wizard UI to automate most of the effort of creating such a file. I have it working end-to-end now, but I have to clean up some UI jank.

I also had five user-research conversations in July, in which I asked friends and acquaintences about their struggles discovering, understanding, and writing code. It's too early to draw generalizations, but here's a few takeaways:
* Independent developers and those working on small teams haven't had problems navigating their codebases or finding where important code is located. They generally remembered their codebases pretty well (which may seem obvious, but is not the case for me personally — Tanagram's current codebase is a few thousand lines across ~50 files, and I often forget what something is called).
* ~Nobody wants to write documentation for other people to consume, but many people write extensive notes for their consumption. Many used comments; some wrote notes in text files alongside the relevant code.
* One person navigated their codebase (in part) by ⌘F-ing for strings that appeared in their UI. Someone else wished for a tool that could "overlay" a running instance of their app and allow them to navigate the relevant code for any given piece of UI or show a history of how their UI got into its current state.
* One person wanted a way to arrange/view chunks of code independently of how they're organized in files and folders — for example, to see a unified view of all the reducers in their app, or a unified view of all the logic that makes up a particular screen. 
* Three people talked about difficulties making large changes across a codebase (e.g. structural refactors or adding a new case to a broadly-used enum) — this is difficult both because of merge conflicts, as well as the "spookiness" of knowing the full impact of such a change.

# Roadmap: August 2023
I'll continue to do user-research conversations this month. Most of my conversations so far have been people who work independently or on small teams with new codebases; I'll now focus on people who work on larger teams/companies with established codebases.

On the development front, I'll finish the compilation database–generation UI and ship that build to a few testers. Then I'll start working on the "spookiness" problem by building a robust "reference graph" among all the symbols that Tanagram knows about within a codebase, and providing a various ways of querying and traversing the graph.

In my mind, a reference graph is a superset of a traditional call graph — in addition to functions/methods calling other functions/methods, codebases can also have less obvious references. For example, a method _X_ may emit an event that gets picked up by some set _Y_ of consumers; _X_ would conceptually have an outgoing reference to each consumer in _Y_. Or an event handler _A_ may send an action _B_, and the reducer case for _B_ calls methods _C_ and _D_; _A_ would conceptually have an outgoing reference to methods _C_ and _D_. These references vary across codebases (which makes a case for some kind of plug-in system); I think a tool that can generate a substantially-accurate reference graph and provide ways to traverse it could provide a lot of value.