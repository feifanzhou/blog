---
title: 'Tanagram Roadmap: May 2024'
date: '2024-05-05'
updated: '2024-05-05'
slug: 'tanagram-roadmap:-may-2024'
excerpt: "Tanagram remains a nights-and-weekends project. My progress pace during April averaged about 1.5 workdays per week.\r\n\r\nWould you like to receive these updates over email? I'm also publishing these to..."
---


Tanagram remains a nights-and-weekends project. My progress pace during April averaged about 1.5 workdays per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: April 2024
[Last month](https://feifan.blog/posts/tanagram-roadmap:-april-2024), I showed some sketches of a search tool for Xcode. Over the past month, I've been building this product, and it currently [looks like this](https://twitter.com/tanagram_/status/1786811830989693128). The core functionality is all working: you can start typing and Tanagram will show you matching symbols or strings in your source code; you can continue typing to refine results, including support for file allowlists (`file:`) and blocklists (`-file:`); you can use keyboard shortcuts to toggle case sensitivity and whether to treat the input as a regex; and you can use arrow keys to select results and open them directly in Xcode. 

It's occasionally buggy; it sometimes hangs or crashes (Swift concurrency is hard). The biggest usability challenge at the moment is the quality of search results — currently, symbols only match on exact substrings, and the results are unsorted. I'd like to support "Quick Open"-style fuzzy matches, e.g. having an input of "msa" return `MatchSymbolAction`. I've just started to implement this, using the [Needleman-Wunsch algorithm](https://en.wikipedia.org/wiki/Needleman–Wunsch_algorithm) as a starting point. 
# Roadmap: May 2024
In May, I'm focusing on usability — improving symbol search results and hopefully making them faster, better error handling, and fixing bugs that appear on computers that aren't my dev machine. I'll also add  a few settings toggles and some logging. My goal is to get something that works, with a little bit of polish, in the hands of some testers in time for WWDC week.