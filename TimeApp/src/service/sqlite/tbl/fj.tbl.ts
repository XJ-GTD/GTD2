import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class FjTbl implements ITblParam {

  fji: string;
  obt: string;
  obi: string;
  fjn: string;
  ext: string;
  fj: string;


  cTParam():string {

    let sq =`create table if not exists gtd_fj(    
     fji varchar(50) PRIMARY KEY
     ,obt varchar(50) 
     ,obi varchar(50) 
     ,fjn varchar(50) 
     ,ext varchar(50) 
     ,fj varchar(50) 
     ,wtt integer  ,utt integer 
     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.obt!=null && this.obt!=''){      sq=sq+', obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+', obi= ? ';      params.push(this.obi);    }
    if(this.fjn!=null && this.fjn!=''){      sq=sq+', fjn= ? ';      params.push(this.fjn);    }
    if(this.ext!=null && this.ext!=''){      sq=sq+', ext= ? ';      params.push(this.ext);    }
    if(this.fj!=null && this.fj!=''){      sq=sq+', fj= ? ';      params.push(this.fj);    }


    sq =`update gtd_fj set utt =${moment().unix()}  ${sq} where fji = ? ;`;
    params.push(this.fji);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_fj where 1=1 ';
    let params = new Array<any>();
    if(this.fji != null && this.fji!=""){
      sq = sq + 'and  fji = ? ';
      params.push(this.fji);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_fj where fji = ?  ;';
    params.push(this.fji);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_fj where  1=1 ';

    if(this.obt!=null && this.obt!=''){      sq=sq+' and obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+' and obi= ? ';      params.push(this.obi);    }
    if(this.fjn!=null && this.fjn!=''){      sq=sq+' and fjn= ? ';      params.push(this.fjn);    }
    if(this.ext!=null && this.ext!=''){      sq=sq+' and  ext= ? ';      params.push(this.ext);    }
    if(this.fj!=null && this.fj!=''){      sq=sq+' and fj= ? ';      params.push(this.fj);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_fj;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_fj 
       (    fji ,obt ,obi ,fjn ,ext ,fj ,wtt,utt) 
       values(?,?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.fji);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.fjn);
    params.push(this.ext);
    params.push(this.fj);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_fj 
       (    fji ,obt ,obi ,fjn ,ext ,fj ,wtt ,utt ) 
       values(?,?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.fji);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.fjn);
    params.push(this.ext);
    params.push(this.fj);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

}
