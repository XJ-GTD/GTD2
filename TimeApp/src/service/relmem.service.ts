import { Injectable } from '@angular/core';
import {RelmemSqliteService} from "./sqlite-service/relmem-sqlite.service";


/**
 * 授权联系人
 */
@Injectable()
export class RelmemService {

  constructor(private relmemSqlite: RelmemSqliteService) {

  }
}
