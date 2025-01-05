#!/bin/bash

npm install

[ -f ./src/db/budget_tracker.db ] && rm ./src/db/budget_tracker.db && echo "Removed budget_tracker.db" || echo "File not found"

node src/db/migrations/createTables.js
node src/db/seeds/seedData.js

npm run dev