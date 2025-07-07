import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/post-list/post-list.component').then(m => m.PostListComponent)
  },
  {
    path: 'posts/new',
    loadComponent: () => import('./components/post-form/post-form.component').then(m => m.PostFormComponent)
  },
  {
    path: 'posts/:slug/edit',
    loadComponent: () => import('./components/post-form/post-form.component').then(m => m.PostFormComponent)
  },
  {
    path: 'posts/:slug',
    loadComponent: () => import('./components/post-detail/post-detail.component').then(m => m.PostDetailComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
