export class ParameterPlaceholder {
    public nameKey: string;
    public typeKey: string;

    public constructor(index: number) {
        this.nameKey = index + "name";
        this.typeKey = index + "type";
    }
}
