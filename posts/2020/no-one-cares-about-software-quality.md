---
title: No One Cares About Software Quality
date: '2020-06-22'
updated: '2020-06-22'
slug: no-one-cares-about-software-quality
excerpt: >-
  No one cares about software quality anymore. I mean, yes technically that is
  untrue and there are demonstrably some people who do, but for the most part,
  quality software has become a niche...
---


No one cares about software quality anymore. I mean, yes technically that is untrue and there are [demonstrably](https://inessential.com/2020/05/18/why_netnewswire_is_fast) [some](https://sigpipe.macromates.com/2020/macos-catalina-slow-by-design/) [people](https://craigmod.com/essays/software_slump/) [who](https://tonsky.me/blog/syncthing/) [do](http://thume.ca/2020/05/17/pipes-kill-productivity/), but for the most part, quality software has become a niche luxury[^3] while the most commonly-used software has become a slow, laborious cesspool.

I just had the misfortune of using the [new Google Groups](https://gsuiteupdates.googleblog.com/2020/03/new-google-groups-beta.html) for the first time and died a little on the inside. The first thing I noticed (besides the egregious amount of pixels wasted on whitespace) was that they broke copy-and-paste. Let me explain:

I send an email with a specific format to a group every week. Every week, I could copy the content from my previous email (which had the latest iteration of the tweaks and boilerplate content) and paste it into a new email compose window and just change the relevant bits of content. Not anymore — try doing that with the new groups and the pasted result is a deeply-indented mess complete with a blue border on the left (weird, right?) and half a printed forest's worth of newlines at the bottom. _Sigh_. Undo, paste-as-plain-text, manually reapply all my formatting. 

The list of conversations used to have infinite scroll, and now it doesn't. One of the nice micro-interactions you can do with a tall list of content is to _scroll_ the next row into place and then click it, rather than having to _move the mouse_ to it and then click it. Sounds like a tiny difference, but if you actually try it, the former is meaningfully easier to maneuver and pull off than the latter. Combined with the two-finger swipe gesture to navigate back and it was a pretty quick way to go through all the conversations in a group[^1]. With a sufficiently-tall screen and no infinite scrolling, this interaction no longer works.

And then it took me a while to realize why half my clicks on the conversation list didn't seem to be working. It turns out, you have to be careful where exactly you click. Each row in the list is 44 pixels tall, but the clickable area is only 20 pixels tall. Half the cell is literally wasted space.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/software-quality-1.jpg)

The list goes on.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/software-quality-2.png)

At face value these are infinitesimally-trivial problems. So I have to wiggle my finger a bit more, big deal[^2]. 

But **my bigger point** is that I think these are symptoms of chronic, pervasive problems with the way we develop and interact with software. Messing up my formatting upon copy-and-paste is a _data-corruption bug_, but we don't think of it this way. Imagine if every time you copied something, half the letters would just come out randomly scrambled. That would more likely be noticed as a bug (hopefully!) and fixed. It's just that we don't really think about the formatting as part of the content because it's not a reliably reified part of the common computing experience. In other words, we have lots of existing software that reliably mangles formatting → we learn to distrust software's ability to preserve formatting → we start ignoring it → no one notices when _they_ build software that mangles formatting, and the loop perpetuates. You can't test for a regression if it doesn't even cross your mind to test for it.

Above all that, I get the feeling that the median vocabulary of interactions with computers is shrinking. I see so many people who's entire computing experience is laboriously moving the mouse, clicking on buttons, and maybe poking ⌘C and ⌘V. For knowledge workers who spend half their waking hours using a computer, that's [akin to being a professional athlete who never visits the gym](https://notes.andymatuschak.org/z4qhD8UwNAmJDdJUC36BUGp5PEUfgfzZXvkhB). And if the median computer user uses computers entirely by mousing around, they'll design software that is meant to be used entirely by mousing around, and that'll force others to learn that software is meant to be used by mousing around, and the loop perpetuates. In such a world, _of course_ no one writes a test or QA script to make sure copy-and-paste doesn't mangle formatting, because, well, who does that anyway?

[^3]: See [Superhuman](https://superhuman.com) — $30/month for keyboard shortcuts and software that just _isn't slow_.
[^1]: Of course I know about keyboard shortcuts. In this case, part of my workflow in each conversation involved a part of the UI that, as far as I could tell, wasn't accessible by keyboard shortcuts. So I had to use the mouse, and if I was going to do that I wanted to figure out the _fastest_ way to do it with a mouse.
[^2]: People with RSI might contend this is, in fact, a big deal.