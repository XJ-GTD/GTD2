import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 */
export class UTbl  implements ITbl{

  ui :string="";
  ai :string="";
  un :string="";
  hiu :string="";
  biy :string="";
  rn :string="";
  ic :string="";
  us :string="";
  uct :string="";
  rob :string="";
  wtt :number = 0;




  cT():string {

    let sq ='create table if not exists gtd_u( ui varchar(50) primary key ,ai varchar(50)  ,' +
      'un varchar(10)  ,hiu varchar(200)  ,biy varchar(10)  ,rn varchar(10)  ,ic varchar(20)  ,' +
      'us varchar(4)  ,uct varchar(11),wtt integer,rob varchar(4));';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.un!=null && this.un!=""){
      sq=sq+', un="' + this.un +'"';
    }
    if(this.hiu!=null && this.hiu!=""){
      sq=sq+', hiu="' + this.hiu +'"';
    }
    if(this.biy != null && this.biy!=""){
      sq = sq + ', biy="' + this.biy +'"';
    }
    if(this.rn != null && this.rn!=""){
      sq = sq + ', rn="' + this.rn +'"';
    }
    if(this.ic != null){
      sq = sq + ', ic="' + this.ic +'"';
    }
    if(this.us != null && this.us!=""){
      sq = sq + ', us="' + this.us +'"';
    }
    if(this.uct != null){
      sq = sq + ', uct="' + this.uct +'"';
    }
    if(this.rob != null){
      sq = sq + ', rob="' + this.rob +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_u set  ' + sq + ' where ui = "'+ this.ui +'";';

    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_u where 1=1 ';
    if(this.ui != null && this.ui!=""){
      sq = sq + 'and  ui ="' + this.ui +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_u where ui = "'+ this.ui +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_u where  1=1 ';
    if(this.hiu!=null && this.hiu!=""){
      sq=sq+' and hiu="' + this.hiu +'"';
    }
    if(this.biy != null && this.biy!=""){
      sq = sq + ' and biy="' + this.biy +'"';
    }
    if(this.rn != null && this.rn!=""){
      sq = sq + ' and rn="' + this.rn +'"';
    }
    if(this.ic != null && this.ic!=""){
      sq = sq + ' and ic="' + this.ic +'"';
    }
    if(this.us != null && this.us!=""){
      sq = sq + ', us="' + this.us +'"';
    }
    if(this.uct != null && this.uct!=""){
      sq = sq + ' and uct="' + this.uct +'"';
    }
    if(this.rob != null && this.rob!=""){
      sq = sq + ' and rob="' + this.rob +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_u;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_u ' +
      '( ui ,ai ,un ,hiu ,biy ,rn ,ic ,us ,uct,wtt,rob) values("'+ this.ui+'","'+ this.ai+'","'+this.un+ '"' +
      ',"'+this.hiu+ '","'+this.biy+ '","'+this.rn+ '","'+this.ic+ '","'+ this.us + '","'+this.uct+ '"' +
      ','+  moment().unix() +',"'+this.rob+ '");';
    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_u ' +
      '( ui ,ai ,un ,hiu ,biy ,rn ,ic ,us ,uct,wtt,rob) values("'+ this.ui+'","'+ this.ai+'","'+this.un+ '"' +
      ',"'+this.hiu+ '","'+this.biy+ '","'+this.rn+ '","'+this.ic+ '","'+ this.us + '","'+this.uct+ '"' +
      ','+  moment().unix() +',"'+this.rob+ '");';

    return sq;
  }

  preT():string {
    let sq ='insert into gtd_u ' +
      '( ui ,ai ,un ,hiu ,biy ,rn ,ic ,us ,uct,wtt,rob) values(?, ?, ?, ?, ?, ?, ?, ?, ?, '+  moment().unix() +',?);';
    return sq;
  }
}
