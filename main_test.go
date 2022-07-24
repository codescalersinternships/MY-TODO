package main

import (
	"bytes"
	"encoding/json"
	"github.com/omar-sherif9992/todo-api/pkg/controllers"
	"github.com/omar-sherif9992/todo-api/pkg/models"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateTodo(t *testing.T) {
	newTodo := models.Todo{
		Task:   "test",
		Author: "omar",
		Status: true,
	}
	jsonValue, _ := json.Marshal(newTodo)

	// Create a request to pass to our handler.
	t.Run("creates a new todo", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", bytes.NewBuffer(jsonValue))
		//In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.CreateTodo(response, request)

		assertStatus(t, response.Code, http.StatusCreated)
	})
}
func TestGetTodos(t *testing.T) {

	// Create a request to pass to our handler.
	t.Run("returns todo using GetTodos with http ok", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodGet, "/api/v1/todo", nil)
		//In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodos(response, request)

		assertStatus(t, response.Code, http.StatusOK)
	})
	t.Run("returns todo by using GetTodos with http method not allowed", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo/id/2", nil)
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoById(response, request)

		assertStatus(t, response.Code, http.StatusMethodNotAllowed)
	})
}

func TestGetTodo(t *testing.T) {
	// todo a bug it doesnt recieves the params in the test
	// Create a request to pass to our handler.
	/* 	t.Run("returns todo by using GetTodoById with http ok", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodGet, "/api/v1/todo/id/2", nil)
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoById(response, request)

		assertStatus(t, response.Code, http.StatusOK)
	}) */
	t.Run("returns todo by using GetTodoById with http method not allowed", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo/id/2", nil)
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoById(response, request)

		assertStatus(t, response.Code, http.StatusMethodNotAllowed)
	})

}

func assertStatus(t testing.TB, got, want int) {
	t.Helper()
	if got != want {
		t.Errorf("did not get correct status, got %d, want %d", got, want)
	}
}

func assertResponseBody(t testing.TB, got, want string) {
	t.Helper()
	if got != want {
		t.Errorf("response body is wrong, got %q want %q", got, want)
	}
}
