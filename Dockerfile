# Docker context should be "<repo-root>"

FROM node:8.11.4
MAINTAINER OpusCapita

ENV HOST 0.0.0.0
ENV PORT 3020

COPY ./ /build

WORKDIR /build/packages/demoapp

EXPOSE $PORT

CMD ["node", "index.js"]
