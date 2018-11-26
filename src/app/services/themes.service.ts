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
            invertPrimary: true,
            accentColor: "#F3CD05",
            invertAccent: false,
            warnColor: "#BDA589",
            invertWarn: false,
        },
        {
            name: "Mediterranean",
            primaryColor: "#ABA6BF",
            invertPrimary: false,
            accentColor: "#F1E0D6",
            invertAccent: false,
            warnColor: "#583E2E",
            invertWarn: true,
        },
        {
            name: "Mountaintop",
            primaryColor: "#888C46",
            invertPrimary: false,
            accentColor: "#A4A4BF",
            invertAccent: false,
            warnColor: "#16235A",
            invertWarn: true,
        },
        {
            name: "Reds and Yellows",
            primaryColor: "#D9AC2A",
            invertPrimary: false,
            accentColor: "#D8D583",
            invertAccent: false,
            warnColor: "#720017",
            invertWarn: true,
        },
        {
            name: "Fruit",
            primaryColor: "#0294A5",
            invertPrimary: false,
            accentColor: "#A79C93",
            invertAccent: false,
            warnColor: "#C1403D",
            invertWarn: true,
        },
        {
            name: "Warm Glow",
            primaryColor: "#F22F08",
            invertPrimary: true,
            accentColor: "#594346",
            invertAccent: true,
            warnColor: "#561E18",
            invertWarn: true,
        },
        {
            name: "Beach",
            primaryColor: "#73C0F4",
            invertPrimary: false,
            accentColor: "#E6EFF3",
            invertAccent: false,
            warnColor: "#F3E4C6",
            invertWarn: false,
        },
        // Credit to themes below https://www.canva.com/learn/website-color-schemes/
        {
            name: "Cool and Calm",
            primaryColor: "#6BBAA7",
            invertPrimary: true,
            accentColor: "#6C648B",
            invertAccent: true,
            warnColor: "#FBA100",
            invertWarn: true,
        },
        {
            name: "Earthy and Fresh",
            primaryColor: "#626E60",
            invertPrimary: true,
            accentColor: "#3C3C3C",
            invertAccent: true,
            warnColor: "#AF473C",
            invertWarn: true,
        },
        {
            name: "Luxurious and Modern",
            primaryColor: "#0F1626",
            invertPrimary: true,
            accentColor: "#AB987A",
            invertAccent: true,
            warnColor: "#FF533D",
            invertWarn: true,
        }
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

    private static invertIcon(invert: boolean): string {
        return invert ? " filter: invert(100%); " : "";
    }

    private static setColors(color: string, invert: boolean): string {
        return " background-color: " + color + "; " + (invert ? " color: #ffffff; " : "");
    }

    public getBackgroundColorFromColor(color: string, invert: boolean): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.setColors(color, invert));
    }

    public getButtonPrimaryStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.setColors(this.currentTheme.primaryColor, this.currentTheme.invertPrimary));
    }

    public getIconPrimaryStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.invertIcon(this.currentTheme.invertPrimary));
    }

    public getButtonAccentStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.setColors(this.currentTheme.accentColor, this.currentTheme.invertAccent));
    }

    public getIconAccentStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.invertIcon(this.currentTheme.invertAccent));
    }

    public getButtonWarnStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.setColors(this.currentTheme.warnColor, this.currentTheme.invertWarn));
    }

    public getIconWarnStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.invertIcon(this.currentTheme.invertWarn));
    }

    public getDirtyNoteClasses(): string {
        return " default-dirty-note ";
    }

    public getDirtyNoteStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.setColors(this.currentTheme.accentColor, this.currentTheme.invertAccent));
    }

    public getIconDirtyNoteStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.invertIcon(this.currentTheme.invertAccent));
    }

    public getToolbarStyles(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.setColors(this.currentTheme.primaryColor, false));
    }

    public getInvertIconStyles(invert: boolean): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(ThemesService.invertIcon(invert));
    }

}
