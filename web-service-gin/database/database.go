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
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("invalid DATABASE_URL: %w", err)
	}

	var lastErr error
	for attempt := 1; attempt <= 10; attempt++ {
		pool, err := pgxpool.NewWithConfig(context.Background(), config.Copy())
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
