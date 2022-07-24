package config

import (
	"fmt"

	"gorm.io/driver/sqlite" // Sqlite driver based on GGO
	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

func Connect() {

	database, err := gorm.Open(sqlite.Open("database/todo.db"), &gorm.Config{})
	if err != nil {
		fmt.Print(err)
		panic(err)
	}
	db = database

}

func GetDB() *gorm.DB {
	return db
}
