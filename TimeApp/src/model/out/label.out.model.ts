/**
 * 标签查询
 *
 * create by wzy on 2018/09/07
 */
export class LabelOutModel {
  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }
  get findType(): number {
    return this._findType;
  }

  set findType(value: number) {
    this._findType = value;
  }
  private _findType: number;
  private _userId: number;
}
