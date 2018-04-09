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
                allowGuestMode: ConfiguratorService.getSetting(this.configuratorService.SETTING_ALLOW_GUEST_MODE, this.config),
                allowGoogleAuth: ConfiguratorService.getSetting(this.configuratorService.SETTING_ALLOW_GOOGLE_AUTH, this.config),
                allowGithubAuth: ConfiguratorService.getSetting(this.configuratorService.SETTING_ALLOW_GITHUB_AUTH, this.config),
            });
        });

        this.dirtyNote = ConstantsService.DIRTY_NOTE_MESSAGE;
    }

    public save(): void {
        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
