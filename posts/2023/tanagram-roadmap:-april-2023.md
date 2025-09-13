---
title: 'Tanagram Roadmap: April 2023'
date: '2023-04-02'
updated: '2023-04-02'
slug: 'tanagram-roadmap:-april-2023'
excerpt: >-
  This is my fifteenth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my fifteenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.5 workdays per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: March 2023
I started March by implementing a [scope bar](https://twitter.com/tanagram_/status/1632473646496366592?s=61&t=hO3FgsGjAicUzMp3NsvQng) to show items from either an entire project (including dependencies), or just the code that I've written. SourceKit-LSP, at least, returns the former, and it's been really helpful to focus on just the latter throughout the rest of the month. 

I spent the rest of March working on live-updating the items shown in Tanagram based on filesystem changes — i.e. when the underlying source code is edited. [Here's a demo video](https://twitter.com/tanagram_/status/1642239554924183552?s=61&t=hO3FgsGjAicUzMp3NsvQng). It'll respond to files being created, modified, and deleted, but there's some situations it doesn't yet handle well:
* Files being renamed: I'm using macOS's [File System Events](https://developer.apple.com/documentation/coreservices/file_system_events) to determine changes to files, and an event with [`kFSEventStreamEventFlagItemRenamed`](https://developer.apple.com/documentation/coreservices/kfseventstreameventflagitemrenamed) indicates a file being renamed. However, the event itself doesn't specify what a file was renamed _from_ or _to_; instead, I've observed that I'll typically get two separate "rename" events, one whose `path` points to the old filename, and one whose `path` points to the new filename. The relative ordering of these events is not guaranteed, and there's always the chance that one (or both) of these events is dropped or coalesced in a weird way. I haven't yet figured out how to handle all of these cases (although [@atom/watcher on Github](https://github.com/atom/watcher/blob/master/docs/macos.md#known-platform-limits) has an example I can dig into), so Tanagram doesn't yet support files being renamed. This is actually a moderately big gap because some IDEs (including Xcode) implement file-saving by writing to a temporary file and then moving (i.e. renaming) the temporary file to the original file's path — so I'll need to support that.
* Symbols being renamed/moved between files: There's no good way to durably identify source code symbols; every code symbol (class, variable, property, etc) is only identified by its name. When a programmer changes a symbol's name, it's unclear — just from looking at the file system event — whether the programmer meant to _rename_ an existing construct, or _replace_ an existing construct with a new one. Tanagram currently implements the more conservative approach of always assuming the latter; I can later add a heuristic (or manual operation) to determine whether a change should actually be a mutating rename of an existing construct.
	* [Unison](https://www.unison-lang.org/learn/the-big-idea/) is a cool programming language and environment built around that idea that code constructs are identified by ~durable IDs, and the names of those constructs can freely change. 

There's another quirk that may be specific to SourceKit-LSP and how I'm using the Language Server Protocol: the initial set of symbols (which I'm getting by using `workspace/symbol` requests) is derived from a different mechanism than that used by incremental changes (which I'm getting by using `textDocument/didOpen` notifications and `textDocument/documentSymbol` requests). Two specific things that made this slightly difficult:
* LSP defines two different data types for these requests. The former is a flat list of symbols; the latter is a hierarchical tree of symbols. The protocol _doesn't_ guarantee any mechanism for determining a symbol hierarchy for the former, which means there's no clear way of differentiating between e.g. a symbol named `foo` inside a class named `A.X`, and a symbol named `foo` inside a class named `B.X` (I only get the most-proximate parent name for each symbol, which, for both of these `foo`s, is `X`).
* SourceKit-LSP returns a different set of symbols for `workspace/symbol` compared to `textDocument/documentSymbol`. In particular, the former includes compiler-generated symbols that aren't actually present in the source code itself, such as memberwise initializers for Swift Structs; the latter does not. The former also returns type parameters for method declarations, whereas the latter does not. However, the latter does return variables defined within methods, while the former does not. The `location.range` for each symbol also differs across the two methods, even when they're referring to the same symbol.

Finally, because SourceKit-LSP only updates its index (for `workspace/symbol` requests) [while building](https://github.com/apple/sourcekit-lsp#indexing-while-building), I've implemented a "full reload" flow that invokes `xcodebuild` as a sub-process to update the underlying index.

# Roadmap: April 2023
I've had friends ask for TypeScript and Python support so they can start using Tanagram with their existing codebases. I'm planning to work on TypeScript support in April — partly for the object-level benefit of making Tanagram potentially usable for other people besides myself, but also the meta-level benefit of learning where I might be over-indexing on SourceKit-LSP's specific quirks.

Once I've implemented TypeScript support, I'll either turn my attention back to supporting file renaming (a foundational feature), or work on ways to define and show links between codebase items (a user-facing feature). I haven't yet decided which will make Tanagram a more compelling product for other people to use.