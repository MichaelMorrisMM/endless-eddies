import {Parameter} from "./parameter.model";
import {ResultFile} from "./result-file.model";
import {GraphTemplate} from "./graph-template.model";

export class Application {
    name: string;
    parameters: Parameter[];
    command: string;
    resultFiles?: ResultFile[];
    graphs?: GraphTemplate[];

    public constructor(n: string, p: Parameter[], c: string, rfs: ResultFile[], gs: GraphTemplate[]) {
        this.name = n;
        this.parameters = p;
        this.command = c;
        this.resultFiles = rfs;
        this.graphs = gs;
    }
}
