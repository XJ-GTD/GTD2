import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class BxTbl extends BaseTbl implements ITbl{
  constructor( arg ){

    super( arg );
  }


  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_B_X( bi varchar(50) PRIMARY KEY ,bmi varchar(50));';

    return this._execT(sq);
  }

  upT(pro:BxPro):Promise<any> {
    let sq='update GTD_B_X set 1=1 ';
    if(pro.bmi!=null){
      sq=sq+', bmi="' + pro.bmi +'"';
    }
    sq = sq + ' where bi = "'+ pro.bi +'"';
    return this._execT(sq);
  }

  dT(pro:BxPro):Promise<any> {
    let sq = 'delete from GTD_B_X where bi = "' + pro.bi +'"';
    return this._execT(sq);
  }

  sloT(pro:BxPro):Promise<any> {
    let sq='select * from GTD_B_X where bi = "'+ pro.bi +'"';
    return this._execT(sq);
  }

  slT(pro:BxPro):Promise<any> {
    let sq='select * from GTD_B_X where  1=1 ';
    if(pro.bmi!=null){
      sq=sq+' and bmi="' + pro.bmi +'"';
    }
    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_B_X;';
    return this._execT(sq);
  }

  inT(pro:BxPro):Promise<any> {
    let sq ='insert into GTD_G ' +
      '(  bi ,bmi) values("'+ pro.bi+'","'+ pro.bmi+'")';

    return this._execT(sq);
  }

  rpT(pro:BxPro):Promise<any> {
    let sq ='replace into GTD_G ' +
      '(  bi ,bmi) values("'+ pro.bi+'","'+ pro.bmi+'")';

    return this._execT(sq);
  }

}

class BxPro{
  private _bi: string;
  private _bmi: string;


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

  clp(){
    this._bi = null;
    this._bmi = null;
  };

}

