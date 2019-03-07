import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class GTbl extends BaseTbl implements ITbl{
  constructor( arg ){

    super( arg );
  }

  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_G(  gI varchar(50) PRIMARY KEY ,gN varchar(50)  ,gM varchar(50));';

    return this._execT(sq);
  }

  upT(pro:GPro):Promise<any> {
    let sq='update GTD_G set 1=1 ';
    if(pro.gN!=null){
      sq=sq+', gN="' + pro.gN +'"';
    }
    if(pro.gM!=null){
      sq=sq+', gM="' + pro.gM +'"';
    }
    sq = sq + ' where gI = "'+ pro.gI +'"';
    return this._execT(sq);
  }

  dT(pro:GPro):Promise<any> {
    let sq = 'delete from GTD_G where gI = "' + pro.gI +'"';
    return this._execT(sq);
  }

  sloT(pro:GPro):Promise<any> {
    let sq='select * from GTD_G where gI = "'+ pro.gI +'"';
    return this._execT(sq);
  }

  slT(pro:GPro):Promise<any> {
    let sq='select * from  GTD_G where  1=1 ';
    if(pro.gN!=null){
      sq=sq+', gN="' + pro.gN +'"';
    }
    if(pro.gM!=null){
      sq=sq+', gM="' + pro.gM +'"';
    }
    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_G;';
    return this._execT(sq);
  }

  inT(pro:GPro):Promise<any> {
    let sq ='insert into GTD_G ' +
      '( gI ,gN ,gM) values("'+ pro.gI+'","'+ pro.gN+'","'+pro.gM+ '")';

    return this._execT(sq);
  }

  rpT(pro:GPro):Promise<any> {
    let sq ='replace into GTD_G ' +
      '( gI ,gN ,gM) values("'+ pro.gI+'","'+ pro.gN+'","'+pro.gM+ '")';

    return this._execT(sq);
  }

}

class GPro{

  private _gI: string;
  private _gN: string;
  private _gM: string;

  get gI(): string {
    return this._gI;
  }

  set gI(value: string) {
    this._gI = value;
  }

  get gN(): string {
    return this._gN;
  }

  set gN(value: string) {
    this._gN = value;
  }

  get gM(): string {
    return this._gM;
  }

  set gM(value: string) {
    this._gM = value;
  }

  clp(){
    this._gI = null;
    this._gN = null;
    this._gM = null;

  };

}

