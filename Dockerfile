FROM node:6
MAINTAINER OpusCapita

RUN mkdir /root/app
WORKDIR /root/app

COPY . /root/app

EXPOSE 3000
EXPOSE 3020

CMD /root/app/start-demo.sh
