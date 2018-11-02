export class SelectOption {
    public id?: number;
    public keyValue?: string;
    public keyDisplay?: string;

    public value: string;
    public display: string;

    public constructor(i: number, so: SelectOption) {
        this.id = i;
        if (so) {
            this.value = so.value ? so.value : '';
            this.display = so.display ? so.display : '';
        } else {
            this.value = '';
            this.display = '';
        }
        this.keyValue = "" + this.id + "optionvalue";
        this.keyDisplay = "" + this.id + "optiondisplay";
    }
}
