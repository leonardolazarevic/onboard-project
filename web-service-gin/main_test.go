package main

import (
	"context"
	//"fmt"
	"net/http"
	"net/http/httptest"
	"onboardproject/web-service-gin/database"
	"strings"
	"testing"
	"github.com/gin-gonic/gin"
)

func TestPostMessage(t *testing.T) {
	t.Log("Starting TestPostMessage")
	var err error
	db, err = database.Connect()
	if err != nil {
		t.Fatalf("Failed to connect to the database: %v", err)
	}
	
	t.Log("Database connected successfully")
	defer db.Close(context.Background())

	gin.SetMode(gin.TestMode)
	
	// Create a test router
	t.Log("Setting up test router")
	router := gin.Default()
	router.POST("/messages", postMessage)

	// Create a test request
	payload := `{"id":"999","message":"TEST DATA","date":"2024-06-02T12:00:00Z","time":1234567890}`
	t.Log("Creating test request")
	req, err := http.NewRequest("POST", "/messages", strings.NewReader(payload))
	if err != nil {
		t.Fatalf("Failed to create test request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	w := performRequest(router, req)
	t.Log("Performing request and checking response")

	t.Logf("Response Body: %s", w.Body.String())

	// Check the response status code
	if w.Code != http.StatusCreated {
		t.Errorf("Expected status code %d but got %d", http.StatusCreated, w.Code)
	}

	//Check the response body for expected data
	// fmt.Println("Response Body:", w.Body.String())
}

func TestGetMessageByID(t *testing.T) {
	t.Log("Starting TestGetMessageByID")
	var err error
	db, err = database.Connect()
	if err != nil {
		t.Fatalf("Failed to connect to the database: %v", err)
	}
	
	t.Log("Database connected successfully")
	defer db.Close(context.Background())

	gin.SetMode(gin.TestMode)
	
	// Create a test router
	t.Log("Setting up test router")
	router := gin.Default()
	router.GET("/messages/:id", getMessageByID)

	// Create a test request
	t.Log("Creating test request")
	req, err := http.NewRequest("GET", "/messages/999", nil)
	if err != nil {
		t.Fatalf("Failed to create test request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	w := performRequest(router, req)
	t.Log("Performing request and checking response")

	t.Logf("Response Body: %s", w.Body.String())

	// Check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("Expected status code %d but got %d", http.StatusOK, w.Code)
	}

	//Check the response body for expected data
	// fmt.Println("Response Body:", w.Body.String())
}

func TestPatchMessageByID(t *testing.T) {
	t.Log("Starting TestPatchMessageByID")
	var err error
	db, err = database.Connect()
	if err != nil {
		t.Fatalf("Failed to connect to the database: %v", err)
	}
	
	t.Log("Database connected successfully")
	defer db.Close(context.Background())

	gin.SetMode(gin.TestMode)
	
	// Create a test router
	t.Log("Setting up test router")
	router := gin.Default()
	router.PATCH("/messages/:id", patchMessageByID)

	// Create a test request
	payload := `{"id":"999","message":"TEST DATA PATCH TEST","date":"2024-06-02T12:00:00Z","time":1234567890}`
	t.Log("Creating test request")
	req, err := http.NewRequest("PATCH", "/messages/999", strings.NewReader(payload))
	if err != nil {
		t.Fatalf("Failed to create test request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	w := performRequest(router, req)
	t.Log("Performing request and checking response")

	t.Logf("Response Body: %s", w.Body.String())

	// Check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("Expected status code %d but got %d", http.StatusOK, w.Code)
	}

	//Check the response body for expected data
	// fmt.Println("Response Body:", w.Body.String())
}

func TestGetMessages(t *testing.T) {
	t.Log("Starting TestGetMessages")
	var err error
	db, err = database.Connect()
	if err != nil {
		t.Fatalf("Failed to connect to the database: %v", err)
	}

	t.Log("Database connected successfully")
	defer db.Close(context.Background())

	// t.Logf(
	// 	"DATABASE_URL=%s",
	// 	os.Getenv("DATABASE_URL"),
	// )

	gin.SetMode(gin.TestMode)

	// Create a test router
	t.Log("Setting up test router")
	router := gin.Default()
	router.GET("/messages", getMessages)

	// Create a test request
	t.Log("Creating test request")
	req, err := http.NewRequest("GET", "/messages", nil)
	if err != nil {
		t.Fatalf("Failed to create test request: %v", err)
	}

	w := performRequest(router, req)
	t.Log("Performing request and checking response")

	t.Logf("Response Body: %s", w.Body.String())

	// Check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("Expected status code %d but got %d", http.StatusOK, w.Code)
	}

	//Check the response body for expected data
	// fmt.Println("Response Body:", w.Body.String())
}

func TestDeleteMessageByID(t *testing.T) {
	t.Log("Starting TestDeleteMessageByID")
	var err error
	db, err = database.Connect()
	if err != nil {
		t.Fatalf("Failed to connect to the database: %v", err)
	}
	
	t.Log("Database connected successfully")
	defer db.Close(context.Background())

	gin.SetMode(gin.TestMode)
	
	// Create a test router
	t.Log("Setting up test router")
	router := gin.Default()
	router.DELETE("/messages/:id", deleteMessageByID)

	// Create a test request
	t.Log("Creating test request")
	req, err := http.NewRequest("DELETE", "/messages/999", nil)
	if err != nil {
		t.Fatalf("Failed to create test request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	w := performRequest(router, req)
	t.Log("Performing request and checking response")

	t.Logf("Response Body: %s", w.Body.String())

	// Check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("Expected status code %d but got %d", http.StatusOK, w.Code)
	}

	//Check the response body for expected data
	// fmt.Println("Response Body:", w.Body.String())
}



func performRequest(router *gin.Engine, req *http.Request) *httptest.ResponseRecorder {

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w

}
