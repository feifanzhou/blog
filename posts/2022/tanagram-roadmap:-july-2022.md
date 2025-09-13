---
title: 'Tanagram Roadmap: July 2022'
date: '2022-07-05'
updated: '2022-07-05'
slug: 'tanagram-roadmap:-july-2022'
excerpt: >-
  This is my sixth monthly public roadmap update for for Tanagram development
  (see previous updates here). I'm publishing this update to document my
  progress and hold myself accountable, and also...
---


This is my sixth monthly public roadmap update for for Tanagram development (see [previous updates here](/labeled/tanagram)). I'm publishing this update to document my progress and hold myself accountable, and also provide a place to share some thoughts about what I plan to work on next.

Tanagram remains a nights-and-weekends project. My progress pace over the past month has been about 0.5 workday per week, a result of some distractions in my personal life.

_Would you like to receive these updates over email? I'm also publishing these to my Buttondown newsletter. [Click here to subscribe](https://buttondown.email/tanagram)._

# Results: June 2022
I've spent the past month creating many more mock-ups of what I think Tanagram's first-party UI could look like. As with last month, I'd like Tanagram to primarily be a canvas on which users can add and arrange small panels of data as needed; Tanagram itself would have very little pre-built/hard-coded UI chrome. Here's some ideas, roughly grouped:

## Querying
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/querying.png)
Everything in Tanagram is queryable. This includes [user-defined data models](https://feifan.blog/posts/tanagram-roadmap:-june-2022), of course, but also Tanagram's built-in items, including commands, events, and even queries themselves and their results.

- 1.1: Tanagram supports GraphQL queries, with a schema that's automatically generated from system items and user-defined data models. Users can also add commands to the schema as queries and mutations. The top half of this item view shows the schema fields available at position of the text-input cursor. As the user moves their cursor, the list of available fields instantly updates.
- 1.2: Query results will live-refresh as the user updates their query (as much as possible, govered by how quickly the query runs).
- 1.3: Queries can be scheduled to repeat on an arbitrary cadence. I've only mocked a UI for accepting a crontab input for now; designing a "real" UI for specifying arbitrary repeat cadences is really complex and I haven't seen examples of this done well. I'll revisit this in the future. One open question is whether scheduling should happen at the level of individual items (i.e. in this case, the user would schedule executions of this particular query), or in the form of a "scheduler" for all scheduled things in a Tanagram instance. In the spirit of [feature-less software](https://feifan.blog/posts/feature-less-software) and letting users decide, I think both should be supported. I haven't gotten around to designing the latter though.
- 1.4: SQL queries are also supported.
- 1.5: Users can transform query results into stylized UIs. More on this below.

## Events & Handlers
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/events.png)
Events are the system primitive for "something has happened". Commands and query results can trigger events at any time. I'm still figuring out the exact semantics and capabilities of events (e.g. are they broadcast to the whole system, or does it make sense to have private events? If so, how would private events be defined and used?). Events enable message passing/pub-sub behaviors, can be queried for metrics, and can be transformed into user-facing notifications.

- 2.1: Events are just data items with an ID and a bag of properties. I haven't yet decided if/how event types correspond to event properties (i.e. if event types correspond to a specific property schema, how is that schema defined).
- 2.2: Events automatically store detailed information about where they came from (e.g. the specific invocation of a query or command from which they were emitted). Users can look at this information to figure out where the event came from; users can also query this information to help with debugging (e.g. if a command fails halfway through, someone could query for events already emitted to figure out where to restart from).
- 2.3: Events can trigger any number of handlers. Tanagram will have bidirectional links everywhere it makes sense, and in this case, it makes sense to be able to see which handlers a given event has triggered.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/event-handlers.png)
Event handlers are simple:
- 2.4: The creator defines a predicate, and specifies what will happen when matching events trigger it. To start with, actions may include sending an email, sending a Slack message, triggering a system notification, or running a custom command (with the event as an input).
- 2.5: Event handlers keep track of all the events that have matched its predicate.

## Datum
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/datum.png)
A datum is a named piece of information that can be addressed via an ID. At first glance, it's like a constant or static config file in a codebase — the creator gives it a human-readable name and description, and can hard-code its values. But it's also a regular data record, so it can be programmatically updated. A datum can therefore be a good replacement for a config file or codebase constant/literal that needs to be manually updated upon a routine change.

- 3.1: A datum can also be a listing of a particular "type" of item. For example, this is a mock of a list of checkers (specific types of queries — more on this below), grouped by their owning team. This could be the cleaned-up result of a query that lists all checkers, or it could be a manually-maintained list if a programmatic query can't be written. Either way, this datum now exists as a "list of checkers, grouped by owning team", and can be used as an input to other commands or queries.
- 3.2: A datum value can be used elsewhere in Tanagram. In this example, a server config is stored in its own datum, and the `port` value is dragged in to the Port field for an HTTP server. This binds the server's port value to that of the datum.
- 3.3: The originating datum is shown when editing the server's Port field.

## Spaces
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/spaces.png)
Spaces are a way to group items into a logical set, typically corresponding to a single train of thought. 

- 4.1: Spaces are items themselves. They have an ID and name, and can be queried. They also can be closed or collapsed. Closed spaces go into an archive and can be restored.
- 4.2: Items within a space exist in a linear scroll. They can be collapsed to increase information density.
- 4.3: Hovering over the gap between any two items (or at the linear end of the space) reveals a button allowing the user to insert another item at that current location.
- 4.4: This is what a collapsed space looks like. It can be moved around the main canvas.
- 4.5: One way to create a new space is to right-click on an empty area and selecting "New space". The newly-created space is pre-populated with the same menu as in 4.3.

## Window Chrome
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/window-chrome.png)
Tanagram's UI primarily focuses on the main canvas, with a small amount of UI around it:

- 5.1: Tanagram allows users to connect to multiple kernels (the "backend" runtime that executes code). Each Tanagram window can be connected to one kernel at a time, and kernels store distinct items — this allows kernels to represent independently-updated environments for a project or entirely-separate projects. Users can add or configure many kernels.
- 5.2: There's an action bar in the middle. More on this below.
- 5.3: These panels show sync progress. Kernels can be configured to either sync changes automatically, or allow the user to manually push and pull changes on a per-item basis. This allows for independently-deployed kernels, such as a staging/QA environment or even a production environment.
- 5.4: A shelf allows users to stash items for easy access.

## Action Bar
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/action-bar.png)
The action bar provides a keyboard-driven interface to Tanagram functionality. 

- 6.1: The action bar appears as a menu out of the toolbar, which I think is a properly Mac-native UI.
- 6.2: It supports actions that take additional input — in this case, a "Search action history" action. The currently-active action is indicated in the left-margin of the input field.
- 6.3: Users can peek at items that appear in the action bar results (likely by pressing or holding down a modifier key, like QuickLook in macOS). These previews are rendered in a temporary overlay, and can be expanded into a non-ephemeral item on the canvas.
- 6.4: Items also have their own action bar. This enables items to support a multitude of actions without having to figure out how to represent those actions in bespoke UI controls. This also improves Tanagram's keyboard-navigability.

## User Journey: Building Checker
Checker is the name of a service used at my day job. In a nutshell, it allows developers to run a query (typically used to verify data integrity) on a recurring schedule and send an alert if an assertion is violated. A Tanagram user could quickly build something similar. Here's what it might look like:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/checker-1.png)

The user creates a space.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/checker-2.png)

The new space is automatically populated with a menu of items that can be added to the space. The user creates a new SQL query and fills in the query itself. Often, the query checks that there are no results matching an erroneous condition.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/checker-3.png)

The user schedules the query to repeat hourly and send an event every time it runs if the result is non-empty.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/checker-4.png)

The user also creates an event handler, catching events from this particular query and sending a Slack message about the erroneous condition.

That's it! It's a simple version of checkers, built entirely with Tanagram's built-in primitives. But we can make it a bit fancier:

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/checker-5.png)

The results of these scheduled query executions are queryable. The user creates a query (using GraphQL this time) to retrieve execution results.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/checker-6.png)

Then the user can transform these results into an interactive UI. Some things to note:
- 7.1: The user can write simple expressions to define named data values. Values are scoped according to the layout hierarchy — the outermost container (see 7.2) automatically gets the `result` data value, corresponding to the query result; the selected container gets access to the values defined by its ancestral containers. In this example, those are `queryResults` and `run` (along with the original `result`).
- 7.2: This is a standard UI tree.
- 7.3: Item appearance can be customized. In this case, a container is selected, and its configurable properties are about box-layout (e.g. spacing between children, and whether children are laid out horizontally or vertically).
- 7.4: This is the actual UI output. I haven't yet decided where else this UI could be used.

![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/2022-07-roadmap/checker-7.png)

Finally, the user can keep track of a list of checkers using a datum.

# Roadmap: July 2022
There's two more large areas I want to sketch some designs for:
- Multi-player/team-collaboration user experiences: how should things work when you're collaborating with a team? This has some overlap with the user experience around kernels. I'm roughly imagining that users will typically have a local kernel with which they make most of their changes and maybe a cloud-based, auto-syncing "devbox" kernel mirroring a production environment to test changes. The user would manually push and pull changes to shared team kernels (likely with some sort of review process) once their changes are ready. Lots of details to explore there!
- Keyboard interactions: I want to define a consistent interface that allows users to navigate the entire UI by keyboard. This means clearly indicating the keyboard focus at all times, and providing a 100% reliable way of changing and moving the keyboard focus

After that, I'd like to start implementing some of these UIs in AppKit. This will let me get a feel for how these UIs actually feel to use, at least in terms of little interaction details. I've never built custom UI controls in AppKit before, so that should be a fun learning experience.