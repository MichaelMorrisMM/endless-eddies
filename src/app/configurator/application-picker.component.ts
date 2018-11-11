import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Config} from "./config.interface";
import {Application} from "./application.model";
import {ThemesService} from "../services/themes.service";

@Component({
    selector: 'application-picker',
    templateUrl: './application-picker.component.html',
    styles: [`
    `]
})
export class ApplicationPickerComponent implements OnInit {
    public config: Config;
    public showAdder: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<ApplicationPickerComponent>,
                public themesService: ThemesService) {
        this.showAdder = false;
    }

    ngOnInit() {
        this.config = this.data.config;
        this.showAdder = this.data.showAdder;
        if (this.config.applications.length === 1 && !this.showAdder) {
            setTimeout(() => {
                this.submit(this.config.applications[0]);
            });
            return;
        }
        if (this.data.preselectApplication) {
            for (let app of this.config.applications) {
                if (app.name === this.data.preselectApplication) {
                    setTimeout(() => {
                        this.submit(app);
                    });
                    break;
                }
            }
            return;
        }
    }

    public submit(app: Application) {
        if (app === null) {
            this.dialogRef.close("new");
        } else {
            this.dialogRef.close(app);
        }
    }

}
