---
title: 'Tanagram Roadmap: May 2023'
date: '2023-05-04'
updated: '2023-05-04'
slug: 'tanagram-roadmap:-may-2023'
excerpt: >-
  This is my sixteenth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my sixteenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.5 workdays per week, minus about a week for vacation.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: April 2023
In April, I implemented support for Typescript (and, by extension, Javascript) using [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server). With previous language servers, I had relied on the `workspace/symbol` request to load all symbols, but typescript-language-server's implementation presented me with one old and one new problem.

The old problem, that I'd also encountered with Swift, was that the server returned no results for an empty query string. Previously, I hacked around this by sending a query for each English vowel and de-duplicating the results. This was slow and imperfect; I'd miss symbols that didn't have any vowels in their names.

When I attempted the same thing with typescript-language-server, I got back way too many results — it was including results from `node_modules` and `*.d.ts` files, none of which were relevant to the project I had opened. It was an unusable list to render in the main list.

I decided to try an alternative implementation: I'd iterate through all the relevant source files in the project directory, and use the `textDocument/documentSymbol` method to get symbols from each file. This approach worked incredibly well:
* The implementation was simpler than what I was afraid it might be,
* It runs much faster than the `workspace/symbol` approach, and
* I can now show a determinate progress indicator based on the number of files for which I've gotten symbols.

You can see it in action [here](https://twitter.com/tanagram_/status/1647667640373239808?s=61&t=zNBfeC8SLc8xvsrrE_kICQ).

I also implemented a sidebar showing details about the selected item, including its location, source, incoming references (items calling the selected item), and outgoing references (items called by the selected item). These automatically load as items are selected, and they update [when the underlying source code changes](https://twitter.com/tanagram_/status/1653959299411111938?s=61&t=zNBfeC8SLc8xvsrrE_kICQ). I am biased, of course, but I feel like this sidebar is the first _A ha!_ aspect of this app — it gives users a view into the database behind their codebase at a higher level than walls of plain text.

I also fixed a couple of bugs, including better support for Homebrew on Apple Silicon and string truncation in the buffer I use to process LSP responses.

# Roadmap: May 2023
I want to get this browser into some friends' hands and see if they get it. As a result, I'm going to spend May polishing some rough edges (including error handling), test Tanagram on a variety of open-source projects, and making sure it can run on other people's computers.