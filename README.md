# OmarSherif-TODO-APP

## if you want to test
```
go test
```

## if you want to run

```
go run !(*_test).go
```


## All Controller Functions ([API DOCUMENTATION](http://localhost:8080/swagger/))

* `CreateTodo() ` : Insert a `Todo` object to the list of Tasks .
* `DeleteTodo()` :Insert a `Todo` object to the list of Tasks .
* `UpdateTodo()` Insert a `Todo` object to the list of Tasks
* `GetTodo()` list of all Tasks Objects , you supply the Query filters if you want to filter
  * `filters`
    * `id`: `int`
    * `author`: `string`  



## Run App through Docker Image 

* Run App through
  * via Docker Hub by pulling Image (visit the link if you want [<Docker-Hub-omarsherif9992](https://hub.docker.com/repository/docker/omarsherif9992/todo/general))
    * `docker login` : (optional no need because it is public) login to your docker account
    * `docker pull omarsherif9992/todo:v1` : (only once) pull the image from the Docker hub Repo
  * == or ==
  * via Github Repository(Docker File) & building the image
    * `git clone <REPO-LINK>`: Clone the Gtihub Repository 
    * cd into the Repo
    * `docker build . -t todo:v1` : to build the latest image 

  
* To Run Container and create persistant named volume
  * In attach mode (For debugging & running in foreground)
    * `docker run -it -p 8080:8080 -v todo-db:/app/database --rm --name todo-app todo:v1` : (run it when you need to run the app)to create then run a conainer called (TODO_APP) and when it stops it gets deleted automatically but terminal get stuck
  * ==or==
  * In detach mode (For running in background)
    * `docker run -d -p 8080:8080 -v todo-db:/app/database --rm --name todo-app todo:v1` : to create then run a conainer called (TODO_APP) and when it stops it gets deleted automatically & created a volume so that your data will persist even if you 

* `docker stop todo-app`: to exit or stop the container and it will get deleted automatic
* `docker rmi todo:v1`: to delete the image but you need to remove its relative containers first (which are removed automatically when you stop them)

* visit http://localhost:3000 / to see the app
