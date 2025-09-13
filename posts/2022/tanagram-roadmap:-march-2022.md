---
title: 'Tanagram Roadmap: March 2022'
date: '2022-03-06'
updated: '2022-03-06'
slug: 'tanagram-roadmap:-march-2022'
excerpt: >-
  This is my third monthly public roadmap update for Tanagram development (see
  previous updates here). I'm publishing this update to document my progress and
  hold myself accountable, and also provide a...
---


This is my third monthly public roadmap update for Tanagram development (see [previous updates here](/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace at the beginning of the month was roughly 1.5 workdays per week, and I've been at home the past few weekends which led to some good progress. Since the second half of the month though, I've been involved in a big, urgent project at my day job that's occupied almost all my working hours and energy.

# Results: February 2022
I got through most of what I set out to do in February:
1. UI for creating new commands (✅).
2. UI support for editing the implementation of a command (✅).
3. UI and server support for showing the run history of each command (✅).
4. Server support for de-retaining command run history (✅).
5. UI and server support for creating/deploying a new run instance.

I expected that I might not get to #5 in February, and indeed this was the case. This is a much bigger project, and I expect it'll be the only thing I get done in March.

# Roadmap: March 2022
In March, I have family visiting, and I'll be on vacation later in the month, so I'm adjusting my expectations for progress accordingly. I'm going to focus entirely on UI and server support for creating/deploying a new run instance — and within that, an emphasis on server support first[^1].

Here's what I have in mind: you click one button to spin up a run instance (see [January's post](/posts/tanagram-roadmap:-january-2022) for what this means), either to just have around or to run a command. Behind the scenes, your currently-active Tanagram kernel (whether running on localhost or a remote server) creates[^3] a VPS or cloud-compute instance[^2], installs Elixir and Postgres on it[^4], compiles the Tanagram kernel, copies over the necessary items (e.g. commands, servers), and then runs whatever you wanted it to run. Your existing kernel will do its best to handle errors and retry while it's setting up the new one, and your client will check for heartbeats and monitor the new run instance's uptime.

I haven't yet decided if I want to do this "bare metal"-style (by directly installing Elixir, Postgres, and compiling the Tanagram kernel on the run instance server), or by distributing everything as a Docker image ([like Retool does](https://github.com/tryretool/retool-onpremise) for their on-prem offering). I'll want to solve for:  
- Developer productivity: whether supporting Docker for remote kernels will also necessitate running the kernel with Docker on localhost — I won't want that while developing because I don't want the overhead Docker adds to everything, and I want Tanagram to be distributable as a self-contained app.
- How long it takes to be ready and reflect changes: starting with a newly-provisoned server instance, I'll have to determine if it's faster to 1) install Elixir, Postgres, and compile the Tanagram kernel, or 2) install Docker and pull the image corresponding to your Tanagram kernel. I'll also have to determine whether it's possible to maintain an instant save-and-recompile process for updating user-defined commands.

I'll have some answers to share around this next month.

[^1]: I'm not very happy with the UI I've built so far. Admittedly that's in large part because I'm not very good at building UIs and my result so far is rather janky, but … at a conceptual level, the hierarchical UI I've built so far faces the same constraints that I find myself chafing at with other apps. I'd like to see if I can do better. More on this in a future post.
[^2]: Cloud support will be pluggable and there should be enough flexibility in this interface for plugins to surface cloud-specific details — for example, a plugin for AWS might ask you about IAM settings for the EC2 instance it's going to create, whereas a plugin for Linode won't.
[^3]: Or recycles an existing instance, eventually. It definitely could make sense to have a pool of instances ready to go, but I'm not planning to build any pool-management features at first.
[^4]: Or check that it can establish a connection to your existing Postgres server.