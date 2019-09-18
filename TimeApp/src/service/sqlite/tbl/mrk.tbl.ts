import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class MrkTbl implements ITblParam {

  mki: string;
  mkl: string;
  obt: string;
  obi: string;
  mkt: string;
  utt: number;
  wtt: number;

  fastParam(): any {
    return [];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_mrk(
     mki varchar(50) PRIMARY KEY
     ,mkl varchar(50)
     ,obt varchar(50)
     ,obi varchar(50)
     ,mkt varchar(50)
     ,wtt integer
     ,utt integer
     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.mkl!=null && this.mkl!=''){      sq=sq+', mkl= ? ';      params.push(this.mkl);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+', obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+', obi= ? ';      params.push(this.obi);    }
    if(this.mkt!=null && this.mkt!=''){      sq=sq+', mkt= ? ';      params.push(this.mkt);    }


    sq =`update gtd_mrk set utt =${moment().unix()}  ${sq} where mki = ? ;`;
    params.push(this.mki);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_mrk where 1=1 ';
    let params = new Array<any>();
    if(this.mki != null && this.mki!=""){
      sq = sq + 'and  mki = ? ';
      params.push(this.mki);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_mrk where mki = ?  ;';
    params.push(this.mki);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_mrk where  1=1 ';

    if(this.mkl!=null && this.mkl!=''){      sq=sq+' and mkl= ? ';      params.push(this.mkl);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+' and obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+' and obi= ? ';      params.push(this.obi);    }
    if(this.mkt!=null && this.mkt!=''){      sq=sq+' and mkt= ? ';      params.push(this.mkt);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_mrk;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_mrk
       (    mki ,mkl ,obt ,obi ,mkt ,wtt ,utt)
       values(?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.mki);
    params.push(this.mkl);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.mkt);


    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_mrk
       (    mki ,mkl ,obt ,obi ,mkt ,wtt ,utt)
       values(?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.mki);
    params.push(this.mkl);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.mkt);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }
}
