import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
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
export class LoginComponent implements OnInit {
  constructor(public authService: AuthService,
              public router: Router) {
  }

  public doLogIn() {
    this.authService.logIn();
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
  }
}
