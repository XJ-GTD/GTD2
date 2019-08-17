# Data Synchronize

数据多设备同步, 多账户间共享同步

## 账户/设备/数据结构

```mermaid
graph TB;
A(账户A) --> B(设备Da);
B --> P(日历Pa);
B --> Ea(日程Ea);
B --> Et(任务Et);
B --> M(备忘M);
A --> C(设备Db);
A --> D(...);
A1(账户B) --> B1(设备Da1);
B1 --> P1(日历Pa1);
A1 --> C1(设备Db1);
C1 --> Ea1(日程Ea1);
C1 --> Et1(任务Et1);
C1 --> M1(备忘M1);
A1 --> D1(...);
```

## 多设备同步

### 设备间同步只按照(数据类型, 日期, 名称)区别重复

数据ID使用原设备生成的ID, 新设备账户登录可以提示是否同步已存在设备的数据, 可选择设备。
服务器使用元数据ID作为识别唯一ID, 设备间同步在服务器端复制数据后, 由客户端下载, 完成同步。

```mermaid
graph TB;
A(账户A) --> B(设备Da);
B --> P(日历Pa);
B --> Ea(日程Ea);
B --> Et(任务Et);
B --> M(备忘M);
A --> C(设备Db);
C --> P1(日历Pa1);
A --> D(...);

```

## 多账户同步

### 账户间同步按照(数据ID)区别重复

多账户共享数据修改同步, 只同步共享数据第一次共享设备, 其它设备同步由多设备同步完成。

```mermaid
graph TB;
A(账户A) --> P(日历Pa);
A --> Et(任务Et);
A --> M(备忘M);
A --> Ea(日程Ea);
B(账户B) --> Ea1(日程Ea1);
B --> P1(日历Pa1);
B --> Et1(任务Et1);
B --> M1(备忘M1);
subgraph 共享数据
  Ea --> Eh(日程Ea<br/>共享);
  Ea1 --> Eh;
end
```

## 数据状态枚举

|   |账户A<br/>设备Da|服务器|账户B<br/>设备Db|
| ---  | ---  | ---  | ---  |
|      | [Plan, ID1XX1, ..., 未删除] | [账户A, 设备Da, Plan, ID1XX1, ID1XX1, ..., 未删除] |  |
| |  | [账户A, 设备Da, Plan, ID1XX2, ID1XX2, ..., 删除] |  |
| |  | [账户B, 设备Db, Plan, ID11X1, ID11X1, ..., 未删除] | [Plan, ID11X1, ..., 未删除] |
| | [PlanItem, ID2XX1, ..., 未删除] | [账户A, 设备Da, PlanItem, ID2XX1, ID2XX1, ..., 未删除] |  |
| |  | [账户A, 设备Da, PlanItem, ID2XX2, ID2XX2, ..., 删除] |  |
| |  | [账户B, 设备Db, PlanItem, ID21X1, ID21X1, ..., 未删除] | [PlanItem, ID21X1, ..., 未删除] |
| | [Task, ID3XX1, ..., 未删除] | [账户A, 设备Da, Task, ID3XX1, ID3XX1, ..., 未删除] |  |
| |  | [账户A, 设备Da, Task, ID3XX2, ID3XX2, ..., 删除] |  |
| |  | [账户B, 设备Db, Task, ID31X1, ID31X1, ..., 未删除] | [Task, ID31X1, ..., 未删除] |
| | [Agenda, ID4XX1, ..., 未删除] | [账户A, 设备Da, Agenda, ID4XX1, ID4XX1, ..., 未删除] |  |
| |  | [账户A, 设备Da, Agenda, ID4XX2, ID4XX2, ..., 删除] |  |
| |  | [账户B, 设备Db, Agenda, ID41X1, ID41X1, ..., 未删除] | [Agenda, ID41X1, ..., 未删除] |
| | [MiniTask, ID5XX1, ..., 未删除] | [账户A, 设备Da, MiniTask, ID5XX1, ID5XX1, ..., 未删除] |  |
| |  | [账户A, 设备Da, MiniTask, ID5XX2, ID5XX2, ..., 删除] |  |
| |  | [账户B, 设备Db, MiniTask, ID51X1, ID51X1, ..., 未删除] | [MiniTask, ID51X1, ..., 未删除] |
| | [Memo, ID6XX1, ..., 未删除] | [账户A, 设备Da, Memo, ID6XX1, ID6XX1, ..., 未删除] |  |
| |  | [账户A, 设备Da, Memo, ID6XX2, ID6XX2, ..., 删除] |  |
| |  | [账户B, 设备Db, Memo, ID61X1, ID61X1, ..., 未删除] | [Memo, ID61X1, ..., 未删除] |

