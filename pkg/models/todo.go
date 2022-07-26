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
	Status bool   `json:"status"`
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
	var todos []Todo
	db.Find(&todos)
	return todos
}

func GetTodoById(id int64) *Todo {
	var todo Todo
	db.First(&todo, id)
	return &todo
}
func GetTodoByAuthor(author string) []Todo {
	var todos []Todo
	db.Where("author = ?", author).Find(&todos)
	return todos
}

func DeleteTodo(id int64) Todo {
	var todo Todo
	db.Where("ID = ?", id).Delete(&todo)
	return todo
}
func Save(todo *Todo) {
	db.Save(todo)
}
