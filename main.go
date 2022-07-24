package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/omar-sherif9992/todo-api/pkg/routes"
)

func init() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {

	var envs map[string]string
	envs, err := godotenv.Read(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := ":" + envs["PORT"]
	api_url := envs["API_URL"]
	router := mux.NewRouter()
	routes.RegisterTodoRoutes(envs["API_VERSION"]+"", router)
	fmt.Println("Server started on port " + api_url + port)
	log.Fatal(http.ListenAndServe(port, router))

}
