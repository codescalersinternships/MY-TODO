package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/routes"
)

func main() {
	port := os.Getenv("PORT")
	api_url := os.Getenv("API_URL")
	router := mux.NewRouter()
	routes.RegisterTodoRoutes(router)

	fmt.Println("Server started on " + api_url + port)
	log.Fatal(http.ListenAndServe(port, router))

}
