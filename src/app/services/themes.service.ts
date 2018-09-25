import {Injectable} from '@angular/core';

@Injectable()
export class ThemesService {
    public readonly THEME_BLUE_SUNSET: string = "theme-blue-sunset";
    public readonly THEME_MEDITERRANEAN: string = "theme-mediterranean";

    public currentTheme: string = this.THEME_MEDITERRANEAN; // TODO remove default

    constructor() {
    }

    public switch(): void {
        // TODO this is only for demo purposes
        if (this.currentTheme === this.THEME_BLUE_SUNSET) {
            this.currentTheme = this.THEME_MEDITERRANEAN
        } else {
            this.currentTheme = this.THEME_BLUE_SUNSET;
        }
    }

    public getButtonPrimary(): string {
        return " mat-raised-button theme-default-button " + this.getBackgroundColorPrimary();
    }

    public getButtonAccent(): string {
        return " mat-raised-button theme-default-button " + this.getBackgroundColorAccent();
    }

    public getButtonWarn(): string {
        return " mat-raised-button theme-default-button " + this.getBackgroundColorWarn();
    }

    public getDirtyNote(): string {
        return " theme-default-dirty-note " + this.getBackgroundColorAccent();
    }

    public getToolbar(): string {
        return " mat-toolbar-single-row " + this.getBackgroundColorPrimary();
    }

    private getBackgroundColorPrimary(): string {
        return " " + this.currentTheme + "-background-color-primary ";
    }

    private getBackgroundColorAccent(): string {
        return " " + this.currentTheme + "-background-color-accent ";
    }

    private getBackgroundColorWarn(): string {
        return " " + this.currentTheme + "-background-color-warn ";
    }

}
