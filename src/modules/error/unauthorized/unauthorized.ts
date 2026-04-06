import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  templateUrl: './unauthorized.html',
})
export class Unauthorized {
  private location = inject(Location);
  private router = inject(Router);

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate([buildPath(PATH.admin.dashboard)]);
  }
}
