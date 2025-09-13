---
title: 'Tanagram Roadmap: May 2022 + Demo #3'
date: '2022-05-08'
updated: '2022-05-08'
slug: 'tanagram-roadmap:-may-2022-demo-3'
excerpt: >-
  This is my fourth monthly public roadmap update for Tanagram development (see
  previous updates here). I'm publishing this update to document my progress and
  hold myself accountable, and also provide...
---


This is my fourth monthly public roadmap update for Tanagram development (see [previous updates here](/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace over the past two months has consistently been about 1–2 workdays per week.

# Results: March–April 2022
I've finally finished everything I wanted to do for Alpha 1:
1. UI for creating new commands (✅).
2. UI support for editing the implementation of a command (✅).
3. UI and server support for showing the run history of each command (✅).
4. Server support for de-retaining command run history (✅).
5. UI and server support for creating/deploying a new kernel (✅).

My intent with Alpha 1 was to prototype a development UI that surfaced "higher-order" components (commands, HTTP servers, and kernel instances) and do so in a way that minimized the amount of thinking required between writing some code and getting it to run on the internet. This is what it looks like:

<div class="ytEmbedContainer">
<iframe width="945" height="532" src="https://www.youtube.com/embed/NF7iC3UC7n0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

It took me a while to implement the functionality to programmatically spin up a kernel on a new server. There's now a happy path where it works end-to-end, but it's still brittle in practice and leaves some open questions.

I originally started with a bare-metal implementation: I used the Linode[^1] API to create a VPS instance, waited for it to be ready, used [SSHKit](https://hexdocs.pm/sshkit/readme.html) to connect to it, and ran commands to install Elixir, Postgres, copy my kernel source, compile it, and run everything. Each run took over 20 minutes, mostly spent on installing Erlang and compiling Tanagram's dependencies. 

I then tried building the Tanagram kernel as a Docker image, with its dependencies pre-installed and Tanagram itself compiled. I still used the Linode API to create a VPS instance and SSHKit to run commands on it, except this time I was just installing Docker, pulling my image, and running it (and the database) through docker-compose. This typically take 5.5 minutes — much better than before, but still not great.

Shortly after I got it working end-to-end for the first time, it started failing towards the end of the setup process. I discovered that I'd been running close to the memory limit on the 1GB instances I was using: a successful boot left the server with 10–20MBs of free memory and sometimes `docker-compose up -d` was failing because the system was just running out of memory and the CPU spent all its cycles swapping to disk. Rather than spending more on bigger instances, I tried reducing memory usage by switching my Linode's OS from Ubunto to Alpine Linux instead, and that seems to have worked! I'm still running lean on free memory (my server ends up with about 50MBs of free memory after `docker-compose up -d`), but I haven't run out of memory since. I removed a few SSH commands I didn't need anymore, and reduced my setup time to 2.5 minutes. I'm also planning on switching my Docker base image itself from Ubuntu to Alpine — I suspect it'll further help reduce memory usage, and lead to a smaller image size which will reduce download times (currently, a large portion of the 2.5-minute setup time is waiting for my Docker image to download).

My current implementation is a bit weird. I wanted the logic of deploying a new kernel instance to live within the kernel itself, rather than in the client, so that if someone were to build an alternative client, they could get kernel-creating functionality for free. I have the kernel also keep track of other kernels it has created, which inadvertently creates a linked-list structure: each kernel could have its own independent list of other kernels it knows about. Each kernel has its own copy of commands and database; there's currently no concept of a "home" or "primary" kernel or datastore. This means my current implementation doesn't support a use case like having separate environments (e.g. QA and production; blue and green) in which users can stage the same code. I'll have to think about how to re-arrange things to enable this.

# Roadmap: May 2022
In May, I want to do some more design explorations and think about what I want Tanagram-the-product to be. A couple of thoughts:

I want Tanagram to be a platform for me to invent new UI functionality and interactions. Thematically, I want to figure out how to build good-looking _dense_ UIs, and figure out an ontology of UI building blocks that allows users to customize and assemble UIs that make sense for them (i.e. [feature-less software](/posts/feature-less-software)). Tactically, I want to figure out how to make scroll views more powerful and keyboard focus/control more obvious.

I think Tanagram's primary interface metaphor will be a canvas upon which users can arrange small blocks of information and functionality, sized only as big as necessary (i.e. contributing to a dense UI). In computing's current interface paradigm, we're stuck with rectangles on screens, but at least a collage of small, precisely-bounded rectangles allows more to fit on-screen than big monolithic rectangles (i.e. windows for traditional apps). 

I can't stop thinking about [this demo](https://twitter.com/yoshikischmitz/status/1176642448077967362?s=21&t=60SEfprseeGzfK43W2qNFA): query for some data and then iteratively map it in a free-form way into a UI.

For Tanagram-the-product, I'm of two minds: I could make it into a development IDE product, a "batteries-included programming environment". I've been thinking about the ideas behind Tanagram entirely in the context of software development. But I'm not sure if there's a sustainable (i.e. bootstrappable) business model around a development IDE product, and making it a general-purpose development environment would mean that I would have to build a lot of surface area to make it useful for real development work.

I could also make Tanagram into a business/organization database and process-builder: the Tanagram schema can include not only commands and HTTP servers, but also cron jobs, teams and roles, users and customer relationships, incidents, projects, and more. Units of code can be foreign-key linked to teams; those links can be used to surface areas of ownership during a re-org. Escalation processes can be written programmatically: some code runs, and if one condition is met, then an alert is sent to role _x_ on team _a_, and if another condition is met, then an alert is sent to role _y_ on team _a_'s parent. With automatically-generated UIs for commands, commands could be written to represent an intake form for a team process, and then its inputs can be directly ingested and processed by real code. It would be easy to build internal tools like a [directory](https://stripe.com/blog/stripe-home) or an incident-management portal. In this case, the value is more for business owners and managers, and the development ergonomics and surface area matter less. The value, and pathway to capturing some of it, is a lot clearer than that for a development IDE product.

I wonder if this latter idea might still be too broad or expansive as a starting point though? I'll need to figure out if there's a minimal set of generally-useful capabilities I can start with, or whether I should start by focusing on capabilities for businesses/organizations in a particular vertical or of a particular shape.

[^1]: I'm using Linode for my development because their dashboard and API are easy to use and their servers are cheap.