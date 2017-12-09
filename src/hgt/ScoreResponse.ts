import { Score } from "./Score";
import { ScoreDto } from "./ScoreDto";
import { Response } from "../common/dto/Response";

export class ScoreResponse extends Response<Score> {

    private scores: Array<Score> = new Array();

    constructor() {
        super();
    }

    setScores(scores: Array<Score>) { this.scores = scores; }
    
    toJSON() : any {
        return {
            scores : this.transform(),
            errors: this.getErrors()
        }
    }
    
    private transform() : Array<ScoreDto>{
        var res = new Array();
    
        for(var score of this.scores) {
            res.push(new ScoreDto(score).toJSON());
        }
    
        return res;
    }

}