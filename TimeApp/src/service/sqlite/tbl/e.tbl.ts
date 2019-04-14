import {ITbl} from "./itbl";
import * as moment from 'moment';

/**
 * create by on 2019/3/5
 */
export class ETbl implements ITbl {

  wi: string = "";
  si: string = "";
  st: string = "";
  wd: string = "";
  wt: string = "";
  wtt: number;


  cT(): string {

    let sq = 'create table if not exists gtd_e(  wi varchar(50) primary key ,si varchar(50)  ,' +
      'st varchar(50)  ,wd varchar(20)  ,wt varchar(20) ,wtt integer);';

    return sq;
  }

  upT(): string {
    let sq = '';
    if (this.si != null && this.si != "") {
      sq = sq + ', si="' + this.si + '"';
    }
    if (this.st != null && this.st != "") {
      sq = sq + ', st="' + this.st + '"';
    }
    if (this.wd != null && this.wd != "") {
      sq = sq + ', wd="' + this.wd + '"';
    }
    if (this.wt != null && this.wt != "") {
      sq = sq + ', wt="' + this.wt + '"';
    }
    sq = sq + ', wtt=' + moment().unix();
    if (sq != null && sq != "") {
      sq = sq.substr(1);
    }
    sq = 'update gtd_e set  ' + sq + ' where wi = "' + this.wi + '";';
    return sq;
  }

  dT(): string {
    console.log("111111111111111111111");
    let sq = 'delete from gtd_e where 1=1 ';

    console.log("111111111111111111112");
    if (this.wi != null && this.wi != "") {

      console.log("111111111111111111113");
      sq = sq + 'and  wi ="' + this.wi + '"';
    }

    console.log("111111111111111111114");
    if(this.si != null && this.si!=""){
      console.log("111111111111111111115");
      sq = sq + 'and  si ="' + this.si +'"';
    }

    console.log("111111111111111111116");
    sq = sq + ';'

    console.log("111111111111111111117");
    console.log(sq);
    return sq;
  }

  sloT(): string {
    let sq = 'select * from gtd_e where wi = "' + this.wi + '";';

    return sq;
  }

  slT(): string {
    let sq = 'select * from  gtd_e where  1=1 ';
    if (this.si != null && this.si != "") {
      sq = sq + ' and si="' + this.si + '"';
    }
    if (this.st != null && this.st != "") {
      sq = sq + ' and st="' + this.st + '"';
    }
    if (this.wd != null && this.wd != "") {
      sq = sq + ' and wd="' + this.wd + '"';
    }
    if (this.wt != null && this.wt != "") {
      sq = sq + ' and wt="' + this.wt + '"';
    }
    sq = sq + ';';
    return sq;
  }

  drT(): string {

    let sq = 'drop table if exists gtd_e;';
    return sq;
  }

  inT(): string {
    let sq = 'insert into gtd_e ' +
      '(  wi ,si ,st ,wd ,wt,wtt) values("' + this.wi + '","' + this.si + '","' + this.st + '"' +
      ',"' + this.wd + '","' + this.wt + '",' + moment().unix() + ');';

    return sq;
  }

  rpT(): string {
    let sq = 'replace into gtd_e ' +
      '(  wi ,si ,st ,wd ,wt,wtt) values("' + this.wi + '","' + this.si + '","' + this.st + '"' +
      ',"' + this.wd + '","' + this.wt + '",' + moment().unix() + ');';

    return sq;
  }

}
