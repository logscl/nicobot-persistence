export class Paging {
    private start: number;
    private limit: number;
    private total: number;

    constructor(start:number, limit:number, total:number) {
        this.start = start;
        this.limit = limit;
        this.total = total;
    }

    toJSON() : any {
        return {
            start: this.start,
            limit: this.limit,
            total: this.total
        };
    }
}