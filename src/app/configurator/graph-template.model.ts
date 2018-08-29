export class GraphTemplate {
    public id?: number;
    public keyName?: string;
    public keyType?: string;
    public keyFilename?: string;
    public keyXAxisLabel?: string;
    public keyYAxisLabel?: string;
    public keyColorScheme?: string;

    public name: string;
    public type: string;
    public filename: string;
    public xAxisLabel: string;
    public yAxisLabel: string;
    public colorScheme: string;

    public constructor(i: number, g: GraphTemplate) {
        this.id = i;
        if (g) {
            this.name = g.name ? g.name : '';
            this.type = g.type ? g.type : '';
            this.filename = g.filename ? g.filename : '';
            this.xAxisLabel = g.xAxisLabel ? g.xAxisLabel : '';
            this.yAxisLabel = g.yAxisLabel ? g.yAxisLabel : '';
            this.colorScheme = g.colorScheme ? g.colorScheme : '';
        } else {
            this.name = '';
            this.type = '';
            this.filename = '';
            this.xAxisLabel = '';
            this.yAxisLabel = '';
            this.colorScheme = '';
        }
        this.keyName = "" + this.id + "graphname";
        this.keyType = "" + this.id + "graphtype";
        this.keyFilename = "" + this.id + "graphfilename";
        this.keyXAxisLabel = "" + this.id + "graphxaxislabel";
        this.keyYAxisLabel = "" + this.id + "graphyaxislabel";
        this.keyColorScheme = "" + this.id + "graphcolorscheme";
    }
}
