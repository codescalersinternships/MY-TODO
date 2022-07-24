package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/models"
	"github.com/omar-sherif9992/todo-api/pkg/utils"
)

var NewTodo models.Todo

// go mod tidy && swag init --parseDependency --parseInternal

// GetTodos godoc
// @Summary get all items in the todo list
// @Description Get all todos
// @ID get-all-todos
// @Produce json
// @Success 200 {object} models.Todo
// @Failure 405 {object} string "Method not allowed"
// @Router /api/v1/todos [get]
func GetTodos(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
	} else {

		Todos := models.GetAllTodos()
		res, _ := json.Marshal(Todos)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		w.Write(res)
	}
}

// CreateTodo godoc
// @Summary create a new todo
// @Description create a todo
// @ID create-todo
// @Produce json
// @Success 201 {object} models.Todo
// @Failure 405 {object} string "Bad Request"
// @Router /api/v1/todo [post]
func CreateTodo(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Method not allowed"))
		return
	}
	newTodo := &models.Todo{}
	utils.ParseBody(r, newTodo)
	b := newTodo.CreateTodo()
	w.WriteHeader(http.StatusCreated)
	res, _ := json.Marshal(b)
	w.Write(res)
}

// GetTodoById godoc
// @Summary get todo item by id
// @Description get todo item by id
// @ID get-todo-by-id
// @Produce json
// @Param id path string true "todo ID"
// @Success 200 {object} models.Todo
// @Failure 405 {object} string "Method not allowed"
// @Failure 400 {object} string "Bad Request"
// @Router /api/v1/todo/{id} [get]
func GetTodoById(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	vars := mux.Vars(r)

	todoId, err := strconv.ParseInt(vars["todoId"], 0, 0)
	fmt.Println(vars)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	todo := models.GetTodoById(todoId)
	res, _ := json.Marshal(todo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// GetTodoByAuthor godoc
// @Summary add a new item to the todo list
// @ID create-todo
// @Produce json
// @Param Author body todo true "todo Author"
// @Success 200 {object} models.Todo
// @Failure 405 {object} string "Method not allowed"
// @Failure 400 {object} "Bad Request"
// @Router /todo [post]
func GetTodoByAuthor(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	vars := mux.Vars(r)
	todoAuthor, err := strconv.ParseInt(vars["author"], 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	todo := models.GetTodoById(todoAuthor)
	res, _ := json.Marshal(todo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// DeleteTodo godoc
// @Summary delete a todo item by ID
// @ID delete-todo-by-id
// @Produce json
// @Param id path string true "todo ID"
// @Success 200 {object} models.Todo
// @Failure 404 {object} message
// @Router  /api/v1/todo/{id} [delete]
func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	vars := mux.Vars(r)
	todoId, err := strconv.ParseInt(vars["todoId"], 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	todo := models.DeleteTodo(todoId)
	res, _ := json.Marshal(todo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// UpdateTodo godoc
// @Summary update a todo item by ID
// @ID update-todo-by-id
// @Produce json
// @Param id path string true "todo ID"
// @Success 200 {object} models.Todo
// @Failure 404 {object} "Method not allowed"
// @Failure 400 {object} "Bad Request"
// @Router  /api/v1/todo/{id} [put]
func UpdateTodo(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var updateTodo = &models.Todo{}
	utils.ParseBody(r, updateTodo)
	vars := mux.Vars(r)
	todoId, err := strconv.ParseInt(vars["todoId"], 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	todoDetails := models.GetTodoById(todoId)
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
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
