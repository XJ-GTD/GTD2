/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import * as moment from "moment";


export class MkTbl implements ITbl{
  mki: string;
  si: string;
  mkl: string;
  mkt: string = "default";
  wtt: number = 0;

  cT():string {

    let sq =` create table if not exists gtd_mk(  mki varchar(50) primary key ,si varchar(50)  ,mkl varchar(50)  ,mkt varchar(50)  ,wtt integer );`;

    return sq;
  }

  upT():string {
    let sq='';
    if(this.mkl != null && this.mkl!=""){
      sq = sq + ', mkl="' + this.mkl +'"';
    }

    if(this.mkt != null && this.mkt!=""){
      sq = sq + ', mkt="' + this.mkt +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_mk set ' + sq + ' where mki = "'+ this.mki +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_mk where mki = "' + this.mki +'";';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_mk where 1=1 ';
    if(this.mki != null && this.mki!=""){
      sq = sq + 'and  mki ="' + this.mki +'"';
    }
    if(this.si != null && this.si!=""){
      sq = sq + 'and  si ="' + this.si +'"';
    }
    sq = sq + ';';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_mk where  1=1 ';
    if(this.mki!=null && this.mki!=""){
      sq=sq+' and mki="' + this.mki +'"';
    }
    if(this.si!=null && this.si!=""){
      sq=sq+' and si="' + this.si +'"';
    }

    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_mk;';
    return sq;
  }

  inT():string {
    let sq =`insert into gtd_mk ( mki ,si ,mkl ,mkt ,wtt ) values( "${this.mki}","${this.si}","${this.mkl}", "${this.mkt}", ${moment().unix()});`;

    return sq;
  }

  rpT():string {
    let sq =`replace into gtd_mk (mki ,si ,mkl ,mkt ,wtt ) values( "${this.mki}","${this.si}","${this.mkl}", "${this.mkt}", ${moment().unix()});`;

    return sq;
  }

}
