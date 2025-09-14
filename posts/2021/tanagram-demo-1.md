---
title: 'Tanagram Demo #1'
date: '2021-05-09'
updated: '2021-05-09'
slug: tanagram-demo-1
excerpt: >-
  I've been working on a new way of writing and working with software. Although
  it's still very early along[^3] and looks very much like a toy, I'd like to
  share a demo:
hero_image: 'https://files.tanagram.app/file/tanagram-data/Screen%20Shot%202021-04-28%20at%208.10.54%20PM.png'
---


I've been working on a new way of writing and working with software. Although it's still very early along[^3] and looks very much like a toy, I'd like to share a demo:

<div class="ytEmbedContainer">
<iframe width="945" height="532" src="https://www.youtube.com/embed/8HxF8oQ4ctI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Tanagram[^0] is an attempt at alleviating personal frustrations when using and making modern software. In many apps, I often feel limited by the feature set that the interface enables; I can imagine customizations and automations that are simply inexpressible through the UI. Sometimes, I may theoretically be able to build what I imagine by integrating with some APIs, but doing so would be a major context shift and involve a despiriting amount of boilerplate code  and incidental complexity. A lot of these are small ideas for which the overhead in configuring the build environment, finding and installing dependencies, and deploying the code dramatically outweighs the effort and reward of the project itself.

I want to have a programming environment that has all the tooling and components (things like a database, background processing queue, file storage, CDN, observability and deploy tooling) already configured, a robust standard library and useful libraries installed and imported, popular APIs integrated, CI in place, and production servers in the cloud ready to run my code. This batteries-included environment would lower the bar for "writing a script" for any given task and make that a relatively more appealing option than "doing it manually". This environment would let me hit ⌘N to start a sketch of a new project, with all the world at my fingertips (no manual requires or imports needed), ⌘R to run it locally, and ⇧⌘R to run it in the cloud[^2]. This environment would help me organize these sketches into groups and projects if I'd like, [browse the code semantically](https://feifan.blog/posts/the-database-inside-your-codebase), keep track of the inputs and outputs of all the code I've run, and show graphs of how different pieces link together. In other words, I want to have a programming environment that gets me closer to working at the speed of thought.

One recent example of something I'd like to do — I wish I could get Slack notifications for certain words, but only when they're used in certain channels and/or from specific people. The Slack UI lets me specify certain words on which to notify, but nothing more specific than that (as far as I can tell). One way I could theoretically solve this for myself would be to setup a server that receives Slack webhooks, implements my custom notification logic, and then sends me a notification that links to that message in the Slack app. Typically, that would involve a lot of work; even more so if I wanted to have a UI to customize the notification logic. Most of this work isn't related to the actual problem; instead it's in setting up a server and registering API keys and sending native notifications. Within Tanagram, setting up a Slack integration would take just one click, as would adding an HTTP handler, and the Tanagram standard library might include a `sendNotification` function. All I'd have to do is write my notifying logic, and press ⇧⌘R to deploy it to my server in the cloud.

In addition to making it easier to work with my own code, this environment would provide a way to browse, extend, and remix other people's code. By providing a robust standard library of built-in data types, frameworks, and code generation, I hope that Tanagram will provide many Schelling points[^12] at which code from different people and projects can merge and integrate[^13].

Tanagram is primarily a headless runtime environment. I'm also working on a desktop[^4] UI as a nice way of interacting with the runtime, but it's only meant to be a reference implementation — the runtime provides a complete API that allows anyone to build their own UI[^5]. This enables plug-ins for existing text editors if you prefer to use that instead, or experiments with novel UIs for programming[^14]. The runtime installs and runs services like HTTP servers, databases, logging, and access controls. It maintains a full, searchable history of all the code you've run (and the code that transitively gets run) along with their inputs and outputs, and allows you to schedule code to execute on repeat or at some particular point in the future. This runtime can be installed on any computer and turns that computer into a Tanagram instance[^6]. The desktop UI can connect to and run code on any Tanagram instance (given the correct login credentials). 

The runtime is implemented in Elixir, which is built on the BEAM VM and provides the following benefits (among others):
* Performance that's "good" to "great" depending on who you ask (both in terms of computation speed and concurrency).
* The ability to serialize and deserialize everything, which makes it possible to reliably archive inputs and outputs for all the code you run and provide a traceable history.
* Process isolation and a supervisory structure that makes it easy to run arbitrary/untested code. For individual developers, this allows the runtime to catch and report most errors and timeouts rather than crashing or freezing the entire program.
* Built-in distributed service primitives allow individual developers to scale their code or run certain components on other computers without having to learn a whole new set of background-processing and RPC tooling.

"Commands" are the unit of code in Tanagram. They're a first-class primitive — you can click a button to create a new one; you can search for them by name or the types involved[^7]; by default the runtime records the code you run at the granularity of commands. In its simplest form, a command is just a function that receives inputs and returns output. Commands can call other commands just like a regular function.

But there's more to commands. Commands can be made of multiple steps, which are also regular functions. Steps can be used to drive UIs: the arguments and typespecs of each step are used to automatically generate input UI, and each step may return a value that describes the next step to execute, providing the client with the info needed to render the next set of inputs and correctly invoke the next step. Steps can assign values to parameters for subsequent steps in cases where one step logically depends on the result from previous steps; the runtime prevents clients from passing in an arbitrary value for step parameters that have already been assigned a value. The runtime provides a mechanism to automatically run steps in sequence until a terminal value (an error or a return value) is reached, or until it encounters a step for which it doesn't have all the needed parameters. Combined with BEAM's built-in distributed system capabilities (including blocking and non-blocking RPCs, message broadcast, and parallel processing[^8]), steps can be analogous to event consumers in a conventional pub-sub system, and a single command can represent an entire asynchronous-processing pipeline[^9].

For human users, a straightforward GUI provides a better user experience than having to remember command-line arguments and coercing everything into plain text. But GUIs are often a pain to build and hook up from scratch; many projects, such as business automation tools and little utilities you might build for yourself, don't require complex GUIs. Tanagram lowers the hurdle for having a GUI by automatically generating them for collecting inputs and displaying outputs. At the same time, every command can be exposed as a shell command with a consistent format for providing arguments[^10] — useful for incorporating Tanagram commands into existing shell-script workflows.

One interesting aspect of this approach is that it preserves many of the benefits of GUIs (namely, discoverability of things you can do and not having to think in terms of pedantic syntax) while avoiding the design-optimization tradeoffs that come with conventional GUI apps. In the latter, building a feature also means deciding *where* in the UI to put it and *how* to show it. In some cases, a particular feature or two may warrant an entire redesign of large parts of an app, which results in a bunch of incidental work for developers, delays the release of that feature, and results in frustration for users. In a system where the things-you-can-do are the first-class primitives, adding a new feature just requires developers to implement the feature. In the video above, I didn't have to decide where and how to put an Edit button in my blog UI; I just implemented an `EditPost` command.

Tanagram provides a code browser[^11] to navigate chunks of code across different dimensions. You can search for commands, steps, and regular functions by regex patterns, return types, input types, version control history, or structured queries. My goal is to support a query like "find all uses of this function in non-test code written in the past two weeks". These queries are mainly based on static code analysis, but augmented with runtime traces — for example, for inputs or outputs declared to be a union type (i.e. type `A` or type `B`), the runtime will keep track of how often each branch of the union actually occurs and can sort search results accordingly.

The combination of all this makes Tanagram, I hope, a better way to program than the manual text manipulation that is most modern programming. Tanagram acknowledges that there's more building blocks in programming than just files and functions, and that primitives such as databases, background processing queues, and everything else should also be integrated into the development experience. At the same time, Tanagram doesn't make you use a proprietary interface or bubble-wrapped stack. The code is still written by typing and the interface will be entirely navigable by keyboard shortcuts because that's the fastest way that broadly exists of interacting with computers. Tanagram integrates popular technologies like Postgres and the BEAM which can be accessed and manipulated with existing tools. And while I'm planning to offer a hosted service for Tanagram runtimes in the cloud, I'm also planning to make the runtime available to install on your own servers.

Tanagram is a nights-and-weekends projects for now, so I can't promise any timelines yet. I'll build somewhat-in-public, posting progress updates on Twitter ([@tanagram_](https://twitter.com/Tanagram_)) and blogging here about large milestones or decisions. For now, I think the first public release will come when I'm able to build a piece of Tanagram using the Tanagram environment.

If you're curious, the implementation of that `EditPost` command in the demo video looks like this:

```elixir
defmodule Tanagram.Posts.Command.EditPost do
  use Tanagram.Core.Command

  @spec get_post(post_id :: String.t()) ::
          {:ok, %NextStep{}} | {:terminate, %Error{}}
  def get_post(post_id) do
    case Tanagram.Repo.get(Tanagram.Posts.Item, post_id) do
      %Tanagram.Posts.Item{} = post ->
        {:ok, NextStep.new(%{step_name: :edit_post}), %{post: post}}

      nil ->
        {:terminate, %Error{reason: :key_not_found, details: %{post_id: post_id}}}
    end
  end

  @type input_params :: %{
          optional(:title) => String.t(),
          optional(:content_md) => String.t(),
          optional(:slug) => String.t(),
          optional(:labels) => [String.t()]
        }
  @spec edit_post(post :: %Tanagram.Posts.Item{}, input_params :: input_params()) ::
          {:ok, %Tanagram.Posts.Item{}} | {:error, term()}
  def edit_post(post, input_params) do
    case Tanagram.Posts.Item.update(post, input_params) do
      {:ok, new_post} ->
        {:return, new_post}

      {:error, changeset} ->
        {:terminate, reason: :changeset_error, details: %{changeset: changeset}}
    end
  end

  def command_definition do
    %Definition{
      description: "Edits an existing `Post.Item` (specified by ID)."
    }
  end

  def entry_point do
    :get_post
  end
end
```



[^3]: Much of what I'll describe below hasn't been implemented yet 😬
[^0]: The name is derived from the tangram puzzle, in which you get seven blocks, each a simple shape, that you arrange into [intricate outlines](https://mathigon.org/tangram). I added an extra syllable to the name (tan-a-gram) because for the longest time that's how I pronounced it in my head.
[^2]: I was talking to a friend about Tanagram; this friend isn't a programmer but works in a software-adjacent job and has occasionally taken a look through programming tutorials. I said, "you know how you look through a programming tutorial, and you feel like you understand what's going on … and then you have no idea where to start applying that to what you're working on right now?" He eagerly agreed. My hope is that a batteries-provided environment that makes it easy to run Lego-sized blocks of code can also enable software-adjacent knowledge workers to cobble together bespoke software tools to help solve problems or automate workflows.
[^4]: And probably iPad.
[^5]: It would be great to support UI extensions (i.e. plug-ins) in the reference UI.
[^6]: Like a Jupyter kernel.
[^7]: E.g. "all commands that return a `Post.Item`" or perhaps "all commands that take a `User` and access its `email` field".
[^8]: See the [documentation for the built-in `rpc` module](https://erlang.org/doc/man/rpc.html) for details on all the things you can do.
[^9]: If you've read [The Database Inside Your Codebase](https://feifan.blog/posts/the-database-inside-your-codebase), you'll know I think this is a big deal! In typical codebases, event consumers might be denoted by naming and filesystem conventions, but there's typically nothing (except tribal knowledge) linking the code that emits events with the code that consumes events.
[^10]: An obvious next step would be to use the GUI to configure input values, and then click a button to "Copy as shell command". This could be extended to inputs that aren't just form inputs — see [Exiftool](https://www.reddit.com/r/linuxquestions/comments/2yiked/i_want_to_batch_extract_the_exif_datetime_from_10/cp9ze7u/?utm_source=share&utm_medium=web2x&context=3) for an example of a shell command with a fiendishly complex syntax for its inputs that could probably be made much clearer with a (custom) GUI.
[^11]: Inspired by the browsers in Smalltalk environments like Pharo.
[^12]: Via [Wikipedia](https://en.wikipedia.org/wiki/Focal_point_(game_theory)): "…a solution that people tend to choose by default in the absence of communication." One possible example — a built-in `User` model that most people and projects use (rather than creating their own user models in a silo) because it can be instantiated automatically with the current user's information.
[^13]: Currently I'm imagining something like [Objective-C's Categories](https://en.wikipedia.org/wiki/Objective-C#Categories).
[^14]: I'd be very happy if Tanagram becomes a go-to "backend" service for experiments in programming UI, like [Natto](https://natto.dev), [NoFlo](https://noflojs.org), and [Dark](https://www.youtube.com/watch?v=orRn2kTtRXQ) have built.