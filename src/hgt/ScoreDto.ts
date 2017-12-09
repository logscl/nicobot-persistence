import { Score } from "./Score";

export class ScoreDto {
    private userId: string;
    private score: number;

    constructor(score: Score) {
        this.score = score.getScore();
        this.userId = score.getUserId();
    }

    toJSON() : any {
        return {
            userId : this.userId,
            score : this.score
        };
    }
}