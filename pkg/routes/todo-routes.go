package routes

import (
	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/controllers"
)

var RegisterTodoRoutes = func(version string, router *mux.Router) {
	router.HandleFunc("/api/"+version+"/todos", controllers.GetTodos).Methods("GET")
	router.HandleFunc("/api/"+version+"/todo/{todoId}", controllers.GetTodoById).Methods("GET")
	router.HandleFunc("/api/"+version+"/todo", controllers.CreateTodo).Methods("POST")
	router.HandleFunc("/api/"+version+"/todo/{todoId}", controllers.UpdateTodo).Methods("PUT")
	router.HandleFunc("/api/"+version+"/todo/{todoId}", controllers.DeleteTodo).Methods("DELETE")
}
