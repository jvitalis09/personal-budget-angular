import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage';

export const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
