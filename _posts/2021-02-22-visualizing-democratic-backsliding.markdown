Visualizing Democratic Backsliding
==================================

with Python & Illustrator
-------------------------

[![Kray Freestone](https://miro.medium.com/fit/c/96/96/1*_mp3QGvY6J5nrLmMiesdeg.jpeg)](https://freestonekray.medium.com/?source=post_page-----13550f8f7bc2--------------------------------)[Kray Freestone](https://freestonekray.medium.com/?source=post_page-----13550f8f7bc2--------------------------------)Follow[Feb 22](https://medium.com/kray-freestone/visualizing-democratic-backsliding-13550f8f7bc2?source=post_page-----13550f8f7bc2--------------------------------) · 1 min read

Very short write-up here. This was created with [data from the V-Dem institute](https://www.v-dem.net/en/data/data/v-dem-dataset/), and was inspired by their article on [toxic polarization and democratic backsliding](https://www.v-dem.net/en/news/polarization-global-threat-democracy/).

<img alt="" class="t u v hy aj" src="https://miro.medium.com/max/1196/1\*AsWiNfE78LXs\_WFDfIO9uQ.png" width="598" height="266" srcSet="https://miro.medium.com/max/552/1\*AsWiNfE78LXs\_WFDfIO9uQ.png 276w, https://miro.medium.com/max/1104/1\*AsWiNfE78LXs\_WFDfIO9uQ.png 552w, https://miro.medium.com/max/1196/1\*AsWiNfE78LXs\_WFDfIO9uQ.png 598w" sizes="598px" role="presentation"/>

Snippet from the final layout

Data processing, map creation, and chart creation was all done in Python (thanks to geopandas and Plotly). Final layout was created in Illustrator.

Quick note on the methodology. While the high-level democracy indicators are on a scale of 0–1, the societal polarization indicator was originally on a scale of 1–4 (where 4 is no societal polarization, and 1 is high polarization). I normalized this to match the 0–1 scale, and then took the inverse of that scale, so that a higher value meant a higher level of societal polarization.