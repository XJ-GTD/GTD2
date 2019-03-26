/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";


export class BxTbl implements ITbl{

  bi: string="";
  bmi: string="";



  cT():string {

    let sq ='create table if not exists gtd_b_x( bi varchar(50) ,bmi varchar(50));';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.bmi!=null && this.bmi!=""){
      sq=sq+', bmi="' + this.bmi +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_b_x set  '+ sq + ' where bi = "'+ this.bi +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_b_x where 1=1 ';
    if(this.bi != null && this.bi!=""){
      sq = sq + 'and  bi ="' + this.bi +'"';
    }
    if(this.bmi != null && this.bmi!=""){
      sq = sq + 'and  bmi ="' + this.bmi +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_b_x where bi = "'+ this.bi +'";';
    return sq;
  }

  slT():string {
    let sq='select * from gtd_b_x where  1=1 ';
    if(this.bmi!=null && this.bmi!=""){
      sq=sq+' and bmi="' + this.bmi +'"';
    }
    if(this.bi!=null && this.bi!=""){
      sq=sq+' and bi="' + this.bi +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_b_x;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_b_x ' +
      '(  bi ,bmi) values("'+ this.bi+'","'+ this.bmi+'");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_b_x ' +
      '(  bi ,bmi) values("'+ this.bi+'","'+ this.bmi+'");';

    return sq;
  }

}
