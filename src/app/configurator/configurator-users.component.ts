import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {Config} from "./config.interface";
import {PostResult} from "./post-result.interface";

@Component({
    selector: 'configurator-users',
    templateUrl: './configurator-users.component.html',
    styles: [`
    `]
})
export class ConfiguratorUsersComponent implements OnInit {
    public config: Config;
    public form: FormGroup;

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                @Inject(FormBuilder) private fb: FormBuilder) {
        this.form = fb.group({
            resultLifespan: [0, [Validators.required, Validators.min(0)]],
            userStorageLimit: [0, [Validators.required, Validators.min(0)]],
            allowGuestMode: false,
            allowGoogleLogin: false,
            allowGithubLogin: false,
        });
    }

    ngOnInit() {
        this.loadScreenFromConfig();
    }

    private loadScreenFromConfig(): void {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.form.controls['resultLifespan'].setValue(response.resultLifespanInDays);
            this.form.controls['userStorageLimit'].setValue(response.userStorageLimit);
            this.form.controls['allowGuestMode'].setValue(response.allowGuestMode);
            this.form.controls['allowGoogleLogin'].setValue(response.allowGoogleLogin);
            this.form.controls['allowGithubLogin'].setValue(response.allowGithubLogin);
        });
    }

    public save(): void {
        this.config.resultLifespanInDays = Math.round(this.form.controls['resultLifespan'].value);
        this.config.userStorageLimit = Math.round(this.form.controls['userStorageLimit'].value);
        this.config.allowGuestMode = this.form.controls['allowGuestMode'].value;
        this.config.allowGoogleLogin = this.form.controls['allowGoogleLogin'].value;
        this.config.allowGithubLogin = this.form.controls['allowGithubLogin'].value;

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.loadScreenFromConfig();
                this.form.markAsPristine();
            }
        });
    }
}
