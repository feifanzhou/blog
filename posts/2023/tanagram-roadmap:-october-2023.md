---
title: 'Tanagram Roadmap: October 2023'
date: '2023-10-02'
updated: '2023-10-02'
slug: 'tanagram-roadmap:-october-2023'
excerpt: >-
  This is my 21st monthly public roadmap update for Tanagram development (see
  previous updates here). Tanagram remains a nights-and-weekends project. My
  progress pace over the past month has averaged...
---


This is my 21st monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1.5 workdays per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: September 2023
I spent my development time this month implementing the reference graph that I begun at the end of August. Putting together a bunch of pieces, it now looks like this:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2023-10-roadmap/references-graph-full-search.png)

There's a lot going on:
* The main content is a graph, where the nodes are items in a codebase (methods, constants, properties, etc), and the edges represent references (i.e. an invocation of a method or access to a property). That's all rendered natively in SwiftUI using `Path`s and a bunch of geometry (the math for offsetting the arrows a few pixels away from the edge of each node was particularly difficult). I wanted to natively render this graph, rather than e.g. embedding a Mermaid/Graphviz bitmap, because I want it all to be interactive:
	* Currently, you can select a node to see its details in the inspector (that's the `.Bar` symbol highlighted in blue in this screenshot).
	* Eventually, I'd like edges to be selectable as well, and it'll show you the corresponding path details (more on this below).
	* When searching for paths, the selected result is highlighted (that's the orange in this screenshot).
* There's an overlay to search for paths, currently supporting paths from one node to another. This is a way to find answers to the question "does this code call this other code"; e.g. if you were looking at the handler for an API endpoint and wondering if there's a callpath by which it might call some buggy helper method. It calculates this by traversing the reference graph from the starting node, storing all paths that lead to the ending node, and rendering each path as an interleaved sequence of nodes (represented by the white bars in the screenshot) and the source code at locations that correspond to each edge.

I'm pretty happy with how this turned out, and (to my pleasant surprise), people on Twitter agreed — [this tweet](https://twitter.com/tanagram_/status/1706145793328198016) and [its followup](https://twitter.com/tanagram_/status/1706876349288521956) have been significantly more popular than other things I've tweeted. Last month, I was a bit skeptical that the reference graph would be useful, but seeing search paths highlighted here, combined with people [liking it](https://twitter.com/Zephraph/status/1706881147878203471) on Twitter, have changed my mind.


In the meantime, I've continued talking to potential users. Some takeaways from my three conversations this month:
* There's a common theme around the difficulty/toilsome-ness of building a mental understanding of how some code actually works, especially when it comes to jumping through code constructs, such as Redux actions and HTTP method calls, that aren't direct method invocations.
* A couple of people (including previous months' conversations) resort to plain text/Markdown scratch files to keep notes while trying to build that mental understanding. I do this too — it's good to get validation that I'm not the only one — and I think there's room for a product to make that experience much better.
* A couple of comments validated additional features/improvements I want to make to the reference graph and search product.

# Roadmap: October 2023
I'll continue to do user-research conversations, focusing on people who work on larger codebases where navigating and understanding are more of a challenge.

On the development front, I'm turning an eye towards transforming Tanagram from a demo/proof-of-concept into a real product. Specifically, there's performance and codebase–size-related bottlenecks I need to work through, and "works on my machine" bugs to investigate. I'm also going to expand the reference graph search capability, including the ability to filter results/compose searches.