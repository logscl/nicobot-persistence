import { Response } from "../common/dto/Response";
import { GommetteScoreDto } from "./GommetteScoreDto";
import { GommetteScore } from "./GommetteScore";

export class GommetteScoreResponse extends Response<GommetteScore> {

  private scores: Array<GommetteScore> = new Array();

  constructor() {
    super();
  }

  setScores(scores: Array<GommetteScore>) { this.scores = scores; }

  toJSON() : any {
    return {
      scores: this.transform(),
      error: this.getError()
    }
  }

  private transform(): Array<GommetteScoreDto> {
    return this.scores.map(g => new GommetteScoreDto(g).toJSON());
  }
}