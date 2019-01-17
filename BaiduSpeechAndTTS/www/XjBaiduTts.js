var exec = require('cordova/exec');


var xjBaiduTtsApi = {
    startSpeak:function(success,error,speakMessage){
        exec(success,error,"XjBaiduTts","speak",[speakMessage]);
    },
    speakStop:function(success,error,speakMessage){
        exec(success,error,"XjBaiduTts","stop",[]);
    }
};

module.exports = xjBaiduTtsApi;