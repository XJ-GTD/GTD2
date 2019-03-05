import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class BxTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq ='';

    return this._execT(sq);
  }

  upT(pro:BxPro):Promise<any> {
    let sq=' ';
    return this._execT(sq);
  }

  dT(pro:BxPro):Promise<any> {
    let sq = '';
    return this._execT(sq);
  }

  sloT(pro:BxPro):Promise<any> {
    let sq='';
    return this._execT(sq);
  }

  slT(pro:BxPro):Promise<any> {
    let sq=' ';

    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='';
    return this._execT(sq);
  }

  inT(pro:BxPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

  rpT(pro:BxPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

}

class BxPro{


  clp(){

  };

}

