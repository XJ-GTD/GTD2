import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {ModalController, NavParams} from 'ionic-angular';
import {AssistantService} from "../../service/cordova/assistant.service";
import {OperationPara} from "../model/operation.para";
import {UtilService} from "../../service/util-service/util.service";
import {ProcesRs} from "../model/proces.rs";
import {ScdData} from "../../data.mapping";
import {EmitService, FriendEmData, ScdEmData, ScdLsEmData, SpeechEmData} from "../../service/util-service/emit.service";
import {OP} from "../model/ws.enum";
import {UserConfig} from "../../service/config/user.config";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {DataConfig} from "../../service/config/data.config";

/**
 * 操作冥王星的语音指令
 *
 * create by leon_xi on 2020/01/14.
 */
@Injectable()
export class OperationProcess extends BaseProcess implements MQProcess {

  constructor(private assistant: AssistantService,
              public modalCtrl: ModalController,
              private utilService: UtilService,
              private emitService: EmitService) {
    super();
  }

   async gowhen(content: WsContent, contextRetMap: Map<string, any>) {

    //上下文内获取日程查询结果
    let agendas: Array<ScdData> = new Array<ScdData>();
    agendas = this.input(content, contextRetMap, "agendas", WsDataConfig.SCD, agendas);

    //上下文内获取备忘查询结果
    let memos: Array<ScdData> = new Array<ScdData>();
    memos = this.input(content, contextRetMap, "memos", WsDataConfig.MOD, memos);

    //上下文内获取日历项查询结果
    let planitems: Array<ScdData> = new Array<ScdData>();
    planitems = this.input(content, contextRetMap, "planitems", WsDataConfig.PID, planitems);

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

    if (content.option == OP.A) {
      //处理所需要参数
      let operationPara: OperationPara = content.parameters;

      if (operationPara.operation
        && operationPara.operation.class
        && operationPara.operation.action
        && operationPara.operation.target) {

        // 页面操作
        if (operationPara.operation.class.toLowerCase() == "page") {
          if (operationPara.operation.action.toLowerCase() == "open") {
            // 日程
            if (operationPara.operation.target.toLowerCase() == "agenda") {
              if (agendas && agendas.length > 0) {
                this.modalCtrl.create(DataConfig.PAGE._AGENDA_PAGE, {
                  si: agendas[0].si
                }).present();
              }
            }

            // 备忘
            if (operationPara.operation.target.toLowerCase() == "memo") {
              if (memos && memos.length > 0) {
                this.modalCtrl.create(DataConfig.PAGE._MEMO_PAGE, {
                  day: memos[0].sd
                }).present();
              }
            }

            // 日历项
            if (operationPara.operation.target.toLowerCase() == "planitem") {
              if (planitems && planitems.length > 0) {
                this.modalCtrl.create(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, {
                  si: planitems[0].si
                }).present();
              }
            }
          }
        }
      }
    }

    //处理结果
    return contextRetMap;
  }
}
