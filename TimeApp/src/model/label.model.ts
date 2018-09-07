/**
 * 标签
 *
 * create by wzy on 2018/09/07
 */
export class LabelModel {

  private _labelName: string;
  private _labelId: number;

  get labelId(): number {
    return this._labelId;
  }

  set labelId(value: number) {
    this._labelId = value;
  }
  get labelName(): string {
    return this._labelName;
  }

  set labelName(value: string) {
    this._labelName = value;
  }

}
