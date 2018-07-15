import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import {ConfiguratorService} from "../services/configurator.service";
import {Config} from "../configurator/config.interface";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
    `]
})
export class LoginComponent implements OnInit {
    public config: Config;
    public showCreateAccount: boolean = false;
    public form: FormGroup;

    constructor(public authService: AuthService,
                private router: Router,
                private configuratorService: ConfiguratorService,
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

    public doGuestLogIn() {
        if (this.config && this.config.allowGuestMode) {
            this.authService.guestLogIn();
        }
    }

    public toggleSignup() {
        this.showCreateAccount = !this.showCreateAccount;
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((result: Config) => {
            this.config = result;
        });
    }
}
