import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BlogService } from '../../services/blog.service';
import { BlogPostList, BlogPostPreview } from '../../models/blog-post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: BlogPostPreview[] = [];
  totalPosts: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  isLoading: boolean = false;
  searchQuery: string = '';
  isSearching: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  
  Math = Math;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to query params to handle search
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.searchPosts();
      } else {
        this.loadPosts();
      }
    });
  }

  loadPosts(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.isSearching = false;
    this.blogService.getPosts(this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (response: BlogPostList) => {
          this.posts = response.posts;
          this.totalPosts = response.totalCount;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading posts:', error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = this.getErrorMessage(error);
          this.posts = [];
          this.totalPosts = 0;
        }
      });
  }

  searchPosts(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.isSearching = true;
    
    // Use the dedicated search endpoint
    this.blogService.searchPosts(this.searchQuery, this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (response: BlogPostList) => {
          this.posts = response.posts;
          this.totalPosts = response.posts.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching posts:', error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = this.getErrorMessage(error);
          this.posts = [];
          this.totalPosts = 0;
        }
      });
  }
  
  clearSearch(): void {
    this.searchQuery = '';
    this.isSearching = false;
    this.router.navigate(['/']);
    this.loadPosts();
  }

  onPageChange(event: PageEvent | {pageIndex: number; pageSize: number}): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    if (this.isSearching && this.searchQuery) {
      this.searchPosts();
    } else {
      this.loadPosts();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.currentPage = 0; // Reset to first page
      this.isSearching = true;
      this.searchPosts();
    } else {
      this.isSearching = false;
      this.loadPosts();
    }
  }

  /**
   * Helper method to extract a user-friendly error message from HTTP errors
   */
  getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check if the backend is running.';
    } else if (error.status === 500) {
      return 'The server encountered an error. Please try again later.';
    } else if (error.error && error.error.error) {
      return error.error.error;
    } else {
      return 'An unexpected error occurred. Please try again later.';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
