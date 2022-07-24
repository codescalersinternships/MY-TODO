package models

import (
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/omar-sherif9992/todo-api/pkg/config"
)

var db *gorm.DB

type Book struct {
	gorm.Model
	Title       string `gorm:""json:"title"` //
	Author      string `json:"author"`
	Year        int    `json:"year"`
	Publication string `json:"publication"`
}

func init() {
	config.Connect() //
	db = config.GetDB()
	db.AutoMigrate(&Todo{})
	fmt.Print("Database connected")
}

func (b *Todo) CreateTodo() *Todo {
	db.NewRecord(b)
	db.Create(&b)
	return b
}

func GetAllTodos() []Todo {
	var Todos []Todo
	db.Find(&Todos)
	return Todos
}
func GetTodo(id int64) Todo {
	var Todo Todo
	db.First(&Todo, id)
	return Todo
}
func GetTodoById(id int64) *Todo {
	var Todo Todo
	db.First(&Todo, id).Where("ID = ?", id)
	return &Todo
}

func DeleteTodo(id int64) Todo {
	var Todo Todo
	db.Where("ID = ?", id).Delete(&Todo)
	return Todo
}
func Save(Todo *Todo) {
	db.Save(Todo)
}
