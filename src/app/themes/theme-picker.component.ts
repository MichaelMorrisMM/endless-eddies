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
            <h1 class="title">Theme - {{this.themesService.currentTheme.name}}</h1>
            <div>
                <mat-form-field>
                    <mat-select placeholder="Change Theme" [formControl]="this.themeControl">
                        <mat-option *ngFor="let theme of this.themesService.THEMES" [value]="theme">
                            {{theme.name}}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
                <span [hidden]="!this.themeControl.dirty">
                    <button mat-raised-button (click)="this.allowResizing()" [style]="this.themesService.getButtonPrimaryStyles()">Change Sizing</button>
                </span>
            </div>
            <div [hidden]="!this.themeControl.dirty">
                <h1 class="title"><b>Preview:</b></h1>
                <hr/>
                <div>
                    <h1 class="title">New Request</h1>
                    <ng-container>
                        <div class="full-width flex-container-row margin-bottom align-center">
                            <mat-checkbox class="half-width">Checkbox</mat-checkbox>
                            <mat-form-field class="half-width">
                                <input matInput placeholder="parameter">
                                <mat-select placeholder="parameter">
                                    <mat-option>None</mat-option>
                                    <mat-option [value]="'Opt1'">Opt1</mat-option>
                                    <mat-option [value]="'Opt2'">Opt2</mat-option>
                                </mat-select>
                            </mat-form-field>
                        </div>
                    </ng-container>
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

    constructor(public authService: AuthService,
                public constantsService: ConstantsService,
                public themesService: ThemesService,
                private configuratorService: ConfiguratorService) {
    }

    ngOnInit() {
        this.reset();
    }

    public allowResizing(): void {
        // TODO: turn on or off resizing of elements when this function is called
    }

    private reset(): void {
        this.themeControl = new FormControl(this.themesService.currentTheme, Validators.required);
        this.configuratorService.getConfiguration().subscribe((config: Config) => {
            this.config = config;
        });
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

}
