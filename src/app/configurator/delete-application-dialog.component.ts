import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Config} from "./config.interface";
import {Application} from "./application.model";

@Component({
    selector: 'delete-application-dialog',
    templateUrl: './delete-application-dialog.component.html',
    styles: [`
    `]
})
export class DeleteApplicationDialogComponent implements OnInit {
    public application: Application;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
      private dialogRef: MatDialogRef<DeleteApplicationDialogComponent>) {
      
    }

    ngOnInit() {
        this.application = this.data.application;
    }

    public deleteApplication(app: Application) {
      this.dialogRef.close("delete");
    }

    public closeDialog(app) {
      this.dialogRef.close(app);
    }

}
