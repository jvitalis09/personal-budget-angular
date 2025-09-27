import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage';
import { ContactComponent } from './contact/contact';

export const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
