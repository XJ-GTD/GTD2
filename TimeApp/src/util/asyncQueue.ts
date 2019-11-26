import * as DLL from "async/internal/DoublyLinkedList.js"
import * as noopF from "lodash/noop.js"
import * as wrapAsync from "async/internal/wrapAsync.js"
import * as onlyOnce from "async/internal/onlyOnce.js"
import * as isArray from "lodash/isArray.js"
import * as baseIndexOf from "lodash/_baseIndexOf.js"



export class AsyncQueue {
  _worker: any;
  numRunning: number;
  workersList = [];
  // processingScheduled: boolean;

  _tasks: DLL = new DLL();
  concurrency: number;
  payload: number;
  buffer: number;
  saturated: Function =  noopF;
  unsaturated:Function =noopF;
  empty: Function = noopF;
  drain: Function =noopF;
  error: Function = noopF;
  started: boolean = false;
  paused: boolean = false;
  isProcessing: boolean = false;
   timeoutWork:Worker;

  constructor(worker, concurrency, payload) {
    if (concurrency == null) {
      concurrency = 1;
    } else if (concurrency === 0) {
      throw new Error('Concurrency must not be zero');
    }

    this._worker = wrapAsync.default(worker);
    this.numRunning = 0;
    this.workersList = [];
    // this.processingScheduled = false;
    this.concurrency = concurrency;
    this.payload = payload;
    this.buffer = this.concurrency / 4;
    this.timeoutWork = new Worker("./workerTimeout.js");


    this.timeoutWork.onmessage = (e)=> {
      while (!this.paused && this.numRunning < this.concurrency && this._tasks.length) {
        var tasks = [], data = [];
        var l = this._tasks.length;
        if (this.payload) l = Math.min(l, this.payload);
        for (var i = 0; i < l; i++) {
          var node = this._tasks.shift();
          tasks.push(node);
          this.workersList.push(node);
          data.push(node.data);
        }

        this.numRunning += 1;

        if (this._tasks.length === 0) {
          this.empty();
        }

        if (this.numRunning === this.concurrency) {
          this.saturated();
        }

        let cb = onlyOnce(this._next(tasks));
        this._worker(data[0], cb);
      }
      this.isProcessing = false;
    };

  }

  private _insert(data, insertAtFront, callback) {
    if (callback != null && typeof callback !== 'function') {
      throw new Error('task callback must be a function');
    }
    this.started = true;
    if (!isArray(data)) {
      data = [data];
    }
    if (data.length === 0 && this.idle()) {
      // call drain immediately if there are no tasks
      return  this.drain();
    }

    for (var i = 0, l = data.length; i < l; i++) {
      var item = {
        data: data[i],
        callback: callback || noopF
      };

      if (insertAtFront) {
        this._tasks.unshift(item);
      } else {
        this._tasks.push(item);
      }
    }

        this.process();
    // if (!this.processingScheduled) {
    //   this.processingScheduled = true;
    //   setImmediate.default(()=> {
    //     this.processingScheduled = false;
    //     this.process();
    //   });
    // }
  }

  private _next(tasks) {
    return  (err)=> {
      this.numRunning -= 1;

      for (var i = 0, l = tasks.length; i < l; i++) {
        let task = tasks[i];

        let index = baseIndexOf(this.workersList, task, 0);
        if (index === 0) {
          this.workersList.shift();
        } else if (index > 0) {
          this.workersList.splice(index, 1);
        }

        task.callback.apply(task, err);

        if (err != null) {
          this.error(err, task.data);
        }
      }

      if (this.numRunning <= (this.concurrency - this.buffer)) {
        this.unsaturated();
      }

      if (this.idle()) {
        this.drain();
      }
      this.process();
    };
  }

  public push(data, callback) {
    this._insert(data, false, callback);
  }

  public kill() {
    this.drain = noopF;
    this._tasks.empty();
  }

  public unshift(data, callback) {
    this._insert(data, true, callback);
  }

  public remove(testFn) {
    this._tasks.remove(testFn);
  }

  public process() {
    // Avoid trying to start too many processing operations. This can occur
    // when callbacks resolve synchronously (#1267).
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    this.timeoutWork.postMessage(300);
  }

  public length() {
    return this._tasks.length;
  }

  public running() {
    return this.numRunning;
  }

  public workersLis() {
    return this.workersList;
  }

  public idle() {
    return this._tasks.length + this.numRunning === 0;
  }

  public pause() {
    this.paused = true;
  }

  public resume() {
    if (this.paused === false) {
      return;
    }
    this.paused = false;
    this.process();
    // setImmediate.default(()=>{
    //   this.process()
    // });
  }
}
