import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';

import {EmitService} from "../../../service/util-service/emit.service";
import {Subscriber} from "rxjs";


@Component({
  selector: 'ListeningComponent',
  template:
      `
      <div class="jsai">
        <span>{{immediately}}</span>
      </div>
    <canvas #canvas></canvas>
  `,
})
export class ListeningComponent {

  immediately:string;
  immediatelyemit:Subscriber<any>;

  @Output() onListeningStart: EventEmitter<any> = new EventEmitter();
  @Output() onListeningStop: EventEmitter<any> = new EventEmitter();

  doublePI: number = Math.PI * 2;

  @ViewChild("canvas")
  canvas: any;
//画布宽度
  canvasWidth: number;
  //画布高度
  canvasHeight: number;

  ctx: any;

//画布的高度的一半
  halfCanvasHeight: number = 25;
//水平边距
  horizontalMargin: number = 150;

//衰减系数(越大, 边缘衰减的就越多, 震动宽度相应也越窄)
  attenuationCoefficient: number = 2;
//半波长个数-1
  halfWaveCount: number = 8;
//振幅是画布高度的一般的百分比[0,1]
  amplitudePercentage: number = 0.6;
//每帧增加的弧度[0,2PI](作用于sin曲线, 正值相当于原点右移, 曲线左移)
  radianStep: number = 0.25;

//当前弧度的偏移
  radianOffset1: number = 0;
  radianOffset2: number = 0;
  radianOffset3: number = 0;

  listenEmit:Subscriber<any>;

  isStop:boolean = false;
  constructor(private emitService:EmitService,
              private changeDetectorRef:ChangeDetectorRef, public elementRef: ElementRef) {
  }

  ngOnInit(){
    this.listenEmit = this.emitService.registerListener((data)=>{
      this.isStop = !data;
      if (this.isStop){
        this.onListeningStop.emit(this);
      }else{
        this.onListeningStart.emit(this);
      }
      // this.init();
    });
    this.immediatelyemit = this.emitService.registerImmediately(($data)=>{
      this.immediately = $data;
      this.changeDetectorRef.detectChanges();
    })

    // this.init();

  }

  ngOnDestroy(){
    this.listenEmit.unsubscribe();
    this.immediatelyemit.unsubscribe();
  }

  init() {
    // this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.nativeElement.getContext("2d");

    this.canvas.nativeElement.height = this.halfCanvasHeight * 2;
    this.onResize();
    this.loop();
  }


  //衰减系数AC:
  setAttenuationCoefficientRange(number: number) {
    this.attenuationCoefficient = number;
  }

  //半波长个数-1
  setHalfWaveCountRange(number: number) {
    this.halfWaveCount = number;
  };

  //振幅
  setAmplitudePercentage(number: number) {
    this.amplitudePercentage = number;
  };

  //角速度
  setRadianStep(number: number) {
    this.radianStep = number;
  };


  onResize() {
    //元素的大小不能加单位, 单位默认就是像素, 而style中的长度要加单位
    this.canvasWidth = this.canvas.nativeElement.width;
    this.canvasHeight = this.canvas.nativeElement.height;
  }

//设K=attenuationCoefficient, 计算信号衰减 (4K/(4K+x^4))^2K<=1 (x belong [-K,K])
  calcAttenuation(x) {
    return Math.pow(4 * this.attenuationCoefficient / (4 * this.attenuationCoefficient + Math.pow(x, 4)),
      2 * this.attenuationCoefficient);
  }

//heightPercentage为振幅的显示比例
  drawAcousticWave1(heightPercentage, alpha, lineWidth) {
    this.ctx.strokeStyle = "#FF632C";
    this.ctx.globalAlpha = alpha;
    this.ctx.lineWidth = lineWidth || 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.halfCanvasHeight);
    var x, y;
    for (var i = -this.attenuationCoefficient; i <= this.attenuationCoefficient; i += 0.01) {
      //i是当前位置相对于整个长度的比率( x=width*(i+K)/(2*K))
      x = this.canvasWidth * (i + this.attenuationCoefficient) / (2 * this.attenuationCoefficient);
      //加offset相当于把sin曲线向右平移
      y = this.halfCanvasHeight + this.halfCanvasHeight * this.amplitudePercentage * this.calcAttenuation(i) * heightPercentage *
        Math.sin(this.halfWaveCount * i + this.radianOffset1);
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }
  drawAcousticWave2(heightPercentage, alpha, lineWidth) {
    this.ctx.strokeStyle = "#B8D6DD";
    this.ctx.globalAlpha = alpha;
    this.ctx.lineWidth = lineWidth || 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.halfCanvasHeight);
    var x, y;
    for (var i = -this.attenuationCoefficient; i <= this.attenuationCoefficient; i += 0.01) {
      //i是当前位置相对于整个长度的比率( x=width*(i+K)/(2*K))
      x = this.canvasWidth * (i + this.attenuationCoefficient) / (2 * this.attenuationCoefficient);
      //加offset相当于把sin曲线向右平移
      y = this.halfCanvasHeight + this.halfCanvasHeight * this.amplitudePercentage / 2 * this.calcAttenuation(i) * heightPercentage *
        Math.sin(this.halfWaveCount / 2 * i + this.radianOffset2);
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }
  drawAcousticWave3(heightPercentage, alpha, lineWidth) {
    this.ctx.strokeStyle = "#a057b4";
    this.ctx.globalAlpha = alpha;
    this.ctx.lineWidth = lineWidth || 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.halfCanvasHeight);
    var x, y;
    for (var i = -this.attenuationCoefficient; i <= this.attenuationCoefficient; i += 0.01) {
      //i是当前位置相对于整个长度的比率( x=width*(i+K)/(2*K))
      x = this.canvasWidth * (i + this.attenuationCoefficient) / (2 * this.attenuationCoefficient);
      //加offset相当于把sin曲线向右平移
      y = this.halfCanvasHeight + this.halfCanvasHeight * this.amplitudePercentage / 1.5 * this.calcAttenuation(i) * heightPercentage *
        Math.sin(this.halfWaveCount / 3 * i + this.radianOffset3);
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }


  loop() {
    if (!this.isStop){
      this.radianOffset1 = (this.radianOffset1 + this.radianStep) % this.doublePI;
      this.radianOffset2 = (this.radianOffset2 + this.radianStep * 1.2) % this.doublePI;
      this.radianOffset3 = (this.radianOffset3 + this.radianStep * 0.8) % this.doublePI;
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawAcousticWave3(1, 1, 1);
      this.drawAcousticWave2(1, 1, 2);
      this.drawAcousticWave1(1, 1, 2);
      requestAnimationFrame(()=>{
        this.loop();
      });
    }
  }

  stop(){
    this.isStop = true;
  }

  start(){
    this.isStop = false;
    this.init();
  }

}

