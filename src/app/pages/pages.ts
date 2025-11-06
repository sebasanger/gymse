import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../shared/navigation/navigation.component';

@Component({
  selector: 'app-pages',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './pages.html',
  styleUrl: './pages.scss',
  standalone: true,
})
export class Pages {}
