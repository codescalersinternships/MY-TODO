package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	_ "github.com/omar-sherif9992/todo-api/docs"

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

// @title TODO API
// @version 1.0
// @description This is a TODO API server.

// @contact.name OMAR SHERIF ALI
// @contact.url https://osa-portfolio.vercel.app/
// @contact.email omar.sherif9992@gmail.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
func main() {

	var envs map[string]string
	envs, err := godotenv.Read(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	port := ":" + envs["PORT"]
	api_url := envs["API_URL"]
	router := mux.NewRouter()
	routes.RegisterTodoRoutes(api_url, port, envs["API_VERSION"]+"", router)
	fmt.Println("Server started on port " + api_url + port)
	// start server listen
	// with error handling
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), handlers.CORS(originsOk, headersOk, methodsOk)(router)))

}
