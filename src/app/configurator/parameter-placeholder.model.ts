export class ParameterPlaceholder {
    public nameKey: string;
    public typeKey: string;
    public codeKey: string;
    public sortOrderKey: string;

    public constructor(index: number) {
        this.nameKey = index + "name";
        this.typeKey = index + "type";
        this.codeKey = index + "code";
        this.sortOrderKey = index + "order";
    }
}
