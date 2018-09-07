import {ResultFile} from "./result-file.model";
import {GraphTemplate} from "./graph-template.model";
import {CommandGroup} from "./command-group.model";
import {Parameter} from "./parameter.model";

export class Application {
    name: string;
    commandGroups: CommandGroup[];
    parameters?: Parameter[];
    resultFiles?: ResultFile[];
    graphs?: GraphTemplate[];

    public constructor(n: string, cgs: CommandGroup[], rfs: ResultFile[], gs: GraphTemplate[]) {
        this.name = n;
        this.commandGroups = cgs;
        this.resultFiles = rfs;
        this.graphs = gs;
    }
}
