var exec = require('cordova/exec');


var xjBaiduWakeUpApi = {


    wakeUpStart:function (success,error){
        exec(success, error, 'XjBaiduWakeUp', 'start', []);
    },
    wakeUpStop:function(){
        exec(null,null,"XjBaiduWakeUp","stop",[]);
    },
    wakeUpCancel:function(){
        exec(null,null,"XjBaiduWakeUp","cancel",[]);
    },
    wakeUpRelease:function(){
        exec(null,null,"XjBaiduWakeUp","release",[]);
    }
};

module.exports = xjBaiduWakeUpApi;




