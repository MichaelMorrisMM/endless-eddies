import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, Validators} from "@angular/forms";
import {ConstantsService} from "../services/constants.service";
import {ThemesService} from "../services/themes.service";
import {Config} from "../configurator/config.interface";
import {ConfiguratorService} from "../services/configurator.service";
import {PostResult} from "../configurator/post-result.interface";

@Component({
    selector: 'theme-picker',
    template: `
        <ng-container *ngIf="this.authService.getCurrentUser() && this.authService.getCurrentUser().isAdmin">
            <h1 class="title">Theme - {{this.themesService.currentTheme.displayName}}</h1>
            <div>
                <mat-form-field>
                    <mat-select placeholder="Change Theme" [formControl]="this.themeControl">
                        <mat-option *ngFor="let theme of this.themesService.THEMES" [value]="theme">
                            {{theme.displayName}}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
            <div class="flex-container-row padded-top">
                <button (click)="this.save()" class="{{this.themesService.getButtonPrimary()}}"
                        [disabled]="this.themeControl.invalid || !this.themeControl.dirty || !this.config">
                    <img src="./assets/icons/icons8-save-as-50.png" class="embeddedIcon">Save
                </button>
                <span class="spacer"></span>
                <span [hidden]="!this.themeControl.dirty" class="{{this.themesService.getDirtyNote()}}">
                    <img src="./assets/icons/icons8-exclamation-mark-50.png" class="embeddedIcon">{{this.constantsService.DIRTY_NOTE_MESSAGE}}
                </span>
            </div>
        </ng-container>
    `,
    styles: [`
    `]
})
export class ThemePickerComponent implements OnInit {
    public themeControl: FormControl;
    public config: Config;

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
    }

    public save(): void {
        if (this.themeControl.valid && this.config) {
            this.config.appTheme = this.themeControl.value.name;
            this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
                if (response.success) {
                    this.themesService.setTheme(this.themeControl.value);
                    this.reset();
                }
            });
        }
    }

}
