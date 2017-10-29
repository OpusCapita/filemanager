#!/bin/sh

service ssh start

(cd client-react && npm start) &
(cd server-nodejs && npm start)
