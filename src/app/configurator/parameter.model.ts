export class Parameter {
    public name: string;
    public type: string;
    public code: string;
    public sortOrder: number;
    public toolTip: string;

    public constructor(n: string, t: string, c: string, so: number, tt: string) {
        this.name = n;
        this.type = t;
        this.code = c;
        this.sortOrder = so;
        this.toolTip = tt;
    }
}
