import { Error, ErrorItem } from "../common/model/Error";

export class Link {

    private id?:number;
    private link:string;
    private count:number;
    private error:Error;

    constructor(link:string, count:number, idLink?:number) {
        this.id = idLink;
        this.link = link;
        this.count = count;
        this.error = new Error();
    }

    getId() { return this.id; }
    getLink() { return this.link; }
    getCount() { return this.count; }
    setCount(newCount:number) { this.count = newCount; }

    validate() {
        if (!this.link) {
            this.error.addFieldError("link", "Cannot be null");
        }
        else {
            this.link = this.link.trim();
            if (this.link.length == 0) {
                this.error.addFieldError("link", "Cannot be empty");
            }
        }

        if (this.error.hasError()) {
            return false;
        }

        return true;
    }

    getValidationErrors() : Array<ErrorItem> {
        return this.error.getErrors();
    }

    toJSON() : object {
        return {
            link: this.link,
            count: this.count
        };
    }
}







