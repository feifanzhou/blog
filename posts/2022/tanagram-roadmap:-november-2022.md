---
title: 'Tanagram Roadmap: November 2022'
date: '2022-11-07'
updated: '2022-11-07'
slug: 'tanagram-roadmap:-november-2022'
excerpt: >-
  This is my tenth monthly public roadmap update for Tanagram development (see
  previous updates here). I'm publishing this update to document my progress and
  hold myself accountable, and also provide a...
---


This is my tenth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged a bit under 1 workday per week — I was traveling for work in the beginning of the month, and then embarked on a personal trip the following week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: October 2022
In my [last update](https://feifan.blog/posts/tanagram-roadmap:-october-2022), I described my intent to start with a more narrow product build. In early October, I wrote short descriptions of three potential products I could build: [Visualize, Collaborate, Simulate](https://docs.google.com/document/d/1gfzIomC-EYidhrCkvDDrG8lROZpieFfHaAC40LYWMtQ/edit?usp=sharing).

I had the clearest idea for Visualize, since it was most-closely related to the version of Tanagram I'd been recently building. It's also the one for which I had the clearest idea of how to actually build. At the encouragement of a friend, who told me this was a big-enough problem that I could start just with it, I started focusing on Visualize.

I came up with a [bunch of use cases](https://docs.google.com/document/d/1RuEk7fbXZU_eMehB5tamsunztfCph87wpT2PfRvoDSE/edit?usp=sharing) — a bunch of words describing actions that I imagined people might want to/could do with Tanagram. I circulated this with a few friends to get a rough sense of what resonated or didn't. Summarizing a bit:

* Everyone liked and would use the proposed "documentation" features.
* Most people understood and would use the proposed "item" features, although people who hadn't worked on large codebases didn't totally get the value beyond going straight to the code.
* People didn't really care for the proposed "insights" and "avoiding boilerplate" features.

Towards the end of the month, I started sketching mocks of what a code documentation and item-browser app might look like:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-11-roadmap/schema-overview.png)

Here, you can define (or adopt suggestions for) the schema underlying a given codebase (this screen is under-designed; I have many more ideas for it).

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-11-roadmap/queries-overview.png)

Once you've defined a schema, you can write queries to answer questions and explore the codebase in specific ways.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-11-roadmap/notes-overview.png)

You can also browse and organize notes. I think this will just be a view over a file system directory — i.e. notes will just be files that can live alongside your codebase.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-11-roadmap/note-content.png)

Each note can have multiple blocks of content. Currently, I've envisioned blocks as being either Markdown prose, or embedded queries and their results. Markdown blocks can use `[[…]]` double brackets to create bi-directional links to other notes, or use `{{…}}` double braces to create bi-directional links to codebase items (as defined in the schema from above).


# Roadmap: November 2022
For Nomember, I'll continue designing and prototyping Visualize. I'll create more mocks for the main use cases, update my use-case survey with those mocks, and send that to more people to ask for their user feedback.

On the technical implementation side, I'll figure out what's feasible with LSP-based language servers by mapping use cases to LSP commands and setting up servers on projects written in different programming languages to see how well they actually work.