#!/bin/sh

(cd client-react && npm install && npm start) &
(cd server-nodejs && npm install && npm start)
