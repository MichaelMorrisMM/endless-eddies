import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import {ConstantsService} from "../services/constants.service";
import {ThemesService} from "../services/themes.service";

@Component({
    selector: 'my-account',
    templateUrl: './my-account.component.html',
    styles: [`
    `]
})
export class MyAccountComponent implements OnInit {
    public emailControl: FormControl;
    public passwordControl: FormControl;
    public passwordConfirmControl: FormControl;
    public form: FormGroup;

    public showChangePassword: boolean = false;

    constructor(public authService: AuthService,
                public constantsService: ConstantsService,
                public themesService: ThemesService) {
    }

    ngOnInit() {
        this.emailControl = new FormControl(this.authService.getCurrentUser().email, [Validators.required, Validators.email]);
        this.passwordControl = new FormControl('', Validators.required);
        this.passwordConfirmControl = new FormControl('', Validators.required);
        this.form = new FormGroup({
            email: this.emailControl
        });
    }

    public save(): void {
        if (this.form.valid) {
            let params: HttpParams = new HttpParams();
            if (this.showChangePassword) {
                if (this.passwordControl.value !== this.passwordConfirmControl.value) {
                    alert("Passwords must match");
                    return;
                }
                params = params.set("password", this.passwordControl.value);
            }
            params = params.set("email", this.emailControl.value);

            this.authService.updateMyAccount(params).subscribe((result: boolean) => {
                if (result) {
                    if (this.showChangePassword) {
                        this.toggleChangePassword();
                    }
                    this.emailControl.setValue(this.authService.getCurrentUser().email);
                    this.emailControl.markAsPristine();
                }
            });
        }
    }

    public deleteAccount(): void {
        let params: HttpParams = new HttpParams().set("idUser", this.authService.getCurrentUser().idUser);
        this.authService.deleteAccount(params).subscribe((result: boolean) => {
            if (result) {
                this.authService.logOut();
            }
        });
    }

    public toggleChangePassword(): void {
        this.showChangePassword = !this.showChangePassword;
        if (this.showChangePassword) {
            this.form.addControl("password", this.passwordControl);
            this.form.addControl("passwordConfirm", this.passwordConfirmControl);
            this.passwordControl.markAsTouched();
            this.passwordConfirmControl.markAsTouched();
        } else {
            this.passwordControl.markAsPristine();
            this.passwordConfirmControl.markAsPristine();
            this.form.removeControl("password");
            this.form.removeControl("passwordConfirm");
            this.passwordControl.setValue('');
            this.passwordConfirmControl.setValue('');
        }
    }
}
