import {TimeOutService} from "../../util/timeOutService";
import {ChangeDetectorRef, Injectable} from "@angular/core";

@Injectable()
export class DetectorService {

  changeDetectorRefs: Array<ChangeDetectorRef> = new Array<ChangeDetectorRef>();
  constructor(private timeOutService:TimeOutService) {
  }

  detector(){
    this.timeOutService.timeout(1000,()=>{
      this.detectorRef();
    },"onpush.detector.ref");
  }

  private detectorRef(){
    this.changeDetectorRefs.forEach((v) =>{
      v.detectChanges();
    })
  }

  registerDetector(detector:ChangeDetectorRef){
    let tmp = this.changeDetectorRefs.find((v)=>{
        return v == detector;
    });

    if (!tmp){
      detector.detach();
      this.changeDetectorRefs.push(detector);
    }
  }
}
