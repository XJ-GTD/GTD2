import {
  Platform,
  DomController,
  GestureController, GESTURE_ITEM_SWIPE, SlideGesture, SlideData
} from "ionic-angular";
import {TdlPage} from "./tdl";
import {GESTURE_PRIORITY_SLIDING_ITEM} from "ionic-angular/gestures/gesture-controller";
import {CalendarAnimation} from "../../components/ion2-calendar/calendar-animation";
import {CalendarComponent} from "../../components/ion2-calendar";
import {pointerCoord} from "ionic-angular/util/dom";
import {clamp} from "ionic-angular/util/util";

export class TdlGesture extends SlideGesture {

  constructor(plt: Platform, tdl: TdlPage, gestureCtrl: GestureController, domCtrl: DomController,private calendarComponent:CalendarComponent)
  {
    super(plt, tdl.getNativeElement(), {
      direction: 'y',
      threshold: 5,
      zone: false,
      passive: true,
      domController: domCtrl,
      gesture: gestureCtrl.createGesture({
        name: GESTURE_ITEM_SWIPE,
        priority: GESTURE_PRIORITY_SLIDING_ITEM,
        disableScroll: true
      })});
  }

 onDragMove(ev) {
    var slide = this.slide;
    var coord = pointerCoord(ev);
    var newPos = coord[this.direction];
    var newTimestamp = Date.now();
    var velocity = (!this.plt.isRTL ? (slide.pos - newPos) : (newPos - slide.pos)) / (newTimestamp - slide.timestamp);
    slide.pos = newPos;
    slide.timestamp = newTimestamp;
    slide.distance = clamp(slide.min, (!this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos) + slide.elementStartPos, slide.max);
    slide.velocity = velocity;
    slide.delta = (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos);
    this.onSlide(slide, ev);
  };

  onSlideStart(_slide?: SlideData, _ev?: any): void{
     this.calendarComponent.calendarAnimation.colseStart();

  }

  onSlide(_slide?: SlideData, _ev?: any): void{
    // var z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
     var stepValue = (_slide.distance / 200);
    this.calendarComponent.calendarAnimation.colseProgess(stepValue);

  }
  onSlideEnd(_slide?: SlideData, _ev?: any): void{

    if (_slide.distance <= 0){
       return ;
    }


    var currentStepValue = (_slide.distance / 200);
    var velocity = _slide.velocity;
    let shouldComplete:boolean = currentStepValue > 0.5 || _slide.delta > 20;

    // if (shouldComplete)
      this.calendarComponent.calendarAnimation.colseEnd(shouldComplete, currentStepValue, velocity,()=>{
         if (shouldComplete)
          this.calendarComponent.changestat();
      });
    // else
    //   this.calendarComponent.calendarAnimation.openView(()=>{},true);


  }
}
