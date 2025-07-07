import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost, BlogPostList } from '../models/blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

  /**
   * Get a paginated list of blog posts
   */
  getPosts(page: number = 1, pageSize: number = 10): Observable<BlogPostList> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<BlogPostList>(this.apiUrl, { params });
  }

  /**
   * Get a single blog post by its slug
   */
  getPostBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${slug}`);
  }

  /**
   * Search for blog posts
   */
  searchPosts(query: string, page: number = 1, pageSize: number = 10): Observable<BlogPostList> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<BlogPostList>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Create a new blog post
   */
  createPost(post: { title: string, content: string }): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.apiUrl, post);
  }

  /**
   * Update an existing blog post
   */
  updatePost(slug: string, post: { title: string, content: string }): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.apiUrl}/${slug}`, post);
  }

  /**
   * Delete a blog post
   */
  deletePost(slug: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${slug}`);
  }
}
