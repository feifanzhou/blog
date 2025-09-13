---
title: Behavioral Observations From Taking Over SXSW
date: '2018-03-20'
updated: '2018-03-20'
slug: behavioral-observations-from-taking-over-sxsw
excerpt: >-
  I just got back from taking over SXSW with Trustwork. We ran a scavenger hunt
  with multiple stations giving out free stuff in exchange for user signups.
  This post is the second of two posts on...
---


I just got back from taking over SXSW with [Trustwork](https://www.trustwork.com/). We ran a scavenger hunt with multiple stations giving out free stuff in exchange for user signups. This post is the second of two posts on learnings and observations from that week. [Part 1 is here](https://feifan.blog/posts/personal-lessons-from-taking-over-sxsw).

My intent is to present some personal observations. It is not to disparage anyone or any usage pattern. I’m also not saying that Trustwork had a perfect signup flow — for example, we definitely could’ve had more performant code, and we had a contentious Confirm Password field.

![Our signup flow](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/sxsw-signup-1.png)
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/sxsw-signup-2-cleaned.png)
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/sxsw-signup-3-cleaned.png)
![](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/sxsw-signup-4-cleaned.png)

# Phone Usage

In my own life, I’ve been very conscious of how I interact with technology. I’ve [cut off apps](https://feifan.blog/posts/deleting-facebook/) when I don’t like the interactions they’re inducing. As a result, it was a reality check for me to observe how most people interact with phones — a lot of behavior seemed instinctive, but laborious. Percentages are precise to within 10%, based on my own observations across a sampling of several hundred pedestrians in Austin:

* When presented with an input field (for phone number, in this case), 80% of people instinctively started filling it out without prompting.
* When presented with an entire form (name, email, password), 60% of people instinctively started filling it out without prompting. An additional 10–20% of people did so after a nod confirming that they should fill it out, before they knew where the information was going.
* The vast majority of people (80+%) didn’t use autocomplete, instead filling out every field manually.
* The vast majority of people (90+%) didn’t have any [autosuggest-password](https://www.igeeksblog.com/how-to-generate-secure-passwords-automatically-in-safari-on-ios-7-iphone-and-ipad/) feature enabled or didn’t use it if available. Based on the lack of thinking time when filling out the form, it appears that almost everyone reuses an existing password.
* 30–40% of people mistype their password between the Password and Confirm Password fields. That stat could be interpreted either in favor of or against having a Confirm Password field.
* The vast majority of people (80+%) didn’t use a password manager (this includes people who decline the browser’s dialog asking to save the password). Notably, one person manually entered his password into his 1Password app after signing up.
* 30% of people had trouble getting around their phones. For example, we send an SMS verifying phone numbers. People had no trouble tapping on the notification to get to messages, but if asked to go back to the message after they left that app, some had difficulty getting back to it. Some people also had trouble finding their web browser.
* 40–50% of the people who were experiencing very slow load times quit background apps in an attempt to make the site load faster. Doing so didn’t help.
* 10% of people didn’t know their own phone number and had to look it up in the Phone app or from a friend’s phone

# Human Behavior

Across hundreds of people, some behavior patterns become apparent. All of the above qualifiers apply here — this information is presented neutrally, without judgment; percentages are precise to within 10% and based on my own observations.

* To “Free shirt?”, “Free cupcake?”, etc, responses were mostly binary — 90% of people either wanted the thing and stopped, or didn’t. Very few _became_ convinced after some more talking.
* Practically 100% of euphemistic Maybes (“I’ll come back later”, “On the way back”, “Let me grab my husband [who had gone ahead]”) were effectively Nos; they never came back.
* 30% of people didn’t ask what Trustwork is before they finished signing up, or at all.
* About half of the people who did ask what Trustwork is did so in the middle of the signup flow, usually after they already verified their phone number.
* Most people who did ask about Trustwork were looking simply for some answer that seemed to make sense, rather than any genuine curiosity. As a result, it was possible to calibrate a couple of answers of varying complexity depending on the listener — my longest pitch took about 20 seconds; the shortest took three.
* With groups of 2–3 (sometimes 4), it only takes one person to say Yes; the rest of the group will wait. Larger groups required more people to say Yes. If one person in a group says Yes, 80% of the time, the rest of the group will wait; occasionally they’ll convince that person to move along. About half of the time, the waiting group members end up saying Yes (usually because they were already on the fence; the fact that they were already spending time waiting was not an effective point).
* For male-and-female couples, women led the interaction during the day, while men led the interaction at night.
* Conversion rate, in rank order:
	* Free pizza was easiest.
	* Free cupcakes and cookies are easy, but it was difficult to manage “loss” — people who grabbed an item in passing, or who grabbed multiple items.
	* Free limo rides are mixed — some people are very skeptical, whereas other people jump at the opportunity.
	* Free shirts are somewhat easy. Availability of different sizes complicated things slightly, although most people were willing to accept sizes (S/M/L/XL) one step away from their stated size.
	* Free drawstring bags are moderately difficult.
	* Free photos were very difficult, although we got better results when it was positioned as the hardest-to-find item on the scavenger hunt.