import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {DS} from "../model/ws.enum";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, AgendaData, TaskData, MiniTaskData, Member} from "../../service/business/event.service";
import {MemoService} from "../../service/business/memo.service";
import {DataSyncPara} from "../model/datasync.para";
import {SyncDataStatus, MemberShareState, EventFinishStatus, DelType, InviteState, CompleteState} from "../../data.enum";
import {FsData} from "../../data.mapping";
import {UserConfig} from "../../service/config/user.config";
import {ContactsService} from "../../service/cordova/contacts.service";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";

/**
 * 数据同步
 *
 * create by leonxi on 2019/09/30.
 */
@Injectable()
export class DataSyncProcess implements MQProcess {
  constructor(private emitService: EmitService,
              private contactsServ: ContactsService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private memoService: MemoService,
              private personRestful: PersonRestful,
              private sqlExce : SqliteExec) {
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {
    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content);
      }catch (e){
        rf = false;
      };
      if (!rf){
        return contextRetMap;
      }
    }

    //处理区分
    //本设备请求云端同步成功
    if (content.option == DS.SD) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        this.eventService.acceptSyncAgendas([dsPara.id]);
      }
    }

    //本帐号他设备请求,云端同步成功,本地下载完成同步
    if (content.option == DS.SA) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        this.eventService.receivedAgenda(dsPara.id);
      }
    }

    //他帐号请求,云端同步成功,本地下载完成同步
    if (content.option == DS.OA) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        this.eventService.receivedAgenda(dsPara.id);
      }
    }

    //本设备拉取请求,本地下载
    if (content.option == DS.SP) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        this.eventService.receivedAgenda(dsPara.id);
      }
    }

    //拉取数据直接保存
    if (content.option == DS.DS) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        let agenda: AgendaData = {} as AgendaData;
        Object.assign(agenda, dsPara.data);

        // 参与人通过to字段重新构造
        if (dsPara.to && dsPara.to.length > 0) {
          let unknowncontacts: Array<string> = new Array<string>(...dsPara.to);

          let fsdatas = UserConfig.friends.filter((element, index, array) => {
            let pos: number = unknowncontacts.indexOf(element.rc);

            if (pos >= 0) unknowncontacts.splice(pos, 1); // 移出已知联系人

            return (pos >= 0);
          });

          let originmembers = agenda.members;

          agenda.members = new Array<Member>();

          let bsqls = new Array<string>();

          for (let fsdata of fsdatas) {

            //更新参与人ui
            if (fsdata.ui == ""){
              let userinfo = await this.personRestful.get(fsdata.rc);
              if (userinfo && userinfo.openid){
                fsdata.ui = userinfo.openid;

                let bt = new BTbl();
                bt.pwi = fsdata.pwi;
                bt.ui = fsdata.ui;
                bsqls.push(bt.upT());
              }
            }

            let member: Member = {} as Member;
            Object.assign(member, fsdata);

            // 数据共享成员状态
            let sharestate = dsPara.share[member['rc']];

            if (sharestate) {
              let datastate = sharestate['datastate'];
              let invitestate = sharestate['invitestate'];
              let todostate = sharestate['todostate'];

              if (datastate == DelType.del) {
                member.sdt = MemberShareState.Removed;
              } else {
                if (invitestate == InviteState.Accepted) {
                  member.sdt = MemberShareState.Accepted;
                } else if (invitestate == InviteState.Rejected) {
                  member.sdt = MemberShareState.Rejected;
                } else {
                  member.sdt = MemberShareState.AcceptWait;
                }
              }

              if (todostate == CompleteState.Completed) {
                member.wc = EventFinishStatus.Finished;
              } else {
                member.wc = EventFinishStatus.NonFinish;
              }
            } else {
              member.sdt = MemberShareState.AcceptWait;
              member.wc = EventFinishStatus.NonFinish;
            }

            agenda.members.push(member);
          }

          if (bsqls.length > 0){
            await this.sqlExce.batExecSql(bsqls);
          }

          // 参与人可能存在没有注册的情况，目前没有考虑
          for (let unknown of unknowncontacts) {
            let origins = originmembers.filter((element) => {
              return element.rc == unknown;
            });

            let origin = (origins && origins.length > 0)? origins[0] : null;
            let btbl = new BTbl();

            if (origin) {
              Object.assign(btbl, origin);
            } else {
              btbl = null;
            }

            let one: FsData = await this.contactsServ.addSharedContact(unknown, btbl);

            if (one && one.rc) { // 注册用户
              let member: Member = {} as Member;
              Object.assign(member, one);

              // 数据共享成员状态
              let sharestate = dsPara.share[member['rc']];

              if (sharestate) {
                let datastate = sharestate['datastate'];
                let invitestate = sharestate['invitestate'];
                let todostate = sharestate['todostate'];

                if (datastate == DelType.del) {
                  member.sdt = MemberShareState.Removed;
                } else {
                  if (invitestate == InviteState.Accepted) {
                    member.sdt = MemberShareState.Accepted;
                  } else if (invitestate == InviteState.Rejected) {
                    member.sdt = MemberShareState.Rejected;
                  } else {
                    member.sdt = MemberShareState.AcceptWait;
                  }
                }

                if (todostate == CompleteState.Completed) {
                  member.wc = EventFinishStatus.Finished;
                } else {
                  member.wc = EventFinishStatus.NonFinish;
                }
              } else {
                member.sdt = MemberShareState.AcceptWait;
                member.wc = EventFinishStatus.NonFinish;
              }

              agenda.members.push(member);
            } else {  // 非注册用户

            }
          }
        }

        this.eventService.receivedAgendaData([agenda], this.convertSyncStatus(dsPara.status));
      }
    }

    return contextRetMap
  }

  private convertSyncStatus(status: string): SyncDataStatus {
    if (status == SyncDataStatus.Deleted) {
      return SyncDataStatus.Deleted;
    }

    if (status == SyncDataStatus.UnDeleted) {
      return SyncDataStatus.UnDeleted;
    }

    return SyncDataStatus.UnDeleted;
  }
}
