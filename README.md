# DM Auth

DM Auth makes some assumptions about your database and your express app, and will configure auth
for you!


# Use DM Auth to set up your user table

Dm-Auth can set up your table for you.
`npm install -g dm-auth`

Then run the command `dm-auth create-user-table postgres://Brett@localhost/sandbox` using your own connection string.

This will create a table with the necessary columns for dm-auth to work. You can always add additional columns you might need with `ALTER TABLE` like so:
```
ALTER TABLE users ADD COLUMN address varchar(30);
```


## Pre requisites

1. You need an account with auth0. You need to get the domain, client ID and client secret.

2. You need to be using postgres and massive. Your postgresql database needs to have a table called `users`, with the following columns:
  - id: primary key (this will be your way to refer to your users)
  - auth_id: string (this will be the way to authenticate your users)
  - username: string (this will be your user's username or full name)


## Setup

1. Set up your express app and your database connection first.

2. Call `dmAuth.init` passing in your app instance and a config object, like so: 
```
  dmAuth.init({
    app: app,
    db: db
    domain: 'brettcaudill.auth0.com',
    clientID: config.auth0.id,
    clientSecret: config.auth0.secret
  })
```
where app is your express app, and db is your massive db instance.

__You might need to call dmAuth.init in your massive connection callback to have the db instance available!__

dmAuth will set up auth and routes for you! It makes assumptions about how your database is set up, so be sure to read the pre-requisites above, or use `dm-auth create-user-table`.