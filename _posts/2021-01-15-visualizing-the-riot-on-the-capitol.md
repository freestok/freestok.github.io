---
permalink: /posts/:title
---

The Hack
========

In the aftermath of the attempted insurrection, Parler faced a flurry of events. Google and Apple dropped them from their respective app stores, and Amazon informed them that they would be shutting down their servers. Oh, and someone (@donk\_enby) [breached their website and extracted 56.7 TB of user data](https://www.vice.com/en/article/n7vqew/the-hacker-who-archived-parler-explains-how-she-did-it-and-what-comes-next).

The Data
========

After the website breach, [Kyle McDonald made the data available](https://gist.github.com/kylemcdonald/8fdabd6526924012c1f5afe538d7dc09) in an easily digestible CSV, alongside instructions on how to view the videos for each data point.

While this project is not interested in finding out _who_ was at the riot, or in viewing any of the videos, you can check out other projects, such as [@patr10tic’s map](https://thepatr10t.github.io/yall-Qaeda/) which visualize videos the day of the riot.

<iframe src="/assets/img/riot/parler.mp4" frameborder="0"> </iframe>

My Process
==========

This was my first foray into R. I probably could have saved myself some time and did this in Python instead, but I’ve been wanting to pickup R for a while now. All that to say, please be kind, I am no R expert, and I’m sure there was a faster/easier way to do this, say via ggplot or ggmap. I also could not have done this without two StackExchange posts on [saving Leaflet maps as PNGs](https://stackoverflow.com/questions/31336898/how-to-save-leaflet-in-r-map-as-png-or-jpg-file) and [combining PNGs into a GIF](https://stackoverflow.com/questions/56389470/convert-multiple-png-to-gif-as-an-animation-in-r).

First, I read in the CSV (which I had already converted from GMT timestamps to EST), filter it for the date I want, convert it into a simple features object ([via the sf library](https://r-spatial.github.io/sf/)), and then only select the points within the Capitol area of D.C.

<script src="https://gist.github.com/freestok/3a6876979c074939142b90640a1505b8.js"></script>

From there, I loop over the all the timestamps, select the pertinent data, create a map from said data, and repeat. More is explained in the code comments.

<script src="https://gist.github.com/freestok/d94477566fe066163459e2790490be3b.js"></script>

The following is the createMap() function which is what utilizes Leaflet for R in making the maps.

<script src="https://gist.github.com/freestok/b9a3a2833fcb69a2e8df4f3d5dd19987.js"></script>

After all of that, I get a list of the PNG file outputs and combine them into a GIF.

<script src="https://gist.github.com/freestok/7b0aabbdc2986e89a1f16bc2200282fa.js"></script>

That’s all, folks.