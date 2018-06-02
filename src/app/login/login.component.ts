import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpParams} from "@angular/common/http";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
    `]
})
export class LoginComponent implements OnInit {
    public showCreateAccount: boolean = false;
    public form: FormGroup;

    constructor(public authService: AuthService,
                private router: Router,
                @Inject(FormBuilder) fb: FormBuilder) {
        this.form = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    public doLogIn() {
        if (this.form.valid) {
            let params: HttpParams = new HttpParams()
                .set("email", this.form.controls['email'].value)
                .set("password", this.form.controls['password'].value);
            this.authService.logIn(params);
        }
    }

    public toggleSignup() {
        this.showCreateAccount = !this.showCreateAccount;
    }

    ngOnInit() {
    }
}
