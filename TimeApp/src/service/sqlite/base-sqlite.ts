import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Platform , Events } from 'ionic-angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import * as moment from "moment";
import { UEntity } from "../../entity/u.entity";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {RuEntity} from "../../entity/ru.entity";
import {LbEntity} from "../../entity/lb.entity";
import {ReEntity} from "../../entity/re.entity";
import {StEntity} from "../../entity/st.entity";
import {ZtEntity} from "../../entity/zt.entity";
import {ZtdEntity} from "../../entity/ztd.entity";
import {MsEntity} from "../../entity/ms.entity";
import {RguEntity} from "../../entity/rgu.entity";
import {JhEntity} from "../../entity/jh.entity";
import {FiEntity} from "../../entity/fi.entity";
import {UtilService} from "../util-service/util.service";
import {BsModel} from "../../model/out/bs.model";
import {DataConfig} from "../../app/data.config";

/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class BaseSqlite {
  className:String = 'BaseSqlite';
  database: SQLiteObject;
  win: any = window;//window对象
  constructor( private platform: Platform,
               private sqlite: SQLite,
               private util: UtilService,
               private sqlitePorter: SQLitePorter,
               private events: Events) { }
  /**
   * 创建数据库
   */
  createDb(): Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      console.log(this.className + " start create Db mingWX.db")
      if (this.isMobile()) {
        this.sqlite.create({
          name: 'mingWX.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          console.log(this.className + " create Db success")
          this.database = db;
          resolve(bs)
        }).catch(e => {
          console.log(this.className + " create Db fail：" + e.message)
          this.events.publish('db:create');
          bs.code=1
          resolve(bs);
        });
      } else {
        //H5数据库存储
        this.database = this.win.openDatabase("mingWX.db", '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
        console.log(this.className + " create Db success")
        resolve(bs)
      }
      //alert('创建数据成功！')
    });
  }

  /**
   * 查询FI表是否存在
   * @returns {Promise<BsModel>} code 0正常打开，1报错暂无表，2无版本数据3，更新后首次打开
   */
  isFi(): Promise<BsModel> {
    return new Promise((resolve, reject) => {
        let bs=new BsModel();
        let code = 1;//表不存
        let sql="SELECT * FROM sqlite_master where type='table' and name='GTD_FI'"
        //1.先查询表是否存在
        this.executeSql(sql,[]).then(data=>{
          if(data && data.rows && data.rows.length>0){
            console.log(this.className + " fi is exist")
            let sql1="SELECT * FROM GTD_FI where id=1";
            code = 0;//表存在
            //2.查询GTD_FI表信息
            return this.executeSql(sql,[])
          }else{
            console.error(this.className + "isFi()  GTD_FI is not exist")
            code=1;
          }
        }).then(data=>{
          if(code==0){
            if(data && data.rows && data.rows.length>0){
              if(data.rows.item(0).isup && data.rows.item(0).isup != 0){
                console.log(this.className + " isFi()  GTD_FI is update")
                code=3;//更新后首次打开进入引导页
              }else{
                code=0;//无更新
              }
            }else{
              console.log(this.className + "isFi()  GTD_FI data is null")
              code = 2;//无数据
            }
          }
          DataConfig.isFirst= code;
          bs.code=code;
          resolve(bs)
        }).catch(e=>{
          console.error(this.className + " isFi() is Error:" + e.message)
          bs.code=1
          bs.message=e.message;
          DataConfig.isFirst= bs.code;
          resolve(bs)
        })
    })
  }

  /**
   * 创建/更新表
   * @param {string} updateSql 更新SQL
   * @returns {Promise<any>}
   */
   createOrUpdateTable(updateSql:string): Promise<any> {
    return new Promise((resolve, reject) => {
      //初始化建表
      if(DataConfig.isFirst != 0){
        //初始化建表
        console.log(this.className + "createTable：数据库初始化建表开始")
        //判断是否是手机端
        if (this.isMobile()) {
          //1先删除表
          let delsql = new UEntity().drsq + new RcEntity().drsq + new RcpEntity().drsq + new RuEntity().drsq
            + new LbEntity().drsq + new ReEntity().drsq + new StEntity().drsq + new MsEntity().drsq
            + new ZtEntity().drsq + new ZtdEntity().drsq + new JhEntity().drsq + new RguEntity().drsq
            + new FiEntity().drsq;
          //再建表
          this.importSqlToDb(delsql).then(data=>{
            console.log("-------------------BaseSqlite createTable delete table success: "+JSON.stringify(data))
            let insertsql = new UEntity().csq + new RcEntity().csq + new RcpEntity().csq + new RuEntity().csq
              + new LbEntity().csq + new ReEntity().csq + new StEntity().csq + new MsEntity().csq
              + new ZtEntity().csq + new ZtdEntity().csq + new JhEntity().csq + new RguEntity().csq
              + new FiEntity().csq;
            return  this.importSqlToDb(insertsql)
          }).then(data=>{
            console.log("-------------------BaseSqlite createTable success: "+JSON.stringify(data))
            resolve(data);
          }).catch(e=>{
            console.error("------------------BaseSqlite createTable error: "+e.message)
            reject(e)
          })
        } else {
          let str = 'GTD_A;'
          //创建用户
          let ue = new UEntity();
          this.executeSql(ue.csq, []).then(data => {
            //创建日程表
            let rc = new RcEntity();
            str+="GTD_C;";
            return  this.executeSql(rc.csq, [])
          }).then(data=>{
            //创建日程参与人表
            let rcp = new RcpEntity();
            str+="GTD_D;";
            return this.executeSql(rcp.csq, [])
          }).then(data=>{
            //授权联系人表
            let ru = new RuEntity();
            str+="GTD_B;";
            return this.executeSql(ru.csq, [])
          }).then(data=>{
            //群组关联人
            let rgu = new RguEntity();
            str+="GTD_B_X;";
            return this.executeSql(rgu.csq, [])
          }).then(data=>{
            //标签表
            let lb = new LbEntity();
            str+="GTD_F;";
            return this.executeSql(lb.csq, [])
          }).then(data=>{
            // 提醒时间表
            let re = new ReEntity();
            str+="GTD_E;";
            return this.executeSql(re.csq, [])
          }).then(data=>{
            // 系统设置表
            let st = new StEntity();
            str+="GTD_G;";
            return this.executeSql(st.csq, [])
          }).then(data=>{
            // massage
            let ms = new MsEntity();
            str+="GTD_H;";
            return this.executeSql(ms.csq, [])
          }).then(data=>{
            // 字典类型表
            let zt = new ZtEntity();
            str+="GTD_X;";
            return this.executeSql(zt.csq, [])
          }).then(data=>{
            // 字典数据表
            let ztd = new ZtdEntity();
            str+="GTD_Y;";
            return this.executeSql(ztd.csq, [])
          }).then(data=>{
            // 计划表
            let jh = new JhEntity();
            str+="GTD_J_H;";
            return this.executeSql(jh.csq, [])
          }).then(data=>{
            // 版本表
            let fi = new FiEntity();
            str+="GTD_FI";
            return this.executeSql(fi.csq, [])
          }).then(data=>{
            console.log("-------------------BaseSqlite createTable success: "+str)
            resolve(data)
          }).catch(e=>{
            console.error("basesqlite createTable Error : "+e.message);
            reject(e)
          })
        }
      }else{
        let bs = new BsModel();
        console.log(this.className + "createTable：数据库表已存在")
        resolve(bs);
      }

    })
  }
  /**
   * 更新表
   */
  updateTable(data:BsModel): Promise<any> {
    return new Promise((resolve, reject) => {

    })
  }

  /**
   * 初始化数据
   * @param {BsModel} data
   * @returns {Promise<any>}
   */
  initData(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(DataConfig.isFirst!=0){
        console.log("-------------------BaseSqlite initData table  data to start ------------------")
        //版本表
        let fi = new FiEntity();
        fi.id = 1;
        fi.firstIn = 1;
        fi.isup = 0;
        //用户表
        let u: UEntity = new UEntity();
        u.uI = this.util.getUuid();
        u.uty = '0';
        if(this.isMobile()){
          //手机端
          let sql=fi.isq+u.isq;
          this.importSqlToDb(sql).then(data=>{
            console.log("-------------------BaseSqlite initData  GTD_A and GTD_FI table to data: "+JSON.stringify(data))
            let data1 = new Array();
            this.initlb(data1);
            resolve(data)
          }).catch(e=>{
            console.error("------------------BaseSqlite initData to table data: "+e.message)
            reject(e)
          })
        }else{
          //web端
          this.save(u).then(data=>{
            console.log("-------------------BaseSqlite initData GTD_A to table data: "+JSON.stringify(data))
            return this.save(fi)
          }).then(data=>{
            console.log("-------------------BaseSqlite initData GTD_FI to table data: "+JSON.stringify(data))
            resolve(data)
          }).then(data=>{
            let data1 = new Array();
            this.initlb(data1);
          }).catch(e=>{
            console.error("------------------BaseSqlite createTable: "+e.message)
            reject(e)
          })
        }
      }else{
        console.log("-------------------BaseSqlite initData table data is exsit ------------------")
        let bs = new BsModel();
        resolve(bs)
      }
    })
  }

  /**
   * 批量语句
   */
  importSqlToDb(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then((count) => {
          console.log('Imported');
          //alert("Imported" + count);
          resolve(count);
        })
        .catch((error)=> {
          console.error(error);
          alert(this.className+"sql执行错误:"+error.message);
          reject(error)
        });
    });
  }

  /**
   * 执行语句
   */
  executeSql(sql: string, array: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.transaction(function(tx) {
        tx.executeSql(sql, array,  (tx, res)=>{
          resolve(res);
        }, (tx, err) =>{
          console.log('error: ' + err.message);
          console.log("sql: "+sql)
          reject(err);
        });
      });

    });
  }


  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile():boolean{
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 保存
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  save(et:any){
    return this.executeSql(et.isq,[])
  }
  /**
   * 更新
   */
  update(et:any){
    return this.executeSql(et.usq,[])

  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(et:any){
    return this.executeSql(et.dsq,[])
  }

  /**
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getOne(et:any){
    return this.executeSql(et.qosq,[])
  }

  /**
   * 生成本地测试日历数据
   */
  addRctest(): Promise<any> {
    let sql = "";

    let ii = 1;
    let mo = moment();
    return new Promise((resolve, reject) => {

      while (ii < 3000) {


        mo = mo.add(5, "h");

        sql = sql + "INSERT INTO GTD_D(pI,son,uI) " +
          "VALUES ( '" + mo.format("YYYY-MM-DD hh:mm:ss SSS") + "','加上5个小时');";
        ii += 1;
      }


      mo = moment();
      ii= 0;
      while (ii < 3000) {


        mo = mo.subtract(5, "h");
        sql = sql + "INSERT INTO GTD_D(pI,son,uI) " +
          "VALUES ( '" + mo.format("SSS YYYY-MM-DD hh:mm:ss") + "','减去5个小时');";
        ii += 1;
      }

      this.importSqlToDb(sql,).then((data) => {
        resolve("添加完成，总数据量为：" + ii);
      }).catch((err) => {
          resolve(err.toString());
        }
      )


    })
  }
  initlb(data:any){
    data.push({lai:'BQA01',lat:'BQA',lan:'任务'});
    data.push({lai:'BQB01',lat:'BQB',lan:'生活'})
    data.push({lai:'BQB02',lat:'BQB',lan:'工作'})
    data.push({lai:'BQC01',lat:'BQC',lan:'聚会'})
    data.push({lai:'BQC02',lat:'BQC',lan:'会议'})
    data.push({lai:'BQC03',lat:'BQC',lan:'事件'})
    data.push({lai:'BQC04',lat:'BQC',lan:'预约'})
    data.push({lai:'BQC05',lat:'BQC',lan:'运动'})
    data.push({lai:'BQD01',lat:'BQD',lan:'特殊日期'})
    data.push({lai:'BQD02',lat:'BQD',lan:'法定假日'})
    data.push({lai:'BQE01',lat:'BQE',lan:'里程碑'})
    data.push({lai:'BQE02',lat:'BQE',lan:'随手记'})
    data.push({lai:'BQE03',lat:'BQE',lan:'记账'})

    for(let i=0;i<data.length;i++){
      /*let sql = 'insert into GTD_F (lai,lan,lat) select "'+ data[i].lai +'","'+ data[i].lan +'","'+ data[i].lat +'" ' +
        'where not exists (select lai,lan,lat from GTD_F)'
      this.executeSql(sql,[]).then(data=>{
        console.log(data)
      }).catch(e=>{
        console.log(e.message)
      })*/
      let lb=new LbEntity();
      lb.lai = data[i].lai;
      lb.lan = data[i].lan;
      lb.lat=data[i].lat;
      this.save(lb);
    }
  }

}
