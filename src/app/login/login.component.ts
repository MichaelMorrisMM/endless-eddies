import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import {ConfiguratorService} from "../services/configurator.service";
import {Config} from "../configurator/config.interface";
import {ThemesService} from "../services/themes.service";
import {ConstantsService} from "../services/constants.service";
import GoogleUser = gapi.auth2.GoogleUser;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
    `]
})
export class LoginComponent implements OnInit, AfterViewInit {
    public auth2: gapi.auth2.GoogleAuth;
    public config: Config;
    public showCreateAccount: boolean = false;
    public form: FormGroup;

    constructor(public authService: AuthService,
                private router: Router,
                private configuratorService: ConfiguratorService,
                public themesService: ThemesService,
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

    public startGithubLogIn() {
        location.href = `${ConstantsService.URL_PREFIX}/github-login`;
    }

    public startGoogleLogIn() {
        this.auth2.signIn().then(this.googleSignInCallback);
    }

    public googleSignInCallback(googleUser: GoogleUser) {
        location.href = `${ConstantsService.URL_PREFIX}/google-callback?idTokenString=${googleUser.getAuthResponse().id_token}`;
    }

    public toggleSignup() {
        this.showCreateAccount = !this.showCreateAccount;
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((result: Config) => {
            this.config = result;
        });
    }

    ngAfterViewInit(): void {
        gapi.load('auth2', () => this.auth2 = gapi.auth2.init({
                client_id: ConstantsService.GOOGLE_OAUTH_CLIENT_ID
            })
        );
    }
}
