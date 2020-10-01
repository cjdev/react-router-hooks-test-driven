#!/usr/bin/env bash

set -e
set -x

home_id=`curl -X POST -d '{ "name": "home" }' http://localhost:8080/profile`
work_id=`curl -X POST -d '{ "name": "work" }' http://localhost:8080/profile`
vacation_id=`curl -X POST -d '{ "name": "vacation" }' http://localhost:8080/profile`

curl -X POST -d "{ \"profile\": \"${home_id}\"    , \"name\":\"Remodel House\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${home_id}\"    , \"name\":\"Install Bunker\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${home_id}\"    , \"name\":\"Stockpile Supplies\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${work_id}\"    , \"name\":\"Cure Cancer\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${work_id}\"    , \"name\":\"World Peace\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${work_id}\"    , \"name\":\"End Hunger\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${vacation_id}\", \"name\":\"Base jump from Mount Everest\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${vacation_id}\", \"name\":\"Toast marshmallows over volcano\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${vacation_id}\", \"name\":\"Dune buggy riding on Mars\", \"complete\":false }" http://localhost:8080/task
