/**
 * create by on 2019/3/5
 */
export class ETbl  {
  private _wI: string;
  private _sI: string;
  private _sT: string;
  private _wD: string;
  private _wT: string;

  get wI(): string {
    return this._wI;
  }

  set wI(value: string) {
    this._wI = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get sT(): string {
    return this._sT;
  }

  set sT(value: string) {
    this._sT = value;
  }

  get wD(): string {
    return this._wD;
  }

  set wD(value: string) {
    this._wD = value;
  }

  get wT(): string {
    return this._wT;
  }

  set wT(value: string) {
    this._wT = value;
  }

  clp(){
    this._wI=null;
    this._sI=null;
    this._sT=null;
    this._wD=null;
    this._wT=null;
  };

  cT():string{

    let sq ='CREATE TABLE IF NOT EXISTS GTD_E(  wI varchar(50) PRIMARY KEY ,sI varchar(50)  ,' +
      'sT varchar(50)  ,wD varchar(20)  ,wT varchar(20))';

    return sq;
  }

  upT():string{
    let sq='update GTD_E set 1=1 ';
    if(this._sI!=null){
      sq=sq+', sI="' + this._sI +'"';
    }
    if(this._sT!=null){
      sq=sq+', sT="' + this._sT +'"';
    }
    if(this._wD != null){
      sq = sq + ', wD="' + this._wD +'"';
    }
    if(this._wT != null){
      sq = sq + ', wT="' + this._wT +'"';
    }
    sq = sq + ' where wI = "'+ this._wI +'"';
    return sq;
  }

  dT():string{
    let sq = 'delete from GTD_E where wI = "' + this._wI +'"';
    return sq;
  }

  sloT():string{
    let sq='select * from GTD_E where wI = "'+ this._wI +'"';

    return sq;
  }

  slT():string{
    let sq='select * from  GTD_E where  1=1 ';
    if(this._sI!=null){
      sq=sq+' and sI="' + this._sI +'"';
    }
    if(this._sT!=null){
      sq=sq+' and sT="' + this._sT +'"';
    }
    if(this._wD != null){
      sq = sq + ' and wD="' + this._wD +'"';
    }
    if(this._wT != null){
      sq = sq + ' and wT="' + this._wT +'"';
    }
    return sq;
  }

  drT():string{

    let sq ='DROP TABLE IF EXISTS GTD_E;';
    return sq;
  }

  inT():string{
    let sq ='insert into GTD_E ' +
      '(  wI ,sI ,sT ,wD ,wT) values("'+ this._wI+'","'+ this._sI+'","'+this._sT+ '"' +
      ',"'+this._wD+ '","'+this._wT+ '")';

    return sq;
  }

  rpT():string{
    let sq ='replace into GTD_E ' +
      '(  wI ,sI ,sT ,wD ,wT) values("'+ this._wI+'","'+ this._sI+'","'+this._sT+ '"' +
      ',"'+this._wD+ '","'+this._wT+ '")';

    return sq;
  }

}
