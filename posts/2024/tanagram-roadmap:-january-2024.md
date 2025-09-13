---
title: 'Tanagram Roadmap: January 2024'
date: '2024-01-07'
updated: '2024-01-07'
slug: 'tanagram-roadmap:-january-2024'
excerpt: "Tanagram remains a nights-and-weekends project. My progress pace during December averaged a bit under 1.0 workdays per week; I was on vacation for much of the month\r\n\r\nWould you like to receive these..."
---


Tanagram remains a nights-and-weekends project. My progress pace during December averaged a bit under 1.0 workdays per week; I was on vacation for much of the month

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: December 2023
I spent December implementing the search UI that I sketched [last month](https://feifan.blog/posts/tanagram-roadmap:-december-2023). It looks [like this](https://twitter.com/tanagram_/status/1743838636586754320). 

The search tokens input looks simple, but involves a lot of custom AppKit code:
* The tokens are custom views rendered inline in an `NSTextView`.
* I wanted the tokens to be transparently navigable via arrow keys — users can use the arrow keys to move the cursor between the outer text view and the text fields inside each token. I [prototyped](https://twitter.com/tanagram_/status/1731181807029363121) this earlier in December, and refined it since then. 
* Users can press ⌘↩ in either the outer text view or the inner text fields to submit the search.
* The autocomplete suggestions are rendered in a custom `NSWindow` whose position is calculated to match the cursor's position. Arrow keys can be used to select suggestions.

# Roadmap: January 2024
In January, I'll spend a bit of time fixing some bugs and rough edges with the search UI. Most of my time will go towards revisiting the foundation of how I work with Xcode projects and SourceKit-LSP. My current implementation is brittle and requires a lot of manual effort from users, which has limited potential users' ability to try using Tanagram. I'm not sure how I can make this better yet; that's part of what I'll have to figure out.