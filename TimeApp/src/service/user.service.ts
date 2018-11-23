import {Injectable} from "@angular/core";
import {UserSqliteService} from "./sqlite-service/user-sqlite.service";

/**
 * 用户sevice
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class ScheduleService {
  constructor( private userSqlite: UserSqliteService) { }


}
