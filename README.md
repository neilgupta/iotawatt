# IoTaWatt

IoTaWatt is a wifi energy meter that can monitor your home's total energy usage at the sub-circuit level. You can then query real-time usage via the local API.

This is my _very_ basic script for identifying when different appliances are running.

## URLs

http://iotawatt.local/query?select=[time.local.unix,Mains1.watts.d0,Mains2.watts.d0]&begin=s-1h&end=s&group=auto

http://iotawatt.local/query?select=[time.iso,Microwave.watts.d0,Dishwasher.watts.d0,GarbageDisposal.watts.d0,WasherRouter.watts.d0,Stove.watts.d0,Dryer.watts.d0,Oven.watts.d0,WarmingDrawer.watts.d0]&begin=s-10s&end=s&group=all

## Thresholds

Microwave > 50w -> running
Dishwasher > 10w -> running (needs to be less for at least 5min before we count it as off)
GarbageDisposal > 100w means water dispenser was used, >20W and < 80W is garbage disposal (wait until it goes back <1W)
WasherRouter > 45W -> running
Stove > 100W -> running
Dryer > 100W -> running
Oven > 100W -> running
WarmingDrawer > 10W

## Dependency

```bash
npm install node-fetch@2
node ./iotawatt.js
```
