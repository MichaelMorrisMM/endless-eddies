import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Parameter} from "./parameter.model";
import {ConfiguratorService} from "../services/configurator.service";
import {ThemesService} from "../services/themes.service";

@Component({
    selector: 'parent-picker',
    template: `
        <h1 mat-dialog-title>Parent for {{this.child.name}}</h1>
        <mat-dialog-content>
            <mat-form-field>
                <mat-select placeholder="Parameter" [(ngModel)]="this.parent" (onChange)="this.onParentChange()">
                    <mat-option *ngFor="let p of this.parameterList" [value]="p">
                        {{p.name}}
                    </mat-option>
                </mat-select>
            </mat-form-field>
            <mat-form-field>
                <mat-select placeholder="Option" [(ngModel)]="this.option">
                    <mat-option *ngFor="let o of this.parent?.selectOptions" [value]="o">
                        {{o}}
                    </mat-option>
                </mat-select>
            </mat-form-field>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button [style]="this.themesService.getButtonPrimaryStyles()" [disabled]="!this.parent && !this.option"
                    (click)="this.save()">Save
            </button>
            <button mat-raised-button [style]="this.themesService.getButtonWarnStyles()" [disabled]="!this.parent"
                    (click)="this.delete()">Remove
            </button>
            <button mat-button mat-dialog-close>Close</button>
        </mat-dialog-actions>
    `,
    styles: [`
    `]
})
export class ParentPickerComponent implements OnInit {
    public child: Parameter;
    public parent: Parameter;
    public option: string;

    public parameterList: Parameter[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<ParentPickerComponent>,
                private configuratorService: ConfiguratorService,
                public themesService: ThemesService) {
    }

    ngOnInit() {
        this.child = this.data.childParameter;
        this.parameterList = (this.data.allParametersList as Parameter[]).filter((p: Parameter) => {
            return p.type === this.configuratorService.TYPE_SELECT && !Parameter.checkForCircularDependency(p, this.child);
        });

        if (this.child.parent) {
            this.parent = this.child.parent;
            this.option = this.child.parentOption;
        }
    }

    public onParentChange(): void {
        this.option = null;
    }

    public delete(): void {
        if (this.child.parent) {
            this.child.parent.removeChild(this.child);
        }
        this.child.removeParent();

        this.dialogRef.close(true);
    }

    public save(): void {
        if (this.child.parent) {
            this.child.parent.removeChild(this.child);
        }
        this.child.setParent(this.parent, this.option);
        this.child.parent.addChild(this.child);

        this.dialogRef.close(true);
    }

}
