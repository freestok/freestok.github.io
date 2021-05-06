City of Grand Rapids Cemeteries
===============================

[![Kray Freestone](https://miro.medium.com/fit/c/96/96/1*_mp3QGvY6J5nrLmMiesdeg.jpeg)](https://freestonekray.medium.com/?source=post_page-----4f06ac398c47--------------------------------)[Kray Freestone](https://freestonekray.medium.com/?source=post_page-----4f06ac398c47--------------------------------)Follow[Jun 16, 2020](https://medium.com/kray-freestone/city-of-grand-rapids-cemeteries-4f06ac398c47?source=post_page-----4f06ac398c47--------------------------------) · 4 min read

[_Article originally written_](https://github.com/freestok/freestok.github.io/blob/master/cemeteries.html) _on Apr. 12th, 2018._

The purpose of [this project](http://grandrapids.maps.arcgis.com/apps/webappviewer/index.html?id=53514aa28a584dbd8f07e7a3ced8af17) was to allow any citizen to view cemeteries online so that they can search for occupants in any of Grand Rapids’ six cemeteries. This project was based on four phases: implementing surveying maps, reconciling polygon data with cemetery records, automating much of the workflow in Python, and visualizing it all in ArcGIS Online.

<img alt="" class="t u v ic aj" src="https://miro.medium.com/max/2166/0\*pC3DHQtX01Vf4cpp.png" width="1083" height="561" srcSet="https://miro.medium.com/max/552/0\*pC3DHQtX01Vf4cpp.png 276w, https://miro.medium.com/max/1104/0\*pC3DHQtX01Vf4cpp.png 552w, https://miro.medium.com/max/1280/0\*pC3DHQtX01Vf4cpp.png 640w, https://miro.medium.com/max/1400/0\*pC3DHQtX01Vf4cpp.png 700w" sizes="700px" role="presentation"/>

_Survey Map of Woodlawn West_

The first phase of the project dealt largely with georeferencing the surveying maps, converting the image to editable features, and cleaning up said features. Though there are six cemeteries, there were eight different maps, each of which being georeferenced to their respective cemetery. After georeferencing, the survey maps were converted into editable features via the **Raster to Polygon** tool. From there, over 20,000 polygons from eight maps were cleaned up and labeled (e.g. deleting the numbers that were turned into polygons, inserting “blocks” and “lots” metadata into each polygon).

The second phase consisted of reconciling the polygons, which contained the bare metadata of “cemetery”, “block”, and “lot”, with the richer data of a spreadsheet derived from the city’s cemetery database. This proved to somewhat of a challenge given that there were multiple occupants per lot, for the survey’s smallest unit was not a **grave** but a **lot**. With multiple occupants per lot, there were only two options: a many-to-one **relate** or building a query table in order to do a many-to-one **join**. I chose the latter. While relating the information would be easiest and is possible in ArcGIS Online, the service’s online search function did not support data from relates, therefore, I had to build a query table.

It should be noted that there are some inherent flaws when working with surveying maps from the mid to late 1900s. Some data that existed in the up-to-date cemetery database was not reflected in the surveying maps, therefore, some lots — and subsequently occupants — do not appear in the final project. Moreover, if certain lots appeared in the surveying maps but did not appear in the spreadsheet, the query table operation then deleted empty polygons. Interestingly, even though the map appears to have fewer polygons, there are actually more: in a many-to-one query table join, polygons are stacked on top of each other when sharing the same space.

<img alt="" class="t u v ic aj" src="https://miro.medium.com/max/1258/0\*RAZEppL8weAA82uC.png" width="629" height="354" srcSet="https://miro.medium.com/max/552/0\*RAZEppL8weAA82uC.png 276w, https://miro.medium.com/max/1104/0\*RAZEppL8weAA82uC.png 552w, https://miro.medium.com/max/1258/0\*RAZEppL8weAA82uC.png 629w" sizes="629px" role="presentation"/>

_Before Query Table Join_

<img alt="" class="t u v ic aj" src="https://miro.medium.com/max/1264/0\*erhc1mWKW7g5V710.png" width="632" height="356" srcSet="https://miro.medium.com/max/552/0\*erhc1mWKW7g5V710.png 276w, https://miro.medium.com/max/1104/0\*erhc1mWKW7g5V710.png 552w, https://miro.medium.com/max/1264/0\*erhc1mWKW7g5V710.png 632w" sizes="632px" role="presentation"/>

_After Query Table Join_

For the third phase, I automated most of the workflow with Python. At a high level, the program:

1.  Creates a one-to-many join via a query table with the cemetery spreadsheet and the cemetery shapefile
2.  Splits the query table result into eight different shapefiles (if we use only one shapefile for the web application, it would have to search through approximately 100,000 features — the maximum amount it can handle is around 20,000 features)
3.  Uploads the shapefiles to ArcGIS Online
4.  Creates Tile Layers from the shapefiles in ArcGIS Online (the Tile Layers help visualize the data more easily in the web applications)

**Note:** the file paths were removed from the following code.

First, I create the query table from the shapefile and the spreadsheet and export the query table as its own shapefile name **queryTable**.

Next, the query table needs to be split into eight different parts (the end result of this project is eight different web applications for their respective cemeteries).

The **ArcPy** library — used above — that comes with ArcGIS for Desktop is built on Python 2.7. The [ArcGIS API for Python](https://developers.arcgis.com/python/) (which allows me to easily manipulate files in ArcGIS Online) is built on Python 3.5 (and above). So, I started a new script for this different library. The end function should overwrite shapefiles and create new tiles layers in ArcGIS Online.

The following function searches for shapefiles, feature services, and map services (tile layers) that match the cemetery’s name. If there is a match, they will be deleted.

After the files are deleted, the program uploads new shapefiles and creates tile layers from them.

Finally, the function is called and passed a list of shapefiles.

The fourth phase consists of making web maps and configuring web applications from the data that was uploaded.

You can find the full list of the cemeteries on the [City of Grand Rapids Cemeteries page](https://www.grandrapidsmi.gov/Government/Departments/Parks-and-Recreation/Cemeteries) under **Genealogy Information**, and if you want to test out searching through one of the cemeteries, [click here](http://grandrapids.maps.arcgis.com/apps/webappviewer/index.html?id=53514aa28a584dbd8f07e7a3ced8af17).