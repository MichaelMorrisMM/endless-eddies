import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ParameterPlaceholder} from "./parameter-placeholder.model";
import {ValidatorBlueprint} from "./validator-blueprint.interface";
import {FormControl, FormGroup} from "@angular/forms";
import {Validator} from "./validator.model";

@Component({
    selector: 'validators',
    templateUrl: './validators.component.html',
    styles: [`
    `]
})
export class ValidatorsComponent implements OnInit {
    public paramName: string;
    public paramPlaceholder: ParameterPlaceholder;
    public blueprints: ValidatorBlueprint[];
    public form: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<ValidatorsComponent>) {
        this.form = new FormGroup({});
    }

    ngOnInit() {
        this.paramPlaceholder = this.data.paramPlaceholder;
        this.paramName = this.data.name;
        this.blueprints = this.data.blueprints.filter((blue: ValidatorBlueprint) => {
            return blue.appliesTo.filter((type: string) => {
                return type === this.data.type
            }).length > 0;
        });
        this.blueprints.forEach((blue: ValidatorBlueprint) => {
            this.form.addControl(blue.name, new FormControl(false));
            this.form.addControl(blue.name + "val", new FormControl(""));
            this.form.addControl(blue.name + "mes", new FormControl(""));
        });
    }

    public save() {
        let validatorArray: Validator[] = [];
        this.blueprints.forEach((blue: ValidatorBlueprint) => {
            if (this.form.controls[blue.name].value) {
                validatorArray.push(new Validator(
                    blue.validatorType,
                    this.form.controls[blue.name+'val'].value,
                    this.form.controls[blue.name+'mes'].value
                ));
            }
        });
        this.paramPlaceholder.validators = validatorArray;
        this.dialogRef.close(true);
    }

}
