# Article-Scraper

## Overview

A web app that lets users view and leave comments on the latest news. But you're not going to actually write any articles; instead, it will scrape news from another site.

### Deployed site

- [Deployed Site](https://murmuring-badlands-76956.herokuapp.com/)

## Technologies Used

1.  express

2.  express-handlebars

3.  mongoose

4.  cheerio

5.  axios

6.  heroku

## Instructions

- Create an app that accomplishes the following:

  1. Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:

     - Headline - the title of the article

     - Summary - a short summary of the article

     - URL - the url to the original article

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.
