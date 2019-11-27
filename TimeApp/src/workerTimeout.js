
let timeObj;
onmessage = function (e) {
  if (!timeObj){
    let time = e.data ? e.data : 0;
    timeObj = setTimeout(() => {
      clearTimeout(timeObj);
      timeObj = null;
      postMessage("");
    }, time);
  }
};
