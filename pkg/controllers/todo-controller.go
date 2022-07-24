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

func GetTodos(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	Todos := models.GetAllTodos()
	res, _ := json.Marshal(Todos)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// CreateTodo is a function that creates a new todo
func CreateTodo(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	newTodo := &models.Todo{}
	utils.ParseBody(r, newTodo)
	b := newTodo.CreateTodo()
	w.WriteHeader(http.StatusCreated)
	res, _ := json.Marshal(b)
	w.Write(res)
}

// GetTodoById is a function that gets a todo by id
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

// GetTodoByAuthor is a function that gets a todo by author
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

// DeleteTodo is a function that deletes a todo
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

// Save is a function that saves a todo
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
