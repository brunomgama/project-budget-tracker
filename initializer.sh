#!/bin/bash


node src/db/migrations/createTables.js
node src/db/seeds/seedData.js

npm run dev