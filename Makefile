start:
	docker compose up --build
test:
	export DATABASE_URL=postgres://postgres:password@localhost:5432/messagesdb && go test -v
logs:
	docker compose logs go-api
down:
	docker compose down -v