package models

import (
	"gorm.io/gorm"

	"github.com/omar-sherif9992/todo-api/pkg/config"
)

var db *gorm.DB

type Todo struct {
	gorm.Model
	Task   string `gorm:"" json:"task"`
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

func GetAllTodos() ([]Todo, error) {
	var todos []Todo
	err := db.Find(&todos).Error
	return todos, err
}

func GetTodoById(id int64) (*Todo, error) {
	var todo Todo
	err := db.First(&todo, id).Error
	return &todo, err
}
func GetTodoByAuthor(author string) ([]Todo, error) {
	var todos []Todo
	err := db.Where("author = ?", author).Find(&todos).Error
	return todos, err
}

func DeleteTodo(id int64) (Todo, error) {
	var todo Todo
	err := db.Where("ID = ?", id).Delete(&todo).Error
	return todo, err
}
func Save(todo *Todo) error {
	return db.Save(todo).Error
}
