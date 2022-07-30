package routes

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/controllers"
	httpSwagger "github.com/swaggo/http-swagger" // http-swagger middleware
)

func setupCORS(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

// logging middleware
func Middleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		setupCORS(&w, r)
		log.Println(r.Method, "request to", r.URL)

		h.ServeHTTP(w, r)
	})
}
func RegisterTodoRoutes(api_url, port, version string, router *mux.Router) {
	router.Use(Middleware)

	router.HandleFunc("/api/"+version+"/todo", controllers.GetTodoHandler).Methods("GET")
	router.HandleFunc("/api/"+version+"/todo", controllers.CreateTodoHandler).Methods("POST")
	router.HandleFunc("/api/"+version+"/todo", controllers.UpdateTodoHandler).Methods("PUT")
	router.HandleFunc("/api/"+version+"/todo", controllers.DeleteTodoHandler).Methods("DELETE")
	router.HandleFunc("/api/"+version+"/*", controllers.ErrorNotFoundHandler).Methods("GET", "POST", "PUT", "DELETE")
	router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL(api_url+port+"/swagger/doc.json"), //The url pointing to API definition
		httpSwagger.DeepLinking(true),
		httpSwagger.DocExpansion("none"),
		httpSwagger.DomID("swagger-ui"),
	)).Methods(http.MethodGet)

}
