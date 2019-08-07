import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class JtaTbl implements ITblParam {

  jti: string;
  ji: string;
  jtn: string;
  sd: string;
  st: string;
  jtt: string;
  jtc: string;
  px: string;
  bz: string;

  cTParam():string {

    let sq =`create table if not exists gtd_jta(    
      jti varchar(50) PRIMARY KEY
     ,ji varchar(50) 
     ,jtn varchar(50) 
     ,sd varchar(20) 
     ,st varchar(20) 
     ,jtt varchar(4) 
     ,jtc varchar(4) 
     ,px integer 
     ,bz varchar(50) 
     ,wtt integer 
     ,utt integer 
     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.ji!=null && this.ji!=''){      sq=sq+', ji= ? ';      params.push(this.ji);    }
    if(this.jtn!=null && this.jtn!=''){      sq=sq+', jtn= ? ';      params.push(this.jtn);    }
    if(this.sd!=null && this.sd!=''){      sq=sq+', sd= ? ';      params.push(this.sd);    }
    if(this.st!=null && this.st!=''){      sq=sq+', st= ? ';      params.push(this.st);    }
    if(this.jtt!=null && this.jtt!=''){      sq=sq+', jtt= ? ';      params.push(this.jtt);    }
    if(this.jtc!=null && this.jtc!=''){      sq=sq+', jtc= ? ';      params.push(this.jtc);    }
    if(this.px!=null && this.px!=''){      sq=sq+', px= ? ';      params.push(this.px);    }
    if(this.bz!=null && this.bz!=''){      sq=sq+', bz= ? ';      params.push(this.bz);    }

    sq =`update gtd_jta set utt =${moment().unix()}  ${sq} where jti = ? ;`;
    params.push(this.jti);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_jti where 1=1 ';
    let params = new Array<any>();
    if(this.jti != null && this.jti!=""){
      sq = sq + 'and  jti = ? ';
      params.push(this.jti);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_jti where moi = ?  ;';
    params.push(this.jti);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_jti where  1=1 ';

    if(this.ji!=null && this.ji!=''){      sq=sq+' and ji= ? ';      params.push(this.ji);    }
    if(this.jtn!=null && this.jtn!=''){      sq=sq+' and jtn= ? ';      params.push(this.jtn);    }
    if(this.sd!=null && this.sd!=''){      sq=sq+' and sd= ? ';      params.push(this.sd);    }
    if(this.st!=null && this.st!=''){      sq=sq+' and st= ? ';      params.push(this.st);    }
    if(this.jtt!=null && this.jtt!=''){      sq=sq+' and jtt= ? ';      params.push(this.jtt);    }
    if(this.jtc!=null && this.jtc!=''){      sq=sq+' and jtc= ? ';      params.push(this.jtc);    }
    if(this.px!=null && this.px!=''){      sq=sq+' and px= ? ';      params.push(this.px);    }
    if(this.bz!=null && this.bz!=''){      sq=sq+' and bz= ? ';      params.push(this.bz);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_jta;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_jta 
       (   jti ,ji ,jtn ,sd ,st ,jtt ,jtc ,px ,bz ,wtt ,utt) 
       values(?,?,?,?,?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.jti);
    params.push(this.ji);
    params.push(this.jtn);
    params.push(this.sd);
    params.push(this.st);
    params.push(this.jtt);
    params.push(this.jtc);
    params.push(this.px);
    params.push(this.nll2str(this.bz));


    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_jta 
       (   jti ,ji ,jtn ,sd ,st ,jtt ,jtc ,px ,bz ,wtt ,utt) 
       values(?,?,?,?,?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.jti);
    params.push(this.ji);
    params.push(this.jtn);
    params.push(this.sd);
    params.push(this.st);
    params.push(this.jtt);
    params.push(this.jtc);
    params.push(this.px);
    params.push(this.nll2str(this.bz));

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }
  nll2str(ob):any{
    if (ob == null || !ob ){
      return "";
    }else{
      return ob;
    }
  }
}
