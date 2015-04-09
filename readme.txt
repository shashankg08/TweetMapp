This main idea behind this project is to plot live tweets based on their geo location on a map to analyse trends based on geolocation.

For example, on taking input as snow, it plot all tweets currently in database on Google maps based on their location. Thus, we get a nice picture of the region where people are tweeting about snow.

Backend: Using twitter4j API, live tweets are collected from tweeter API and store on AWS RDS cloud database. Database is updated in near real time (when the tweet collection server is running). Backend is implemented using Java and twitter4J API.

FrontEnd: Based on user input, all corresponding tweets are collected from db and plotted on map using Google Maps API. Heat map is also implemented as an additional module. Front end is implemented using PHP, AJAX, JQuery, CSS-Bootstrap.

Cloud components used: 
AWS RDS (cloud database) 
AWS ElasticBeanStalk (host app, load balancing, monitoring) 
AWS EC2 (web server) 
AWS CloudWatch (monitor cloud resources)
