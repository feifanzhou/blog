---
title: 'Tanagram Roadmap: April 2024'
date: '2024-04-08'
updated: '2024-04-08'
slug: 'tanagram-roadmap:-april-2024'
excerpt: >-
  Tanagram remains a nights-and-weekends project. My progress pace during March
  averaged about 1.3 workdays per week.
---


Tanagram remains a nights-and-weekends project. My progress pace during March averaged about 1.3 workdays per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: March 2024
[Last month](https://feifan.blog/posts/tanagram-roadmap:-march-2024), I mentioned that I'd spend some time exploring different product shapes with the goal of coming up with a small set of features that can come together into a cohesive product that I can feasibly build, polish, and launch. Part of my product development hypothesis is that, in the beginning, it's possible to build something people will pay for if the product does something that people already do, but in a better and more polished way — there are people that will pay for a clearly-better user experience over existing functionality.

I've decided to start with a code search tool that can replace Xcode's search and Open Quickly features, and augments it with more extensive keyboard support, result management, and the ability to save and share searches. It looks like this:

![A wireframe sketch of an empty Tanagram search input.](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2024-04-roadmap/1-empty-prompt.png?)

It's an overlay that you can activate while working in Xcode (perhaps via ⌘P, which, in VSCode, defaults to a commonly-used file-based quick-open, but in Xcode still defaults to showing a print dialog for your source code[^0]).

![A wireframe sketch of Tanagram search, showing results to the query input "upsert".](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2024-04-roadmap/2-search-results.png)

Tanagram will show results matching your input (including both specific symbols as well as any matches in source code) live as you type. Speed is a feature here — instantaneous results, along with not having to interrupt your typing to press Return, makes the search interactive. For example, if there are too many options for a given input, you can continue typing to refine results:

![A wireframe sketch of Tanagram search showing results to the input "upsert -file:view".](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2024-04-roadmap/4-refine-results.png)

In this example, you started out searching for "upsert". Upon seeing the initial results, you realize that you're not interested in any results from UI-related code, so you append "-file:view" as a rough way to filter out such code.

![A wireframe sketch of Tanagram search showing a Quick Look overlay on a selected result.](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2024-04-roadmap/3-quick-look-result.png)

Tanagram will allow you to Quick Look the definition of symbol results, making it a bit more useful as a research tool. For example, if you're wondering if this particular method mutates its inputs or returns a new value, you could Quick Look its definition to confirm.

![A wireframe sketch of Tanagram search with some results hidden.](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2024-04-roadmap/5-hide-results.png)

Once you have the right query, you might have to go through and individually understand the results. Tanagram will allow you to hide results as you evaluate them to reduce their visual clutter and provide you with a checklist of what's left.

![A wireframe sketch of Tanagram search showing a link to the current search input.](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2024-04-roadmap/6-link-to-search.png)

Finally, Tanagram will allow you to copy a URL representing a given search. You can share this search with a remote coworker to collaborate on going through a result set. Or you can save the link in documentation or code comments to back up your claim that nothing uses `OldDeprecatedClass`.
# Roadmap: April 2024
This version of Tanagram builds on the same foundations (e.g. language server interactions, symbol database) that I've been working on for the past ~year, but it is a new interface. I'm excited about this direction because it's a much clearer product shape than what I had before, and I've gotten some promising feedback on the sketches so far. 

I would very much like to ship this product to private beta testers by this summer, so in April, I'll be working on building out this interface and refactoring my existing code to support it. 

[^0]: When I was in high school, I did in fact have a computer science teacher who asked us to print out our source code for assignments; he would then mark them up and grade them on the printed output. Needless to say, the whole class thought this was a waste of time and paper.