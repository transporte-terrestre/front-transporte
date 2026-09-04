import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-blank',
  standalone: true,
  template: '',
  styles: `
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      background-color: #ffffff;
    }
  `,
})
export class Blank implements OnInit {
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.title = '';
      document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]').forEach((link) => {
        link.href = 'data:,';
        link.remove();
      });
    }
  }
}

