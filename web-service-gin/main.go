package main

import (
	"context"
	"fmt"
	"net/http"
	"onboardproject/web-service-gin/database"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type message struct {
	ID      string    `json:"id"`
	Message string    `json:"message"`
	Date    time.Time `json:"date"`
	Time    int64     `json:"time"`
}

var apiToken = os.Getenv("API_TOKEN")

var db *pgxpool.Pool

func getMessages(c *gin.Context) {
	rows, err := db.Query(context.Background(), "SELECT id, message, date, time FROM messages")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var allMessages []message
	for rows.Next() {
		var m message
		if err := rows.Scan(&m.ID, &m.Message, &m.Date, &m.Time); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		allMessages = append(allMessages, m)
	}

	c.IndentedJSON(http.StatusOK, allMessages)
}

func postMessage(c *gin.Context) {
	var newMessage message

	//Bind json binds the received JSON to newMessage, basically instead of raw text and needing a decoder
	//we can use the returned struct
	if err := c.BindJSON(&newMessage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Exec(
		context.Background(),
		"INSERT INTO messages (id, message, date, time) VALUES ($1, $2, $3, $4)",
		newMessage.ID,
		newMessage.Message,
		newMessage.Date,
		newMessage.Time,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, newMessage)
}

func getMessageByID(c *gin.Context) {
	id := c.Param("id")
	rows, err := db.Query(context.Background(), "SELECT id, message, date, time FROM messages WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var m message
		if err := rows.Scan(&m.ID, &m.Message, &m.Date, &m.Time); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if m.ID == id {
			c.IndentedJSON(http.StatusOK, m)
			return
		}

	}

	c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Message not found"})
}

func deleteMessageByID(c *gin.Context) {
	id := c.Param("id")
	commandTag, err := db.Exec(context.Background(), "DELETE FROM messages WHERE id = $1", id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if commandTag.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Message not found",
		})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Message deleted successfully", "id": id})
}

func patchMessageByID(c *gin.Context) {
	id := c.Param("id")

	var updatedMessage message

	if err := c.BindJSON(&updatedMessage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	date := updatedMessage.Date
	if date.IsZero() {
		date = time.Now()
	}
	timeVal := updatedMessage.Time
	if timeVal == 0 {
		timeVal = time.Now().Unix()
	}

	commandTag, err := db.Exec(
		context.Background(),
		`UPDATE messages
         SET message = $1,
             date = $2,
             time = $3
         WHERE id = $4`,
		updatedMessage.Message,
		date,
		timeVal,
		id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if commandTag.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Message not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": updatedMessage.Message,
		"id":      id,
		"date":    date,
		"time":    timeVal,
	})
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")

		expectedToken := "Bearer " + apiToken

		if token != expectedToken {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// add database stuff
func main() {
	fmt.Println("Hello, World!")

	router := gin.Default()

	//Why did cors config not work?
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}

	router.Use(cors.New(config))

	protected := router.Group("/")
	protected.Use(AuthMiddleware())

	protected.GET("/messages", getMessages)
	protected.GET("/messages/:id", getMessageByID)
	protected.POST("/messages", postMessage)
	protected.DELETE("/messages/:id", deleteMessageByID)
	protected.PATCH("/messages/:id", patchMessageByID)

	var err error
	db, err = database.Connect()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	fmt.Println("Connected to PostgreSQL!")

	router.Run(":8080")
}
