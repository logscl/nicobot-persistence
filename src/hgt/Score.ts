export class Score {
    private userId: string;
    private channelId: string;
    private year: number;
    private week: number;
    private score: number;

    constructor(userId: string, channelId:string, year:number, week:number, score:number = 1) {
        this.userId = userId;
        this.channelId = channelId;
        this.year = year;
        this.week = week;
        this.score = score;
    }

    getScore() { return this.score; }
    getUserId() { return this.userId; }
    getChannelId() { return this.channelId; }
    getYear() { return this.year; }
    getWeek() { return this.week; }
}