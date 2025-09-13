---
title: 'Tanagram Roadmap: August 2022'
date: '2022-08-07'
updated: '2022-08-07'
slug: 'tanagram-roadmap:-august-2022'
excerpt: >-
  This is my seventh monthly public roadmap update for for Tanagram development
  (see previous updates here). I'm publishing this update to document my
  progress and hold myself accountable, and also...
---


This is my seventh monthly public roadmap update for for Tanagram development (see [previous updates here](/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace over the past month has been about 1 workday per week.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: July 2022
I've spent the past month talking with some friends about the idea-exploration process and thinking through some of the more complicated aspects of Tanagram's user experience. I'd like to focus today's update on one such aspect, because I still have many open questions and haven't yet been able to come up with a plausibly-cohesive user experience: the problem of collaborative development and syncing between kernels.

Tanagram will have a kernel component along with a client component. The kernel performs the execution of code and queries. To use an analogy, the kernel is an "OS layer", and the client is akin to a Terminal app. Tanagram data lives "on" the kernel, in the same way that, on personal computers, files live on the live filesystem hosted by the OS, and changes to these files can immediately change the OS's execution. In this way, Tanagram blends source code with the runtime. This is how users expect software products to work. For example, imagine you're using a tool to build dashboards. You'd make a change, click save, and then the dashboard just exists on production — the tool doesn't give you a file that you then have to go and upload to a separate production system. This is _unlike_ how software development works, where source code lives in its own repository separated from the production environment itself[^0].

Tanagram users will interact with a client application, and at any time, the client application will be connected to a "primary" kernel. The client gets its data from the primary kernel, and the client executes commands and queries by sending them to the primary kernel.

At first thought, it might appear to make sense for every change on the client to  immediately sync to the primary kernel so that the user can actually _do_ things. But I don't think this is always true, and it depends on the use case. For syncing from the client to a primary kernel:
- If a user is doing local development, using a desktop computer connected to a localhost kernel, they'd want automatic, instant sync.
- I also envision a mobile client (perhaps optimized for iPad), connected to a remote kernel to enable local-like development; in this case, users would also want automatic, instant sync.
- For collaborative development (e.g. pair-programming), users would probably also want automatic, instant sync.
- Kernels could also represent different environments, such as a QA environment or blue/green production environments. In those cases, users would want deliberately-initiated batch sync, maybe with some sort of approvals process (similar to a pull-request workflow).
- For kernels representing production environments, users would definitely want batched changes with approvals, and probably additional constraints around what counts as an approval or which users/roles are allowed to actually make changes.

Kernels should also be able to sync from other kernels: for example, users would want their local kernel to stay up-to-date with the production kernel so they can incorporate changes other people make. There's an open question here around how much the client should be responsible for syncing: if a user has a devbox kernel, several staging environments, and a production environment, should the _client_ be driving the syncing to all those kernels? Or should the primary kernel be doing the heavy lifting here?

For non-automatic sync, Tanagram will also need some way to track changes in order to list what has actually changed between any two pairs of kernels. This could be a big data set, and there are questions around how to present this set of changes to users[^1]. Change sets will also necessitate a review flow for those changes, and this review flow should be user-configurable. Users should be able to specify rules or invoke commands to validate changes before allowing them to be merged into a given kernel.

Users will want to "group" kernels into projects — for a given project, there might be one production kernel, a few staging kernels, and many local development kernels. But a user may be working on multiple projects, each with such setups, and will want ways to distinguish one production kernel from another. Each user may want to configure their own automatic syncing setup between development and staging kernels, but a project as a whole (or a team, yet another under-defined concept) may want to configure the sync rules between a staging kernel and the production kernel.

Sync will probably happen at the granularity of items (commands, queries, etc). Tanagram items can be synced, whereas data records (i.e. instances of user-defined data models) won't be, or at least not through the same mechanism — there are compelling reasons why users wouldn't want to sync development data records to production, and vice versa[^2].

---

Also in July, I thought about keyboard navigation for Tanagram and started implementing some of the UI I've been sketching, but the sync and collaborative development problems are much more interesting.

# Roadmap: August 2022
After a few months of sketching and coming up with ideas, it's time to switch back to implementation. I want to build a real, working version of the UI I've been sketching so I can get a feel for how it would actually be like to use, and whether I can cohesively string together some user journeys within this design. Having demos featuring real user journeys will let me explain items and concepts in the context of real-world motivation (rather than a homogenous list of ideas whose details can be overlooked), and will be an important step in making Tanagram into an actual product rather than just a collection of ideas.

I've been learning AppKit, and I'm off to a humble start:
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-08-roadmap/tanagram-2022-08-06.png)

[^0]: Tanagram's fundamental insight, as far as I can tell at this point in its development, is that it will be valuable to unify source code, runtime records, and user-data records into a single integrated development environment with a set of tools that can operate across all that data. The status quo of software development today is that this is _not_ the case, that this is a source of development friction, and that unifying the triumvirate will enable much better tools and understanding of software systems.
[^1]: Tanagram's [canvas](https://feifan.blog/posts/tanagram-roadmap:-july-2022) provides a way of spatially organizing items that goes beyond files in a tree. That spatial arrangement will likely have semantic meaning (e.g. users might arrange items in a particular order to correspond to a flow of data, or users might visually cluster logically-related items), and Tanagram should probably capture that spatial arrangement when showing potential changes. This means that simply displaying a flat list of changes (akin to a git diff) won't be good enough.
[^2]: The main reasons are privacy of end-users' data, avoiding data integrity problems caused by development data, and just the sheer volume of data and runtime records.