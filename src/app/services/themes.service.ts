import {Injectable} from '@angular/core';
import {ConfiguratorService} from "./configurator.service";
import {Config} from "../configurator/config.interface";
import {Theme} from "../themes/theme.interface";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@Injectable()
export class ThemesService {

    // Themes (source http://blog.visme.co/color-combinations/)
    public readonly THEMES: Theme[] = [
        {
            name: "Blue Sunset",
            primaryColor: "#36688D",
            accentColor: "#F3CD05",
            warnColor: "#BDA589",
        },
        {
            name: "Mediterranean",
            primaryColor: "#595775",
            accentColor: "#F1E0D6",
            warnColor: "#583E2E",
        },
    ];

    public currentTheme: Theme = this.THEMES[0]; // Default theme

    constructor(private configuratorService: ConfiguratorService,
                private sanitizer: DomSanitizer) {
        this.setTheme();
    }

    public setTheme(theme?: Theme): void {
        if (theme) {
            this.currentTheme = theme;
        } else {
            this.configuratorService.getConfiguration().subscribe((config: Config) => {
                if (config && config.appTheme) {
                    this.currentTheme = config.appTheme;
                } else {
                    this.currentTheme = this.THEMES[0]; // Default theme
                }
            });
        }
    }

    public getBackgroundColorFromColor(color: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(" background-color: " + color + "; ");
    }

    public getButtonPrimaryStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(" background-color: " + this.currentTheme.primaryColor + "; ");
    }

    public getButtonAccentStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(" background-color: " + this.currentTheme.accentColor + "; ");
    }

    public getButtonWarnStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(" background-color: " + this.currentTheme.warnColor + "; ");
    }

    public getDirtyNoteClasses(): string {
        return " default-dirty-note ";
    }

    public getDirtyNoteStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(" background-color: " + this.currentTheme.accentColor + "; ");
    }

    public getToolbarStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(" background-color: " + this.currentTheme.primaryColor + "; ");
    }

}
