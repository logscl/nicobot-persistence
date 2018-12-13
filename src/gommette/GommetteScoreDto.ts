import { GommetteScore } from "./GommetteScore"
import { GommetteType } from "./Gommette"

export class GommetteScoreDto {
  private userId: string;
  private score: number;
  private greenCount: number;
  private redCount: number;

  constructor(gommetteScore: GommetteScore) {
    this.userId = gommetteScore.getUserId()
    this.greenCount = gommetteScore.getGreenCount();
    this.redCount = gommetteScore.getRedCount();
    this.score = gommetteScore.getScore();
  }

  toJSON(): any {
    return {
      userId: this.userId,
      greenCount: this.greenCount,
      redCount: this.redCount,
      score: this.score
    }
  }

}