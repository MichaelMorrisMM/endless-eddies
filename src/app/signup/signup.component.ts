import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {PostResult} from "../configurator/post-result.interface";
import {ThemesService} from "../services/themes.service";

@Component({
    selector: 'app-sign-up',
    templateUrl: './signup.component.html',
    styles: [`
    `]
})
export class SignupComponent implements OnInit {
    public form: FormGroup;

    constructor(@Inject(FormBuilder) fb: FormBuilder,
                private authService: AuthService,
                public themesService: ThemesService) {
        this.form = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    public submit(): void {
        if (this.form.controls['password'].value !== this.form.controls['passwordConfirm'].value) {
            alert("Passwords must match");
            return;
        }
        if (this.form.valid) {
            let params: HttpParams = new HttpParams()
                .set("email", this.form.controls['email'].value)
                .set("password", this.form.controls['password'].value);
            this.authService.createUser(params).subscribe((result: PostResult) => {
                if (result.success) {
                    alert("User created");
                    this.authService.logIn(params);
                } else {
                    alert(result.message);
                }
            });
        }
    }

}
