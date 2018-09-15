import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Parameter} from "./parameter.model";

@Component({
    selector: 'validators',
    templateUrl: './options.component.html',
    styles: [`
    `]
})
export class OptionsComponent implements OnInit {
    public paramName: string;
    public parameter: Parameter;
    public form: FormGroup;
    public index: number;
    public keys: string[];

    private originalOptions: string[];

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<OptionsComponent>) {
        this.form = new FormGroup({});
        this.index = 0;
        this.keys = [];
    }

    ngOnInit() {
        this.parameter = this.data.parameter;
        this.paramName = this.data.name;

        this.originalOptions = this.parameter.selectOptions;

        for (let opt of this.parameter.selectOptions) {
            this.addOption(opt);
        }
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
        for (let key of this.keys) {
            optionsArray.push(this.form.get(key).value);
        }

        for (let originalOption of this.originalOptions) {
            let newIndex: number = optionsArray.indexOf(originalOption);
            if (newIndex === -1) {
                this.parameter.breakChildrenWithOption(originalOption);
            }
        }

        this.parameter.selectOptions = optionsArray;
        this.dialogRef.close(true);
    }

}
