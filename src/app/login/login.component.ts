import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
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

    public redirectToSignup() {
        // TODO this needs to be fixed when proper route guards are in place and log in is fixed
        this.authService.logIn();
        this.router.navigateByUrl('/sign-up');
    }

    ngOnInit() {
    }
}
