import { Injectable } from '@angular/core';
import {RemindSqliteService} from "./sqlite-service/remind-sqlite.service";


/**
 * 闹铃
 */
@Injectable()
export class RemindService {

  constructor(private remindSqlite: RemindSqliteService) {

  }
}
