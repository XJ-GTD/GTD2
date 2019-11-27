
let timeObj;
onmessage = function (e) {
  if (!timeObj){
    let time = e.data ? e.data : 0;
    timeObj = setTimeout(() => {
      console.log("当前任务=====测试timeout是否存活");
      clearTimeout(timeObj);
      timeObj = null;
      postMessage("");
    }, time);
  }
};
