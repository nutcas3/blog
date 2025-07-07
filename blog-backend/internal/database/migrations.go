package database

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"path/filepath"
	"sort"
	"strings"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

// RunMigrations runs all SQL migration scripts in the migrations directory
func (s *service) RunMigrations(ctx context.Context) error {
	log.Println("Running database migrations...")

	// Get all migration files
	entries, err := fs.ReadDir(migrationsFS, "migrations")
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	// Sort migration files by name to ensure they run in order
	var migrationFiles []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".sql") {
			migrationFiles = append(migrationFiles, entry.Name())
		}
	}
	sort.Strings(migrationFiles)

	// Execute each migration file
	for _, filename := range migrationFiles {
		log.Printf("Applying migration: %s", filename)
		
		// Read migration file content
		content, err := fs.ReadFile(migrationsFS, filepath.Join("migrations", filename))
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", filename, err)
		}

		// Execute the SQL statements in a transaction
		tx, err := s.db.BeginTx(ctx, nil)
		if err != nil {
			return fmt.Errorf("failed to begin transaction for migration %s: %w", filename, err)
		}

		_, err = tx.ExecContext(ctx, string(content))
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to execute migration %s: %w", filename, err)
		}

		if err = tx.Commit(); err != nil {
			return fmt.Errorf("failed to commit migration %s: %w", filename, err)
		}

		log.Printf("Successfully applied migration: %s", filename)
	}

	log.Println("All migrations completed successfully")
	return nil
}
