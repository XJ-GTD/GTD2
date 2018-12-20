/**
 * create by on 2018/11/19
 */

//群组中间表
export class RguModel {

  private _bi: string=null;   //授权表主键ID
  private _bmi:string=null; //授权表关系人主键ID

  get bi(): string {
    return this._bi;
  }

  set bi(value: string) {
    this._bi = value;
  }

  get bmi(): string {
    return this._bmi;
  }

  set bmi(value: string) {
    this._bmi = value;
  }
}
