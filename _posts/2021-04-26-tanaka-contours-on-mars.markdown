Tanaka Contours on Mars
=======================

with ArcGIS Pro
---------------

[![Kray Freestone](https://miro.medium.com/fit/c/96/96/1*_mp3QGvY6J5nrLmMiesdeg.jpeg)](https://freestonekray.medium.com/?source=post_page-----b2358f49b8b4--------------------------------)[Kray Freestone](https://freestonekray.medium.com/?source=post_page-----b2358f49b8b4--------------------------------)Follow[Apr 26](https://medium.com/kray-freestone/tanaka-contours-on-mars-b2358f49b8b4?source=post_page-----b2358f49b8b4--------------------------------) · 4 min read

![](https://miro.medium.com/max/14400/1*o01fvAe9ND7FmSzCjY_5eg.png)Tanaka contours in the Oxia Planum region of Mars

Background
==========

[Tanaka contours](http://wiki.gis.com/wiki/index.php/Tanaka_contours), also known as illuminated contours, are a unique way of visualizing elevation. Tanaka Kitiro (developer of said method), used light from a northwesterly direction and varying line width & color based on the line’s angle.

![](https://miro.medium.com/max/1000/0*JFAv6Ij8wx4PJ53M.jpg)[Map of Japan by Kitiro Tanaka (1950s)](http://wiki.gis.com/wiki/index.php/File:Japan.jpg)

This guide is an adaption of [Anita Graser](https://anitagraser.com/)’s excellent guide to [creating Tanaka contours in QGIS](https://anitagraser.com/2015/05/24/how-to-create-illuminated-contours-tanaka-style/). Here, I will show how to accomplish the same thing in ArcGIS Pro (with some notes on data preparation).

Select a Location
=================

First, find an area where you want to create contours. For me it was Kasei Valles on Mars.

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/2308/1\*8IdzdjHEGha3jKUhjykqCQ.png" width="1154" height="749" srcSet="https://miro.medium.com/max/552/1\*8IdzdjHEGha3jKUhjykqCQ.png 276w, https://miro.medium.com/max/1104/1\*8IdzdjHEGha3jKUhjykqCQ.png 552w, https://miro.medium.com/max/1280/1\*8IdzdjHEGha3jKUhjykqCQ.png 640w, https://miro.medium.com/max/1400/1\*8IdzdjHEGha3jKUhjykqCQ.png 700w" sizes="700px" role="presentation"/>

Kasei Valles

If you’re curious why Mars looks this way, I used [John Nelson’s custom Imhof Style](https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/steal-this-imhof-like-topography-style-please/) on a 200m DEM of Mars ([from the USGS](https://astrogeology.usgs.gov/search/map/Mars/Topography/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2)). Sure, Mars doesn’t have the lush landscape of Switzerland, but it looks pretty neat!

Clipping the Raster
===================

This isn’t strictly necessary, but it will help speed up processing down the road. This can be accomplished via the **Clip Raster** tool in ArcGIS Pro, or through this GDAL command (in this instance, it said my source and target ellipsoids were not on the same celestial body, which was strange because both were in the same projection).

```
gdalwarp -cutline clip.shp -crop\_to\_cutline mars.tif kasei.tif
```

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/636/1\*GwMZ5BIIpVJNtg\_cx77Z3A.png" width="318" height="356" srcSet="https://miro.medium.com/max/552/1\*GwMZ5BIIpVJNtg\_cx77Z3A.png 276w, https://miro.medium.com/max/636/1\*GwMZ5BIIpVJNtg\_cx77Z3A.png 318w" sizes="318px" role="presentation"/>

Creating Contours
=================

This could be as easy as this GDAL command

```
gdal\_contour -a elev input.tif output.shp -i 200.0
```

While this will create accurate contours, I’m looking for something smooth and aesthetically pleasing. In order to create smooth contours, the DEM needs to be generalized (this is possible with [some more GDAL commands](https://gis.stackexchange.com/questions/30627/smoothing-reinterpolating-raster-with-gdal) and [maybe some Python](https://gis.stackexchange.com/questions/9431/what-raster-smoothing-generalization-tools-are-available), but I’m not going to go into that here).

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/636/1\*YVQS4Luk208swF0EUysUfA.png" width="318" height="324" srcSet="https://miro.medium.com/max/552/1\*YVQS4Luk208swF0EUysUfA.png 276w, https://miro.medium.com/max/636/1\*YVQS4Luk208swF0EUysUfA.png 318w" sizes="318px" role="presentation"/>

In ArcGIS Pro, the DEM needs to be run through the **Focal Statistics** tool. Depending on the size of the DEM and the scale you are working with, your width and height parameters will be different. Play around with the settings until you find something appropriately smooth.

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/2302/1\*Q2a7cYNM9\_pkqrgU9Q-CmQ.png" width="1151" height="743" srcSet="https://miro.medium.com/max/552/1\*Q2a7cYNM9\_pkqrgU9Q-CmQ.png 276w, https://miro.medium.com/max/1104/1\*Q2a7cYNM9\_pkqrgU9Q-CmQ.png 552w, https://miro.medium.com/max/1280/1\*Q2a7cYNM9\_pkqrgU9Q-CmQ.png 640w, https://miro.medium.com/max/1400/1\*Q2a7cYNM9\_pkqrgU9Q-CmQ.png 700w" sizes="700px" role="presentation"/>

It’s pretty squid-like

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/640/1\*GBnq3CdIMVy2srIPhMelmw.png" width="320" height="317" srcSet="https://miro.medium.com/max/552/1\*GBnq3CdIMVy2srIPhMelmw.png 276w, https://miro.medium.com/max/640/1\*GBnq3CdIMVy2srIPhMelmw.png 320w" sizes="320px" role="presentation"/>

The contours created with the smoothed DEM look a lot better than the ones created with the raw DEM. The contour interval for others will depend on the scale of your layout (mine is approximately 1:3 million).

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/1442/1\*dtBWc-S5Md8M9GLbFX4w2g.png" width="721" height="413" srcSet="https://miro.medium.com/max/552/1\*dtBWc-S5Md8M9GLbFX4w2g.png 276w, https://miro.medium.com/max/1104/1\*dtBWc-S5Md8M9GLbFX4w2g.png 552w, https://miro.medium.com/max/1280/1\*dtBWc-S5Md8M9GLbFX4w2g.png 640w, https://miro.medium.com/max/1400/1\*dtBWc-S5Md8M9GLbFX4w2g.png 700w" sizes="700px" role="presentation"/>

Original contours in red, smoothed in blue

Calculating the Azimuth, Color, and Width
=========================================

Since line color and width is dependent on a line segment’s azimuth, the line needs to be split by its vertices. This can be accomplished through the **Split Line at Vertices** tool in Pro.

After the contours have been split, I added three fields (all with the type float): azimuth, width, and height.

For the azimuth calculation, open up the field calculator on your split contours and call the following code block with `get_azimuth(!Shape!)` on the azimuth field:

This code was adapted from the [QGIS function](https://qgis.org/api/qgspoint_8cpp_source.html#l00716) `azimuth()`.

For the color calculation, create another field and call the following code block with `get_color(!azimuth!):`

This is to make it look like the sun is based in the north west (-45°).

The width calculation will be similar in concept. Line segments that are in the sun or shadow will be thicker, while those in the orthogonal direction (meaning at right angles) will be thinner. Call the following code block with `get_width(!azimuth!)`

Styling the Map
===============

Click on the processed contours, select the **Appearance** tab, and set the **Layer Blend** to **Overlay**.

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/516/1\*d6mAsQ1USEBd-7A9wUGaUQ.png" width="258" height="223" role="presentation"/>

With the contours still selected, go to the Symbology pane, navigate to **Vary symbology by attribute**, and set the **Color** field to color and the **Size** field to width.

<img alt="" class="t u v jr aj" src="https://miro.medium.com/max/640/1\*c--3-WwPlQqZlNB1388W9Q.png" width="320" height="161" srcSet="https://miro.medium.com/max/552/1\*c--3-WwPlQqZlNB1388W9Q.png 276w, https://miro.medium.com/max/640/1\*c--3-WwPlQqZlNB1388W9Q.png 320w" sizes="320px" role="presentation"/>

The default for the color ramp is acceptable, but in the **Size** area, check the **Enable size range** checkbox, and set the range from 1pt to 2 pt (or however thick you would like your lines).

Then, assuming your blurred DEM is still the back-drop, your map should look like this:

<img alt="Black &amp; White Kasei Valles" class="t u v jr aj" src="https://miro.medium.com/max/1736/1\*m6pTJTHc\_Ik4i4Kn\_rWjJQ.png" width="868" height="562" srcSet="https://miro.medium.com/max/552/1\*m6pTJTHc\_Ik4i4Kn\_rWjJQ.png 276w, https://miro.medium.com/max/1104/1\*m6pTJTHc\_Ik4i4Kn\_rWjJQ.png 552w, https://miro.medium.com/max/1280/1\*m6pTJTHc\_Ik4i4Kn\_rWjJQ.png 640w, https://miro.medium.com/max/1400/1\*m6pTJTHc\_Ik4i4Kn\_rWjJQ.png 700w" sizes="700px"/>

Mess around with the color ramp on your DEM to get the look you’re going for. I tried one with an “earthy” look to it:

<img alt="Earthy looking Kasei Valles" class="t u v jr aj" src="https://miro.medium.com/max/10200/1\*cxLExwVNQM1Vv8ecPlKf1Q.png" width="5100" height="3300" srcSet="https://miro.medium.com/max/552/1\*cxLExwVNQM1Vv8ecPlKf1Q.png 276w, https://miro.medium.com/max/1104/1\*cxLExwVNQM1Vv8ecPlKf1Q.png 552w, https://miro.medium.com/max/1280/1\*cxLExwVNQM1Vv8ecPlKf1Q.png 640w, https://miro.medium.com/max/1400/1\*cxLExwVNQM1Vv8ecPlKf1Q.png 700w" sizes="700px"/>

That’s all there is to it. This workflow can be repeated anywhere and adjusted to your liking. Thanks for reading.