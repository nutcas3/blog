import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LineBreakToParagraphPipe } from '../../pipes/line-break-to-paragraph.pipe';

import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LineBreakToParagraphPipe
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: BlogPost | null = null;
  isLoading: boolean = false;
  isDeleting: boolean = false;
  showDeleteConfirm: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.hasError = true;
      this.errorMessage = 'Post not found';
      return;
    }

    this.isLoading = true;
    this.blogService.getPostBySlug(slug).subscribe({
      next: (post) => {
        this.post = post;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading post:', err);
        this.hasError = true;
        this.errorMessage = this.getErrorMessage(err);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
  
  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }
  
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
  
  deletePost(): void {
    if (!this.post?.slug) return;
    
    this.isDeleting = true;
    this.blogService.deletePost(this.post.slug).subscribe({
      next: () => {
        this.snackBar.open('Post deleted successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.hasError = true;
        this.errorMessage = this.getErrorMessage(err);
        this.snackBar.open('Failed to delete post: ' + this.errorMessage, 'Close', {
          duration: 5000
        });
        this.isDeleting = false;
        this.showDeleteConfirm = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper method to get user-friendly error messages
  getErrorMessage(error: any): string {
    if (!error) {
      return 'An unknown error occurred';
    }

    // Connection refused error
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    // Server error
    if (error.status === 500) {
      return 'The server encountered an error. Please try again later.';
    }

    // Not found error
    if (error.status === 404) {
      return 'The blog post was not found. It may have been removed or does not exist.';
    }

    // If the error has a message property
    if (error.error && error.error.error) {
      return error.error.error;
    }

    // Default error message
    return 'An unexpected error occurred. Please try again.';
  }
}
