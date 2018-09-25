import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {ThemesService} from "../services/themes.service";

@Component({
    selector: 'delete-application-dialog',
    templateUrl: './delete-application-dialog.component.html',
    styles: [`
    `]
})
export class DeleteApplicationDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<DeleteApplicationDialogComponent>,
                public themesService: ThemesService) {
    }

    ngOnInit() {
    }

    public deleteApplication(): void {
      this.dialogRef.close("delete");
    }

}
