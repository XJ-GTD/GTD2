import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import {UserConfig} from "../config/user.config";
import * as moment from "moment";
import {EmitService} from "../util-service/emit.service";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import {DataRestful, PullInData, PushInData, SyncData, SyncDataFields, UploadInData, DownloadInData} from "../restful/datasev";
import {CompleteState, InviteState, SyncDataSecurity, PullType, SyncDataStatus, SyncType} from "../../data.enum";
import {
  assertNotNumber,
  assertEmpty,
  assertFail
} from "../../util/util";
import {AtTbl} from "../sqlite/tbl/at.tbl";
import {Member} from "./event.service";
import * as anyenum from "../../data.enum";
import {MemoData} from "./memo.service";

@Injectable()
export class AnnotationService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private emitService:EmitService,
              private bacRestful: BacRestful,private userConfig: UserConfig,
              private dataRestful: DataRestful) {
    super();
    moment.locale('zh-cn');
  }

  /**
   * 接收@参与人信息
   *
   * @param {Array<Annotation>} pullAnnotations
   * @param {SyncDataStatus} status
   * @returns {Promise<Array<Annotation>>}
   */
  async receivedAnnotationData(pullAnnotations: Array<Annotation>, status: SyncDataStatus, extension: string): Promise<Array<Annotation>> {
    this.assertEmpty(pullAnnotations);     // 入参不能为空
    this.assertEmpty(status);   // 入参不能为空

    let sqlparam = new Array<any>();

    let saved: Array<Annotation> = new Array<Annotation>();

    if (pullAnnotations && pullAnnotations !=null ){
      for (let j = 0 , len = pullAnnotations.length; j < len ; j++){
        let annotation = new  Annotation();
        Object.assign(annotation, pullAnnotations[j]);

        annotation.tb = SyncType.synch;
        if (UserConfig.account.id == annotation.ui){
          annotation.gs = anyenum.GsType.self;
        }else{
          annotation.ati = this.util.getUuid();
          annotation.gs = anyenum.GsType.him;
          annotation.rc = "";
        }

        let at = new AtTbl();
        Object.assign(at,annotation);
        sqlparam.push(at.rpTParam());
        saved.push(annotation);
      }

      await this.sqlExce.batExecSqlByParam(sqlparam);
    }

    if (extension != PullType.Full) {
      this.emitService.emit("mwxing.calendar.datas.readwrite", {rw: "write", payload: saved});
    }

    return saved;

  }

  /**
   * 完成@信息同步,更新@信息同步状态
   *
   * @author leon_xi@163.com
   */
  async acceptSyncAnnotation(ids: Array<string>) {
    let sqls: Array<any> = new Array<any>();

    let sql: string = `update gtd_at set tb = ? where obt = ? and  obi || dt in ('` + ids.join(`', '`) + `')`;

    sqls.push([sql, [SyncType.synch, anyenum.ObjectType.Event]]);

    await this.sqlExce.batExecSqlByParam(sqls);

  }

  /**
   * 接收@数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedAnnotation(id: any) {

    this.assertEmpty(id);   // 入参不能为空

    let pull: PullInData = new PullInData();

    if (id instanceof Array) {
      pull.type = "Annotation";
      pull.d.splice(0, 0, ...id);
    } else {
      pull.type = "Annotation";
      pull.d.push(id);
    }

    // 发送下载日程请求
    await this.dataRestful.pull(pull);

    return;
  }


  /**
	 * 发送@信息
   *
	 * @author leon_xi@163.com
	 */
  async sendAnnotation(annotation: Annotation) {
    this.assertEmpty(annotation);  // 入参不能为空
    await this.syncAnnotation([annotation]);
    return ;
  }

  /**
   * 同步全部的未同步的@信息/指定@信息到服务器
   *
   * @author leon_xi@163.com
   */
  async syncAnnotation(annotations: Array<Annotation>= new Array<Annotation>()) {

    let groupanno :Array<Annotation>;
    let listanno :Array<Annotation>;
    if (annotations.length <= 0 ){
      let sql: string = ` select * from gtd_at where obt = ?1 and tb = ?2 ;`;
      listanno = await this.sqlExce.getExtLstByParam<Annotation>(sql, [anyenum.ObjectType.Event, SyncType.unsynch]) ;

      let sql2:string = ` select obi ,dt from gtd_at where obt =?1 and tb=?2 group by obi ,dt ;`;
      groupanno = await this.sqlExce.getExtLstByParam<Annotation>(sql2, [anyenum.ObjectType.Event, SyncType.unsynch]);

      if (listanno && listanno.length > 0){
        this.util.toastStart(`发现${listanno.length}条未同步提醒关注@, 开始同步...`, 1000);

        for (let ganno of  groupanno){

          let ret2: Array<Annotation> = listanno.filter((value, index, arr) => {
            return ganno.obi == value.obi && ganno.dt == value.dt;
          });
          //同一时间会产生多个at，对应生成多个数据放入at表中，上传到服务器也需要并成一条上传服务器
          //根据obi+dt来上传
          if (ret2.length > 0 ){
            let ret1 = new  Annotation();
            Object.assign(ret1,ret2[0]);
            for (let tmp of ret2 ){
              ret1.rcs.push(tmp.rc);
            }
            annotations.push(ret1);
          }
        }
      }

    }
    if (annotations.length > 0){
      let push: PushInData = new PushInData();
      for (let annotation of annotations){
        let sync: SyncData = new SyncData();
        sync.src = annotation.ui;
        //同一时间会产生多个at，对应生成多个数据放入at表中，上传到服务器也需要并成一条上传服务器，
        //根据obi+dt来上传
        sync.id = annotation.obi + annotation.dt;
        sync.type = "Annotation";
        sync.title = annotation.content;
        sync.datetime = annotation.dt;
        sync.main = true;
        sync.security = SyncDataSecurity.None;
        sync.todostate = CompleteState.None;
        sync.status = SyncDataStatus.UnDeleted;
        sync.invitestate = InviteState.None;
        sync.to =  annotation.rcs;

        sync.payload = annotation;
        push.d.push(sync);
      }
      await this.dataRestful.push(push);
    }

  }

  async saveAnnotation(condition: Annotation):Promise<string>{

    assertEmpty(condition.ui);
    assertEmpty(condition.obi);
    assertEmpty(condition.content);
    assertEmpty(condition.rcs);

    if (condition.rcs.length == 0){
      return;
    }
    condition.dt = moment().format("YYYY/MM/DD HH:mm");
    condition.obt = anyenum.ObjectType.Event;
    let sqlparam = new Array<any>();
    //同一时间会产生多个at(手机号)，对应生成多个数据放入at表中
    for (let rc of condition.rcs ){
      let at =  new AtTbl();
      condition.ati = this.util.getUuid();
      condition.rc = rc;
      condition.tb = anyenum.SyncType.unsynch;
      condition.gs = anyenum.GsType.self;
      at.ati = condition.ati;
      at.ui = condition.ui;
      at.obt = condition.obt;
      at.obi = condition.obi;
      at.rc = condition.rc;
      at.tb = condition.tb;
      at.dt = condition.dt;
      at.content = condition.content;
      at.sdt = condition.sdt;
      at.gs = condition.gs;
      sqlparam.push(at.rpTParam());
    }

    await this.sqlExce.batExecSqlByParam(sqlparam);
    await this.syncAnnotation([condition]);
    return "";


  }

  //根据条件查询参与人
  getMembers(members, key: string) {
    if (key)
      return members.filter((value) => {
        return value.ran.indexOf(key) > -1
          || value.rc.indexOf(key) > -1
          || value.rn.indexOf(key) > -1
          || value.rc.indexOf(key) > -1
          || value.rnpy.indexOf(key) > -1
          || value.ranpy.indexOf(key) > -1
      });
    else
      return members;
  }

  async delAnnotation(){
    let d : string  = moment().add( -1 ,'days').format("YYYY/MM/DD HH:mm");
    let sq = ` delete from gtd_at where dt <= ? ;`;
    await this.sqlExce.batExecSqlByParam([sq,[d]]);
  }

  async fetchAnnotations(): Promise<Array<Annotation>>{
    let ret : Array<Annotation>;
    let d : string  = moment().add( -1 ,'days').format("YYYY/MM/DD HH:mm");
    let sq = ` select attbl.*, count(attbl.obi) atcount, max(attbl.dt) maxdt
                from (select gtd_at.*, gtd_b.ran, substr(dt, 1, 11) d
                        from gtd_at
                        left join gtd_b on gtd_at.rc = gtd_b.rc
                       where dt > ?
                         and gs = '1') attbl ,gtd_ev ev 
               where attbl.obi = ev.evi and attbl.obt = 'event' and ev.del <> 'del'
               group by attbl.ui, attbl.obi, attbl.d 
               order by attbl.dt desc `
    ret = await this.sqlExce.getExtLstByParam<Annotation>(sq,[d]);
    return ret;
  }

  async getAnnotation(annotationId :string): Promise<Annotation>{
    let ret : Annotation;
    let at = new AtTbl();
    at.ati = annotationId;
    ret = await this.sqlExce.getOneByParam<Annotation>(at);
    return ret;
  }
}

export class Annotation extends AtTbl{
  atcount : number;
  ran : string;
  rcs : Array<string > =new Array<string>();
}
