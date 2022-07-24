package config

import (
	"fmt"

	_ "github.com/jinzhu/gorm/dialects/mysql"

	"github.com/jinzhu/gorm"
)

var (
	db *gorm.DB
)

func Connect() {

	database, err := gorm.Open("mysql", "omar:hell1@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local") // todo: change to env variables
	if err != nil {
		fmt.Print(err)
		panic(err)
	}
	db = database

}

func GetDB() *gorm.DB {
	return db
}
