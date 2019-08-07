```mermaid
graph LR;
    a --> b
    a --> b1
    a1 --> b
    a1 --> b1
    subgraph 页面
        a(page) --> a1(page.service)
        a --> a2(page.datamap)
    end
    v1 --> b
    v1 --> b1
    subgraph 语音
        v(ws) --> v1(ws.process)
        v --> v2(ws.datamap)
    end
    b --> c
    b --> c1
    b --> d
    b --> d1
    subgraph 服务
    	b(service) --> b1(service.datamap)
        subgraph 数据库
        c(table.service) --> c1(table.datamap)
        end
        subgraph Restful
        d(restful.service) --> d1(restful.datamap)
        end
    end

```

使用样例
```typescript
//table.datamap

export class EVTbl implements ITbl {
	evi: string;
	evn: string;
}

//service.datamap

export class EventData implements EVTbl {
	repeatType: RepeatEnum;
}

//page.datamap

export class PageEventData implements EventData {
	hasAddress: boolean = false;
}
```