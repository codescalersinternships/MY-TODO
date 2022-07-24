package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/omar-sherif9992/todo-api/pkg/models"
	"github.com/omar-sherif9992/todo-api/pkg/utils"
)

var NewBook models.Book

func GetTodo(w http.ResponseWriter, r *http.Request) {
	Books := models.GetAllBooks()
	res, _ := json.Marshal(Books)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
func GetBookById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	bookId, err := strconv.ParseInt(vars["bookId"], 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	Books := models.GetBookById(bookId)
	res, _ := json.Marshal(Books)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func CreateBook(w http.ResponseWriter, r *http.Request) {
	newBook := &models.Book{}
	utils.ParseBody(r, newBook)
	b := newBook.CreateBook()
	w.WriteHeader(http.StatusCreated)
	res, _ := json.Marshal(b)
	w.Write(res)
}
func DeleteBook(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	bookId, err := strconv.ParseInt(vars["bookId"], 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	Books := models.DeleteBook(bookId)
	res, _ := json.Marshal(Books)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
func UpdateBook(w http.ResponseWriter, r *http.Request) {
	var updateBook = &models.Book{}
	utils.ParseBody(r, updateBook)
	vars := mux.Vars(r)
	bookId, err := strconv.ParseInt(vars["bookId"], 0, 0)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	bookDetails := models.GetBookById(bookId)
	if updateBook.Title != "" {
		bookDetails.Title = updateBook.Title
	}
	if updateBook.Author != "" {
		bookDetails.Author = updateBook.Author
	}
	if updateBook.Year != 0 {
		bookDetails.Year = updateBook.Year
	}
	if updateBook.Publication != "" {
		bookDetails.Publication = updateBook.Publication
	}
	models.Save(bookDetails)
	res, _ := json.Marshal(bookDetails)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)

}
