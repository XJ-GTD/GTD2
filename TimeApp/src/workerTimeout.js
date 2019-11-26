onmessage = function (e) {
  let time = e.data ? e.data : 0;
  setTimeout(() => {
    console.log("当前任务=====测试timeout是否存活");
    postMessage("");
  }, time);
};
