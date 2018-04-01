import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styles: [`
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    h1 {
      font-family: Arial;
    }
  `]
})
export class NotFoundComponent implements OnInit {
  constructor() {
  }
  ngOnInit() {
  }
}
