import {Validator} from "./validator.model";

export class Parameter {

    public id?: number;
    public keyName?: string;
    public keyType?: string;
    public keyCode?: string;
    public keySortOrder?: string;
    public keyToolTip?: string;
    public keyValidators?: string;
    public keySelectOptions?: string;

    public name: string;
    public type: string;
    public code: string;
    public sortOrder: number;
    public toolTip: string;
    public validators: Validator[];
    public selectOptions: string[];

    public constructor(i: number, p: Parameter) {
        this.id = i;
        if (p) {
            this.name = p.name ? p.name : '';
            this.type = p.type ? p.type : '';
            this.code = p.code ? p.code : '';
            this.sortOrder = p.sortOrder ? p.sortOrder : i;
            this.toolTip = p.toolTip ? p.toolTip : '';
            this.validators = p.validators ? p.validators : [];
            this.selectOptions = p.selectOptions ? p.selectOptions : [];
        } else {
            this.name = '';
            this.type = '';
            this.code = '';
            this.sortOrder = i;
            this.toolTip = '';
            this.validators = [];
            this.selectOptions = [];
        }
        this.keyName = "" + this.id + "pname";
        this.keyType = "" + this.id + "ptype";
        this.keyCode = "" + this.id + "pcode";
        this.keySortOrder = "" + this.id + "psortorder";
        this.keyToolTip = "" + this.id + "ptooltip";
        this.keyValidators = "" + this.id + "pvalidators";
        this.keySelectOptions = "" + this.id + "pselectoptions";
    }
}
