Prerequisites
-Go 1.27 downloaded
-docker downloaded
-Bruno downloaded
-Authorization token found on main.go for api calls

Running the program (ALL "MAKE" COMMANDS MUST BE RAN AT web-service-gin)
 1. Use "make start" to begin the docker containers for the api and postgres db
 2. Running test cases requires "make test"
 3. "make logs" shows docker logs
 4. "make down" turns docker runnings off
 
 API calls (These are example calls, and can be changed for other message IDs/bodies):
 getMessages
 -gets all messages avaliable in API
 -curl -H "Authorization: Bearer 123456789" http://localhost:8080/messages
 
 getMessageById
 -gets message by an ID
 -curl -H "Authorization: Bearer 123456789" http://localhost:8080/messages/10

 postMessage
 -creates a new message on the API
 -curl -X POST -H "Authorization: Bearer 123456789" -H "Content-Type: application/json" -d '{"id":"11","message":"Test Message","date":"2026-09-02T00:00:00Z","time":123}' http://localhost:8080/messages

 patchMessage
 -changes an already exisitng message based of key
 -curl -X PATCH -H "Authorization: Bearer 123456789" -H "Content-Type: application/json" -d '{"message":"Updated Message"}' http://localhost:8080/messages/11

 deleteMessage
 -deletes a message based off message id in API
 -curl -X DELETE -H "Authorization: Bearer 123456789" http://localhost:8080/messages/11

 Trouble Shooting
 1. Sometimes "make start" needs to be stopped with ctrl+c and ran again due to postgres instance not starting

 Purpose of the program:
 - This program serves as a display of how a RESTful API based on Go using the GIN framework is integrated
 alongside docker containers, bruno, unit/integration tests, bearer tokens, and git fundamentals. It achieves this by being the mock backend for a hypothetical messaging board at Chick-Fil-A. Where one can Post, Delete, Patch, and Get posts.

Running Bruno

- To open Bruno, simply open collection on the Bruno folder attached to the project, make sure the program on docker is running first. Although there are unit tests for the api calls, bruno also acts as means for testing connectivity
