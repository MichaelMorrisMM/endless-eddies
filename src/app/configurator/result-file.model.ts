export class ResultFile {
    public id?: number;
    public keyName?: string;
    public keyFilename?: string;
    public keyTooltip?: string;
    public keyDisplayInline?: string;

    public name: string;
    public filename: string;
    public toolTip: string;
    public displayInline: boolean;

    public src?: any;

    public constructor(i: number, rf: ResultFile) {
        this.id = i;
        if (rf) {
            this.name = rf.name ? rf.name : '';
            this.filename = rf.filename ? rf.filename : '';
            this.toolTip = rf.toolTip ? rf.toolTip : '';
            this.displayInline = rf.displayInline ? rf.displayInline : false;
        } else {
            this.name = '';
            this.filename = '';
            this.toolTip = '';
            this.displayInline = false;
        }
        this.keyName = "" + this.id + "resultfilename";
        this.keyFilename = "" + this.id + "resultfilefilename";
        this.keyTooltip = "" + this.id + "resultfiletooltip";
        this.keyDisplayInline = "" + this.id + "resultfiledisplayinline";
    }
}
