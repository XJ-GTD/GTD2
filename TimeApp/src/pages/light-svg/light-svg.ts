import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the LightSvgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-light-svg',
  templateUrl: 'light-svg.html',
})
export class LightSvgPage {
  @ViewChild('canvas') c:ElementRef;
   ctx:any;
   w:number = 10;
   h:number;
   cx:number;
   cy:number;
   branches:Array<Branch>;
   startHue:number;
   tick:number = 11;
  loopId:number;

  constructor(public navCtrl: NavController, public navParams: NavParams,public util:UtilService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LightSvgPage');
  }

  ngAfterViewInit() {
    //this.init();
  }

  init() {
    this.ctx = this.c.nativeElement.getContext( '2d' );
    this.startHue = 220;
    this.branches = [];
    this.reset();
  }
  startLoop(){
    this.loopId = requestAnimationFrame(()=>{
      this.loop();
    });
  }

  endLoop(){
    cancelAnimationFrame(this.loopId);
  }

  loop() {
    this.startLoop();
    this.step();
    this.draw();
    this.step();
    this.draw();
  }
  step() {
    var i = this.branches.length;
    while( i-- ) { this.branches[ i ].step( i ) }
    this.tick++;
  }

  draw() {
    let i = this.branches.length;
    if( this.tick < 250 ) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.globalAlpha = 0.0002;
      this.ctx.translate( this.cx, this.cy );
      let scale = 1 + this.tick * 0.00025 ;
      this.ctx.scale( scale, scale );
      this.ctx.translate( -this.cx, -this.cy );
      this.ctx.drawImage(this.c.nativeElement, UtilService.rand( -50, 50 ), UtilService.rand( -50, 50 ) );
      this.ctx.restore();
    }

    this.ctx.globalCompositeOperation = 'lighter';
    while( i-- ) { this.branches[ i ].draw() }
  }

  reset() {
    this.w =  this.c.nativeElement.width
    this.h =  this.c.nativeElement.height
    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.branches = [];
    this.c.nativeElement.width = this.w;
    this.c.nativeElement.height = this.h;
    this.tick = 0;
    for( var i = 0; i < 300; i++ ) {
      let branch =  new Branch(this.startHue, this.cx, this.cy,this.util);
      branch.setCtx(this.ctx);
      branch.setBranches(this.branches);
      this.branches.push(branch);
    }
    this.loop();
  }
}

class Branch{
   move:number = 15;
   life:number = 1;
   decay:number = 0.0015;
   dead:boolean = false;
   angle:number;
   points:Array<any> = new Array;
   hue:number;
   spread:number = 0;
   ctx:any;
   vel:number;
   tick:number = 0;
   branches:Array<Branch>;

  setCtx(ctx:any){
    this.ctx = ctx;
  }
  setBranches(branches:Array<Branch>){
    this.branches = branches;
  }

  constructor(hue:number, x:number, y :number,public util:UtilService ) {
    let x1 = x + UtilService.rand( -this.move, this.move );
    let y1 = y + UtilService.rand( -this.move, this.move);
    this.angle = this.angle != undefined ? this.angle : UtilService.rand( 0, Math.PI * 1 );
    this.vel = this.vel != undefined ? this.vel : UtilService.rand( -4, 4 );
    this.hue = hue != undefined ? hue : 200;
    this.points.push({
      x: x1,
      y: y1
    });
  }


  step(i:number){
    this.life -= this.decay;
    if( this.life <= 0 ) {
      this.dead = true;
    }

    if( !this.dead ) {
      let lastPoint = this.points[ this.points.length - 1 ];
      this.points.push({
        x: lastPoint.x + Math.cos( this.angle ) * this.vel,
        y: lastPoint.y + Math.sin( this.angle ) * this.vel
      });
      this.angle += UtilService.rand( -this.spread, this.spread );
      this.vel *= 0.99;
      this.spread = this.vel * 0.04;
      this.tick++;
      this.hue += 0.3;
    } else {
       this.branches.splice( i, 1 );
    }

  }

  draw() {
    if( !this.points.length || this.dead ) {
      return false;
    }

    var length = this.points.length,
      i = length - 1,
      point = this.points[ i ],
      lastPoint = this.points[ i - UtilService.randInt( 5, 15 ) ];
    let jitter = 8;
    if( lastPoint ) {
      //let jitter = 2 + this.life * 6;
      this.ctx.beginPath();
      this.ctx.moveTo( lastPoint.x, lastPoint.y );
      this.ctx.lineTo( point.x + UtilService.rand( -jitter, jitter ), point.y + UtilService.rand( -jitter, jitter ) );
      this.ctx.lineWidth = 1;
      var alpha = this.life * 0.075;
      this.ctx.strokeStyle = 'hsla(' + ( this.hue + UtilService.rand( -10, 10 ) ) + ', 70%, 40%, ' + alpha + ')';
      this.ctx.stroke();
    }
  }
}
