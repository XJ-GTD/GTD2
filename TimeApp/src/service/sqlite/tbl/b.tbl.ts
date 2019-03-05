import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class BTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq ='';

    return this._execT(sq);
  }

  upT(pro:BPro):Promise<any> {
    let sq=' ';
    return this._execT(sq);
  }

  dT(pro:BPro):Promise<any> {
    let sq = '';
    return this._execT(sq);
  }

  sloT(pro:BPro):Promise<any> {
    let sq='';
    return this._execT(sq);
  }

  slT(pro:BPro):Promise<any> {
    let sq=' ';

    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='';
    return this._execT(sq);
  }

  inT(pro:BPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

  rpT(pro:BPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

}

class BPro{


  clp(){

  };

}

