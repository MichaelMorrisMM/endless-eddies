export class Graph {
    public id?: number;
    public keyName?: string;
    public keyType?: string;

    public name: string;
    public type: string;

    public constructor(i: number, g: Graph) {
        this.id = i;
        if (g) {
            this.name = g.name ? g.name : '';
            this.type = g.type ? g.type : '';
        } else {
            this.name = '';
            this.type = '';
        }
        this.keyName = "" + this.id + "graphname";
        this.keyType = "" + this.id + "graphtype";
    }
}
