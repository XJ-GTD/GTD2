import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {DS} from "../model/ws.enum";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {CalendarService, PlanData, PlanItemData} from "../../service/business/calendar.service";
import {EventService, AgendaData, TaskData, MiniTaskData, Member, Attachment} from "../../service/business/event.service";
import {MemoService, MemoData} from "../../service/business/memo.service";
import {DataSyncPara} from "../model/datasync.para";
import {TellyouType, TellyouIdType, SyncDataStatus, MemberShareState, EventFinishStatus, DelType, InviteState, CompleteState} from "../../data.enum";
import {FsData} from "../../data.mapping";
import {UserConfig} from "../../service/config/user.config";
import {ContactsService} from "../../service/cordova/contacts.service";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {PersonRestful} from "../../service/restful/personsev";
import {DataRestful} from "../../service/restful/datasev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {Annotation, AnnotationService} from "../../service/business/annotation.service";
import {Grouper, GrouperService} from "../../service/business/grouper.service";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";
import {TellyouService, TellYouBase} from "../../components/ai/tellyou/tellyou.service";

/**
 * 数据同步
 *
 * create by leonxi on 2019/09/30.
 */
@Injectable()
export class DataSyncProcess implements MQProcess {
  cachedpersons: any = {};

  constructor(private emitService: EmitService,
              private contactsServ: ContactsService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private memoService: MemoService,
              private tellyouService: TellyouService,
              private personRestful: PersonRestful,
              private dataRestful: DataRestful,
              private annotationService : AnnotationService,
              private grouperService : GrouperService,
              private sqlExce : SqliteExec,
              private utilService :UtilService) {
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

      if (dsPara.type == "Plan") {
        await this.calendarService.acceptSyncPrivatePlans([dsPara.id]);
      }
      if (dsPara.type == "PlanItem") {
        await this.calendarService.acceptSyncPlanItems([dsPara.id]);
      }
      if (dsPara.type == "Agenda") {
        await this.eventService.acceptSyncAgendas([dsPara.id]);
      }
      if (dsPara.type == "Memo") {
        await this.memoService.acceptSyncMemos([dsPara.id]);
      }
      if (dsPara.type == "Attachment") {
        await this.eventService.acceptSyncAttachments([dsPara.id]);
      }
      if (dsPara.type == "Annotation") {
        await this.annotationService.acceptSyncAnnotation([dsPara.id]);
      }
    }

    //本帐号他设备请求,云端同步成功,本地下载完成同步
    if (content.option == DS.SA) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Plan") {
        await this.calendarService.receivedPlan(dsPara.id);
      }
      if (dsPara.type == "PlanItem") {
        await this.calendarService.receivedPlanItem(dsPara.id);
      }
      if (dsPara.type == "Agenda") {
        await this.eventService.receivedAgenda(dsPara.id);
      }
      if (dsPara.type == "Memo") {
        await this.memoService.receivedMemo(dsPara.id);
      }
      if (dsPara.type == "Attachment") {
        await this.eventService.receivedAttachment(dsPara.id);
      }
      if (dsPara.type == "Annotation") {
        await this.annotationService.receivedAnnotation(dsPara.id);
      }
      if (dsPara.type == "Grouper") {
        await this.grouperService.receivedGrouper(dsPara.id);
      }
    }

    //他帐号请求,云端同步成功,本地下载完成同步
    if (content.option == DS.OA) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Plan") {
        await this.calendarService.receivedPlan(dsPara.id);
      }
      if (dsPara.type == "PlanItem") {
        await this.calendarService.receivedPlanItem(dsPara.id);
      }
      if (dsPara.type == "Agenda") {
        await this.eventService.receivedAgenda(dsPara.id);
      }
      if (dsPara.type == "Memo") {
        await this.memoService.receivedMemo(dsPara.id);
      }
      if (dsPara.type == "Attachment") {
        await this.eventService.receivedAttachment(dsPara.id);
      }
      if (dsPara.type == "Annotation") {
        await this.annotationService.receivedAnnotation(dsPara.id);
      }
      if (dsPara.type == "Grouper") {
        await this.grouperService.receivedGrouper(dsPara.id);
      }
    }

    //本设备拉取请求,本地下载
    if (content.option == DS.SP) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Plan") {
        await this.calendarService.receivedPlan(dsPara.id);
      }
      if (dsPara.type == "PlanItem") {
        await this.calendarService.receivedPlanItem(dsPara.id);
      }
      if (dsPara.type == "Agenda") {
        await this.eventService.receivedAgenda(dsPara.id);
      }
      if (dsPara.type == "Memo") {
        await this.memoService.receivedMemo(dsPara.id);
      }
      if (dsPara.type == "Attachment") {
        await this.eventService.receivedAttachment(dsPara.id);
      }
      if (dsPara.type == "Annotation") {
        await this.annotationService.receivedAnnotation(dsPara.id);
      }
      if (dsPara.type == "Grouper") {
        await this.grouperService.receivedGrouper(dsPara.id);
      }
    }

    //拉取数据文件直接保存
    if (content.option == DS.FS) {
      let file: string = content.parameters.file;
      let extension: string = content.parameters.extension;

      let filedatas = await this.dataRestful.pullfile(file);

      if (filedatas && filedatas.length > 0) {
        // 预处理
        // classified {
        //   "Agenda": {
        //      "del": [...],
        //      "undel": [...],
        //   },
        //   "PlanItem": {
        //      "del": [...],
        //      "undel": [...],
        //   },
        // }
        let classified = {};
        this.utilService.tellyou( "当前在DataSyncProcess.filedatas中还有" + filedatas.length + "个任务没有完成");
        console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":==当前在DataSyncProcess.filedatas中按照数据类型以及删除状态分类start");
        for (let filedata of filedatas) {


          let dsPara: DataSyncPara = filedata;

          let status: string = dsPara.status;

          // 按照数据类型以及删除状态分类
          if (status == SyncDataStatus.Deleted) {
            let typeclass = classified[dsPara.type];

            if (!typeclass) {
              typeclass = {del: [], undel: []};

              if (dsPara.type == "Plan") {
                typeclass['del'].push(await this.preProcessPlanData(dsPara));
              } else if (dsPara.type == "PlanItem") {
                typeclass['del'].push(await this.preProcessPlanItemData(dsPara));
              } else if (dsPara.type == "Agenda") {
                typeclass['del'].push(await this.preProcessAgendaData(dsPara));
              } else if (dsPara.type == "Memo") {
                typeclass['del'].push(await this.preProcessMemoData(dsPara));
              } else if (dsPara.type == "Attachment") {
                typeclass['del'].push(await this.preProcessAttachment(dsPara));
              } else if (dsPara.type == "Annotation") {
                typeclass['del'].push(await this.preProcessAnnotation(dsPara));
              } else if (dsPara.type == "Grouper") {
                typeclass['del'].push(await this.preProcessGrouper(dsPara));
              } else {
                typeclass['del'].push(dsPara.data);
              }

              classified[dsPara.type] = typeclass;
            } else {
              if (dsPara.type == "Plan") {
                typeclass['del'].push(await this.preProcessPlanData(dsPara));
              } else if (dsPara.type == "PlanItem") {
                typeclass['del'].push(await this.preProcessPlanItemData(dsPara));
              } else if (dsPara.type == "Agenda") {
                typeclass['del'].push(await this.preProcessAgendaData(dsPara));
              } else if (dsPara.type == "Memo") {
                typeclass['del'].push(await this.preProcessMemoData(dsPara));
              } else if (dsPara.type == "Attachment") {
                typeclass['del'].push(await this.preProcessAttachment(dsPara));
              } else if (dsPara.type == "Annotation") {
                typeclass['del'].push(await this.preProcessAnnotation(dsPara));
              } else if (dsPara.type == "Grouper") {
                typeclass['del'].push(await this.preProcessGrouper(dsPara));
              } else {
                typeclass['del'].push(dsPara.data);
              }
            }
          } else {
            let typeclass = classified[dsPara.type];

            if (!typeclass) {
              typeclass = {del: [], undel: []};

              if (dsPara.type == "Plan") {
                typeclass['undel'].push(await this.preProcessPlanData(dsPara));
              } else if (dsPara.type == "PlanItem") {
                typeclass['undel'].push(await this.preProcessPlanItemData(dsPara));
              } else if (dsPara.type == "Agenda") {
                typeclass['undel'].push(await this.preProcessAgendaData(dsPara));
              } else if (dsPara.type == "Memo") {
                typeclass['undel'].push(await this.preProcessMemoData(dsPara));
              } else if (dsPara.type == "Attachment") {
                typeclass['undel'].push(await this.preProcessAttachment(dsPara));
              } else if (dsPara.type == "Annotation") {
                typeclass['undel'].push(await this.preProcessAnnotation(dsPara));
              } else if (dsPara.type == "Grouper") {
                typeclass['undel'].push(await this.preProcessGrouper(dsPara));
              } else {
                typeclass['undel'].push(dsPara.data);
              }

              classified[dsPara.type] = typeclass;
            } else {

              if (dsPara.type == "Plan") {
                typeclass['undel'].push(await this.preProcessPlanData(dsPara));
              } else if (dsPara.type == "PlanItem") {
                typeclass['undel'].push(await this.preProcessPlanItemData(dsPara));
              } else if (dsPara.type == "Agenda") {
                typeclass['undel'].push(await this.preProcessAgendaData(dsPara));
              } else if (dsPara.type == "Memo") {
                typeclass['undel'].push(await this.preProcessMemoData(dsPara));
              } else if (dsPara.type == "Attachment") {
                typeclass['undel'].push(await this.preProcessAttachment(dsPara));
              } else if (dsPara.type == "Annotation") {
                typeclass['undel'].push(await this.preProcessAnnotation(dsPara));
              } else if (dsPara.type == "Grouper") {
                typeclass['undel'].push(await this.preProcessGrouper(dsPara));
              } else {
                typeclass['undel'].push(dsPara.data);
              }
            }
          }
        }
        console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":==当前在DataSyncProcess.filedatas中按照数据类型以及删除状态分类end");
        console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":==当前在DataSyncProcess.filedatas中分类数据处理start");
        // 对分类后数据进行批量处理
        for (let datatype of ["Plan", "PlanItem", "Agenda", "Task", "MiniTask", "Memo", "Attachment", "Annotation", "Grouper"]) {
          let typeclass = classified[datatype];

          if (!typeclass) continue;

          let typeclassdel = typeclass['del'];

          if (typeclassdel && typeclassdel.length > 0) {
            console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":===当前在DataSyncProcess.filedatas中对 "
                                          +"received"+datatype+"Data同步删除数据("+ typeclassdel.length +")条start " );
            if (datatype == "Plan") {
              for (let plan of typeclassdel) {
                await this.calendarService.receivedPlanData(plan, SyncDataStatus.Deleted);
              }
            } else if (datatype == "PlanItem") {
              await this.calendarService.receivedPlanItemData(typeclassdel, SyncDataStatus.Deleted);
            } else if (datatype == "Agenda") {
              await this.eventService.receivedAgendaData(typeclassdel, SyncDataStatus.Deleted, extension);
            } else if (datatype == "Memo") {
              for (let memo of typeclassdel) {
                await this.memoService.receivedMemoData(memo, SyncDataStatus.Deleted);
              }
            } else if (datatype == "Attachment") {
              await this.eventService.receivedAttachmentData(typeclassdel, SyncDataStatus.Deleted, extension);
            } else if (datatype == "Annotation") {
              await this.annotationService.receivedAnnotationData(typeclassdel, SyncDataStatus.Deleted, extension);
            } else if (datatype == "Grouper") {
              await this.grouperService.receivedGrouperData(typeclassdel, SyncDataStatus.Deleted);
            }
            console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":===当前在DataSyncProcess.filedatas中对 "
              +"received"+datatype+"Data同步删除数据("+ typeclassdel.length +")条end " );
          }

          let typeclassundel = typeclass['undel'];

          if (typeclassundel && typeclassundel.length > 0) {
            console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":===当前在DataSyncProcess.filedatas中对 "
              +"received"+datatype+"Data同步未删除数据("+ typeclassundel.length +")条start " );
            if (datatype == "Plan") {
              for (let plan of typeclassundel) {
                await this.calendarService.receivedPlanData(plan, SyncDataStatus.UnDeleted);
              }
            } else if (datatype == "PlanItem") {
                await this.calendarService.receivedPlanItemData(typeclassundel, SyncDataStatus.UnDeleted);

                // 发送语音通知用数据
                typeclassundel.forEach((planitem) => {
                  this.tellyouService.tellyou4invsited(generateTellYouBase({id: planitem.jti, idtype: TellyouIdType.PlanItem, tellType: TellyouType.default}));
                });
            } else if (datatype == "Agenda") {
              await this.eventService.receivedAgendaData(typeclassundel, SyncDataStatus.UnDeleted, extension);

              // 发送语音通知用数据
              typeclassundel.forEach((agenda) => {
                this.tellyouService.tellyou4invsited(generateTellYouBase({id: agenda.evi, idtype: TellyouIdType.Agenda, tellType: TellyouType.default}));
              });
            } else if (datatype == "Memo") {
              for (let memo of typeclassundel) {
                await this.memoService.receivedMemoData(memo, SyncDataStatus.UnDeleted);
              }
            } else if (datatype == "Attachment") {
              await this.eventService.receivedAttachmentData(typeclassundel, SyncDataStatus.UnDeleted, extension);
            } else if (datatype == "Annotation") {
              await this.annotationService.receivedAnnotationData(typeclassundel, SyncDataStatus.UnDeleted, extension);
            } else if (datatype == "Grouper") {
              await this.grouperService.receivedGrouperData(typeclassundel, SyncDataStatus.UnDeleted);
            }
          }
          console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":===当前在DataSyncProcess.filedatas中对 "
            +"received"+datatype+"Data同步未删除数据("+ typeclassundel.length +")条end " );
        }
        console.log(moment().format("YYYY/MM/DD HH:mm:ss SSS") + ":==当前在DataSyncProcess.filedatas中分类数据处理end");
      }
    }

    //拉取数据直接保存
    if (content.option == DS.DS) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Plan") {
        let plan: PlanData = {} as PlanData;
        Object.assign(plan, dsPara.data);

        await this.calendarService.receivedPlanData(plan, this.convertSyncStatus(dsPara.status));
      }

      if (dsPara.type == "PlanItem") {
        let planitem: PlanItemData = {} as PlanItemData;
        Object.assign(planitem, dsPara.data);

        // 参与人通过to字段重新构造
        if (dsPara.to && dsPara.to.length > 0) {
          let unknowncontacts: Array<string> = new Array<string>(...dsPara.to);

          let fsdatas = UserConfig.friends.filter((element, index, array) => {
            let pos: number = unknowncontacts.indexOf(element.rc);

            if (pos >= 0) unknowncontacts.splice(pos, 1); // 移出已知联系人

            return (pos >= 0);
          });

          let originmembers = planitem.members;

          planitem.members = new Array<Member>();

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
            } else {
              member.sdt = MemberShareState.AcceptWait;
            }

            planitem.members.push(member);
          }

          if (bsqls.length > 0){
            await this.sqlExce.batExecSql(bsqls);
          }

          // 参与人可能存在没有注册的情况，目前没有考虑
          for (let unknown of unknowncontacts) {
            if (!originmembers) continue;   // 存在历史错误的数据,没有参与人数据

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
              } else {
                member.sdt = MemberShareState.AcceptWait;
              }

              planitem.members.push(member);
            } else {  // 非注册用户

            }
          }
        }

        await this.calendarService.receivedPlanItemData([planitem], this.convertSyncStatus(dsPara.status));

        // 发送语音通知用数据
        this.tellyouService.tellyou4invsited(generateTellYouBase({id: planitem.jti, idtype: TellyouIdType.PlanItem, tellType: TellyouType.default}));
      }

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
            if (!originmembers) continue;   // 存在历史错误数据，忽略处理

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

        await this.eventService.receivedAgendaData([agenda], this.convertSyncStatus(dsPara.status), dsPara.extension);

        // 发送语音通知用数据
        this.tellyouService.tellyou4invsited(generateTellYouBase({id: agenda.evi, idtype: TellyouIdType.Agenda, tellType: TellyouType.default}));
      }

      if (dsPara.type == "Memo") {
        let memo: MemoData = {} as MemoData;
        Object.assign(memo, dsPara.data);

        await this.memoService.receivedMemoData(memo, this.convertSyncStatus(dsPara.status));
      }

      if (dsPara.type == "Attachment") {
        let attachment: Attachment = {} as Attachment;
        Object.assign(attachment, dsPara.data);

        await this.eventService.receivedAttachmentData([attachment], this.convertSyncStatus(dsPara.status), dsPara.extension);
      }
      if (dsPara.type == "Annotation") {
        let annotation: Annotation = {} as Annotation;
        Object.assign(annotation, dsPara.data);

        await this.annotationService.receivedAnnotationData([annotation], this.convertSyncStatus(dsPara.status), dsPara.extension);
      }
      if (dsPara.type == "Grouper") {
        let grouper: Grouper = new Grouper();
        Object.assign(grouper, dsPara.data);

        await this.grouperService.receivedGrouperData([grouper], this.convertSyncStatus(dsPara.status));
      }

    }

    return contextRetMap
  }

  private async preProcessGrouper(dsPara: DataSyncPara): Promise<Grouper> {
    let grouper: Grouper = new Grouper();
    Object.assign(grouper, dsPara.data);

    return grouper;
  }

  private async preProcessAnnotation(dsPara: DataSyncPara): Promise<Annotation> {
    let annotation: Annotation = {} as Annotation;
    Object.assign(annotation, dsPara.data);

    return annotation;
  }

  private async preProcessAttachment(dsPara: DataSyncPara): Promise<Attachment> {
    let attachment: Attachment = {} as Attachment;
    Object.assign(attachment, dsPara.data);

    return attachment;
  }

  private async preProcessMemoData(dsPara: DataSyncPara): Promise<MemoData> {
    let memo: MemoData = {} as MemoData;
    Object.assign(memo, dsPara.data);

    return memo;
  }

  private async preProcessPlanData(dsPara: DataSyncPara): Promise<PlanData> {
    let plan: PlanData = {} as PlanData;
    Object.assign(plan, dsPara.data);

    return plan;
  }

  private async preProcessPlanItemData(dsPara: DataSyncPara): Promise<PlanItemData> {
    let planitem: PlanItemData = {} as PlanItemData;
    Object.assign(planitem, dsPara.data);

    // 参与人通过to字段重新构造
    if (dsPara.to && dsPara.to.length > 0) {
      let unknowncontacts: Array<string> = new Array<string>(...dsPara.to);

      let fsdatas = UserConfig.friends.filter((element, index, array) => {
        let pos: number = unknowncontacts.indexOf(element.rc);

        if (pos >= 0) unknowncontacts.splice(pos, 1); // 移出已知联系人

        return (pos >= 0);
      });

      let originmembers = planitem.members;

      planitem.members = new Array<Member>();

      let bsqls = new Array<string>();

      for (let fsdata of fsdatas) {

        //更新参与人ui
        if (fsdata.ui == ""){
          let userinfo = this.cachedpersons[fsdata.rc] || await this.personRestful.get(fsdata.rc);
          if (userinfo && userinfo.openid){
            // 缓存用户数据防止多次访问
            this.cachedpersons[fsdata.rc] = userinfo;

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
        } else {
          member.sdt = MemberShareState.AcceptWait;
        }

        planitem.members.push(member);
      }

      if (bsqls.length > 0){
        await this.sqlExce.batExecSql(bsqls);
      }

      // 参与人可能存在没有注册的情况，目前没有考虑
      for (let unknown of unknowncontacts) {
        if (!originmembers) continue;   // 存在历史错误的数据,没有参与人数据

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
          } else {
            member.sdt = MemberShareState.AcceptWait;
          }

          planitem.members.push(member);
        } else {  // 非注册用户

        }
      }
    }

    return planitem;
  }

  private async preProcessAgendaData(dsPara: DataSyncPara): Promise<AgendaData> {
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
          let userinfo = this.cachedpersons[fsdata.rc] || await this.personRestful.get(fsdata.rc);

          if (userinfo && userinfo.openid){
            // 缓存用户数据防止多次访问
            this.cachedpersons[fsdata.rc] = userinfo;

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
        if (!originmembers) continue;   // 存在历史错误数据，忽略处理

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

    return agenda;
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

export function generateTellYouBase(params: any): TellYouBase {
  let tellyou: TellYouBase = new TellYouBase();
  Object.assign(tellyou, params);

  return tellyou;
}
