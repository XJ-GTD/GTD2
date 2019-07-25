# 项目跟进
用户可以设置跟进GitHub中管理项目的代码提交、持续集成、发布等通知

## 跟进
通过第三方网络服务提供的Web钩子(Webhooks), 获取在第三方服务中管理的内容变动通知。

### GITHUB
```生效设置
{
  "type": "FOGH",
  "key": "FOGH",
  "value": "0:关闭, 1:打开"
}
```

```令牌设置
{
  "type": "FOGHSECRET",
  "key": "FOGHSECRET",
  "value": "secret"
}
```

```实例数据
{
  "type": "FOGH_INS",
  "key": "GitHub Repository Name",
  "value": "{实例数据}"
}
```

### 集成 | FIR.IM
```生效设置
{
  "type": "FOFIR",
  "key": "FOFIR",
  "value": "0:关闭, 1:打开"
}
```

```实例数据
{
  "type": "FOFIR_INS",
  "key": "https://fir.im/下载链接",
  "value": "{实例数据}"
}
```

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

3. 共享人本地存储共享信息

    1. GITHUB
    ```实例共享数据
    {
      "type": "FOGH_INS_SHARE",
      "key": "GitHub Repository Name",
      "value": "{share:[{成员1},{成员n}]}"
    }
    ```

    2. 集成 | FIR.IM
    ```实例共享数据
    {
      "type": "FOFIR_INS_SHARE",
      "key": "https://fir.im/下载链接",
      "value": "{share:[{成员1},{成员n}]}"
    }
    ```
