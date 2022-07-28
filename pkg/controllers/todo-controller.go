package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/omar-sherif9992/todo-api/pkg/models"
	"github.com/omar-sherif9992/todo-api/pkg/utils"
)

var NewTodo models.Todo

// go mod tidy && swag init --parseDependency --parseInternal

// GetTodo godoc
// @Summary get all items in the todo list
// @Description Get all todos
// @ID get-all-todos
// @Produce json
// @Param id query int false "id"
// @Param author query string false "author name"
// @Success 200 {object} models.Todo
// @Failure 405 {object} string "Method not allowed"
// @Failure 400 {object} string "Bad Request"
// @Failure 500 {object} string "Internal Server Error"
// @Router /api/v1/todo [get]
func GetTodoHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
	} else {
		todoIdQuery := r.URL.Query().Get("id")
		todoAuthor := r.URL.Query().Get("author")
		if todoIdQuery != "" {
			getTodoById(w, r)
		} else if todoAuthor != "" {
			getTodoByAuthor(w, r)
		} else {

			Todos, err := models.GetAllTodos()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			res, _ := json.Marshal(Todos)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)

			w.Write(res)
		}
	}
}
func getTodoById(w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	todoIdQuery := r.URL.Query().Get("id")
	todoId, err := strconv.ParseInt(todoIdQuery, 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	todo, err := models.GetTodoById(todoId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	res, _ := json.Marshal(todo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func getTodoByAuthor(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	todoAuthor := r.URL.Query().Get("author")
	todos, err := models.GetTodoByAuthor(todoAuthor)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	res, _ := json.Marshal(todos)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// CreateTodo godoc
// @Summary create a new todo
// @Description create a todo
// @ID create-todo
// @Body author string true "author"
// @Body task string true "task"
// @Body status boolean true "status"
// @Produce json
// @Success 201 {object} models.Todo
// @Failure 405 {object} string "Bad Request"
// @Router /api/v1/todo [post]
func CreateTodoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Method not allowed"))
		return
	}
	newTodo := &models.Todo{}
	utils.ParseBody(r, newTodo)

	if newTodo.Author == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("author is required"))
		return
	} else if newTodo.Task == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("task is required"))
		return
	}
	fmt.Println("@create", newTodo)
	todo := newTodo.CreateTodo()
	w.WriteHeader(http.StatusCreated)
	res, _ := json.Marshal(todo)
	w.Write(res)
}

// DeleteTodo godoc
// @Summary delete a todo item by id
// @ID delete-todo-by-id
// @Produce json
// @Param id query string true "id"
// @Success 204 {object} models.Todo
// @Failure 405 {object} string "Method not allowed"
// @Failure 400 {object} string "Bad Request"
// @Router  /api/v1/todo [delete]
func DeleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	todoIdQuery := r.URL.Query().Get("id")
	todoId, err := strconv.ParseInt(todoIdQuery, 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	todo, err := models.DeleteTodo(todoId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	res, _ := json.Marshal(todo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
	w.Write(res)
}

// UpdateTodo godoc
// @Summary update a todo item by ID
// @ID update-todo-by-id
// @Produce json
// @Param id query string true "id"
// @Success 202 {object} models.Todo
// @Failure 404 {object} string "Method not allowed"
// @Failure 400 {object} string "Bad Request"
// @Router  /api/v1/todo [put]
func UpdateTodoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var updateTodo = &models.Todo{}
	utils.ParseBody(r, updateTodo)
	todoIdQuery := r.URL.Query().Get("id")
	// accces query params
	todoId, err := strconv.ParseInt(todoIdQuery, 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	todoDetails, err := models.GetTodoById(todoId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if updateTodo.Task != "" {
		todoDetails.Task = updateTodo.Task
	}
	if updateTodo.Author != "" {
		todoDetails.Author = updateTodo.Author
	}
	// status boolean
	todoDetails.Status = updateTodo.Status

	models.Save(todoDetails)
	res, _ := json.Marshal(todoDetails)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	w.Write(res)
}

// ErrorNotFound godoc
// @Summary not found
// @ID not-found
// @Produce json
// @Failure 404 {object} string "Not Found"
// @Router /api/v1/ [get]
func ErrorNotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("Not Found"))
}
