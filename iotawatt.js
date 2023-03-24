const fetch = require('node-fetch');

let states = {};
let lastRun = {};

function report(device, state, diffInSeconds) {
  if (!!states[device] === state) return;

  const now = new Date();
  const duration = now - lastRun[device];
  if (!state && diffInSeconds && duration < diffInSeconds*1000) return;

  states[device] = state;
  lastRun[device] = now;
  console.log(new Date(), state ? '🏃‍♂️' : '✅', `${device} is ${state ? 'running!' : `done after ${(duration/60000.0).toFixed(2)} minutes`}`);
  // TODO report via mqtt
}

async function processIotaWatt() {
  const response = await fetch('http://iotawatt.local/query?select=[time.iso,Microwave.watts.d0,Dishwasher.watts.d0,GarbageDisposal.watts.d0,WasherRouter.watts.d0,Stove.watts.d0,Dryer.watts.d0,Oven.watts.d0,WarmingDrawer.watts.d0,MasterBedroom.watts.d0]&begin=s-10s&end=s&group=all');
  // looks like [["2022-04-10T22:04:55",17,1,0,28,0,0,1,0]]
  const data = await response.json();
  const [time, microwave, dishwasher, garbageDisposal, washer, stove, dryer, oven, warmingDrawer, masterBedroom] = data[0];

  report('microwave', microwave > 50);
  report('dishwasher', dishwasher > 10, 5 * 60);
  report('waterFilter', garbageDisposal > 100);
  report('garbageDisposal', garbageDisposal < 80 && garbageDisposal > 20);
  report('washer', washer > 42, washer > 35 ? 5 * 60 : 0);
  report('stove', stove > 100);
  report('dryer', dryer > 100);
  report('oven', oven > 100);
  report('warmingDrawer', warmingDrawer > 10);
  report('bedjet', masterBedroom > 200);
  report('iron', masterBedroom > 100 && masterBedroom < 200);

  // run again in 10 seconds
  setTimeout(processIotaWatt, 10000);
}

processIotaWatt();
