import {ITbl} from "./itbl";
import * as moment from "moment";
import {Data} from "@angular/router";

/**
 * create by on 2019/4/29
 */
export class LogTbl implements ITbl {

  id :string;

  //访问URL
  su:string;

  //访问时长
  ss:number;

  //访问类型 0 sqlite 1 restful 2 ws 3 其他
  t:number;

  //访问状态
  st:boolean;

  //错误日志
  er:string;

  //访问时间
  wtt :number=0;

  searchs:number;
  searche:number;



  cT():string {

    let sq =`create table if not exists gtd_log(id varchar(50) primary key,
      su varchar(255) ,ss integer ,t integer, st boolean,er varchar(255), wtt integer);`;
    return sq;
  }

  upT():string {
    let sq='';
    return sq;
  }

  dT():string {
    let sq = `delete from gtd_log where 1=1 `;
    if(this.id != null && this.id!=""){
      sq = sq + 'and  id ="' + this.id +'"';
    }
    sq = sq + ';';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_log;';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_log ';
    if(this.su != null && this.su!=""){
      sq = sq + ' and su="' + this.su +'"';
    }
    sq = sq + ';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_log;';
    return sq;
  }

  inT():string {
    let sq =`insert into gtd_log (id,su,ss,st,t,er,wtt) values('${this.id}','${this.su}',${this.ss},${this.st},${this.t},'${this.er?this.er:""}',${moment().valueOf()});`

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_log ' +
      '(id,su,ss,st,wtt) values("'+ this.id+'","'+ this.su+'","'+this.ss+ '"' +
      ',"'+this.st+ ',' +  moment().unix() +');';

    return sq;
  }

}

