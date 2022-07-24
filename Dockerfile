FROM golang:latest


LABEL maintainer="omarsherif9992"
LABEL version="1.0"
LABEL description="Todo CRUD API."

WORKDIR /app


COPY go.mod .

COPY go.sum .

RUN go mod tidy
RUN go mod download

COPY . .

ENV PORT 8080
ENV API_URL https://localhost
ENV API_VERSION v1

RUN go build 

CMD ["go","run","main"]








