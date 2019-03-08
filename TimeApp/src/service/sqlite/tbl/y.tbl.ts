import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class YTbl implements ITbl {

  private _yi: string="";
  private _yt: string="";
  private _ytn: string="";
  private _yn: string="";
  private _yk: string="";
  private _yv: string="";


  get yi(): string {
    return this._yi;
  }

  set yi(value: string) {
    this._yi = value;
  }

  get yt(): string {
    return this._yt;
  }

  set yt(value: string) {
    this._yt = value;
  }

  get ytn(): string {
    return this._ytn;
  }

  set ytn(value: string) {
    this._ytn = value;
  }

  get yn(): string {
    return this._yn;
  }

  set yn(value: string) {
    this._yn = value;
  }

  get yk(): string {
    return this._yk;
  }

  set yk(value: string) {
    this._yk = value;
  }

  get yv(): string {
    return this._yv;
  }

  set yv(value: string) {
    this._yv = value;
  }

  cT(): string {

    let sq = 'CREATE TABLE IF NOT EXISTS GTD_Y(  yi varchar(50) PRIMARY KEY ,yt VARCHAR(20)  ,' +
      'ytn VARCHAR(20)  ,yn VARCHAR(20)  ,yk VARCHAR(20)  ,yv VARCHAR(400)   );';

    return sq;
  }

  upT(): string {
    let sq = 'update GTD_Y set 1=1 ';
    if (this._yt != null) {
      sq = sq + ', yt="' + this._yt + '"';
    }
    if (this._ytn != null) {
      sq = sq + ', ytn="' + this._ytn + '"';
    }
    if (this._yn != null) {
      sq = sq + ', yn="' + this._yn + '"';
    }
    if (this._yk != null) {
      sq = sq + ', yk="' + this._yk + '"';
    }
    if (this._yv != null) {
      sq = sq + ', yv="' + this._yv + '"';
    }
    sq = sq + ' where yi = "' + this._yi + '"';
    return sq;
  }

  dT(): string {
    let sq = 'delete from GTD_Y where yi = "' + this._yi + '"';
    return sq;
  }

  sloT(): string {
    let sq = 'select * from GTD_Y where yi = "' + this._yi + '"';
    return sq;
  }

  slT(): string {
    let sq = 'select * from  GTD_Y where  1=1 ';
    if (this._yt != null) {
      sq = sq + ' and yt="' + this._yt + '"';
    }
    if (this._ytn != null) {
      sq = sq + ' and ytn="' + this._ytn + '"';
    }
    if (this._yn != null) {
      sq = sq + ' and yn="' + this._yn + '"';
    }
    if (this._yk != null) {
      sq = sq + ' and yk="' + this._yk + '"';
    }
    if (this._yv != null) {
      sq = sq + ' and yv="' + this._yv + '"';
    }
    return sq;
  }

  drT(): string {

    let sq = 'DROP TABLE IF EXISTS GTD_Y;';
    return sq;
  }

  inT(): string {
    let sq = 'insert into GTD_Y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("' + this._yi + '","' + this._yt + '","' + this._ytn + '"' +
      ',"' + this._yn + '","' + this._yk + '","' + this._yv + '")';

    return sq;
  }

  rpT(): string {
    let sq = 'replace into GTD_Y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("' + this._yi + '","' + this._yt + '","' + this._ytn + '"' +
      ',"' + this._yn + '","' + this._yk + '","' + this._yv + '")';

    return sq;
  }

}

