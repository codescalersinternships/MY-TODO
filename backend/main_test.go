package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/omar-sherif9992/todo-api/pkg/controllers"
	"github.com/omar-sherif9992/todo-api/pkg/models"
)

func TestCreateTodo(t *testing.T) {
	newTodo := models.Todo{
		Task:   "test",
		Author: "test",
		Status: true,
	}
	jsonValue, _ := json.Marshal(newTodo)

	// Create a request to pass to our handler.
	t.Run("creates a new todo", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", bytes.NewBuffer(jsonValue))
		//In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.CreateTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusCreated)
	})
	// Create a request to pass to our handler.
	t.Run("creates a new todo but missing author name", func(t *testing.T) {
		newTodo.Author = ""
		jsonValue, _ := json.Marshal(newTodo)

		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", bytes.NewBuffer(jsonValue))
		//In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.CreateTodoHandler(response, request)
		// check statu
		assertStatus(t, response.Code, http.StatusBadRequest)
		// check body
		assertResponseBody(t, response.Body.String(), "author is required")
	})
	// Create a request to pass to our handler.
	t.Run("creates a new todo but missing task", func(t *testing.T) {
		newTodo.Author = "test"
		newTodo.Task = ""
		jsonValue, _ := json.Marshal(newTodo)

		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", bytes.NewBuffer(jsonValue))
		//In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.CreateTodoHandler(response, request)

		// check status code
		assertStatus(t, response.Code, http.StatusBadRequest)
		// check body
		assertResponseBody(t, response.Body.String(), "task is required")
	})
}
func TestGetAllTodos(t *testing.T) {

	// Create a request to pass to our handler.
	t.Run("returns todo using GetTodos with http ok", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodGet, "/api/v1/todo", nil)
		//In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusOK)
	})
	t.Run("returns todo by using GetTodos with http method not allowed", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", nil)
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusMethodNotAllowed)
	})
}

func TestGetTodoByID(t *testing.T) {

	t.Run("returns todo by using GetTodo with http method not allowed", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", nil)
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusMethodNotAllowed)
	})

}
func TestGetTodoByAuthor(t *testing.T) {

	// Create a request to pass to our handler.
	t.Run("returns todo by using GetTodo?author=omar with http ok", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodGet, "/api/v1/todo", nil)

		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()
		query := request.URL.Query()
		query.Add("author", "omar")
		request.URL.RawQuery = query.Encode()
		controllers.GetTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusOK)
	})
	t.Run("returns todo by using GetTodo?author=omar with http method not allowed", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", nil)
		query := request.URL.Query()
		query.Add("author", "omar")
		request.URL.RawQuery = query.Encode()
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusMethodNotAllowed)
	})

}
func TestUpdateTodo(t *testing.T) {

	// Create a request to pass to our handler.
	t.Run("returns todo by using GetTodo?author=omar with http ok", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodGet, "/api/v1/todo", nil)

		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()
		query := request.URL.Query()
		query.Add("author", "omar")
		query.Add("task", "I want to learn go")
		query.Add("status", "true")
		request.URL.RawQuery = query.Encode()
		controllers.GetTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusOK)
	})
	t.Run("returns todo by using GetTodo?author=omar with http method not allowed", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", nil)
		query := request.URL.Query()
		query.Add("author", "omar")
		request.URL.RawQuery = query.Encode()
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.GetTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusMethodNotAllowed)
	})

}
func TestDeleteTodo(t *testing.T) {

	// Create a request to pass to our handler.
	t.Run("delete todo by DeleteTodo with http ok", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodDelete, "/api/v1/todo", nil)

		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()
		query := request.URL.Query()
		query.Add("id", "1")

		request.URL.RawQuery = query.Encode()
		controllers.DeleteTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusNoContent)
	})
	t.Run("delete todo by DeleteTodo  with http method not allowed because it is not DELETE method", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodPost, "/api/v1/todo", nil)
		query := request.URL.Query()
		query.Add("id", "1")
		request.URL.RawQuery = query.Encode()
		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.DeleteTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusMethodNotAllowed)
	})
	t.Run("delete todo by DeleteTodo  with http method Bad Request because you didnt supplied id in the Query", func(t *testing.T) {
		// We use http.NewRequest to create a request. The first argument is the request's method and the second is the request's path. The nil argument refers to the request's body, which we don't need to set in this case.
		request, _ := http.NewRequest(http.MethodDelete, "/api/v1/todo", nil)

		// In order to test our server, we will need a Request to send in and we'll want to spy on what our handler writes to the ResponseWriter
		response := httptest.NewRecorder()

		controllers.DeleteTodoHandler(response, request)

		assertStatus(t, response.Code, http.StatusBadRequest)
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
