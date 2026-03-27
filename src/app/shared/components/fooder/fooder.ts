import { Component } from '@angular/core';

@Component({
  selector: 'app-fooder',
  imports: [],
  templateUrl: './fooder.html',
  styleUrl: './fooder.css'
})
export class FooderComponent {
  readonly year = new Date().getFullYear();
}
