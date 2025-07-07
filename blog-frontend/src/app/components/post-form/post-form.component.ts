import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  slug: string | null = null;
  post: BlogPost | null = null;
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      slug: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    if (this.slug) {
      this.isEditMode = true;
      this.loadPost();
    }
  }

  loadPost(): void {
    if (!this.slug) return;
    
    this.isLoading = true;
    this.blogService.getPostBySlug(this.slug).subscribe({
      next: (post) => {
        this.post = post;
        this.postForm.patchValue({
          title: post.title,
          slug: post.slug,
          content: post.content
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading post:', err);
        this.snackBar.open('Failed to load the post. It may have been removed.', 'Close', {
          duration: 5000
        });
        this.router.navigate(['/']);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.markFormGroupTouched(this.postForm);
      return;
    }

    const postData = this.postForm.value;
    this.isSubmitting = true;

    if (this.isEditMode && this.slug) {
      this.blogService.updatePost(this.slug, postData).subscribe({
        next: (post) => {
          this.snackBar.open('Post updated successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/posts', post.slug]);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error updating post:', err);
          this.hasError = true;
          this.errorMessage = this.getErrorMessage(err);
          this.snackBar.open('Failed to update post: ' + this.errorMessage, 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;
        }
      });
    } else {
      this.blogService.createPost(postData).subscribe({
        next: (post) => {
          this.snackBar.open('Post created successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/posts', post.slug]);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error creating post:', err);
          this.hasError = true;
          this.errorMessage = this.getErrorMessage(err);
          this.snackBar.open('Failed to create post: ' + this.errorMessage, 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  // Helper to mark all controls as touched for validation display
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.slug) {
      this.router.navigate(['/posts', this.slug]);
    } else {
      this.router.navigate(['/']);
    }
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

    // If the error has a message property
    if (error.error && error.error.error) {
      return error.error.error;
    }

    // Default error message
    return 'An unexpected error occurred. Please try again.';
  }
}
