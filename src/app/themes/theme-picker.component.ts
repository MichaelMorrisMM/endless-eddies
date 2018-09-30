import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, Validators} from "@angular/forms";
import {ConstantsService} from "../services/constants.service";
import {ThemesService} from "../services/themes.service";
import {Theme} from "../themes/theme.interface";
import {Config} from "../configurator/config.interface";
import {ConfiguratorService} from "../services/configurator.service";
import {PostResult} from "../configurator/post-result.interface";

@Component({
    selector: 'theme-picker',
    templateUrl: './theme-picker.component.html',
    styles: [`
    `]
})
export class ThemePickerComponent implements OnInit {
    public themeControl: FormControl;
    public config: Config;
    public currentTheme: Theme;

    constructor(public authService: AuthService,
                public constantsService: ConstantsService,
                public themesService: ThemesService,
                private configuratorService: ConfiguratorService) {
    }

    ngOnInit() {
        this.reset();
    }

    private reset(): void {
        this.themeControl = new FormControl(this.themesService.currentTheme, Validators.required);
        this.configuratorService.getConfiguration().subscribe((config: Config) => {
            this.config = config;
        });
        this.currentTheme = this.themesService.currentTheme;
    }

    public save(): void {
        if (this.themeControl.valid && this.config) {
            this.config.appTheme = this.themeControl.value;
            this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
                if (response.success) {
                    this.themesService.setTheme(this.themeControl.value);
                    this.reset();
                }
            });
        }
    }

    public changeSelectedTheme(themeName: string): void {
        this.currentTheme = this.themeControl.value;
    }

}
