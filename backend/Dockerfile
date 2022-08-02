FROM golang:latest


LABEL maintainer="omarsherif9992"
LABEL version="1.0"
LABEL description="Todo CRUD API."

WORKDIR /app/backend


COPY go.mod .

COPY go.sum .

RUN go mod tidy
RUN go mod download

COPY . .

ENV PORT 8080
ENV API_URL http://localhost
ENV API_VERSION v1
ENV ORIGIN_ALLOWED  http://localhost:3000/*

RUN go build 

ENTRYPOINT [ "go" ]

CMD ["run","/app/backend/main.go"]








