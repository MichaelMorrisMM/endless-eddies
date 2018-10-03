import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConstantsService} from "../services/constants.service";
import {ThemesService} from "../services/themes.service";
import {Theme} from "./theme.interface";
import {Config} from "../configurator/config.interface";
import {ConfiguratorService} from "../services/configurator.service";
import {PostResult} from "../configurator/post-result.interface";
import {MatSelectChange} from "@angular/material";

@Component({
    selector: 'theme-picker',
    templateUrl: './theme-picker.component.html',
    styles: [`
        input.preview {
            width: 300px;
            height: 80px;
            text-align: center;
        }
    `]
})
export class ThemePickerComponent implements OnInit {
    public form: FormGroup;
    public config: Config;
    public showFullPreview: boolean = false;

    constructor(public authService: AuthService,
                public constantsService: ConstantsService,
                public themesService: ThemesService,
                private configuratorService: ConfiguratorService,
                private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            name: ["", Validators.required],
            primary: ["", Validators.required],
            invertPrimary: [false, Validators.required],
            accent: ["", Validators.required],
            invertAccent: [false, Validators.required],
            warn: ["", Validators.required],
            invertWarn: [false, Validators.required]
        });
    }

    ngOnInit() {
        this.reset();
    }

    private reset(): void {
        this.configuratorService.getConfiguration().subscribe((config: Config) => {
            this.config = config;
        });
        this.form.controls['name'].setValue(this.themesService.currentTheme.name);
        this.form.controls['primary'].setValue(this.themesService.currentTheme.primaryColor);
        this.form.controls['invertPrimary'].setValue(this.themesService.currentTheme.invertPrimary);
        this.form.controls['accent'].setValue(this.themesService.currentTheme.accentColor);
        this.form.controls['invertAccent'].setValue(this.themesService.currentTheme.invertAccent);
        this.form.controls['warn'].setValue(this.themesService.currentTheme.warnColor);
        this.form.controls['invertWarn'].setValue(this.themesService.currentTheme.invertWarn);
        this.form.markAsPristine();
    }

    public onColorChange(name: string, event: any): void {
        this.form.controls[name].setValue(event);
        this.form.markAsDirty();
    }

    public save(): void {
        if (this.form.valid && this.config) {
            let newTheme: Theme = {
                name: this.form.controls['name'].value,
                primaryColor: this.form.controls['primary'].value,
                invertPrimary: this.form.controls['invertPrimary'].value,
                accentColor: this.form.controls['accent'].value,
                invertAccent: this.form.controls['invertAccent'].value,
                warnColor: this.form.controls['warn'].value,
                invertWarn: this.form.controls['invertWarn'].value
            };
            this.config.appTheme = newTheme;
            this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
                if (response.success) {
                    this.themesService.setTheme(newTheme);
                    this.reset();
                }
            });
        }
    }

    public selectTheme(event: MatSelectChange): void {
        if (event && event.value) {
            this.form.controls['name'].setValue(event.value.name);
            this.form.controls['primary'].setValue(event.value.primaryColor);
            this.form.controls['invertPrimary'].setValue(event.value.invertPrimary);
            this.form.controls['accent'].setValue(event.value.accentColor);
            this.form.controls['invertAccent'].setValue(event.value.invertAccent);
            this.form.controls['warn'].setValue(event.value.warnColor);
            this.form.controls['invertWarn'].setValue(event.value.invertWarn);
            this.form.markAsDirty();
            event.source.value = null;
        }
    }

    public toggleFullPreview(): void {
        this.showFullPreview = !this.showFullPreview;
    }

}
