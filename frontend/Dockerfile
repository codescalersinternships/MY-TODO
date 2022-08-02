

ARG NODE_VERSION=16.6.0
FROM node:${NODE_VERSION}

WORKDIR /app/frontend

LABEL maintainer="omarsherif9992"
LABEL version="1.0"
LABEL description="Todo CRUD frontend."



COPY package*.json ./
COPY rollup.config.js ./
COPY tsconfig.json ./

RUN npm install

#COPY /public ./
#COPY /src ./
COPY . .


ENV PORT=3000
ENV HOST=0.0.0.0


EXPOSE ${PORT}

CMD ["npm","start"]

