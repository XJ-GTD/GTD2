/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import * as moment from "moment";


export class CTbl implements  ITbl{

  si: string="";
  sn: string="";
  ui: string="";
  sd: string="";
  st: string="";
  ed: string="";
  et: string="";
  rt: string="";
  ji: string="";
  sr: string ="";
  bz: string ="";
  tx: string ="";
  wtt: Number=0;
  pni: string ="";
  du:string="";
  //归属(gs)
  //0：本人创建
  //1：他人创建
  //2：系统本地日历
  //3: 系统计划优先级类型(不显示在日程一览)
  //4：系统计划无优先级(只显示在日程一览)
  //5: 备忘
  //6: 特殊数据（天气等,只在单日日程画面显示）
  gs:string = "";




  clp(){
    this.si = "";
    this.sn = "";
    this.ui = "";
    this.sd = "";
    this.st = "";
    this.ed = "";
    this.et = "";
    this.rt = "";
    this.ji = "";
    this.tx = "";
    this.pni= "";
    this.wtt= 0;
    this.du="";
  };

  cT():string {

    let sq =' create table if not exists gtd_c(  si varchar(50) primary key ,sn varchar(50)  ,ui varchar(50)  ,sd varchar(20)  ' +
      ',st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,rt varchar(4)  ,ji varchar(50),sr varchar(50),bz varchar(50),tx varcher(10),' +
      'wtt integer,pni varchar(50),du varchar(4),gs varchar(4));';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.sn!=null && this.sn!=""){
      sq=sq+', sn="' + this.sn +'"';
    }
    if(this.ui!=null && this.ui!=""){
      sq=sq+', ui="' + this.ui +'"';
    }
    if(this.sd != null && this.sd!=""){
      sq = sq + ', sd="' + this.sd +'"';
    }
    if(this.st != null && this.st!=""){
      sq = sq + ', st="' + this.st +'"';
    }
    if(this.ed != null && this.ed!=""){
      sq = sq + ', ed="' + this.ed +'"';
    }
    if(this.et != null && this.et!=""){
      sq = sq + ', et="' + this.et +'"';
    }
    if(this.rt != null && this.rt!=""){
      sq = sq + ', rt="' + this.rt +'"';
    }
    if(this.ji != null && this.ji!=""){
      sq = sq + ', ji="' + this.ji +'"';
    }
    if(this.sr != null && this.sr!=""){
      sq = sq + ', sr="' + this.sr +'"';
    }
    if(this.bz != null ){
      sq = sq + ', bz="' + this.bz +'"';
    }
    if(this.tx != null && this.tx!=""){
      sq = sq + ', tx="' + this.tx +'"';
    }
    if(this.pni != null && this.pni!=""){
      sq = sq + ', pni="' + this.pni +'"';
    }
    if(this.du != null && this.du!=""){
      sq = sq + ', du="' + this.du +'"';
    }
    if(this.gs != null && this.gs!=""){
      sq = sq + ', gs="' + this.gs +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_c set '+ sq + ' where si = "'+ this.si +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_c where 1=1 ';
    if(this.si != null && this.si!=""){
      sq = sq + 'and  si ="' + this.si +'"';
    }
    if(this.ji != null && this.ji!=""){
      sq = sq + 'and  ji ="' + this.ji +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_c where si = "'+ this.si +'";';

    if (this.si && this.si != "") {
      // 查询本地日程
      sq='select * from gtd_c where si = "'+ this.si +'";';
    } else if (this.sr && this.sr != "") {
      // 查询接收到的共享日程
      sq='select * from gtd_c where sr = "'+ this.sr +'";';
    }
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_c where  1=1 ';
    if(this.sn!=null && this.sn!=""){
      sq=sq+' and sn="' + this.sn +'"';
    }
    if(this.ui!=null && this.ui!=""){
      sq=sq+' and ui="' + this.ui +'"';
    }
    if(this.sd != null && this.sd!=""){
      sq = sq + ' and sd="' + this.sd +'"';
    }
    if(this.st != null && this.st!=""){
      sq = sq + ' and st="' + this.st +'"';
    }
    if(this.ed != null && this.ed!=""){
      sq = sq + ' and ed="' + this.ed +'"';
    }
    if(this.et != null && this.et!=""){
      sq = sq + ' and et="' + this.et +'"';
    }
    if(this.rt != null && this.rt!=""){
      sq = sq + ' and rt="' + this.rt +'"';
    }
    if(this.ji != null && this.ji!=""){
      sq = sq + ' and ji="' + this.ji +'"';
    }
    if(this.si != null && this.si!=""){
      sq = sq + ' and si="' + this.si +'"';
    }
    if(this.sr != null && this.sr!=""){
      sq = sq + ' and sr="' + this.sr +'"';
    }
    if(this.tx != null && this.tx!=""){
      sq = sq + ' and tx="' + this.tx +'"';
    }
    if(this.pni != null && this.pni!=""){
      sq = sq + ' and pni="' + this.pni +'"';
    }
    if(this.du != null && this.du!=""){
      sq = sq + ' and du="' + this.du +'"';
    }
    if(this.gs != null && this.gs!=""){
      sq = sq + ' and gs="' + this.gs +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_c;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_c ' +
      '( si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,bz,tx,wtt,pni,du,gs) values("'+ this.si+'","'+ this.sn+'","'+this.ui+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '","'+this.rt+ '","'+this.ji+ '"' +
      ',"'+this.sr+ '","'+this.nll2str(this.bz)+  '","'+this.nll2str(this.tx)+'",'+  moment().unix() + ',"'+this.pni+'","'+this.du+'"' +
      ',"'+this.gs+'");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_c ' +
      '( si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,bz,tx,wtt,pni,du,gs) values("'+ this.si+'","'+ this.sn+'","'+this.ui+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '","'+this.rt+ '","'+this.ji+ '"' +
      ',"'+this.sr+ '","'+this.nll2str(this.bz)+ '","' + this.nll2str(this.tx) + '",'+  moment().unix() +',"'+this.pni+'","'+this.du+'"' +
      ',"'+this.gs+'");';
    return sq;
  }
  nll2str(ob):any{
    if (ob == null || !ob ){
      return "";
    }else{
      return ob;
    }
  }
}
