import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class RwTbl implements ITblParam {

  type: string;
  id: string;
  mark: string;
  rw: string;
  nval: number;
  cval: string;
  bval: boolean;
  checksum: string;
  utt: number;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.type);
    params.push(this.id);
    params.push(this.mark);
    params.push(this.rw);
    params.push(this.nval);
    params.push(this.cval);
    params.push(this.bval);
    params.push(this.checksum);
    params.push(this.utt || moment().unix());

    return [`replace into gtd_rw
       (      type
             ,id
             ,mark
             ,rw
             ,nval
             ,cval
             ,bval
             ,checksum
             ,utt
            )`,
     `select ?,?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_rw(
          type varchar(10) 
           ,id varchar(50) 
           ,mark varchar(50) 
           ,rw varchar(10) 
           ,nval integer 
           ,cval varchar(50) 
           ,bval boolean 
           ,checksum varchar(50) 
           ,utt integer ,
           PRIMARY KEY(  type
                         ,id
                         ,mark
                         ,rw
                         )
     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.nval!=null ){      sq=sq+', nval= ? ';      params.push(this.nval);    }
    if(this.cval!=null && this.cval!=''){      sq=sq+', cval= ? ';      params.push(this.cval);    }
    if(this.bval!=null ){      sq=sq+', bval= ? ';      params.push(this.bval);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }




    sq =`update gtd_rw set utt =${moment().unix()}  ${sq} where type = ? and id =? and mark=? and rw=?  ;`;
    params.push(this.type);
    params.push(this.id);
    params.push(this.mark);
    params.push(this.rw);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_rw where 1=1 ';
    let params = new Array<any>();
    if(this.type!=null && this.type!=''){      sq=sq+' and type= ? ';      params.push(this.type);    }
    if(this.id!=null && this.id!=''){      sq=sq+' and id= ? ';      params.push(this.id);    }
    if(this.mark!=null && this.mark!=''){      sq=sq+' and mark= ? ';      params.push(this.mark);    }
    if(this.rw!=null && this.rw!=''){      sq=sq+' and rw= ? ';      params.push(this.rw);    }

    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_rw where  type = ? and id =? and mark=? and rw=?  ;';
    params.push(this.type);
    params.push(this.id);
    params.push(this.mark);
    params.push(this.rw);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_rw where  1=1 ';

    if(this.type!=null && this.type!=''){      sq=sq+' and  type= ? ';      params.push(this.type);    }
    if(this.id!=null && this.id!=''){      sq=sq+' and  id= ? ';      params.push(this.id);    }
    if(this.mark!=null && this.mark!=''){      sq=sq+' and mark= ? ';      params.push(this.mark);    }
    if(this.rw!=null && this.rw!=''){      sq=sq+' and rw= ? ';      params.push(this.rw);    }
    if(this.nval!=null ){      sq=sq+' and nval= ? ';      params.push(this.nval);    }
    if(this.cval!=null && this.cval!=''){      sq=sq+' and  cval= ? ';      params.push(this.cval);    }
    if(this.bval!=null){      sq=sq+' and bval= ? ';      params.push(this.bval);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }


    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_rw;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_rw
       (   type
             ,id
             ,mark
             ,rw
             ,nval
             ,cval
             ,bval
             ,checksum
             ,utt)
       values(?,?,?,?,?,?,?,?,?);`;
    params.push(this.type);
    params.push(this.id);
    params.push(this.mark);
    params.push(this.rw);
    params.push(this.nval);
    params.push(this.cval);
    params.push(this.bval);
    params.push(this.checksum);
    params.push(this.utt || moment().unix());
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_rw
       (   type
             ,id
             ,mark
             ,rw
             ,nval
             ,cval
             ,bval
             ,checksum
             ,utt)
       values(?,?,?,?,?,?,?,?,?);`;
    params.push(this.type);
    params.push(this.id);
    params.push(this.mark);
    params.push(this.rw);
    params.push(this.nval);
    params.push(this.cval);
    params.push(this.bval);
    params.push(this.checksum);
    params.push(this.utt || moment().unix());

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }
}
