Generating Running Loops with Graph Theory
==========================================

using Java, Leaflet, and turf.js
--------------------------------

[![Kray Freestone](https://miro.medium.com/fit/c/96/96/1*_mp3QGvY6J5nrLmMiesdeg.jpeg)](https://freestonekray.medium.com/?source=post_page-----87ca4a80add6--------------------------------)[Kray Freestone](https://freestonekray.medium.com/?source=post_page-----87ca4a80add6--------------------------------)Follow[Dec 10, 2020](https://medium.com/kray-freestone/generating-running-loops-with-graph-theory-87ca4a80add6?source=post_page-----87ca4a80add6--------------------------------) · 3 min read

LoopMyRun
=========

If you want to skip reading, you can navigate straight to [**LoopMyRun**](https://loopmyrun.herokuapp.com). The purpose of this web app is to create a running (or walking) loop in any road network, given a preferred distance and location.

<img alt="" class="t u v iz aj" src="https://miro.medium.com/max/3032/1\*yZPcRqZsPvltTXmDgk-BhQ.png" width="1516" height="762" srcSet="https://miro.medium.com/max/552/1\*yZPcRqZsPvltTXmDgk-BhQ.png 276w, https://miro.medium.com/max/1104/1\*yZPcRqZsPvltTXmDgk-BhQ.png 552w, https://miro.medium.com/max/1280/1\*yZPcRqZsPvltTXmDgk-BhQ.png 640w, https://miro.medium.com/max/1400/1\*yZPcRqZsPvltTXmDgk-BhQ.png 700w" sizes="700px" role="presentation"/>

Looking for a 5k in Madison, WI

Though I wish I knew that Strava had [already created this solution](https://blog.strava.com/routes/) before I embarked on this project, creating this app did have worthwhile benefits anyhow:

1.  It was a great learning experience.
2.  My app is free while Strava’s routing is a premium feature.
3.  While Strava pulls potential routes from its “[3 billion activities and 50 million users](https://cyclingtips.com/2020/03/strava-overhauls-routes-feature-with-loop-suggestions/)”, my app does not keep track of your location, or email, or…anything.

This is not to say mine is better by any means. Theirs is certainly more intelligent thanks to user data and you get more features. Mine is simply different.

Graph Theory
============

I am not going to sit here and pretend I know much about mathematics, but Graph Theory, and the graphing library [JGraphtT](https://jgrapht.org/) for Java, was pivotal for making this application work.

<img alt="" class="t u v iz aj" src="https://miro.medium.com/max/896/0\*ucy5F9Rinqi8pbZF.png" width="448" height="279" srcSet="https://miro.medium.com/max/552/0\*ucy5F9Rinqi8pbZF.png 276w, https://miro.medium.com/max/896/0\*ucy5F9Rinqi8pbZF.png 448w" sizes="448px" role="presentation"/>

Sample Graph

Simply put, a graph consists of vertices (or nodes) and edges (which are between the nodes). They are useful for finding shortest routes between any two points, and for finding cycles in any directed or undirected graph. Moreover, you can assign the edges certain weights for defining paths of least resistance.

<img alt="" class="t u v iz aj" src="https://miro.medium.com/max/7984/0\*Orb2oOejAkB72Zl5" width="3992" height="2992" srcSet="https://miro.medium.com/max/552/0\*Orb2oOejAkB72Zl5 276w, https://miro.medium.com/max/1000/0\*Orb2oOejAkB72Zl5 500w" sizes="500px" role="presentation"/>

Photo by [Hanson Lu](https://unsplash.com/@hansonluu?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

Really, a road network is a lot like an undirected graph (though I suppose it could be _directed_ if you are a car on a one-way). All intersections and roads can be plotted as nodes and edges respectively.

Moreover, each one of those roads can be _weighted_ based on what type of road they are. This app set the lowest weight to residential roads and the highest weights to primary roads.

The Data
========

All of the road data is retrieved from OpenStreetMap’s [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API). The program then transforms the roads and road vertices to graph nodes and edges.

The Stack
=========

The back-end was built with Java and used Embedded Tomcat ([credit to Heroku](https://devcenter.heroku.com/articles/create-a-java-web-application-using-embedded-tomcat) for getting me started with a nice template).

The front-end is pretty standard HTML/CSS/JavaScript. The mapping is done with Leaflet, and the distances and mile markers are calculated with turf.js.

Since some of the calculations can take a while, when a user submits the form, the back-end will calculate possible routes and submit it to a temporary PostgresSQL database. When it is ready, the route will be sent from the database back to the user.

Similarly, saved routes are sent to a separate table in the database for long-term storage. I have a limit of 10,000 rows, so if the number gets to high, the oldest routes are deleted. As long as no-one abuses this, storage can remain free, and users will not need to be validated (neither of which I want to do…I would sooner just remove the save route feature).

The Code
========

Breaking down the code here would be pretty boring and complicated, so if you want to delve into the code yourself, you can find it at my [GitHub repository](https://github.com/freestok/loopmyrun). Thanks for reading.