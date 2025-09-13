---
title: 'Tanagram Roadmap: September 2022'
date: '2022-09-05'
updated: '2022-09-05'
slug: 'tanagram-roadmap:-september-2022'
excerpt: >-
  This is my eighth monthly public roadmap update for Tanagram development (see
  previous updates here). I'm publishing this update to document my progress and
  hold myself accountable, and also provide...
---


This is my eighth monthly public roadmap update for Tanagram development (see [previous updates here](https://feifan.blog/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace over the past month has averaged about 1 workday per week, with some weeks being higher and other weeks being lower.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: August 2022
I've been building demo-able (read: powered by hard-coded data) UIs to get a better feel for my initial designs. A month ago, I had this little thing:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-08-roadmap/tanagram-2022-08-06.png)

Now, I have a lot more, and I've learned a lot about how to use AppKit:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-09-roadmap/tanagram-2022-09-01-1.png)
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-09-roadmap/tanagram-2022-09-01-3.png)
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-09-roadmap/tanagram-2022-09-01-2.png)

Each of the panes are an "item", an instance of several built-in types. Each item pane has a contextual action bar, showing the actions that can be performed on or with that particular item. There's also a global action bar with app-wide actions; it will also support open-by-ID: you'll be able to paste in the ID of any item and open a pane for it[^0].

A little more than a decade ago, I taught myself to code with C, Objective-C, and the nascent iPhoneOS SDK[^1]. After switching to building webapps around 2014, I'm coming back to Apple's development platforms with a hint of nostalgia and a wallop of bewilderment. Here's a smattering of things I've learned recently, mostly from trying things and seeing what happens:

- `init(frame:)` is the default initializer for `NSView`, but (in an autolayout world, at least) the provided `frame` doesn't seem to do much. I used to spend a bunch of time and code calculating what the frame should be, but using `NSRect.zero` seems to work in most cases.
- I struggled with `NSTabView` for a while: it seems to silently [add some autolayout constraints](https://twitter.com/tanagram_/status/1557544173049221120?s=21&t=tpe70t45MhSlxwixxe9NNQ), despite me turning off `translatesAutoresizingMaskIntoConstraints`. These constraints cause an ambiguous layout, and I wasn't able to get to them to manually remove or modify them.
- `NSButton` can't store much information about what the button represents (e.g. "this button operates on item `obj_123`"). It has a `tag` field, but that can only store an integer. If you wanted to store a string ID or anything more complicated, you'll have to create a whole subclass.
- On the web, CSS affords a broad set of visual attributes (e.g. backgrounds, borders, padding, and rounded corners) to every view. That's not the case for `NSView` — I had to create subclasses specifically to draw borders and rounded corners, and doing this drawing requires lots of manual code (e.g. manually creating `NSBezierPath`s), and this code can only be called from `draw(rect:)`.
- I wanted the action bar (both the global one and the item-specific ones) to behave like Safari's navigation bar: it'd present a list of options below the bar that changed based on the user's input, but keyboard focus would remain with the input field so the user could keep typing. I originally tried doing this with `NSMenu`, but soon realized this wouldn't work because `NSMenu` wanted to take keyboard focus. Instead, I had to create the whole view from scratch and try to make it look like a native menu. Luckily, I found a link to an old [sample project](https://developer.apple.com/library/archive/samplecode/CustomMenus/Introduction/Intro.html). It was last updated ten years ago, but to my pleasant surprise, it still compiled and Just Worked.
- `NSTableView` doesn't render its headers when you add the table view as a subview directly, but they magically appear if you add the table view to an `NSScrollView`.
- Setting `edgeInsets` on `NSStackView` instances works along the stack view's primary axis, but don't seem to do anything along the other axis.
- A few times, I would create a view, programmatically add some subviews (all sizes were defined by autolayout), and then want to want to know the resulting size of the parent view. `view.frame`  would return `0` or some obviously-wrong number. For a while, I had no idea how to make AppKit refresh the layout so I could get accurate sizes. Eventually, I found a StackOverflow answer that mentioned the `NSView.layoutSubtreeIfNeeded()` method, which turned out to be exactly what I needed.

My overall impression is that AppKit is very flexible and lets me muck around and do anything, but there's also some magic behavior and, to be effective with it, I need to know the (non-obvious) incantations and places to poke for various results.

# Roadmap: September 2022
I'll spend September building more UI to showcase some specific use cases I have in mind. Specifically, I'll be working on:

- Query ItemView
- Datum ItemView (described in [this post](https://feifan.blog/posts/tanagram-roadmap:-july-2022))
- Using a datum in a command (e.g. as an API key)
	- Bidirectional link between a datum and a command
- Creating an event type from a command and linking them on the canvas
- Creating an event handler from an event
- Canvas zooming


[^0]: For readers who are or have worked at Stripe, yes this is inspired by `go/o/:id`, which is a _great_ idea.
[^1]: I also turned around and taught the world what I'd learned in [a blog](https://cupsofcocoa.wordpress.com/) that got moderately popular.