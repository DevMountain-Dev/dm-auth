#!/usr/bin/env node
const massive = require('massive');
const command = process.argv[2];
const connectionString = process.argv[3];


const setup = `CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  auth_id varchar(40) NOT NULL,
  username varchar(40) NOT NULL
);`


if (command === 'create-user-table') {

  massive(connectionString)
  .then(db => {
    db.run(setup)
    .then(() => {
      console.log('[x] CREATED TABLES')
      process.exit(0);
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  })
} else {
  console.log(`Command not found:
  Currently supported: create-user-table
    Usage: dm-auth create-table <connection string>`)
}