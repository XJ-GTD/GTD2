var exec = require('cordova/exec');


var xjBaiduTtsApi = {
    startSpeak:function(success,error,speakMessage){
        exec(success,error,"XjBaiduTts","speak",[speakMessage]);
    }
};

module.exports = xjBaiduTtsApi;