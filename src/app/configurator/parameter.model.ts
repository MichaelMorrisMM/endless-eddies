import {Validator} from "./validator.model";

export class Parameter {

    public id?: number;
    public keyName?: string;
    public keyType?: string;
    public keyCode?: string;
    public keySortOrder?: string;
    public keyToolTip?: string;
    public keyValidators?: string;
    public keySelectOptions?: string;

    public name: string;
    public type: string;
    public code: string;
    public sortOrder: number;
    public toolTip: string;
    public validators: Validator[];
    public selectOptions: string[];

    public children?: Parameter[];
    public parent?: Parameter;
    public parentString: string;
    public parentOption: string;

    public currentlyDisplayedChildren?: Parameter[] = null;

    public constructor(i: number, p: Parameter) {
        this.id = i;
        if (p) {
            this.name = p.name ? p.name : '';
            this.type = p.type ? p.type : '';
            this.code = p.code ? p.code : '';
            this.sortOrder = p.sortOrder ? p.sortOrder : i;
            this.toolTip = p.toolTip ? p.toolTip : '';
            this.validators = p.validators ? p.validators : [];
            this.selectOptions = p.selectOptions ? p.selectOptions : [];
            this.children = p.children ? p.children : [];
            this.parent = p.parent ? p.parent : null;
            this.parentString = p.parentString ? p.parentString : '';
            this.parentOption = p.parentOption ? p.parentOption : '';
        } else {
            this.name = '';
            this.type = '';
            this.code = '';
            this.sortOrder = i;
            this.toolTip = '';
            this.validators = [];
            this.selectOptions = [];
            this.children = [];
            this.parent = null;
            this.parentString = '';
            this.parentOption = '';
        }
        this.keyName = "" + this.id + "pname";
        this.keyType = "" + this.id + "ptype";
        this.keyCode = "" + this.id + "pcode";
        this.keySortOrder = "" + this.id + "psortorder";
        this.keyToolTip = "" + this.id + "ptooltip";
        this.keyValidators = "" + this.id + "pvalidators";
        this.keySelectOptions = "" + this.id + "pselectoptions";
    }

    public removeChild(child: Parameter): void {
        let index: number = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    public addChild(child: Parameter): void {
        let index: number = this.children.indexOf(child);
        if (index === -1) {
            this.children.push(child);
        }
    }

    public getChildrenWithOption(option: string): Parameter[] {
        return this.children.filter((p: Parameter) => {
            return p.parentOption === option;
        });
    }

    public removeParent(): void {
        this.setParent(null, null);
    }

    public setParent(parent: Parameter, option: string): void {
        this.parent = parent;
        this.parentOption = option;
    }

    public breakAllChildren(): void {
        for (let child of this.children) {
            child.removeParent();
        }
        this.children = [];
    }

    public breakChildrenWithOption(option: string): void {
        let index: number = this.children.length;
        while (index--) {
            if (this.children[index].parentOption === option) {
                this.children[index].removeParent();
                this.children.splice(index, 1);
            }
        }
    }

    public breakAllRelationships(): void {
        if (this.parent) {
            Parameter.breakRelationship(this.parent, this);
        }
        this.breakAllChildren();
    }

    public static breakRelationship(parent: Parameter, child: Parameter): void {
        parent.removeChild(child);
        child.removeParent();
    }

    public static checkForCircularDependency(parent: Parameter, child: Parameter): boolean {
        let currentParent: Parameter = parent;
        while (currentParent) {
            if (currentParent === child) {
                return true;
            }
            currentParent = currentParent.parent;
        }
        return false;
    }

    public static establishRelationships(params: Parameter[]): void {
        for (let child of params) {
            if (child.parentString && child.parentOption) {
                for (let parent of params) {
                    if (parent.name === child.parentString) {
                        child.parent = parent;
                        parent.addChild(child);
                    }
                }
            }
        }
    }
}
