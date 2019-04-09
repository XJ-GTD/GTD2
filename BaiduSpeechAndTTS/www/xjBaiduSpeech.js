var exec = require('cordova/exec');


var xjBaiduSpeechApi = {
    startListen:function (success,error){
        exec(success, error, 'XjBaiduSpeech', 'start', []);
    },
    stopListen:function(){
        exec(null,null,"XjBaiduSpeech","stop",[]);
    },
    cancelListen:function(){
        exec(null,null,"XjBaiduSpeech","cancel",[]);
    },
    releaseListen:function(){
        exec(null,null,"XjBaiduSpeech","release",[]);
    }
};

module.exports = xjBaiduSpeechApi;




