---
title: 'Tanagram Roadmap: June 2024'
date: '2024-06-04'
updated: '2024-06-04'
slug: 'tanagram-roadmap:-june-2024'
excerpt: "Tanagram remains a nights-and-weekends project. My progress pace during May averaged about 1.5 workdays per week.\r\n\r\nWould you like to receive these updates over email? I'm also publishing these to..."
---


Tanagram remains a nights-and-weekends project. My progress pace during May averaged about 1.5 workdays per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: May 2024
I spent May working on a lot of core functionality for Tanagram:
* I implemented a modified Needleman-Wunsch algorithm for filtering symbols — it now supports fuzzy matching for symbols (e.g. `smsa` will match `SearchMatchSymbolAction`), with some tuning for certain conditions I want to encourage or discourage (e.g. consecutive letters are encouraged; leading and trailing gaps are discouraged). The algorithm returns a score for each result, which I use to rank results; Tanagram will also avoid showing results whose score is too low relative to the length of the input (generally speaking, every character in the search input should be present in a returned result).
* I added file system event listeners to update Tanagram's symbol database when files change on-disk.
* I added a `kind:` filter to return symbols of a particular `kind`.
* The results view now scrolls to keep the selected result in view.
* I added a Welcome/Settings window, and turned Tanagram into a menu-bar app.
* Source results now show surrounding lines for additional context.
* I figured out how to get OpenTelemetry logging working so that I can send log lines to a cloud-hosted logging tool.
* I added some performance optimizations and fixed several crashes.

I also designed and built a new website at [tanagram.app](https://tanagram.app)! I'm quite happy with the way this turned out.
# Roadmap: June 2024
In June, my focus will be getting a few early users to try using Tanagram. I'd like to find out how well it performs on other people's codebases, and get their feedback on whether it's useful and valuable for their use cases.