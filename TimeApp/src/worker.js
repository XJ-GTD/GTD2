// importScripts("cordova.js")
// importScripts("./build/polyfills.js")
// importScripts("./build/vendor.js")
// importScripts("./build/main.js")
onmessage = function (e) {
  // var speaker = new AssistantService();
  // speaker.speakText(e.data);
  // console.log(e.data);
  test();
};

function test(){
  setTimeout(()=>{
    console.log("当前任务=====timeout=====进入" + + new Date().getSeconds());
    // postMessage("22221111");
    test();
  },1000);
}
