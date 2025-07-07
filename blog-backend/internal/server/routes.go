package server

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"}, // Angular default port
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	// Root and health endpoints
	r.GET("/health", s.healthHandler)

	// Blog API endpoints
	api := r.Group("/api")
	{
		posts := api.Group("/posts")
		{
			posts.GET("", s.GetPostsHandler)
			posts.GET("/:slug", s.GetPostBySlugHandler)
			posts.POST("", s.CreatePostHandler)
			posts.PUT("/:slug", s.UpdatePostHandler)
			posts.DELETE("/:slug", s.DeletePostHandler)
			posts.GET("/search", s.SearchPostsHandler)
		}
	}

	return r
}



func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}
