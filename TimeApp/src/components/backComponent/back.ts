import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {ControlValueAccessor} from "@angular/forms";

/**
 * Generated class for the BackComponent page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'BackComponent',
  template: `<canvas  #canvas></canvas>`,
})
export class BackComponent{
  @ViewChild('canvas')
  canvas: ElementRef;

  circles: Array<any> = [];
  ctx: any;
  w: number;
  h: number;

  ngOnInit(): void {
    //暂时屏蔽背景移动的点
   // this.loadScene(20);
  }

  loadScene(num:number) {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.w = this.canvas.nativeElement.width = window.innerWidth;
    this.h = this.canvas.nativeElement.height = window.innerHeight;
    for (var i = 0; i < num; i++) {
      this.circles.push(new Circle(Math.random() * this.w, Math.random() * this.h));
    }
    this.draw();
  }


  draw() {

    this.ctx.clearRect(0, 0, this.w, this.h);
    for (var i = 0; i < this.circles.length; i++) {
      this.circles[i].move(this.w, this.h);
      this.circles[i].drawCircle(this.ctx);
      for (var j = i + 1; j < this.circles.length; j++) {
        this.circles[i].drawLine(this.ctx, this.circles[j]);
      }
    }
    requestAnimationFrame(() => {
      this.draw();
    });
  }

}

class Circle
{
  x:number
  y:number
  r:number
  _mx:number
  _my:number
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 2;
    this._mx = 1 - (Math.random() * 2);
    this._my = 1 - (Math.random() * 2);

  }


   drawCircle(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.fillStyle = 'rgba(218,71,57, 0.2)';
    ctx.fill();
  }


   move(w, h) {
    this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
    this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
    this.x += this._mx / 2;
    this.y += this._my / 2;
  }


   drawLine(ctx, _circle) {
    var dx = this.x - _circle.x;
    var dy = this.y - _circle.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < 60) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);//起点
      ctx.lineTo(_circle.x, _circle.y);//终点
      ctx.strokeStyle = 'rgba(0,0,0, 0.1)';
      ctx.stroke();
    }
  }
}
