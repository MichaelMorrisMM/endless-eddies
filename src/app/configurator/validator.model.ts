export class Validator {
    public validatorType: string;
    public value: any;
    public message: string;

    public constructor(t: string, v: any, m: string) {
        this.validatorType = t;
        this.value = v;
        this.message = m;
    }
}
