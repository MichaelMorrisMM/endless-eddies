export class ResultFile {
    public id?: number;
    public keyName?: string;
    public keyFilename?: string;
    public keyTooltip?: string;

    public name: string;
    public fileName: string;
    public toolTip: string;

    public constructor(i: number, rf: ResultFile) {
        this.id = i;
        if (rf) {
            this.name = rf.name ? rf.name : '';
            this.fileName = rf.fileName ? rf.fileName : '';
            this.toolTip = rf.toolTip ? rf.toolTip : '';
        } else {
            this.name = '';
            this.fileName = '';
            this.toolTip = '';
        }
        this.keyName = "" + this.id + "name";
        this.keyFilename = "" + this.id + "filename";
        this.keyTooltip = "" + this.id + "tooltip";
    }
}
