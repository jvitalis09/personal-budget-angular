import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu';
import { FooterComponent } from './footer/footer';
import { HeroComponent } from './hero/hero';   // <-- add

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, FooterComponent, HeroComponent], // <-- add
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {}
