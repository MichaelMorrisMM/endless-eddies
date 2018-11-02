import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Parameter} from "./parameter.model";
import {SelectOption} from "./select-option.model";

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

    public options: SelectOption[];
    private originalOptions: SelectOption[];

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<OptionsComponent>) {
        this.form = new FormGroup({});
        this.index = 0;
        this.options = [];
    }

    ngOnInit() {
        this.parameter = this.data.parameter;
        this.paramName = this.data.name;

        this.originalOptions = this.parameter.selectOptions;

        for (let opt of this.parameter.selectOptions) {
            this.addOption(opt);
        }
    }

    public addOption(opt: SelectOption): void {
        let o: SelectOption = new SelectOption(this.index, opt);
        this.form.addControl(o.keyValue, new FormControl(o.value, Validators.required));
        this.form.addControl(o.keyDisplay, new FormControl(o.display));
        this.options.push(o);
        this.index = this.index + 1;
    }

    public removeOption(opt: SelectOption): void {
        this.form.removeControl(opt.keyValue);
        this.form.removeControl(opt.keyDisplay);
        this.options.splice(this.options.indexOf(opt), 1);
    }

    public save() {
        for (let originalOption of this.originalOptions) {
            let found: boolean = false;
            for (let newOption of this.options) {
                if (this.form.controls[newOption.keyValue].value === originalOption.value) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.parameter.breakChildrenWithOption(originalOption.value);
            }
        }

        for (let newOption of this.options) {
            newOption.value = this.form.controls[newOption.keyValue].value;
            newOption.display = this.form.controls[newOption.keyDisplay].value;
        }

        this.parameter.selectOptions = this.options;
        this.dialogRef.close(true);
    }

}
