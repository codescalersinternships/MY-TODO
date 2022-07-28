package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"

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

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Accept", "Accept-Language", "Content-Language", "Origin"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"})
	port := ":" + envs["PORT"]
	api_url := envs["API_URL"]
	version := envs["API_VERSION"] + ""
	router := mux.NewRouter()
	routes.RegisterTodoRoutes(api_url, port, version, router)
	fmt.Println("Server started on port " + api_url + port)

	server := &http.Server{Addr: port, Handler: handlers.CORS(originsOk, headersOk, methodsOk)(router)}

	// Creating a waiting group that waits until the graceful shutdown procedure is done
	var wg sync.WaitGroup
	wg.Add(1)

	// This goroutine is running in parallels to the main one
	go func() {
		// creating a channel to listen for signals, like SIGINT
		stop := make(chan os.Signal, 1)
		// subscribing to interruption signals
		signal.Notify(stop, os.Interrupt)
		// this blocks until the signal is received
		<-stop
		// initiating the shutdown
		err := server.Shutdown(context.Background())
		// can't do much here except for logging any errors
		if err != nil {
			log.Printf("error during shutdown: %v\n", err)
		}
		// notifying the main goroutine that we are done
		wg.Done()
	}()

	err = server.ListenAndServe()
	if err == http.ErrServerClosed { // graceful shutdown
		log.Println("commencing server shutdown...")
		wg.Wait()
		log.Println("server was gracefully shut down.")
	} else if err != nil {
		log.Printf("server error: %v\n", err)
	}

}
