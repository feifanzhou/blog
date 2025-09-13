---
title: Service Objects As Test Fixtures
date: '2018-04-25'
updated: '2018-04-25'
slug: service-objects-as-test-fixtures
excerpt: >-
  In our Rails codebase at work, we often have tests that begin with many lines
  of setup code — declaring relevant variables, creating and updating models —
  to setup the database so we actually test...
---


In our Rails codebase at work, we often have tests that begin with many lines of setup code — declaring relevant variables, creating and updating models — to setup the database so we actually test what we intend.

![Most of this test's body is setup](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/service-objects-1.png)

For background: we have `Project`s, which can have multiple `Bid`s (each of which is associated with a different `User` — in other words, users can submit a bid to a project). The project’s creator can “accept” a bid by offering the bidder a `Contract`.

Tests with lots of manual model setup causes at least three problems:

* Tests become harder to read, because the setup code isn’t logically important to the test. You end up having to skim through a lot of code clutter to get to the important test code.
* Tests have to know exactly how models fit together, and if that changes, all the corresponding tests have to change as well. For example, in the example above, you’d have to know that `Bid` models and `Contract` models are both associated with a `Project` (they’re not valid unless you specify a related project), and the `status` of both the `Bid` and `Contract` have to be as specified (otherwise you’ll end up with an invalid state error). Easy enough if you just wrote the underlying code, but impossible to keep in mind for someone new to the code (which could be you, a few weeks later).
* Sometimes you have user-facing concepts that are implemented as a “derived” state of data models. For example, in addition to the concepts above, our UI has the concept of “direct offers”, which is implemented as a particular combination of bid state and contract state. This leads to a logical disconnect when we want to test some aspect of that functionality, but the setup code doesn’t say anything about a “direct offer”.

For unrelated reasons, we started moving business logic functionality into service objects, especially when there are side effects that need to happen in certain cases. The thinking behind this is a subject for a different post, but the end result is that (for example) we can create a bid for a user on a project by simply calling `BidOnProject.new(user, project).create()`, which takes care of creating the `Bid` instance, updating `status`es, setting prices, and creating and sending notifications. Creating a direct offer is similarly simple: `BidOnProject.new(user, project).create(direct_offer: true)`

Lately, I’ve found myself using these service objects to setup test state as well, with code that roughly looks like this:

![Simplified setup via a service object](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/service-objects-1.png)

Much less setup, much more readable test code. Since this runs the same code as “normal” app, tests don’t have to know the details of how models and state fit together, and changes to that only need to happen in one place. Using service objects is better than using custom factories for this reason as well — why duplicate the business logic? Finally, to the extent that you have service objects for user-facing concepts, tests become more coherent and clear, which ultimately make them more reliable and valuable.