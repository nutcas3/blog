package models

import (
	"time"
)

// BlogPost represents a blog post in the system
type BlogPost struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	Slug        string    `json:"slug"`
	PublishedAt time.Time `json:"publishedAt"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// BlogPostList represents a paginated list of blog posts
type BlogPostList struct {
	Posts      []BlogPostPreview `json:"posts"`
	TotalCount int               `json:"totalCount"`
	Page       int               `json:"page"`
	PageSize   int               `json:"pageSize"`
}

// BlogPostPreview represents a preview of a blog post (for list views)
type BlogPostPreview struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Excerpt     string    `json:"excerpt"`
	Slug        string    `json:"slug"`
	PublishedAt time.Time `json:"publishedAt"`
}
