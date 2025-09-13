---
title: Thoughts on Personalizing Software
date: '2018-05-22'
updated: '2018-05-22'
slug: thoughts-on-personalizing-software
excerpt: >-
  I’ve been obsessed with productivity software for most of my life. I’ve
  sampled dozens, from simple personal tools (like Apple Notes) to full-featured
  productions complete with the kitchen sink (like...
---


I’ve been obsessed with productivity software for most of my life. I’ve sampled dozens, from simple personal tools (like Apple Notes) to full-featured productions complete with the kitchen sink (like Phabricator and JIRA). None of them ever felt comfortable — many were too simplistic, some were too prescriptive, and some were overwhelmingly customizable (although not necessarily in the ways that I would’ve liked).

The fundamental challenge is that software products are more-or-less centrally designed, and even assuming a product is well-designed with many use cases covered, software products are exactly as-is, no more or less. Without the ability to add specific functionality, change certain flows, or remove unnecessary complexity, most software ends up being prescriptive and less-than-ideal for most specific use-cases.

For example:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The state of Google calendar leaves much to be desired, especially if you are a person with a two separate calendars and you&#39;re rigorous about that separation. <br><br>&quot;Show Free/Busy information from Calendar B on Calendar A&quot; would solve so many scheduling problems.</p>&mdash; EricaJoy (@EricaJoy) <a href="https://twitter.com/EricaJoy/status/996408189317926912?ref_src=twsrc%5Etfw">May 15, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Google Calendar is a complex and extensively-designed product, but at some scale, any product will overlook or choose not to include certain use-cases that might be important to a subset of users. The end result is a product that’s not “just right” for anyone.

But does it have to be this way? Does software have to built towards a one-size-fits-all paradigm that exists in real-world products at the intersection of economics and the laws of physics?

To be fair, there are examples of customizable and extendible software. Some apps ship with extensive options. The proliferation of APIs provides a foundation for countless products built on the same underlying data ([Nylas](https://www.nylas.com/) is a great example of an easy-to-use API over email and calendars, which normally depend on arcane protocols). And, developer experience aside, [Salesforce Apex](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro_what_is_apex.htm) is a first step towards a world of personalized software.

![Customization options for iTerm 2](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/customizing-software.png)

I’d love to see a world of software that allows any user to change the way certain workflows work, add custom inputs, and automate steps that should happen after a particular trigger.

Technically, we’re starting to see the building blocks that would make this possible — serverless execution is getting faster, and GraphQL makes it easier to discover and understand APIs.

Practically, I think this would mean a shift in the way we think about software product design along two dimensions:

* How extensive is the base product? At the minimalist extreme, the product is essentially an API to the underlying data, with minimal functionality out-of-the-box. At the kitchen-sink extreme, the product is likely complex, with built-in solutions for a lot of use cases, but may be harder to customize.
* How much customizability gets exposed? It’s easy to follow the rabbit hole of maximizing optionality, leading to a product that lacks cohesion and becomes incredibly difficult to maintain or change.
Beyond that, there’s also the question of how customizations would be implemented. Perhaps writing software will eventually become a form of basic literacy, and everyone can plug in personal code into a product at customization points. Or perhaps a product figures out an effective visual programming environment for its domain, and customization becomes possible without having to “write code”.

The obstacles between prescriptive software and personalized software echo fundamental debates in software engineering and UX design. But personalized software could unlock a massive amount of value in knowledge work if every worker could leverage software’s scale and computation capabilities in a way that matches the way they work.