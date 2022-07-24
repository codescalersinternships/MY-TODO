package routes

import (
	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/controllers"
)

var RegisterTodoRoutes = func(router *mux.Router) {
	version := "v1"
	router.HandleFunc("/api/"+version+"/todos", controllers.GetBooks).Methods("GET")
	router.HandleFunc("/api/"+version+"/todo/{id}", controllers.GetBookById).Methods("GET")
	router.HandleFunc("/api/"+version+"/todo", controllers.CreateBook).Methods("POST")
	router.HandleFunc("/api/"+version+"/todo/{id}", controllers.UpdateBook).Methods("PUT")
	router.HandleFunc("/api/"+version+"/todos/{id}", controllers.DeleteBook).Methods("DELETE")
}
