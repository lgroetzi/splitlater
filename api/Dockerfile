FROM node:8.4.0

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install yarn
RUN yarn

COPY . /usr/src/app
