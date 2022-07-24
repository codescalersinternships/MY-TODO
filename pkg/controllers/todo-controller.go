package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/models"
	"github.com/omar-sherif9992/todo-api/pkg/utils"
)

var NewTodo models.Todo

func GetTodos(w http.ResponseWriter, r *http.Request) {
	Todos := models.GetAllTodos()
	res, _ := json.Marshal(Todos)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
func GetTodoById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	todoId, err := strconv.ParseInt(vars["todoId"], 0, 0)
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

func CreateTodo(w http.ResponseWriter, r *http.Request) {
	newTodo := &models.Todo{}
	utils.ParseBody(r, newTodo)
	b := newTodo.CreateTodo()
	w.WriteHeader(http.StatusCreated)
	res, _ := json.Marshal(b)
	w.Write(res)
}
func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	todoId, err := strconv.ParseInt(vars["bookId"], 0, 0)
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
func UpdateTodo(w http.ResponseWriter, r *http.Request) {
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
	if updateTodo.Status != "" {
		todoDetails.Status = updateTodo.Status
	}
	models.Save(todoDetails)
	res, _ := json.Marshal(todoDetails)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
