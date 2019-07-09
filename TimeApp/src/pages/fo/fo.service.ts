import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import {ContactsService} from "../../service/cordova/contacts.service";
import {PageY} from "../../data.mapping";
import {SyncRestful} from "../../service/restful/syncsev";

@Injectable()
export class FoService {

  constructor(
    private sqlExce: SqliteExec,
    private syncRestful:SyncRestful,
    private userConfig:UserConfig,
    private contactsService: ContactsService) {
  }

}
