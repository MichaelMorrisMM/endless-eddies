import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ValidatorBlueprint} from "./validator-blueprint.interface";
import {FormControl, FormGroup} from "@angular/forms";
import {Validator} from "./validator.model";
import {Parameter} from "./parameter.model";

@Component({
    selector: 'validators',
    templateUrl: './validators.component.html',
    styles: [`
    `]
})
export class ValidatorsComponent implements OnInit {
    public paramName: string;
    public parameter: Parameter;
    public blueprints: ValidatorBlueprint[];
    public form: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<ValidatorsComponent>) {
    }

    ngOnInit() {
        this.form = new FormGroup({});

        this.parameter = this.data.parameter;
        this.paramName = this.data.name;
        this.blueprints = this.data.blueprints.filter((blue: ValidatorBlueprint) => {
            return blue.appliesTo.filter((type: string) => {
                return type === this.data.type
            }).length > 0;
        });
        let existingValidatorList: Validator[];
        let existingValidator: Validator;
        for (let blue of this.blueprints) {
            existingValidatorList = this.parameter.validators.filter((validator: Validator) => {
                return validator.validatorType === blue.validatorType;
            });
            existingValidator = existingValidatorList.length === 1 ? existingValidatorList[0] : null;
            this.form.addControl(blue.name, new FormControl(existingValidator !== null));
            this.form.addControl(blue.name + "val", new FormControl(existingValidator ? existingValidator.value : ""));
            this.form.addControl(blue.name + "mes", new FormControl(existingValidator ? existingValidator.message : ""));
        }
    }

    public save() {
        let validatorArray: Validator[] = [];
        for (let blue of this.blueprints) {
            if (this.form.controls[blue.name].value) {
                validatorArray.push(new Validator(
                    blue.validatorType,
                    this.form.controls[blue.name+'val'].value,
                    this.form.controls[blue.name+'mes'].value
                ));
            }
        }
        this.parameter.validators = validatorArray;
        this.dialogRef.close(true);
    }

}
