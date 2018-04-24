import {Validator} from "./validator.model";

export class Parameter {
    public name: string;
    public type: string;
    public code: string;
    public sortOrder: number;
    public toolTip: string;
    public validators: Validator[];
    public selectOptions: string[];

    public constructor(n: string, t: string, c: string, so: number, tt: string, vals: Validator[], opts: string[]) {
        this.name = n;
        this.type = t;
        this.code = c;
        this.sortOrder = so;
        this.toolTip = tt;
        this.validators = vals;
        this.selectOptions = opts;
    }
}
