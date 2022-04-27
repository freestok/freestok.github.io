---
permalink: /portfolio/:title
title: John Ball Zoo Explorer
thumbnail: /assets/img/john-ball-zoo/thumbnail.png
---
<img class="full-width" src="/assets/img/john-ball-zoo/thumbnail.png" 
    alt="Map of the John Ball Zoo and a card of information on penguins, showing scientific name and conservation status (least concern for Magellenic penguins)">

## Introduction and Overview

The goal of this project was to create a mobile-friendly web application that showcased a park, real or fictitious. I chose to use John Ball Zoo in Grand Rapids, MI.

This application allows users to click on exhibits, and then click on an animal&#39;s &quot;card&quot; to view extra information, such as seeing a larger picture (credits for each image is included), their Wikipedia article, and their conservation status. Each card also lets the user submit a rating (on a five-star scale). Once there are ratings on an animal, the user can view the break down of all ratings, and the card will update the average score.

The application URL is below, though it should be noted that in production, the SVG symbols for the facilities do not show up properly in Firefox. Please use Chrome or Edge instead.

[https://freestok.herokuapp.com/john-ball-zoo/](https://freestok.herokuapp.com/john-ball-zoo/)


## User Stories

I was planning on this application to be used by the public. The user I had in mind had a goal of exploring the zoo easily. They were not researchers, nor were they advanced users that required advanced workflows to view animals at the zoo. Therefore, the imagined person is a casual user, wanting to take the least amount of clicks possible to find information on animals at the zoo, as well as facilities and buildings that are nearby.

The UI is built to make everything easy, painless, and to require as few clicks as possible. Moreover, feedback is included in the application so that user knows what the purpose of each interaction is.

## Application Architecture

Technically, since the application is hosted through Heroku, it treats the entire application as one front-end. In reality, which is [reflected in the GitHub repository](https://github.com/freestok/heroku), the front-end uses React and the back-end uses Flask. Routing has to match between the two in order to work.

To expand on that, Heroku is looking for a python project. Flask runs, and it serves up a single index.html file, which is the output of the react-scripts build process. When running this application locally, one must open two terminals, one running &quot;npm start&quot; and the other running &quot;npm run server&quot;. It also assumes that the terminal running &quot;npm run server&quot; is in a proper conda environment that has all the dependencies installed (which should be found in the project&#39;s root level requirements.txt file).

Aside from serving the assets, the back-end also handles the requests to get and set ratings. If it receives a GET request, it returns the specific animal&#39;s rating, and if it receives a POST request, it will create a rating for the animal. I did not spend the time to implement robust state tracking, so once a larger card is closed, a user could simply reopen it and re-submit a rating. However, while they are in the card, it no longer gives them the option to submit another rating.

On the React side of the application, the UI is split into two main parts: the map and the sidebar. There is a navbar as well, but it simply hosts a link to the GitHub repository and shows a help dialog box to give the user an idea about the application.

The sidebar contains animal &quot;cards&quot; which give the user information about each animal. It also hosts the ratings functionality. They are each broken into multiple components:

- Sidebar
  - Card container
    - Card accordion
      - Small Card
      - Expanded Card
        - Five star rating
          - Five star modal (showing the graph)
- Map
  - Widgets (home, layer list, legend, search)