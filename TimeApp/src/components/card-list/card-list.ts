import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'card-list',
  template: `
  <ion-grid class="h70">
    <ion-row class="h100" align-items-center>
      <p class="p15"></p>
      <ion-grid>
        <ion-row justify-content-center>
          <small *ngIf="todaylist && todaylist.length > 0">当天</small>
          <ng-container *ngFor="let scd of todaylist">
          <ion-card *ngIf="scd.gs == '3' || scd.gs == '4'" (click)="gotoDetail(scd)">
            <div class="card-title">{{scd.sn}}</div>
            <div *ngIf="scd.bz" class="card-subtitle">{{scd.bz}}</div>
            <div *ngIf="scd.st && scd.st != '99:99'" class="card-subtitle">{{scd.st}}</div>
            <div *ngIf="scd.st && scd.st == '99:99'" class="card-subtitle">全天</div>
            <div *ngIf="scd.p && scd.p.jc" class="card-subtitle">
              <div class="color-dot" [ngStyle]="{'background-color': scd.p.jc }"></div>
            </div>
          </ion-card>
          </ng-container>
        </ion-row>
        <ion-row justify-content-center>
          <small *ngIf="hasLoaded && ((!todaylist || todaylist.length <= 0) || (scdlist && scdlist.length > 0))">日程</small>
          <ng-container *ngFor="let scd of scdlist">
          <ion-card *ngIf="scd.gs != '3' && scd.gs != '4'" (click)="gotoDetail(scd)">
            <div class="card-title">{{scd.sn}}</div>
            <div *ngIf="scd.bz" class="card-subtitle">{{scd.bz}}</div>
            <div *ngIf="scd.st && scd.st != '99:99'" class="card-subtitle">{{scd.st}}</div>
            <div *ngIf="scd.st && scd.st == '99:99'" class="card-subtitle">全天</div>
            <div *ngIf="scd.p && scd.p.jc" class="card-subtitle">
              <div class="color-dot" [ngStyle]="{'background-color': scd.p.jc }"></div>
            </div>
          </ion-card>
          </ng-container>
          <ion-card *ngIf="hasLoaded && (!todaylist || todaylist.length <= 0) && (!scdlist || scdlist.length <= 0)" (click)="gotoNew()">
            <div class="card-subtitle">添加新事件</div>
          </ion-card>
          <ion-spinner *ngIf="!hasLoaded" name="bubbles"></ion-spinner>
        </ion-row>
        <ion-row justify-content-center>
          <small *ngIf="weatherlist && weatherlist.length > 0">天气</small>
          <ng-container *ngFor="let scd of weatherlist">
          <ion-card *ngIf="scd.gs == '6'">
            <wi name="day-sunny" direction="from" degree="78"></wi>
            <div class="card-title">{{scd.sn}}</div>
            <div *ngIf="scd.bz" class="card-subtitle">{{scd.bz}}</div>
            <div *ngIf="scd.fjo && scd.fjo.city" class="card-subtitle">{{scd.fjo.city}}</div>
          </ion-card>
          </ng-container>
        </ion-row>
      </ion-grid>
      <p class="p15"></p>
      <p class="p15"></p>
    </ion-row>
  </ion-grid>
  `
})
export class CardListComponent {

  @Output()
  private onStartLoad: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCardClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCreateNew: EventEmitter<any> = new EventEmitter<any>();

  todaylist: Array<any> = new Array<any>();
  weatherlist: Array<any> = new Array<any>();
  scdlist: Array<any> = new Array<any>();
  hasLoaded: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.onStartLoad.emit(this);
  }

  gotoDetail(scd: any) {
    this.onCardClick.emit({target: this, value: scd});
  }

  gotoNew() {
    this.onCreateNew.emit(this);
  }

  refresh() {
    this.onStartLoad.emit(this);
  }
}
