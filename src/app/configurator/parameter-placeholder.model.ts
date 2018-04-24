import {Validator} from "./validator.model";

export class ParameterPlaceholder {
    public nameKey: string;
    public typeKey: string;
    public codeKey: string;
    public sortOrderKey: string;
    public toolTipKey: string;
    public validators: Validator[];
    public selectOptions: string[];

    public constructor(index: number) {
        this.nameKey = index + "name";
        this.typeKey = index + "type";
        this.codeKey = index + "code";
        this.sortOrderKey = index + "order";
        this.toolTipKey = index + "toolTip";
        this.validators = [];
        this.selectOptions = [];
    }
}
