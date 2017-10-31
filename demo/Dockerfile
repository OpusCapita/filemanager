# Docker context should be "<repo-root>"

FROM node:6.9.3
MAINTAINER OpusCapita

RUN mkdir /demo && mkdir /server-nodejs

COPY ./server-nodejs /server-nodejs
COPY ./demo /demo

RUN /demo/populate-demo-fs.sh && cp /demo/start-demo.sh /server-nodejs

WORKDIR /server-nodejs

EXPOSE 3020

CMD ["sh /demo/start-demo.sh"]
