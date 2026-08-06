Decisions & Reasons


Day - 1 --


MongoDB over Postgresql -- A non-relational database (often called a NoSQL database) stores data in flexible, non-tabular formats   like documents, key-value pairs, or graphs, rather than rigid rows and columns. PostgreSQL is a relational database.

Created a basic API endpoint for homepage

Setup node environment via Express (app.get,listen)


Day - 2 --


Mongoose = popular ODM(acts as a translation layer, allowing developers to write database queries using native object-oriented code instead of raw database commands) for MongoDB. Since mongodb is schema-less, Mongoose provides a schema-based solution to enforce structure, validate data, and manage relationships directly from your application code.

Schema defines the structure and rules of your data, while a Model provides the database interface to query and manipulate that data

In app.get() every route is situated in a single file (eg. index.js) but express router()/router.get() breaks the project into each component thereby providing modularity. eg. userRouter, productRouter

