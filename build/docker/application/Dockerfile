FROM node:8.11.4

ARG CREATED
ARG SOURCE
ARG REVISION
LABEL maintainer="egor.stambakio@opuscapita.com" \
      org.opencontainers.image.created="$CREATED" \
      org.opencontainers.image.source="$SOURCE" \
      org.opencontainers.image.revision="$REVISION" \
      org.opencontainers.image.vendor="OpusCapita"

ENV HOST 0.0.0.0
ENV PORT 3020

COPY / /build/

WORKDIR /build/packages/demoapp

EXPOSE $PORT

CMD ["node", "index.js"]
