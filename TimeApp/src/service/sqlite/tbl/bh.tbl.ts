/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import * as moment from "moment";


export class BhTbl implements ITbl{
  bhi:string="";
  pwi: string="";
  hiu:string="";
  wtt: number=0;


  cT():string {

    let sq =` create table if not exists gtd_bh( bhi varchar(50) primary key ,pwi varchar(50)  ,hiu TEXT  ,wtt integer );`;

    return sq;
  }

  upT():string {
    let sq='';
    if(this.hiu != null && this.hiu!=""){
      sq = sq + ', hiu="' + this.hiu +'"';
    }

    if(this.pwi != null && this.pwi!=""){
      sq = sq + ', pwi="' + this.pwi +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_bh set ' + sq + ' where bhi = "'+ this.bhi +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_bh where bhi = "' + this.bhi +'";';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_bh where 1=1 ';
    if(this.pwi != null && this.pwi!=""){
      sq = sq + 'and  bhi ="' + this.bhi +'"';
    }
    sq = sq + ';';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_bh where  1=1 ';
    if(this.pwi!=null && this.pwi!=""){
      sq=sq+' and pwi="' + this.pwi +'"';
    }
    if(this.bhi!=null && this.bhi!=""){
      sq=sq+' and bhi="' + this.bhi +'"';
    }

    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_bh;';
    return sq;
  }

  inT():string {
    let sq =`insert into gtd_bh (bhi ,pwi ,hiu,  wtt) values( '${this.bhi}','${this.pwi}','${this.hiu}', ${moment().unix()})`;

    return sq;
  }

  rpT():string {
    let sq =`replace into gtd_bh (bhi ,pwi ,hiu,  wtt) values( '${this.bhi}','${this.pwi}','${this.hiu}', ${moment().unix()})`;

    return sq;
  }

}



