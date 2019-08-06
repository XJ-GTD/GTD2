```mermaid
graph LR;
A(service.business) --> B(calendar.service);
B --> B1(savePlan);
B --> B2(removePlan);
B --> B3(savePlanItem);
B --> B4(removePlanItem);
```
