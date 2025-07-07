package database

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"blog-backend/internal/models"
)

// BlogPostService defines the interface for blog post operations
type BlogPostService interface {
	// GetPosts retrieves a paginated list of blog posts
	GetPosts(ctx context.Context, page, pageSize int) (models.BlogPostList, error)
	
	// GetPostBySlug retrieves a single blog post by its slug
	GetPostBySlug(ctx context.Context, slug string) (models.BlogPost, error)
	
	// CreatePost creates a new blog post
	CreatePost(ctx context.Context, post models.BlogPost) (models.BlogPost, error)
	
	// UpdatePost updates an existing blog post
	UpdatePost(ctx context.Context, post models.BlogPost) (models.BlogPost, error)
	
	// DeletePost deletes a blog post by its slug
	DeletePost(ctx context.Context, slug string) error
	
	// SearchPosts searches for blog posts by title or content
	SearchPosts(ctx context.Context, query string, page, pageSize int) (models.BlogPostList, error)
}

// Ensure service implements BlogPostService
var _ BlogPostService = (*service)(nil)

// GetPosts retrieves a paginated list of blog posts
func (s *service) GetPosts(ctx context.Context, page, pageSize int) (models.BlogPostList, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	// Query to get paginated posts
	query := `
		SELECT id, title, slug, content, published_at, created_at, updated_at
		FROM blog_posts
		ORDER BY published_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := s.db.QueryContext(ctx, query, pageSize, offset)
	if err != nil {
		return models.BlogPostList{}, fmt.Errorf("error querying blog posts: %w", err)
	}
	defer rows.Close()

	var posts []models.BlogPostPreview
	for rows.Next() {
		var post models.BlogPost
		var content string
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Slug,
			&content,
			&post.PublishedAt,
			&post.CreatedAt,
			&post.UpdatedAt,
		)
		if err != nil {
			return models.BlogPostList{}, fmt.Errorf("error scanning blog post: %w", err)
		}

		// Create a preview with excerpt
		preview := models.BlogPostPreview{
			ID:          post.ID,
			Title:       post.Title,
			Slug:        post.Slug,
			PublishedAt: post.PublishedAt,
			Excerpt:     createExcerpt(content, 150),
		}
		posts = append(posts, preview)
	}

	// Get total count for pagination
	var totalCount int
	countQuery := "SELECT COUNT(*) FROM blog_posts"
	err = s.db.QueryRowContext(ctx, countQuery).Scan(&totalCount)
	if err != nil {
		return models.BlogPostList{}, fmt.Errorf("error counting blog posts: %w", err)
	}

	return models.BlogPostList{
		Posts:      posts,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
	}, nil
}

// GetPostBySlug retrieves a single blog post by its slug
func (s *service) GetPostBySlug(ctx context.Context, slug string) (models.BlogPost, error) {
	query := `
		SELECT id, title, slug, content, published_at, created_at, updated_at
		FROM blog_posts
		WHERE slug = $1
	`

	var post models.BlogPost
	err := s.db.QueryRowContext(ctx, query, slug).Scan(
		&post.ID,
		&post.Title,
		&post.Slug,
		&post.Content,
		&post.PublishedAt,
		&post.CreatedAt,
		&post.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return models.BlogPost{}, fmt.Errorf("blog post not found: %w", err)
		}
		return models.BlogPost{}, fmt.Errorf("error querying blog post: %w", err)
	}

	return post, nil
}

// CreatePost creates a new blog post
func (s *service) CreatePost(ctx context.Context, post models.BlogPost) (models.BlogPost, error) {
	query := `
		INSERT INTO blog_posts (title, slug, content, published_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, title, slug, content, published_at, created_at, updated_at
	`

	now := time.Now()
	if post.PublishedAt.IsZero() {
		post.PublishedAt = now
	}

	err := s.db.QueryRowContext(
		ctx,
		query,
		post.Title,
		post.Slug,
		post.Content,
		post.PublishedAt,
		now,
		now,
	).Scan(
		&post.ID,
		&post.Title,
		&post.Slug,
		&post.Content,
		&post.PublishedAt,
		&post.CreatedAt,
		&post.UpdatedAt,
	)

	if err != nil {
		return models.BlogPost{}, fmt.Errorf("error creating blog post: %w", err)
	}

	return post, nil
}

// UpdatePost updates an existing blog post
func (s *service) UpdatePost(ctx context.Context, post models.BlogPost) (models.BlogPost, error) {
	query := `
		UPDATE blog_posts
		SET title = $1, content = $2, updated_at = $3
		WHERE slug = $4
		RETURNING id, title, slug, content, published_at, created_at, updated_at
	`

	now := time.Now()
	err := s.db.QueryRowContext(
		ctx,
		query,
		post.Title,
		post.Content,
		now,
		post.Slug,
	).Scan(
		&post.ID,
		&post.Title,
		&post.Slug,
		&post.Content,
		&post.PublishedAt,
		&post.CreatedAt,
		&post.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return models.BlogPost{}, fmt.Errorf("blog post not found: %w", err)
		}
		return models.BlogPost{}, fmt.Errorf("error updating blog post: %w", err)
	}

	return post, nil
}

// DeletePost deletes a blog post by its slug
func (s *service) DeletePost(ctx context.Context, slug string) error {
	query := "DELETE FROM blog_posts WHERE slug = $1"
	result, err := s.db.ExecContext(ctx, query, slug)
	if err != nil {
		return fmt.Errorf("error deleting blog post: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error checking rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("blog post not found")
	}

	return nil
}

// SearchPosts searches for blog posts by title or content
func (s *service) SearchPosts(ctx context.Context, query string, page, pageSize int) (models.BlogPostList, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	// Query to search posts
	searchQuery := `
		SELECT id, title, slug, content, published_at, created_at, updated_at
		FROM blog_posts
		WHERE title ILIKE $1 OR content ILIKE $1
		ORDER BY published_at DESC
		LIMIT $2 OFFSET $3
	`

	searchParam := "%" + query + "%"
	rows, err := s.db.QueryContext(ctx, searchQuery, searchParam, pageSize, offset)
	if err != nil {
		return models.BlogPostList{}, fmt.Errorf("error searching blog posts: %w", err)
	}
	defer rows.Close()

	var posts []models.BlogPostPreview
	for rows.Next() {
		var post models.BlogPost
		var content string
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Slug,
			&content,
			&post.PublishedAt,
			&post.CreatedAt,
			&post.UpdatedAt,
		)
		if err != nil {
			return models.BlogPostList{}, fmt.Errorf("error scanning blog post: %w", err)
		}

		// Create a preview with excerpt
		preview := models.BlogPostPreview{
			ID:          post.ID,
			Title:       post.Title,
			Slug:        post.Slug,
			PublishedAt: post.PublishedAt,
			Excerpt:     createExcerpt(content, 150),
		}
		posts = append(posts, preview)
	}

	// Get total count for pagination
	var totalCount int
	countQuery := "SELECT COUNT(*) FROM blog_posts WHERE title ILIKE $1 OR content ILIKE $1"
	err = s.db.QueryRowContext(ctx, countQuery, searchParam).Scan(&totalCount)
	if err != nil {
		return models.BlogPostList{}, fmt.Errorf("error counting search results: %w", err)
	}

	return models.BlogPostList{
		Posts:      posts,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
	}, nil
}

// Helper function to create an excerpt from content
func createExcerpt(content string, maxLength int) string {
	if len(content) <= maxLength {
		return content
	}
	
	// Try to find a space to break at
	cutoff := maxLength
	for i := maxLength; i > maxLength-20 && i > 0; i-- {
		if content[i] == ' ' {
			cutoff = i
			break
		}
	}
	
	excerpt := strings.TrimSpace(content[:cutoff]) + "..."
	return excerpt
}
