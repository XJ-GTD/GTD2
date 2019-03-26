import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class STbl implements ITbl   {

  si: string="";
  st: string="";
  stn: string="";
  sn: string="";
  yk: string="";
  yv: string="";



  cT():string {

    let sq ='create table if not exists gtd_s( si varchar(50) primary key ,st varchar(20)  ,' +
      'stn varchar(20)  ,sn varchar(20)  ,yk varchar(20)  ,yv varchar(400)   );';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.st!=null && this.st !=""){
      sq=sq+', st="' + this.st +'"';
    }
    if(this.stn!=null && this.stn!=""){
      sq=sq+', stn="' + this.stn +'"';
    }
    if(this.sn != null &&this.sn !=""){
      sq = sq + ', sn="' + this.sn +'"';
    }
    if(this.yk != null&&this.yk != ""){
      sq = sq + ', yk="' + this.yk +'"';
    }
    if(this.yv != null&&this.yv !=""){
      sq = sq + ', yv="' + this.yv +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_s set  '+ sq + ' where si = "'+ this.si +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_s where 1=1 ';
    if(this.si != null && this.si!=""){
      sq = sq + 'and  si ="' + this.si +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_s where si = "'+ this.si +'";';
    return sq;
  }

  slT():string
  {
    let sq='select * from  gtd_s where  1=1 ';
    if(this.st!=null && this.st!=""){
      sq=sq+' and st="' + this.st +'"';
    }
    if(this.stn!=null && this.stn!=""){
      sq=sq+' and stn="' + this.stn +'"';
    }
    if(this.sn != null && this.sn != ""){
      sq = sq + ' and sn="' + this.sn +'"';
    }
    if(this.yk != null && this.yk != ""){
      sq = sq + ' and yk="' + this.yk +'"';
    }
    if(this.yv != null && this.yv != ""){
      sq = sq + ' and yv="' + this.yv +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_s;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_s ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ this.si+'","'+ this.st+'","'+this.stn+ '"' +
      ',"'+this.sn+ '","'+this.yk+ '","'+this.yv+ '");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_s ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ this.si+'","'+ this.st+'","'+this.stn+ '"' +
      ',"'+this.sn+ '","'+this.yk+ '","'+this.yv+ '");';

    return sq;
  }
  clp(){
    this.si ="";
    this.st ="";
    this.stn ="";
    this.sn ="";
    this.yk ="";
    this.yv ="";
  }
}

