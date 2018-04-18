import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {
    private loggedIn = false;

    public logIn() {
        this.loggedIn = true;
    }

    public logOut() {
        this.loggedIn = false;
    }

    constructor() {
    }
}
