Decisions & Reasons


Day - 1 --


MongoDB over Postgresql -- A non-relational database (often called a NoSQL database) stores data in flexible, non-tabular formats   like documents, key-value pairs, or graphs, rather than rigid rows and columns. PostgreSQL is a relational database.

Created a basic API endpoint for homepage

Setup node environment via Express (app.get,listen)


Day - 2 --


Mongoose = popular ODM(acts as a translation layer, allowing developers to write database queries using native object-oriented code instead of raw database commands) for MongoDB. Since mongodb is schema-less, Mongoose provides a schema-based solution to enforce structure, validate data, and manage relationships directly from your application code.

Schema defines the structure and rules of your data, while a Model provides the database interface to query and manipulate that data

In app.get() every route is situated in a single file (eg. index.js) but express router()/router.get() breaks the project into each component thereby providing modularity. eg. userRouter, productRouter


Day - 3 --


JWT generation & User management.

Routing register and auth

Testing APIs using postman (register, authentication). learning JWT and verifying using bcrypt.compare()


Day - 4 --

Authentication & Protected Routes 

JWT verification by jwt.verify(). authorization: bearer token and req.header.authorization for authenticating valid user

Middleware 


Day - 5 --

Job Schema & Fetching Job applications

Jobs post and get routers. User can get(middleware prtoected) only the jobs he has posted {req.user.id}. Added _id to JWT payload for linking user and jobs via MongoDB ref


Day - 6 --

Finished entire CRUD backend specific to /:id endpoint.


Day - 7 --

Setup AI SDK(Gemini). Built utility function for responses.

Linked with MongoDB and Express to generate interview questions based on user jobs data.

Questions asked are saved to DB so that client can attempt later


Day - 8 --

Installed frontend dependencies. Helper function for fetching API requests


Day - 9 --

Shifted architecture from localStorage based JWT authentication to httpOnly cookie based authentication.

origin = combination of protocol + domain + port and thus CORS become relevant. Switched from JSX to TSX.


Day - 10 --

Made apiHelper() dynamic as per http requests (default = GET) . Configured and connected register page(React-state) with backend (Initially issues with connection b/w back and frontend due to difference in their ports). Started tailwind.


Day - 11 --

Imported jsx components from shadcn/ui. Faced framework and aliases issues.

Built register UI referring to a design on figma using tailwind


Day - 12 --

Worked on dashboard jobsCard component and basic structuring of the layout.

Planned dashboard.tsx and kanban.tsx. Endpoint for logout which resets cookie rather than simply using router.push('/login').

Dashboard Navbar


Day - 13 --

Created jobCard and addJobModal. fetched jobs and displayed on dashboard.








Issues faced -- 

localStorage to cookie based transitioning and reconfig of endpoints.

Git broken local reference (origin/HEAD) - removed older ref and added new and set it as main

Git diverged & associated merge conflict (updates to readme.md) - 

CORS for accessing 'api/logout' bcoz options didnt match clearCookies() options - app.use(cors) placement 