import {Parameter} from "./parameter.model";
import {ResultFile} from "./result-file.model";
import {Graph} from "./graph.model";

export class Application {
    name: string;
    parameters: Parameter[];
    command: string;
    resultFiles?: ResultFile[];
    graphs?: Graph[];

    public constructor(n: string, p: Parameter[], c: string, rfs: ResultFile[], gs: Graph[]) {
        this.name = n;
        this.parameters = p;
        this.command = c;
        this.resultFiles = rfs;
        this.graphs = gs;
    }
}
