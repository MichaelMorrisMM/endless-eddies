export class HomePage {
    public id?: number;
    public keyTitle?: string;
    public keyContent?: string;

    public title: string;
    public content: string;

    public constructor(i: number, hp: HomePage) {
        this.id = i;
        if (hp) {
            this.title = hp.title ? hp.title : '';
            this.content = hp.content ? hp.content : '';
        } else {
            this.title = '';
            this.content = '';
        }
        this.keyTitle = "" + this.id + "homepagetitle";
        this.keyContent = "" + this.id + "homepagecontent";
    }
}
