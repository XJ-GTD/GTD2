/**
 * 标签类
 *
 * create by hwc on 2018/09/07
 */

export class groupLabel {

  private _labelId:number;//标签Id
  private _labelName:string;//标签名称

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
