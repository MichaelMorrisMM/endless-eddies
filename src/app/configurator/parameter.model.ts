export class Parameter {
    public name: string;
    public type: string;
    public code: string;
    public sortOrder: number;

    public constructor(n: string, t: string, c: string, so: number) {
        this.name = n;
        this.type = t;
        this.code = c;
        this.sortOrder = so;
    }
}
