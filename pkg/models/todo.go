package models

import (
	"gorm.io/gorm"

	"github.com/omar-sherif9992/todo-api/pkg/config"
)

var db *gorm.DB

type Todo struct {
	gorm.Model
	Task   string `gorm:""json:"task"`
	Author string `json:"author"`
	Status string `json:"status"`
}

func init() {
	config.Connect() //
	db = config.GetDB()
	db.AutoMigrate(&Todo{})
}

func (b *Todo) CreateTodo() *Todo {
	db.Create(&b)
	return b
}

func GetAllTodos() []Todo {
	var books []Todo
	db.Find(&books)
	return books
}
func GetTodo(id int64) Todo {
	var todo Todo
	db.First(&todo, id)
	return todo
}
func GetTodoById(id int64) *Todo {
	var todo Todo
	db.First(&todo, id).Where("ID = ?", id)
	return &todo
}

func DeleteTodo(id int64) Todo {
	var todo Todo
	db.Where("ID = ?", id).Delete(&todo)
	return todo
}
func Save(todo *Todo) {
	db.Save(todo)
}
