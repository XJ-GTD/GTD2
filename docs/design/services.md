```mermaid
graph LR;
A(service.business) --> B(calendar.service);
B --> B1(保存日历<br/>savePlan);
B --> B2(removePlan);
B --> B3(保存日历项<br/>savePlanItem);
B --> B4(removePlanItem);
B --> B5(fetchAllPlans);
B --> B6(fetchPrivatePlans);
B --> B7(fetchPublicPlans);
B --> B8(fetchPlanItems);
B --> B9(downloadPublicPlan);
B --> B10(fetchMonthActivities);
B --> B11(mergeMonthActivities);
B --> B12(fetchDayActivities);
B --> B13(MergeDayActivities);
B --> B14(findActivities);
B --> B15(sharePlan);
A(service.business) --> C(event.service);
C --> C1(saveAgenda);
C --> C2(saveTask);
C --> C3(saveMiniTask);
C --> C4(shareEvent);
A(service.business) --> D(memo.service);
D --> D1(saveMemo);
D --> D2(removeMemo);
D --> D3(shareMemo);
```
