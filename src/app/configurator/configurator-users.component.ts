import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {Setting} from "./setting.interface";
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
    public userSettingsArray: Setting[];
    public form: FormGroup;

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                @Inject(FormBuilder) private fb: FormBuilder) {
        this.form = fb.group({
            resultLifespan: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.userSettingsArray = ConfiguratorService.getGroupSettings(this.configuratorService.GROUP_USERS, this.config);
            this.userSettingsArray.forEach((setting: Setting) => {
                this.form.addControl(setting.name, new FormControl(setting.value));
            });
            this.form.controls['resultLifespan'].setValue(response.resultLifespanInDays);
        });
    }

    public save(): void {
        this.userSettingsArray.forEach((setting: Setting) => {
            ConfiguratorService.setSettingValue(setting.name, this.form.controls[setting.name].value, this.config);
        });

        this.config.resultLifespanInDays = Math.round(this.form.controls['resultLifespan'].value);

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
