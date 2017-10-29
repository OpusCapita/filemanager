FROM node:6
MAINTAINER OpusCapita

# ------------------------
# Azure SSH Server support
# ------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd

COPY sshd_config /etc/ssh/

EXPOSE 2222 80

# ------------------------
# App
# ------------------------

RUN mkdir /root/app
WORKDIR /root/app

COPY . /root/app

EXPOSE 3000
EXPOSE 3020

CMD /root/app/start-demo.sh
