/**
 * create by on 2018/11/19
 */

//标签表
export class SyncEntity {

  private _id: number;   //主键
  private _tableName: string=''; //表名
  private _action: string=''; //执行类型0添加,1更新,2删除
  private _tableA: string='';//名称
  private _tableB: string='';//名称
  private _tableC: string='';//名称
  private _tableD: string='';//名称
  private _tableE: string='';//名称
  private _tableF: string='';//名称
  private _tableG: string='';//名称
  private _tableH: string='';//名称
  private _tableI: string='';//名称
  private _tableJ: string='';//名称
  private _tableK: string='';//名称
  private _tableL: string='';//名称
  private _tableM: string='';//名称
  private _tableN: string='';//名称
  private _tableO: string='';//名称
  private _tableP: string='';//名称
  private _tableQ: string='';//名称
  private _tableR: string='';//名称
  private _tableS: string='';//名称
  private _tableT: string='';//名称
  private _tableU: string='';//名称
  private _tableV: string='';//名称
  private _tableW: string='';//名称
  private _tableX: string='';//名称
  private _tableY: string='';//名称
  private _tableZ: string='';//名称
    /*
     * 创建表
     * @type {string}
     * @private
     */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_S_Y(id INTEGER PRIMARY KEY AUTOINCREMENT,' +
                          'tableName VARCHAR(100) NOT NULL,action VARCHAR(100),tableA VARCHAR(100),tableB VARCHAR(100),' +
                          'tableC VARCHAR(100),tableD VARCHAR(100),tableE VARCHAR(100),tableF VARCHAR(100),' +
                          'tableG VARCHAR(100),tableH VARCHAR(100),tableI VARCHAR(100),tableJ VARCHAR(100),' +
                          'tableK VARCHAR(100),tableL VARCHAR(100),tableM VARCHAR(100),tableN VARCHAR(100),' +
                          'tableO VARCHAR(100),tableP VARCHAR(100),tableQ VARCHAR(100),tableR VARCHAR(100),' +
                          'tableS VARCHAR(100),tableT VARCHAR(100),tableU VARCHAR(100),tableV VARCHAR(100),' +
                          'tableW VARCHAR(100),tableX VARCHAR(100),tableY VARCHAR(100),tableZ VARCHAR(100));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_S_Y;";

  private _isq:string;


  get isq(): string {
    let field = 'tableName,action,tableA,tableB,tableC,tableD,tableE,tableF,tableG,tableH,tableI,tableJ,' +
      'tableK,tableL,tableM,tableN,tableO,tableP,tableQ,tableR,' +
      'tableS,tableT,tableU,tableV,tableW,tableX,tableY,tableZ';
    let sql='insert into GTD_S_Y ' +
      '('+field+') values("'+ this._tableName+'",'+ this._action+',"'+ this._tableA+'","'+this._tableB+
      '","'+ this._tableC+'","'+ this._tableD+'","'+ this._tableE+'","'+this._tableF+'","'+ this._tableG+
      '","'+ this._tableH+'","'+ this._tableI+'","'+ this._tableJ+'","'+this._tableK+'","'+ this._tableL+
      '","'+ this._tableM+'","'+ this._tableN+'","'+ this._tableO+'","'+this._tableP+'","'+ this._tableQ+
      '","'+ this._tableR+'","'+ this._tableS+'","'+ this._tableT+'","'+this._tableU+'","'+ this._tableV+
      '","'+ this._tableW+'","'+ this._tableX+'","'+ this._tableY+'","'+this._tableZ+'");';
    if(this._tableA && this._tableA != '' && this._tableA !=null){
      this._isq=sql;
    }else{
      this._isq = '';
      console.error("本同步数据TableA为空："+sql);
    }

    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }


  get csq(): string {
    return this._csq;
  }

  set csq(value: string) {
    this._csq = value;
  }

  get drsq(): string {
    return this._drsq;
  }

  set drsq(value: string) {
    this._drsq = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get tableName(): string {
    return this._tableName;
  }

  set tableName(value: string) {
    this._tableName = value;
  }

  get action(): string {
    return this._action;
  }

  set action(value: string) {
    this._action = value;
  }

  get tableA(): string {
    return this._tableA;
  }

  set tableA(value: string) {
    this._tableA = value;
  }

  get tableB(): string {
    return this._tableB;
  }

  set tableB(value: string) {
    this._tableB = value;
  }

  get tableC(): string {
    return this._tableC;
  }

  set tableC(value: string) {
    this._tableC = value;
  }

  get tableD(): string {
    return this._tableD;
  }

  set tableD(value: string) {
    this._tableD = value;
  }

  get tableE(): string {
    return this._tableE;
  }

  set tableE(value: string) {
    this._tableE = value;
  }

  get tableF(): string {
    return this._tableF;
  }

  set tableF(value: string) {
    this._tableF = value;
  }

  get tableG(): string {
    return this._tableG;
  }

  set tableG(value: string) {
    this._tableG = value;
  }

  get tableH(): string {
    return this._tableH;
  }

  set tableH(value: string) {
    this._tableH = value;
  }

  get tableI(): string {
    return this._tableI;
  }

  set tableI(value: string) {
    this._tableI = value;
  }

  get tableJ(): string {
    return this._tableJ;
  }

  set tableJ(value: string) {
    this._tableJ = value;
  }

  get tableK(): string {
    return this._tableK;
  }

  set tableK(value: string) {
    this._tableK = value;
  }

  get tableL(): string {
    return this._tableL;
  }

  set tableL(value: string) {
    this._tableL = value;
  }

  get tableM(): string {
    return this._tableM;
  }

  set tableM(value: string) {
    this._tableM = value;
  }

  get tableN(): string {
    return this._tableN;
  }

  set tableN(value: string) {
    this._tableN = value;
  }

  get tableO(): string {
    return this._tableO;
  }

  set tableO(value: string) {
    this._tableO = value;
  }

  get tableP(): string {
    return this._tableP;
  }

  set tableP(value: string) {
    this._tableP = value;
  }

  get tableQ(): string {
    return this._tableQ;
  }

  set tableQ(value: string) {
    this._tableQ = value;
  }

  get tableR(): string {
    return this._tableR;
  }

  set tableR(value: string) {
    this._tableR = value;
  }

  get tableS(): string {
    return this._tableS;
  }

  set tableS(value: string) {
    this._tableS = value;
  }

  get tableT(): string {
    return this._tableT;
  }

  set tableT(value: string) {
    this._tableT = value;
  }

  get tableU(): string {
    return this._tableU;
  }

  set tableU(value: string) {
    this._tableU = value;
  }

  get tableV(): string {
    return this._tableV;
  }

  set tableV(value: string) {
    this._tableV = value;
  }

  get tableW(): string {
    return this._tableW;
  }

  set tableW(value: string) {
    this._tableW = value;
  }

  get tableX(): string {
    return this._tableX;
  }

  set tableX(value: string) {
    this._tableX = value;
  }

  get tableY(): string {
    return this._tableY;
  }

  set tableY(value: string) {
    this._tableY = value;
  }

  get tableZ(): string {
    return this._tableZ;
  }

  set tableZ(value: string) {
    this._tableZ = value;
  }
}
