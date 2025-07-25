import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  constructor(private router: Router) {
    // Set up the debounced search
    this.searchTerms.pipe(
      debounceTime(300), // Wait for 300ms after the user stops typing
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe(term => {
      if (term && term.trim() !== '') {
        this.router.navigate(['/'], { 
          queryParams: { q: term.trim() }
        });
      } else if (term.trim() === '') {
        // If search is cleared, go back to home without query params
        this.router.navigate(['/']);
      }
    });
  }

  // Called on form submit
  onSearch(): void {
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      // Navigate to the search results page with the query parameter
      this.router.navigate(['/'], { 
        queryParams: { q: this.searchQuery.trim() }
      });
    }
  }
  
  // Called on input change for real-time search
  onSearchInput(): void {
    this.searchTerms.next(this.searchQuery);
  }
}
