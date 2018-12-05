export class GommetteScore {
  private userId: string;
  private redCount: number;
  private greenCount: number;
  private score: number;

  constructor(userId: string, redCount:number, greenCount:number, score:number) {
    this.userId = userId;
    this.redCount = redCount;
    this.greenCount = greenCount;
    this.score = score;
  }

  getUserId() { return this.userId; }
  getRedCount() { return this.redCount; }
  getGreenCount() { return this.greenCount; }
  getScore() { return this.score; }
}