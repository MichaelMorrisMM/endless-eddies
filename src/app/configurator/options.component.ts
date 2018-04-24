import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ParameterPlaceholder} from "./parameter-placeholder.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'validators',
    templateUrl: './options.component.html',
    styles: [`
    `]
})
export class OptionsComponent implements OnInit {
    public paramName: string;
    public paramPlaceholder: ParameterPlaceholder;
    public form: FormGroup;
    public index: number;
    public keys: string[];

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<OptionsComponent>) {
        this.form = new FormGroup({});
        this.index = 0;
        this.keys = [];
    }

    ngOnInit() {
        this.paramPlaceholder = this.data.paramPlaceholder;
        this.paramName = this.data.name;
        this.paramPlaceholder.selectOptions.forEach((opt: string) => {
            this.addOption(opt);
        });
    }

    public addOption(opt: string): void {
        let key: string = "" + this.index;
        this.form.addControl(key, new FormControl(opt ? opt : "", Validators.required));
        this.keys.push(key);
        this.index = this.index + 1;
    }

    public removeOption(): void {
        if (this.index > 0) {
            this.form.removeControl("" + (this.index - 1));
            this.index = this.index - 1;
            this.keys.splice(this.index, 1);
        }
    }

    public save() {
        let optionsArray: string[] = [];
        this.keys.forEach((key: string) => {
            optionsArray.push(this.form.get(key).value);
        });
        this.paramPlaceholder.selectOptions = optionsArray;
        this.dialogRef.close(true);
    }

}
