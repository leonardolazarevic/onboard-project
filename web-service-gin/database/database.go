package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect() (*pgxpool.Pool, error) {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set")
	}

	var lastErr error
	for attempt := 1; attempt <= 10; attempt++ {
		pool, err := pgxpool.New(context.Background(), databaseURL)
		if err != nil {
			lastErr = err
			time.Sleep(time.Duration(attempt) * time.Second)
			continue
		}

		if err := pool.Ping(context.Background()); err != nil {
			pool.Close()
			lastErr = err
			time.Sleep(time.Duration(attempt) * time.Second)
			continue
		}

		return pool, nil
	}

	return nil, fmt.Errorf("failed to connect to database after retries: %w", lastErr)
}
