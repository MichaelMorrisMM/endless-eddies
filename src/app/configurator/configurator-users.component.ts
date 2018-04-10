import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";

@Component({
    selector: 'configurator-users',
    templateUrl: './configurator-users.component.html',
    styles: [`
    `]
})
export class ConfiguratorUsersComponent implements OnInit {
    public config: Config;
    public form: FormGroup;
    public dirtyNote: string;

    constructor(public configuratorService: ConfiguratorService,
                @Inject(FormBuilder) fb: FormBuilder) {

        this.form = fb.group({
            allowGuestMode: false,
            allowGoogleAuth: false,
            allowGithubAuth: false,
        });
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;

            this.form.setValue({
                allowGuestMode: ConfiguratorService.getSettingValue(this.configuratorService.SETTING_ALLOW_GUEST_MODE, this.config),
                allowGoogleAuth: ConfiguratorService.getSettingValue(this.configuratorService.SETTING_ALLOW_GOOGLE_AUTH, this.config),
                allowGithubAuth: ConfiguratorService.getSettingValue(this.configuratorService.SETTING_ALLOW_GITHUB_AUTH, this.config),
            });
        });

        this.dirtyNote = ConstantsService.DIRTY_NOTE_MESSAGE;
    }

    public save(): void {
        ConfiguratorService.setSettingValue(this.configuratorService.SETTING_ALLOW_GUEST_MODE, this.form.controls.allowGuestMode.value, this.config);
        ConfiguratorService.setSettingValue(this.configuratorService.SETTING_ALLOW_GOOGLE_AUTH, this.form.controls.allowGoogleAuth.value, this.config);
        ConfiguratorService.setSettingValue(this.configuratorService.SETTING_ALLOW_GITHUB_AUTH, this.form.controls.allowGithubAuth.value, this.config);

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
