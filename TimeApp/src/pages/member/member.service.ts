import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {AgdPro, AgdRestful, ContactPerPro} from "../../service/restful/agdsev";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {PersonRestful} from "../../service/restful/personsev";
import {DataConfig} from "../../service/config/data.config";
import {ContactsService} from "../../service/cordova/contacts.service";
import {UserConfig} from "../../service/config/user.config";
import {FsData} from "../../data.mapping";
import {Member} from "../../service/business/event.service";

@Injectable()
export class MemberService {
  constructor(private sqlite: SqliteExec,
              private agdRest: AgdRestful,
              private perRest: PersonRestful,
              private contacts: ContactsService,
              private util: UtilService) {
  }

  //根据条件查询参与人
  getMembers(key: string) {
    if (key)
    return UserConfig.members.filter((value) => {
      return value.ran.indexOf(key) > -1
        || value.rc.indexOf(key) > -1
        || value.rn.indexOf(key) > -1
        || value.rc.indexOf(key) > -1
        || value.rnpy.indexOf(key) > -1
        || value.ranpy.indexOf(key) > -1
    });
    else
      return UserConfig.members;
  }
}

