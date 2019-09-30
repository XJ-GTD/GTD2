/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
import {Animation, Platform} from "ionic-angular";
import {CalendarComponent} from "./components/calendar.component";

export class CalendarAnimation{

  //列表上移
  ani:Animation;
  viewHeight:number;
  viewAni:Animation;

  constructor(
    private plt:Platform,private calendar:CalendarComponent) {
    this.ani = new Animation(plt);

    this.ani
      .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
      .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
      .duration(280);

    this.viewHeight = this.calendar.cardContent.getElementRef().nativeElement.offsetHeight;

    this.viewAni = new Animation(this.plt, this.calendar.cardContent.getElementRef().nativeElement);
    this.viewAni.fromTo('height',this.viewHeight + "px","0px");
    // this.viewAni.fromTo('top',"0px",this.viewHeight * -1 + "px");
    this.ani.add(this.viewAni);

  }

  closeView(done,animated){
    let ani = this.ani
      .onFinish(done, true, true)
      .reverse(false);
    if (animated) {
      ani.play();
    }
    else {
      ani.syncPlay();
    }
  }
  openView(done,animated){
    let ani = this.ani
      .onFinish(done, true, true)
      .reverse(true);
    if (animated) {
      ani.play();
    }
    else {
      ani.syncPlay();
    }
  }
  colseStart(){
    // the cloned animation should not use an easing curve during seek
    this.ani
      .reverse(false)
      .progressStart();
  }
  colseProgess(stepValue:number){
    this.ani.progressStep(stepValue);
  }
  colseEnd(shouldComplete: boolean, currentStepValue: number, velocity: number, done: Function){
    var ani = this.ani;
    ani.onFinish( ()=> {
      done();
      //this.closeView();
    }, true);
    var factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
    var dur = ani.getDuration() * factor;


    ani.progressEnd(shouldComplete, currentStepValue, dur);

  }
}

