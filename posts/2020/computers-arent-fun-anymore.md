---
title: Computers Aren't Fun Anymore
date: '2020-07-27'
updated: '2020-07-27'
slug: computers-arent-fun-anymore
excerpt: >-
  Throughout The Dream Machine, a history of the early days of computing,
  tinkering and having fun was a recurring theme throughout the decades. I
  wasn't around to experience the early days of...
hero_image: 'https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/penny-farthing.jpeg'
---


Throughout [_The Dream Machine_](https://www.amazon.com/Dream-Machine-M-Mitchell-Waldrop/dp/1732265119), a history of the early days of computing, tinkering and having fun was a recurring theme throughout the decades. I wasn't around to experience the early days of computers myself, but they seemed to be genuinely exciting and rewarding. In the words of MIT sociologist Sherry Turkle: computers empowered their users, making them feel smart[er], "in control", and "more fully participant in the future". 

Those feel like odd descriptions for the modern computing experience. Using computers today doesn't feel like an empowering experience. Sometimes it's mindless and distracting. Sometimes, when a redesign rolls out, or laptop doesn't wake from sleep mode, it's downright hostile. The experience of using a computer in 2020 is a concoction of data silos, dinging notifications and reinvented wheels, presented in gratuitously bubble-wrapped UIs hyper-optimized by persnickety product managers and soulless A/B tests. 

For most people, the computing experience is [clicking around a lot](https://feifan.blog/2020/06/22/no-one-cares-about-software-quality/), typing into disparate apps in which your data is trapped except through narrowly-defined, bespoke integrations, and struggling to find _that thing you were just reading a few days ago_ among all the silos. This doesn't make anyone feel smarter or more in control. It's simply frustrating.

Software _development_ is stuck in the doldrums too. A massive amount of cumulative engineering effort is spent rebuilding the same primitives[^0] because the software engineering industry hasn't convincingly developed platforms at higher levels of abstraction[^1]. A significant portion of development effort goes to placating not-invented-here-ness, where companies feel the need to build their own version of every feature, each slightly different (user familiarity be damned). A lot of software is little more than looking up API documentation and plugging one into another. There's a dearth of creativity, of joy and discovery, of inventing something interesting and new. 

To be fair, computers — both the desktop kind and various mobile kinds — enable[^3] seemingly-impossible[^4] things[^5]. But it feels frustrating to see the pioneering spirit that originally led to the development of modern computers giving way to uninspired flat interfaces[^2] and [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) SaaS apps. The things you can do are limited to bespokely-implemented features, dribbled out only as fast as a small team of designers and developers can think of and build them. Of course you have an extensive list of things you _wish_ your phone/computer/most-used apps could do; everyone does. You know the majority of it will remain a wishlist; there's almost no hope of the feature you really want being implemented[^6]. This isn't empowering. What's more, new features tend to be one-off improvements and ungainly new ways for you to do more work[^7] rather than adding or improving functionality in a generalized way so you can remix functionality and do things faster.

For the people who've figured out the right incantations to type and buttons-buried-in-submenus to click, computers can automate administrivia, surface information, and make them feel "more fully participant in the future". But getting there is an arduous journey, and many people get in a place where computers just make things harder. The experience of using computers is, in various ways, awkward and frustrating (and maybe even dangerous[^8]) for everyone. Computers were supposed to be bicycles for the mind. So far we only have penny-farthings.

[^0]: If you wanted to build a [web] app to do … anything, you probably have to start by setting up a database server, building a schema from scratch, possibly importing existing data or building a bespoke API-based integration, HTTP endpoints and request and response payloads. To build the UI you're given little more than buttons and generic rectangles and an unkempt jungle of components and abstractions that may or may not be any good. Project setup scripts exist, but all that [incidental complexity](https://www.infoq.com/presentations/Simple-Made-Easy/) still [_exists_](https://twitter.com/dhh/status/1258074299337826304?s=21) in your codebase before you've even gotten to the intrinsic complexity of what you're actually trying to build.
[^1]: I explored this [on Twitter](https://twitter.com/feifanz/status/1285766348975427585?s=21)
[^2]: Specifically, I'm referring to UIs that tend to have low contrast/readability, hidden functionality, and acres of space between elements that aren't accessible via keyboard controls, only laboriously mousing. I'm not sure if flat design was the starting point for these problems, but I think it's accurate to say it was an inflection point at least.
[^3]: Halide: RAW photography from the camera you already have that rivals the quality of much bulkier DSLRs.
[^4]: Concepts: An infinite canvas. Literally impossible without software.
[^5]: Spreadsheets: replaced roomfuls of human computers (literally, "people who computed")
[^6]: Sometimes, someone builds a new app to address a feature gap. But building a new app requires a ton of effort just to get to parity with what already exists (see above), and this new offering will inevitably have feature gaps elsewhere.
[^7]: See [Justin's tweet here](https://twitter.com/itunpredictable/status/1266125506925092864)
[^8]: From the benign case of accidental deletion to not being able to comprehend the deceptiveness of artifically-generated content.