import {Parameter} from "./parameter.model";

export class CommandGroup {
    public id?: number;
    public keyCommand?: string;
    public keyParameters?: string;

    public command: string;
    public parameters: Parameter[];

    public constructor(i: number, cg: CommandGroup) {
        this.id = i;
        if (cg) {
            this.command = cg.command ? cg.command : '';
            this.parameters = cg.parameters ? cg.parameters : [];
        } else {
            this.command = '';
            this.parameters = [];
        }
        this.keyCommand = "" + this.id + "cgcommand";
        this.keyParameters = "" + this.id + "cgparameters";
    }
}
