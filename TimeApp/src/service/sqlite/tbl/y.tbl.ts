import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class YTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq ='';

    return this._execT(sq);
  }

  upT(pro:YPro):Promise<any> {
    let sq=' ';
    return this._execT(sq);
  }

  dT(pro:YPro):Promise<any> {
    let sq = '';
    return this._execT(sq);
  }

  sloT(pro:YPro):Promise<any> {
    let sq='';
    return this._execT(sq);
  }

  slT(pro:YPro):Promise<any> {
    let sq=' ';

    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='';
    return this._execT(sq);
  }

  inT(pro:YPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

  rpT(pro:YPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

}

class YPro{


  clp(){

  };

}

