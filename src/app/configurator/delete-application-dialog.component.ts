import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
    selector: 'delete-application-dialog',
    templateUrl: './delete-application-dialog.component.html',
    styles: [`
    `]
})
export class DeleteApplicationDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<DeleteApplicationDialogComponent>) {
    }

    ngOnInit() {
    }

    public deleteApplication(): void {
      this.dialogRef.close("delete");
    }

}
