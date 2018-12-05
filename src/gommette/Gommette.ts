export enum GommetteType {
  RED = 0,
  GREEN
}

export class Gommette {
  private userId: string;
  private giverId: string;
  private reason: string;
  private type: GommetteType;
  private yesCount: number;
  private noCount: number;
  private creationDate: Date;
  private valid: boolean;

  constructor(userId: string, giverId: string, reason: string, type: GommetteType, yesCount: number, noCount: number, creationDate: Date, valid: boolean) {
    this.userId = userId;
    this.giverId = giverId;
    this.reason = reason;
    this.type = type;
    this.yesCount = yesCount;
    this.noCount = noCount;
    this.creationDate = creationDate;
    this.valid = valid;
  }

  getUserId() { return this.userId; }
  getGiverId() { return this.giverId; }
  getReason() { return this.reason; }
  getType() { return this.type; }
  getYesCount() { return this.yesCount; }
  getNoCount() { return this.noCount; }
  getCreationDate() { return this.creationDate; }
  isValid() { return this.valid; }
}