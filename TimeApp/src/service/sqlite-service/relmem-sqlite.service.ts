import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";

/**
 * 授权联系人
 */
@Injectable()
export class RelmemSqliteService {

  constructor(private baseSqlite: BaseSqliteService) {

  }
}
