import { Component } from '@angular/core';

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
export class Blank {}
