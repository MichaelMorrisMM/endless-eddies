import {Parameter} from "./parameter.model";
import {ResultFile} from "./result-file.model";

export class Application {
    name: string;
    parameters: Parameter[];
    command: string;
    resultFiles?: ResultFile[];

    public constructor(n: string, p: Parameter[], c: string, rfs: ResultFile[]) {
        this.name = n;
        this.parameters = p;
        this.command = c;
        this.resultFiles = rfs;
    }
}
