import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [`
    .Column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .Container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: #BDBDBD 1px solid;
      padding: 50px;
    }
  `]
})
export class SignupComponent implements OnInit {
  constructor() {
  }
  ngOnInit() {
  }
}
