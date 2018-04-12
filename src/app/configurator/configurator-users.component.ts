import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
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
    public userSettingsArray: Setting[];
    public form: FormGroup;

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService) {
        this.form = new FormGroup({});
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.userSettingsArray = ConfiguratorService.getGroupSettings(this.configuratorService.GROUP_USERS, this.config);
            this.userSettingsArray.forEach((setting: Setting) => {
                this.form.addControl(setting.name, new FormControl(setting.value));
            });
        });
    }

    public save(): void {
        this.userSettingsArray.forEach((setting: Setting) => {
            ConfiguratorService.setSettingValue(setting.name, this.form.controls[setting.name].value, this.config);
        });

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
