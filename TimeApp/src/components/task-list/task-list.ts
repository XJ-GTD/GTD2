import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'task-list',
  template: `
  <ion-grid class="h70">
    <ion-row class="h100" align-items-center>
      <p class="p15"></p>
      <ion-grid>
        <ion-row justify-content-center>
          <ng-container *ngFor="let task of tasklist">
          <ion-card [ngClass]="{'complete': task.cs == '1'}" (click)="gotoDetail(task)">
            <div class="card-title">{{task.evn}}</div>
            <div class="card-subtitle">{{task.evd}}</div>
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
export class TaskListComponent {

  @Output()
  private onStartLoad: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCardClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCreateNew: EventEmitter<any> = new EventEmitter<any>();

  tasklist: Array<any> = new Array<any>();

  constructor() {
  }

  ngOnInit() {
    this.onStartLoad.emit(this);
  }

  gotoDetail(task: any) {
    this.onCardClick.emit({target: this, value: task});
  }

  gotoNew() {
    this.onCreateNew.emit(this);
  }

  refresh() {
    this.onStartLoad.emit(this);
  }
}
