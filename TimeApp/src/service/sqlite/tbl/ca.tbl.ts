import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class CaTbl implements ITblParam {

  evi: string;
  sd: string;
  st: string;
  ed: string;
  et: string;
  al: string;
  ct: number;
  utt: number;
  wtt: number;

  fastParam(): any {
    return [];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_ca(  evi varchar(50) PRIMARY KEY
       ,sd varchar(20)
       ,st varchar(20)
       ,ed varchar(20)
       ,et varchar(20)
       ,al varchar(4)
       ,ct integer
       ,wtt integer
       ,utt integer
        );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.sd!=null && this.sd!=''){      sq=sq+', sd= ? ';      params.push(this.sd);    }
    if(this.st!=null && this.st!=''){      sq=sq+', st= ? ';      params.push(this.st);    }
    if(this.ed!=null && this.ed!=''){      sq=sq+', ed= ? ';      params.push(this.ed);    }
    if(this.et!=null && this.et!=''){      sq=sq+', et= ? ';      params.push(this.et);    }
    if(this.al!=null && this.al!=''){      sq=sq+', al= ? ';      params.push(this.al);    }
    if(this.ct!=null){      sq=sq+', ct= ? ';      params.push(this.ct);    }


    sq =`update gtd_ca set utt = ${moment().unix()}  ${sq} where evi = ? ;`;
    params.push(this.evi);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_ca where 1=1 ';
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
    let sq='select * from gtd_ca where evi = ?  ;';
    params.push(this.evi);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_ca where  1=1 ';

    if(this.sd!=null && this.sd!=''){      sq=sq+' and  sd= ? ';      params.push(this.sd);    }
    if(this.st!=null && this.st!=''){      sq=sq+' and  st= ? ';      params.push(this.st);    }
    if(this.ed!=null && this.ed!=''){      sq=sq+' and  ed= ? ';      params.push(this.ed);    }
    if(this.et!=null && this.et!=''){      sq=sq+' and  et= ? ';      params.push(this.et);    }
    if(this.al!=null && this.al!=''){      sq=sq+' and al= ? ';      params.push(this.al);    }
    if(this.ct!=null){      sq=sq+' and ct= ? ';      params.push(this.ct);    }
    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_ca;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_ca
       (  evi ,sd ,st ,ed ,et ,al,ct ,wtt ,utt)
       values(?,?,?,?,?,?,?,?,?);`;
    params.push(this.evi);
    params.push(this.sd);
    params.push(this.st);
    params.push(this.ed);
    params.push(this.et);
    params.push(this.al);
    params.push(this.ct);
    params.push(moment().unix());
    params.push(moment().unix());

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_ca
       (  evi ,sd ,st ,ed ,et ,al,ct ,wtt ,utt)
       values(?,?,?,?,?,?,?,?,?);`;
    params.push(this.evi);
    params.push(this.sd);
    params.push(this.st);
    params.push(this.ed);
    params.push(this.et);
    params.push(this.al);
    params.push(this.ct);
    params.push(moment().unix());
    params.push(moment().unix());
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

}
