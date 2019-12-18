
let timeObj;
onmessage = function (e) {
    let time = e.data ? e.data : 0;
    clearTimeout(timeObj);
    timeObj = setTimeout(() => {
      clearTimeout(timeObj);
      timeObj = null;
      postMessage("");
      self.close();
    }, time);
};
