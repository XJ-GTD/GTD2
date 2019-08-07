import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class TTbl implements ITblParam {

  evi: string;
  cs: string;
  isrt: string;
  cd: string;
  fd: string;

  cTParam():string {

    let sq =`create table if not exists gtd_t(    
    evi varchar(50) PRIMARY KEY
     ,cs varchar(4) 
     ,isrt varchar(4) 
     ,cd varchar(20) 
     ,fd varchar(20) 
     ,wtt integer 
     ,utt integer 
     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.cs!=null && this.cs!=''){      sq=sq+', cs= ? ';      params.push(this.cs);    }
    if(this.isrt!=null && this.isrt!=''){      sq=sq+', isrt= ? ';      params.push(this.isrt);    }
    if(this.cd!=null && this.cd!=''){      sq=sq+', cd= ? ';      params.push(this.cd);    }
    if(this.fd!=null && this.fd!=''){      sq=sq+', fd= ? ';      params.push(this.fd);    }

    sq =`update gtd_t set utt = ${moment().unix()}  ${sq} where evi = ? ;`;
    params.push(this.evi);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_t where 1=1 ';
    let params = new Array<any>();
    if(this.evi != null && this.evi!=""){
      sq = sq + 'and  evi = ? ';
      params.push(this.evi);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_t where evi = ?  ;';
    params.push(this.evi);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_t where  1=1 ';

    if(this.cs!=null && this.cs!=''){      sq=sq+' and cs= ? ';      params.push(this.cs);    }
    if(this.isrt!=null && this.isrt!=''){      sq=sq+' and  isrt= ? ';      params.push(this.isrt);    }
    if(this.cd!=null && this.cd!=''){      sq=sq+' and cd= ? ';      params.push(this.cd);    }
    if(this.fd!=null && this.fd!=''){      sq=sq+' and fd= ? ';      params.push(this.fd);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_t;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_t 
       (   evi ,cs ,isrt ,cd ,fd ,wtt ,utt) 
       values(?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.evi);
    params.push(this.cs);
    params.push(this.isrt);
    params.push(this.cd);
    params.push(this.fd);


    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_t 
       (   evi ,cs ,isrt ,cd ,fd ,wtt ,utt) 
       values(?,?,?,?,?,${moment().unix()},${moment().unix()});`;
    params.push(this.evi);
    params.push(this.cs);
    params.push(this.isrt);
    params.push(this.cd);
    params.push(this.fd);


    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

}
