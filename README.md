# OmarSherif-TODO-APP

## if you want to test
```
go test
```

## if you want to run

```
go run !(*_test).go
```


## All Functions

* `InsertTask() ` : Insert a `Task` object to the list of Tasks .
* `DeleteTask()` :Insert a `Task` object to the list of Tasks .
* `UpdateTask()` Insert a `Task` object to the list of Tasks
* `GetTasks()` list of all Tasks Objects


## Run App through Docker Image 

* Run App through
  * via Docker Hub by pulling Image (visit the link if you want <placeholder>)
    * `docker login` : (optional no need because it is public) login to your docker account
    * `docker pull omarsherif9992/TODO:latest` : (only once) pull the image from the Docker hub Repo
  * == or ==
  * via Github Repository(Docker File) & building the image
    * `git clone <REPO-LINK>`: Clone the Gtihub Repository 
    * cd into the Repo
    * echo "MONGODB-URL=<ENTER-YOUR-MONGODB-URL>" > .env
    * `docker build . -t TODO:latest` : to build the latest image 

  
* To Run Container and create persistant named volume
  * In attach mode (For debugging & running in foreground)
    * `docker run -it -p 3000:3000 -v TODO-list:/app/list --rm --name TODO_APP TODO:latest` : (run it when you need to run the app)to create then run a conainer called (TODO_APP) and when it stops it gets deleted automatically but terminal get stuck
  * ==or==
  * In detach mode (For running in background)
    * `docker run -d -p 3000:3000 -v TODO-list:/app/list --rm --name TOOD_APP TODO:latest` : to create then run a conainer called (TODO_APP) and when it stops it gets deleted automatically & created a volume so that your data will persist even if you 

* `docker stop TODO_APP`: to exit or stop the container and it will get deleted automatic
* `docker rmi TODO:latest`: to delete the image but you need to remove its relative containers first (which are removed automatically when you stop them)

* visit http://localhost:3000
