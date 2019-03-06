/**
 * create by on 2018/11/19
 */

//闹铃表
export class ReEntity {

  private _ri: string='';   //提醒时间UUID
  private _pi:string=''; //参与人表ID
  private _rd: string='';   //日程提醒时间

  get ri(): string {
    return this._ri;
  }

  set ri(value: string) {
    this._ri = value;
  }

  get pi(): string {
    return this._pi;
  }

  set pi(value: string) {
    this._pi = value;
  }

  get rd(): string {
    return this._rd;
  }

  set rd(value: string) {
    this._rd = value;
  }
}
