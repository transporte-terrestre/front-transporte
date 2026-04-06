import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from '@component/toast/toast';
import { Alert } from '@component/alert/alert';
import { ThemeService } from '@service/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Alert],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private themeService = inject(ThemeService);
}
