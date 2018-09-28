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
    template: `
        <ng-container *ngIf="this.authService.getCurrentUser() && this.authService.getCurrentUser().isAdmin">
            <h1 class="title">Theme - {{this.themesService.currentTheme.name}}</h1>
            <div>
                <mat-form-field>
                    <mat-select placeholder="Change Theme" [formControl]="this.themeControl" (change)="changeSelectedTheme()">
                        <mat-option *ngFor="let theme of this.themesService.THEMES" [value]="theme">
                            {{theme.name}}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
            <div [hidden]="!this.themeControl.dirty">
                <h1 class="title"><b>Preview:</b></h1>
                <hr/>
                <div class="flex-container-col full-width margin-bottom">
                    <h1 class="title">New Request</h1>
                    <ng-container>
                        <div class="full-width flex-container-row margin-bottom align-center">
                            <div class="full-width flex-container-row margin-bottom align-center">
                                <mat-checkbox class="half-width">Checkbox</mat-checkbox>
                                <mat-form-field class="half-width">
                                    <mat-select placeholder="Parameter">
                                        <mat-option [value]="'Opt1'">Opt1</mat-option>
                                        <mat-option [value]="'Opt2'">Opt2</mat-option>
                                    </mat-select>
                                </mat-form-field>
                            </div>
                        </div>
                    </ng-container>
                    <button mat-raised-button [style]="this.themesService.getButtonPrimaryStylesFromName(this.themeControl.value.name)">
                        <img src="./assets/icons/icons8-upload-to-cloud-50.png" class="embeddedIcon">Submit
                    </button>
                </div>
                <div>
                    <h1 class="title">Results</h1>
                    <label>System Out:</label>
                    <pre>Example system out</pre>
                    <div>
                        <h2 class="subtitle">Result File(s)</h2>
                        <button mat-button matTooltip="Example tooltip">
                            <img src="./assets/icons/icons8-download-50.png" class="embeddedIcon">Results File Name
                        </button>
                    </div>
                </div>
                <hr/>
            </div>
            <div class="flex-container-row padded-top">
                <button mat-raised-button (click)="this.save()" [style]="this.themesService.getButtonPrimaryStyles()"
                        [disabled]="this.themeControl.invalid || !this.themeControl.dirty || !this.config">
                    <img src="./assets/icons/icons8-save-as-50.png" class="embeddedIcon">Save
                </button>
                <span class="spacer"></span>
                <span [hidden]="!this.themeControl.dirty" [style]="this.themesService.getDirtyNoteStyles()" class="{{this.themesService.getDirtyNoteClasses()}}">
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
