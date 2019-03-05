import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class JhTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq ='';

    return this._execT(sq);
  }

  upT(pro:JhPro):Promise<any> {
    let sq=' ';
    return this._execT(sq);
  }

  dT(pro:JhPro):Promise<any> {
    let sq = '';
    return this._execT(sq);
  }

  sloT(pro:JhPro):Promise<any> {
    let sq='';
    return this._execT(sq);
  }

  slT(pro:JhPro):Promise<any> {
    let sq=' ';

    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='';
    return this._execT(sq);
  }

  inT(pro:JhPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

  rpT(pro:JhPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

}

class JhPro{


  clp(){

  };

}

