package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/controllers"
	httpSwagger "github.com/swaggo/http-swagger" // http-swagger middleware
)

var RegisterTodoRoutes = func(api_url, port, version string, router *mux.Router) {

	router.HandleFunc("/api/"+version+"/todo", controllers.GetTodo).Methods("GET")
	router.HandleFunc("/api/"+version+"/todo", controllers.CreateTodo).Methods("POST")
	router.HandleFunc("/api/"+version+"/todo", controllers.UpdateTodo).Methods("PUT")
	router.HandleFunc("/api/"+version+"/todo", controllers.DeleteTodo).Methods("DELETE")
	router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL(api_url+port+"/swagger/doc.json"), //The url pointing to API definition
		httpSwagger.DeepLinking(true),
		httpSwagger.DocExpansion("none"),
		httpSwagger.DomID("swagger-ui"),
	)).Methods(http.MethodGet)
}
