import {Parameter} from "./parameter.model";

export class Application {
    name: string;
    parameters: Parameter[];
    command: string;

    public constructor(n: string, p: Parameter[], c: string) {
        this.name = n;
        this.parameters = p;
        this.command = c;
    }
}
