import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {AgdPro, AgdRestful, ContactPerPro} from "../../service/restful/agdsev";
import {BsModel} from "../../service/restful/out/bs.model";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {UtilService} from "../../service/util-service/util.service";

@Injectable()
export class FsService {
  constructor(private sqlite:SqliteExec, private agdRest : AgdRestful, private util : UtilService) {
  }

  //根据条件查询参与人
  getfriend(fs:PageFsData):Promise<Array<PageFsData>>{
    return new Promise<Array<PageFsData>>((resolve, reject)=>{
      //获取本地参与人
      let fsList =  new Array<PageFsData>();
      let sql = 'select * from gtd_b where rc like "'+fs.rc+'%" or rn like "%'+fs.rn+ '%" or ran like "%'+fs.ran+'%"';
      console.log('---------- getfriend 根据条件查询参与人 条件:'+ JSON.stringify(sql));
      this.sqlite.getExtList<PageFsData>(sql).then(data=>{
        fsList = data;
        console.log('---------- getfriend 根据条件查询参与人 结果:'+ JSON.stringify(data));
        resolve(fsList);
      }).catch(e=>{
        console.log('---------- getfriend 根据条件查询参与人 错误:'+ e.message);
        resolve(fsList);
      })

    })
  }

  /**
   * 获取分享日程的参与人
   * @param {string} calId 日程ID
   * @returns {Promise<Array<PageFsData>>}
   */
  getCalfriend(calId:string):Promise<Array<PageFsData>>{
    return new Promise<Array<PageFsData>>((resolve, reject)=>{
      let sql ='select gd.pi,gd.si,gb.* from gtd_d gd inner join gtd_b gb on gb.pwi = gd.ai where si="'+calId+'"';
      let fsList =  new Array<PageFsData>();
      console.log('---------- getCalfriend 获取分享日程的参与人 sql:'+ sql);
      this.sqlite.execSql(sql).then(data=>{
        if(data && data.rows && data.rows.length>0){
          for(let i=0,len =data.rows.length;i<len;i++ ){
            fsList.push(data.rows.item(i))
          }
        }
        console.log('---------- getCalfriend 获取分享日程的参与人结果:'+ JSON.stringify(fsList));
        resolve(fsList);
      }).catch(e=>{
        console.error('---------- getCalfriend 获取分享日程的参与人出错:'+ e.message);
        resolve(fsList);
      })
    })
  }

  /**
   * 分享给参与人操作
   * @param {string} si 日程ID
   * @param {Array<PageFsData>} fsList 日程参与人列表
   * @returns {Promise<Array<PageFsData>>}
   */
  sharefriend(si:string,fsList:Array<PageFsData>):Promise<BsModel<any>>{
    return new Promise<BsModel<any>>((resolve, reject)=>{
      let bs = new BsModel<any>();
      //restFul 通知参与人
      let adgPro:AgdPro = new AgdPro();
      adgPro.ai=si;
      let ac:Array<ContactPerPro> =new Array<ContactPerPro>();
      for(let fs of fsList){
        let con = new ContactPerPro();
        con.ai = fs.ui;
        con.mpn =fs.rc;
        con.a = fs.hiu;
        con.n = fs.rn;
        ac.push(con);
      }
      adgPro.ac = ac;
      console.log('---------- sharefriend 分享给参与人操作 参数:'+ JSON.stringify(adgPro));
      this.agdRest.contactssave(adgPro).then(data=>{
        bs = data;
        console.log('---------- sharefriend 分享给参与人操作 结果:'+ JSON.stringify(data));
        if(bs.code == 0){
          let sq = 'delete from gtd_d where si = "' +si +'";';
          console.log('---------- sharefriend 分享给参与人操作 删除原参与人 ---------');
          return this.sqlite.execSql(sq);
        }
      }).then(data=>{
        let dtList = new Array<string>();
        for(let fs of fsList){
          let dt = new DTbl();
          dt.pi = this.util.getUuid();
          dt.ai = fs.pwi;
          dt.si = si;
          dtList.push(dt.inT());
        }
        console.log('---------- sharefriend 分享给参与人操作 保存参与人 ---------'+ JSON.stringify(data));
        return this.sqlite.batExecSql(dtList);
      }).then(data=>{
        console.log('---------- sharefriend 分享给参与人操作 保存参与人结束 ---------'+ JSON.stringify(data));
        resolve(bs);
      }).catch(e=>{
        console.error('---------- sharefriend 分享给参与人操作 保存参与人错误 ---------'+ e.message);
        resolve(bs);
      })
    })
  }

  //查询群组中的参与人
  getfriendgroup(groupId:string):Promise<Array<PageFsData>>{
    return new Promise<Array<PageFsData>>((resolve, reject)=>{
      //查询本地群组中的参与人
      let sql ='select gb.* from gtd_b_x gbx inner join gtd_b gb on gb.pwi = gbx.bmi where gbx.bi="'+groupId+'"';
      let fsList =  new Array<PageFsData>();
      console.log('---------- getfriend4group 查询群组中的参与人 sql:'+ sql);
      this.sqlite.execSql(sql).then(data=>{
        if(data && data.rows && data.rows.length>0){
          for(let i=0,len =data.rows.length;i<len;i++ ){
            fsList.push(data.rows.item(i))
          }
        }
        console.log('---------- getfriend4group 查询群组中的参与人 结果:'+ JSON.stringify(fsList));
        resolve(fsList);
      }).catch(e=>{
        console.error('---------- getfriend4group 查询群组中的参与人 出错:'+ e.message);
        resolve(fsList);
      })
    })
  }
}

/**
 * 联系人视图
 */
export class PageFsData {
  pi: string=""; //日程参与人表ID
  si: string=""; //日程事件ID
  pwi: string=""; //授权表主键
  ran: string=""; //被授权联系人别称
  ranpy: string=""; //被授权联系人别称拼音
  hiu: string="";  // 被授权联系人头像
  rn: string="";  // 被授权联系人名称
  rnpy: string="";  //被授权联系人名称拼音
  rc: string="";  //被授权联系人联系方式
  rel: string=""; //授权联系类型 1是个人，2是群，0未注册用户
  ui: string="";  //数据归属人ID
}

