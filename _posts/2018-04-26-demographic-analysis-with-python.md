<figure>
  <img src="/assets/img/demographics/heatmap.png" alt="map of cemetery blocks"/>
  <figcaption>Before Query Table Join</figcaption>
</figure>

The goal of this project is to analyze the demographics of donors to a non-profit in West Michigan with Python. Demographic data was acquired from the U.S. Census Bureau’s [American Fact Finder](https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml), donor data through my [geocoding project](https://freestok.github.io/geocode), and the shapefiles were found through the Census’s [TIGER shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html). I looked for the following data:

*   Median Household Income in the Past 12 Months ([a widely accepted measure of income](http://mcdc.missouri.edu/allabout/measures_of_income/))
*   Age and Gender
*   Educational Attainment

First, I imported the relevant modules and set the current working directory:

<script src="https://gist.github.com/freestok/0c9213df8fbd12ac6834ee3d5f001fdd.js"></script>

Next, the spreadsheets are turned into a [pandas](https://pandas.pydata.org/) dataframe and the column headers are dropped.

<script src="https://gist.github.com/freestok/7b494d9394184cebc2f6e2c4a345efce.js"></script>

There are only certain columns that I am interested in for each spreadsheet. All other columns are dropped through this function (columns were determined manually).

<script src="https://gist.github.com/freestok/e5b9d16230ec361835e59f77e64e875e.js"></script>

After the demographic data is formatted correctly, it can be joined with the shapefile of census tracts.

<script src="https://gist.github.com/freestok/f3d805c4ea898f6151c3e44c2ac92239.js"></script>

In order to perform demographic analysis on the non-profit donors, the spreadsheet must be turned into a [geopandas](http://geopandas.org/) GeoDataFrame. This is done by reading in the spreadsheet, dropping any rows that were unsuccessfully geocoded, and then converting those columns into a [Shapely Point object](https://toblerity.org/shapely/manual.html#points). Now that the dataframe has a correctly formatted geometry column, it can be converted into a GeoDataFrame.

<script src="https://gist.github.com/freestok/37ae28bb448394d294f59497b17060e9.js"></script>

The donors and demographics can then be spatially joined into one GeoDataFrame. The end result will be donors in Michigan (this is where a large majority of the donors are).

<script src="https://gist.github.com/freestok/80358867806b6c6ff1a735ecd72a0409.js"></script>

ANALYSIS
========

[The graphs](https://freestok.github.io/donors.html#analysis) can be found on the original GitHub Pages site.

I used the [pygal](http://www.pygal.org/en/stable/index.html) library to make the following graphs. These graphs give a general impression of the non-profit donors and should be weighted according to where the donors are located. For example, if a large share of donors live in Ottawa County, their information will be weighted more heavily than the one donor in Oscoda County.

<script src="https://gist.github.com/freestok/faa65432b268295d024c2bdfd3130929.js"></script>

Income Groups

<script src="https://gist.github.com/freestok/f94d4832a6d78390d42ba56c2b469214.js"></script>

Educational Attainment in Ages 25 and Over

<script src="https://gist.github.com/freestok/eec940d793e17a2db8b10e4d0e4f7dd3.js"></script>

Finally, a heatmap is made with the Python library [folium](http://python-visualization.github.io/folium/docs-v0.5.0/). This library allows [Leaflet](http://leafletjs.com/) webmaps to be made from Python.

<script src="https://gist.github.com/freestok/b034dfbbe2535df6dde109d971352a6b.js"></script>