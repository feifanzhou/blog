---
title: 'Tanagram Roadmap: June 2023'
date: '2023-06-05'
updated: '2023-06-05'
slug: 'tanagram-roadmap:-june-2023'
excerpt: >-
  This is my seventeenth monthly public roadmap update for Tanagram development
  (see previous updates here). Tanagram remains a nights-and-weekends project.
  My progress pace over the past month has...
---


This is my seventeenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.5 workdays per week, minus about a week for vacation.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: May 2023
I spent the first half of May polishing rough edges and fixing bugs, including better handling for file-system changes, adding a default sort to the items list, and caching items' source code in memory rather than repeatedly reading from disk in a couple of places where I display or rely on the underlying source code.

I also scheduled a chat with someone to talk about Tanagram, and wanted to have a slightly more impressive demo, so I spent about a week implementing [custom field matchers](https://twitter.com/tanagram_/status/1661909038085591040). I'm really excited about custom field matchers — given my premise that a [codebase is a database](https://feifan.blog/posts/the-database-inside-your-codebase), custom item types let you define the tables in your database, and custom field matchers let you define the columns of a table. In its current iteration, custom field matchers will only allow you to extract a single scalar value from each matching item, but in the future it'll support one-to-many results from each matching item and allow you to translate match results to other items in your codebase.

# Roadmap: June 2023
My short-term goal is still to get this browser into some friends' hands and see if they understand it. I'm spending June continuing to polish rough edges and testing it on a variety of open-source projects (focusing on Javascript/Typescript, since its language server is the fastest and most robust out of the ones I've integrated so far). I'd like to get a build out for some friends to try by the end of this month — I'm building no new features until that happens.