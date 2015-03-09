# README #

SchoolTrackr-API is the backend for the SchoolTrackr web application.
It is designed to have a fully frontend agnostic platform, to ease development of user interfaces in the future. The entire API is comprised of RESTful JSON calls/responses, with some features available via Socket.io in the future, for realtime communication. At the moment, this repository is to be considered unstable, as many (most) of the API endpoints need work, and many features are not yet implemented (Namely: Caching, proper ACLs, Cluster, and Spectrum mode). 

The API is built with "Modules" in mind, such that only "core" functionality is initially loaded (Management of People, Schools, Counties, and Platform Config), with any other functionality (Attendance, Transportation, Gradebooks, etc) being added separately. This allows for better separation of concerns, as well as increased stability, as one modules failure should not bring down the entire application.
