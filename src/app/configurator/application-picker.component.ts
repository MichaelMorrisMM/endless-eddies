import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Config} from "./config.interface";
import {Application} from "./application.model";

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
                private dialogRef: MatDialogRef<ApplicationPickerComponent>) {
        this.showAdder = false;
    }

    ngOnInit() {
        this.config = this.data.config;
        this.showAdder = this.data.showAdder;
    }

    public submit(app: Application) {
        if (app === null) {
            this.dialogRef.close("new");
        } else {
            this.dialogRef.close(app);
        }
    }

}
