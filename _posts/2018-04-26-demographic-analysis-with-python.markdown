Demographic Analysis with Python
================================

[![Kray Freestone](https://miro.medium.com/fit/c/96/96/1*_mp3QGvY6J5nrLmMiesdeg.jpeg)](https://freestonekray.medium.com/?source=post_page-----b96010be2a5--------------------------------)[Kray Freestone](https://freestonekray.medium.com/?source=post_page-----b96010be2a5--------------------------------)Follow[Jun 18, 2020](https://medium.com/kray-freestone/demographic-analysis-with-python-b96010be2a5?source=post_page-----b96010be2a5--------------------------------) · 2 min read

[_This article_](https://github.com/freestok/freestok.github.io/blob/master/donors.html) _was originally written on Apr. 26th, 2018._

![](https://miro.medium.com/max/1664/1*yrzAJrd_xjNRdY5oSA0cpg.png)

The goal of this project is to analyze the demographics of donors to a non-profit in West Michigan with Python. Demographic data was acquired from the U.S. Census Bureau’s [American Fact Finder](https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml), donor data through my [geocoding project](https://freestok.github.io/geocode), and the shapefiles were found through the Census’s [TIGER shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html). I looked for the following data:

*   Median Household Income in the Past 12 Months ([a widely accepted measure of income](http://mcdc.missouri.edu/allabout/measures_of_income/))
*   Age and Gender
*   Educational Attainment

First, I imported the relevant modules and set the current working directory:

Next, the spreadsheets are turned into a [pandas](https://pandas.pydata.org/) dataframe and the column headers are dropped.

There are only certain columns that I am interested in for each spreadsheet. All other columns are dropped through this function (columns were determined manually).

After the demographic data is formatted correctly, it can be joined with the shapefile of census tracts.

In order to perform demographic analysis on the non-profit donors, the spreadsheet must be turned into a [geopandas](http://geopandas.org/) GeoDataFrame. This is done by reading in the spreadsheet, dropping any rows that were unsuccessfully geocoded, and then converting those columns into a [Shapely Point object](https://toblerity.org/shapely/manual.html#points). Now that the dataframe has a correctly formatted geometry column, it can be converted into a GeoDataFrame.

The donors and demographics can then be spatially joined into one GeoDataFrame. The end result will be donors in Michigan (this is where a large majority of the donors are).

ANALYSIS
========

[The graphs](https://freestok.github.io/donors.html#analysis) can be found on the original GitHub Pages site.

I used the [pygal](http://www.pygal.org/en/stable/index.html) library to make the following graphs. These graphs give a general impression of the non-profit donors and should be weighted according to where the donors are located. For example, if a large share of donors live in Ottawa County, their information will be weighted more heavily than the one donor in Oscoda County.

Income Groups

Educational Attainment in Ages 25 and Over

Finally, a heatmap is made with the Python library [folium](http://python-visualization.github.io/folium/docs-v0.5.0/). This library allows [Leaflet](http://leafletjs.com/) webmaps to be made from Python.

To see the heatmap, click [here](https://freestok.github.io/heatmap.html).