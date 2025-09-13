---
title: How To Do My Job
date: '2019-09-09'
updated: '2019-09-09'
slug: how-to-do-my-job
excerpt: >-
  Recently, I was talking to a future coworker (who didn’t work as a software
  engineer), and I found myself indelibly curious about what exactly his job was
  like and what I would need to know if I...
---


Recently, I was talking to a future coworker (who didn’t work as a software engineer), and I found myself indelibly curious about what exactly his job was like and what I would need to know if I wanted to competently perform his job. I didn’t get to fully find out at the time, but I later came up with a possible framework for how I’d like to explore the topic. For illustrative purposes, I’ll go first:

> How would I describe what I do to a reasonably intelligent knowledge worker who isn’t a software engineer?

First, some context: this is from the perspective of a mid–/senior–level software engineer, and only covers the software engineering piece of the job. Real-world roles, especially at smaller companies, will likely require some skills in other functions, including product development, UI design, mentoring/coaching other team members, and building productive work relationships.

# Understanding problems

Before actually writing code, you need to understand what you’re setting out to accomplish in a holistic, intuitive way. You will need to know or find out what the use cases will be (how your change will be used and by whom), and what your constraints are (both explicit requirements and implicit thresholds of reasonable-ness, like how fast your code needs to be). There will often be multiple simultaneous constraints, and you will have to keep them all in mind.

Next you’ll want to come up with a sufficiently-detailed path of how you’re going to complete your implementation and deliver it. In this case, “sufficient” means enough granularity such that you have no doubt how to do each piece — this implies, somewhat counterintuitively, that your plan will likely need more explicit steps when you’re less experienced, and that you’re allowed more hand-waving, high-level steps when you’re more experienced. Once you have a plan, you can make a rough estimate of when you’ll be able to deliver the finished result. Part of your job is to get more accurate at estimating this, given time and experience.

Ultimately, the point of shipping software is to make an impact on the business, so you should have some idea of which metrics will change and to what extent each will change once you’ve shipped your project. You should understand the use case enough to list most or all of the business-level metrics that will be affected, and provide a rough estimate of the amount of impact on technical metrics (including network response times and CPU/memory/disk usage). With experience, you’ll be able to refine your estimations and predict the impact of your code with greater accuracy. You’ll even be able to use these predictions early on in your planning to consider a different solution if it appears that one particular solution will have an intolerable effect on a performance metric.

# Actually writing software

I mostly build web-based applications and APIs, which, at a high-enough level, involves knowing how to do a couple of things:

**Read data from a database and combine it in different ways:** Designing the structure of database records to support good performance when you end up with a lot of data, figuring out how to correctly and efficiently combine data stored in different places in your database, and implementing fallback plans if your database goes down.

**Write changes to a database:** Making sure data is valid (this is [harder](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/) [than](https://www.mjt.me.uk/posts/falsehoods-programmers-believe-about-addresses/) [it seems](https://github.com/kdeldycke/awesome-falsehood)!), efficiently saving complex changes when it involves multiple little changes under the hood, keeping multiple copies of your data in sync within an acceptable amount of time (typically measured in milliseconds), and implementing fallback if your database goes down.

**Moving or transforming very large amounts of data:** Implementing database queries and dashboards (both for internal use cases and customer-facing), and coming up with highly-customized approaches to keep everything running in a reasonable amount of time.

**Understanding documentation and code examples:** [Sight-reading](https://en.wikipedia.org/wiki/Sight-reading) code examples from tutorials and documentation to understand what its doing and how it may be adapted to your particular use case.

**Writing reusable code:** Being able to see the bigger picture of what you’re trying to build — you’re working with code that does x or need to build a feature that does x, but is there a more generic feature (where x represents a specific instance of that feature) that can feasibly be implemented and may reasonably be useful? Finding the balance between not building something overly specific and not building something overly generic (which tends to be over-engineered, too complex, or both) is quite difficult in practice. There exist principles of well-designed code; these vary according to the type of code and programming language you’re using, but they can be learned and serve as a good starting point for finding that balance.

**Building UIs:** Certain types of software will require a UI with which users can actually do things. Building UIs requires decent design taste (or at least the ability to faithfully implement designs from mocks). UIs are often incredibly complex because your code has to potentially keep track of every little detail — which view or page users are on, how they got there, scroll positions, which buttons have been clicked, and much more. All of these little pieces of UI information can interact and influence each other and interaction patterns are prevalent, which means writing reusable code is incredibly important.

**Fixing bugs and keeping things running:** Remaining calm when things break, developing an intuition for why a particular breakage might be happening (based on experience and the ability to identify high-signal indicators), and establishing and effectively using tools to get visibility into what’s going on.