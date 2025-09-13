---
title: Documenting Some Thoughts Around Tanagram
date: '2019-08-09'
updated: '2019-08-09'
slug: tanagram-intro
excerpt: >-
  Tanagram is the name of a project idea I’ve been thinking about for a while. I
  trace the idea’s lineage back to a little prototype I built in late 2013. I
  didn’t think much of it at the time, but...
---


Tanagram is the name of a project idea I’ve been thinking about for a while. I trace the idea’s lineage back to a little prototype I [built in late 2013](https://github.com/feifanzhou/canvas). I didn’t think much of it at the time, but I’ve revisited this idea (or at least something directionally-related) countless times in intervening years.

With the [free time I’ve had lately](https://feifan.blog/2019/07/22/next-steps/), I decided to gather my scattered thoughts and define what exactly I want to build, distilling many vague ambitions into specific product features. I treated it as an exercise in articulating my thoughts, as well as a singular place to point people to when I’m asked about the project (it’s rather complex to explain!). The result is a [rather long read](https://tanagram.app/).

In short though, Tanagram is built around two hypotheses about modern software:

* Productivity software should behave in a way that better aligns with human brains, and remove as much friction as possible to asymptotically approach the speed of thought. I’d consider any app that behaves like a notebook, calendar, todo list, project planner, or communication tool to roughly fall in this category. These apps should enable a rich network of links between pieces of information — e.g. a calendar event corresponding to a meeting should be linked to the notes, follow-up discussions, and action items/tasks resulting from that meeting — and capture the metadata necessary to automatically make and surface these links wherever possible. Typically, this requires manual effort to add these links and keep them updated with existing software — after a meeting, does anyone gather all the resulting JIRA tickets and add links to them in the calendar event? How often have you wanted to see a list of action items that came out of a particular meeting or series of meetings? I think this is an unfortunate side effect of the way software has traditionally been built.
* A lot of existing software (including almost all productivity software) bundle their data with their UI — you can’t access the data stored by an app without using its UI, and you can’t use a different UI to interact with the data stored by any particular app. At the same time, many apps have data models that conceptually overlap — if you squint a bit, the database for both JIRA and a todo list app like [Things](https://culturedcode.com/things/) both contain the same Task model, plus or minus a few fields. I contend that it would be valuable to have a generic database storing these modern “primitive” data types, and allow multiple apps to extend and jointly access this data. This enables apps to innovate on UI and ship the ideal UI for more niche use cases without having to expend the fixed cost of data modeling and persistence that, at a squint, is pretty similar across legions of apps.
The result from Tanagram would be this database, in addition to at least one “client” app that addresses my personal use cases for productivity software. The database would have an authenticated, graph-based API; along with defined integration points, the Tanagram platform would enable other developers to build software to suit their own use cases.

More details are available at [tanagram.app](https://tanagram.app/). Feedback is absolutely welcome! You can reach me through the comments on this post or [on Twitter](https://twitter.com/FeifanZ).