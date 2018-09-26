import {Injectable} from '@angular/core';
import {ConfiguratorService} from "./configurator.service";
import {Config} from "../configurator/config.interface";
import {Theme} from "../themes/theme.interface";

@Injectable()
export class ThemesService {

    public readonly THEMES: Theme[] = [
        {
            displayName: "Blue Sunset",
            name: "theme-blue-sunset",
        },
        {
            displayName: "Mediterranean",
            name: "theme-mediterranean",
        },
    ];

    public currentTheme: Theme = this.THEMES[0]; // Default theme

    constructor(private configuratorService: ConfiguratorService) {
        this.setTheme();
    }

    public getThemeFromName(name: string): Theme {
        return this.THEMES.filter((theme: Theme) => {
            return theme.name === name;
        })[0];
    }

    public setTheme(theme?: Theme): void {
        if (theme) {
            this.currentTheme = theme;
        } else {
            this.configuratorService.getConfiguration().subscribe((config: Config) => {
                if (config && config.appTheme) {
                    this.currentTheme = this.getThemeFromName(config.appTheme);
                } else {
                    this.currentTheme = this.THEMES[0]; // Default theme
                }
            });
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
        return " " + this.currentTheme.name + "-background-color-primary ";
    }

    private getBackgroundColorAccent(): string {
        return " " + this.currentTheme.name + "-background-color-accent ";
    }

    private getBackgroundColorWarn(): string {
        return " " + this.currentTheme.name + "-background-color-warn ";
    }

}
