onmessage = function (e) {
  console.log(e.data);
  postMessage("22221111");
  // testTimeOut(0);
};

testTimeOut = function(i){
  setTimeout(()=>{
    console.log("setTimeout ====" + i++ );
    this.testTimeOut(i);
  },1000)
}
