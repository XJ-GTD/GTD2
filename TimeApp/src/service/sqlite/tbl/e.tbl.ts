import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class ETbl extends BaseTbl implements ITbl{
  constructor( arg ){

    super( arg );
  }


  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_E(  wI varchar(50) PRIMARY KEY ,sI varchar(50)  ,' +
      'sT varchar(50)  ,wD varchar(20)  ,wT varchar(20))';

    return this._execT(sq);
  }

  upT(pro:EPro):Promise<any> {
    let sq='update GTD_E set 1=1 ';
    if(pro.sI!=null){
      sq=sq+', sI="' + pro.sI +'"';
    }
    if(pro.sT!=null){
      sq=sq+', sT="' + pro.sT +'"';
    }
    if(pro.wD != null){
      sq = sq + ', wD="' + pro.wD +'"';
    }
    if(pro.wT != null){
      sq = sq + ', wT="' + pro.wT +'"';
    }
    sq = sq + ' where wI = "'+ pro.wI +'"';
    return this._execT(sq);
  }

  dT(pro:EPro):Promise<any> {
    let sq = 'delete from GTD_E where wI = "' + pro.wI +'"';
    return this._execT(sq);
  }

  sloT(pro:EPro):Promise<any> {
    let sq='select * from GTD_E where wI = "'+ pro.wI +'"';

    return this._execT(sq);
  }

  slT(pro:EPro):Promise<any> {
    let sq='select * from  GTD_E where  1=1 ';
    if(pro.sI!=null){
      sq=sq+' and sI="' + pro.sI +'"';
    }
    if(pro.sT!=null){
      sq=sq+' and sT="' + pro.sT +'"';
    }
    if(pro.wD != null){
      sq = sq + ' and wD="' + pro.wD +'"';
    }
    if(pro.wT != null){
      sq = sq + ' and wT="' + pro.wT +'"';
    }
    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_E;';
    return this._execT(sq);
  }

  inT(pro:EPro):Promise<any> {
    let sq ='insert into GTD_E ' +
      '(  wI ,sI ,sT ,wD ,wT) values("'+ pro.wI+'","'+ pro.sI+'","'+pro.sT+ '"' +
      ',"'+pro.wD+ '","'+pro.wT+ '")';

    return this._execT(sq);
  }

  rpT(pro:EPro):Promise<any> {
    let sq ='replace into GTD_E ' +
      '(  wI ,sI ,sT ,wD ,wT) values("'+ pro.wI+'","'+ pro.sI+'","'+pro.sT+ '"' +
      ',"'+pro.wD+ '","'+pro.wT+ '")';

    return this._execT(sq);
  }

}

class EPro{

  private _wI: string;
  private _sI: string;
  private _sT: string;
  private _wD: string;
  private _wT: string;


  get wI(): string {
    return this._wI;
  }

  set wI(value: string) {
    this._wI = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get sT(): string {
    return this._sT;
  }

  set sT(value: string) {
    this._sT = value;
  }

  get wD(): string {
    return this._wD;
  }

  set wD(value: string) {
    this._wD = value;
  }

  get wT(): string {
    return this._wT;
  }

  set wT(value: string) {
    this._wT = value;
  }

  clp(){
    this._wI=null;
    this._sI=null;
    this._sT=null;
    this._wD=null;
    this._wT=null;
  };

}

