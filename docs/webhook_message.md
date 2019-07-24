# 项目跟进

## 团队共享
共享已设置的GitHub或者FIR.IM通知, 让团队所有成员都可以接收此通知

1. 个人设置的通知保存到服务器事件分发服务中
```TASK_TYPE
WEBHOOK
```

```TASK_RUNAT
{
  "eventId":"WEBHOOK_FIR.IM",
  "filters":[
    {
      "name":"webhook",
      "value":"fir.im"
    },
    {
      "name":"observer",
      "value":"43193b8cbd26b614fbc4b4885a9a512740a2df35"
    }
  ]
}
```

```TASK_RUNWITH
{
  "url":"https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger",
  "payload":{
    "userId":"13585820972",
    "webhook":"fir.im",
    "observer":"43193b8cbd26b614fbc4b4885a9a512740a2df35",
    "clientip":"222.64.177.189"
  }
}
```

2. 团队成员接收设置按照以下各式保存到服务器事件分发服务中
```TASK_TYPE
WEBHOOK_FORWARD
```

```TASK_RUNAT
{
  "eventId":"WEBHOOK_FIR.IM",
  "filters":[
    {
      "name":"webhook",
      "value":"fir.im"
    },
    {
      "name":"observer",
      "value":"43193b8cbd26b614fbc4b4885a9a512740a2df35"
    }
  ]
}
```

```TASK_RUNWITH
{
  "url":"https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger",
  "payload":{
    "from":"13585820972",
    "userId":"forwardto",
    "webhook":"fir.im",
    "observer":"43193b8cbd26b614fbc4b4885a9a512740a2df35",
    "clientip":"222.64.177.189"
  }
}
```
