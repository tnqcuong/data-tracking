const axios = require('axios');
const url = require('url');
const { Telegraf } = require('telegraf')
const express = require('express');
const app = express();
const WebSocket = require('ws');

const bot = new Telegraf('2002135323:AAH7h98z9jMnDrke6_UU0zzy2IS5nXfA3gY');

const baseUrl = 'https://api.binance.com';
const apiUrl = {
  exchangeInfo: '/api/v3/exchangeInfo',
  candleStick: '/api/v3/klines',
}

const arrStr = ["btcusdt"];

// arrStr.forEach(item => {
//   const ws = new WebSocket("wss://stream.binance.com:9443/ws/" + item + "@kline_1s");

//   ws.on('message', function incoming(data) {
//     const jsonData = JSON.parse(data.toString());
//     console.log(`h: ${jsonData.k.h} l: ${jsonData.k.l} `);
//   });
// });


// const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');

// ws.on('message', function incoming(data) {
//   //console.log(data.toString());
//   const k = JSON.parse(data.toString()).k
//   const o = k.o;
//   const h = k.h;
//   const l = k.l;
//   console.log(data.toString());
// });

const groupByFn = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

async function getGroupData() {
  const res = await getExchangeInfo();
  const data = res.data.symbols.map(item => ({ symbol: item.symbol, baseAsset: item.baseAsset, quoteAsset: item.quoteAsset }));
  const filterData = data.filter(item => item.quoteAsset === "BTC" || item.quoteAsset === "USDT" || item.quoteAsset === "BUSD");
  const groupBy = groupByFn(filterData, "quoteAsset");
  return groupBy;
}

async function getExchangeInfo() {
  const config = {
    method: 'get',
    url: baseUrl + apiUrl.exchangeInfo,
    headers: { 'Content-Type': 'application/json' }
  }
  return await axios(config);


  BTCdata = groupData["BTC"].map(item => (item.symbol));
  const USDTdata = groupData["USDT"].map(item => (item.symbol));
  const BUSDdata = groupData["BUSD"].map(item => (item.symbol));

  console.log("res1: " + JSON.stringify(BTCdata));
  console.log("res2: " + JSON.stringify(USDTdata));
  console.log("res3: " + JSON.stringify(BUSDdata));

  const promises = BUSDdata.map(element => {
    getCandleStickInfo_1m(element.symbol).then(res => {
      console.log("values: " + JSON.stringify(res.data));
    }).catch(err => "");
  })
  Promise.allSettled(promises).then((values) => {
    // console.log("values: " + JSON.stringify(values));
    // console.log("values: " + typeof values);
  });
  // BUSDdata.forEach(element => {
  //   console.log(":::::::");
  //   getCandleStickInfo_1m(element.symbol);
  // });

}

async function getCandleStickInfo_1m(symbolVal) {
  let payload = { symbol: symbolVal, interval: '1m', limit: '1' };
  const params = new url.URLSearchParams(payload);

  const config = {
    method: 'get',
    url: baseUrl + apiUrl.candleStick + '?' + params.toString(),
    headers: { 'Content-Type': 'application/json' }
  }
  return await axios(config);
  // .then(function (res) {
  //   //console.log("res: " + JSON.stringify(res.data));
  //   // newBTCdata.push(symbolVal);
  //    console.log("symbolVal: " + symbolVal);
  //   return res.data;
  // })
  // .catch(function (error) {
  //   return null;
  //   if (error.response) {
  //     // Request made and server responded
  //     console.log(error.response.data);
  //     console.log(error.response.status);
  //     //console.log(error.response.headers);
  //   } else if (error.request) {
  //     // The request was made but no response was received
  //     //console.log(error.request);
  //   } else {
  //     // Something happened in setting up the request that triggered an Error
  //     console.log('Error', error.message);
  //   }

  // });
  //console.log("res: " + JSON.stringify(res.data));
}

async function getCandleStickInfo(symbolVal, interval, limit) {
  let payload = { symbol: symbolVal, interval: interval, limit: limit };
  const params = new url.URLSearchParams(payload);
  let res;

  const config = {
    method: 'get',
    url: baseUrl + apiUrl.candleStick + '?' + params.toString(),
    headers: { 'Content-Type': 'application/json' }
  }

  try {
    res = await axios(config);
  }
  catch (error) {
    return ''
  }
  //let res = await axios(config);

  return res.data;
}

async function getCandleStickInfoFuture(symbolVal, interval, limit) {
  let payload = { symbol: symbolVal, interval: interval, limit: limit };
  const params = new url.URLSearchParams(payload);
  let res;

  const config = {
    method: 'get',
    url: baseUrl + apiUrl.candleStick + '?' + params.toString(),
    headers: { 'Content-Type': 'application/json' }
  }

  try {
    res = await axios(config);
  }
  catch (error) {
    return ''
  }
  //let res = await axios(config);

  return res.data;
}

function getCandleIn(currency, symbolList, interval, limit, percent) {
  for (let j = 0; j < symbolList.length; j++) {
    setTimeout(function () {
      getCandleStickInfo(symbolList[j], interval, limit).then(res => {
        dataList = res;
        for (let i = 0; i < dataList.length; i++) {
          if ((dataList[i][4] - dataList[i][1]) > 0) {
            let percentUp = ((dataList[i][4] - dataList[i][1]) / dataList[i][1]) * 100;
            if (percentUp > percent) {

              let message = ' - ' + currency + ' -- ' + interval + ' -- ' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + ' -- ' + Math.round(percentUp * 100) / 100 + ' % -- ' + getCurrentTime() + '-- https://www.binance.com/en/trade/' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + '_USDT';
              //let message = ' - ' + currency + ' -- '+ interval + ' -- ' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + ' ' + Math.round(dataList[i][3]*100000)/100000 + '$ : Up ' + Math.round(percentUp*100)/100 + ' % ---- ' + getCurrentTime();
              bot.telegram.sendMessage('1724440021', message, {});
              console.log(message);
              // console.log("Vol: " + dataList[0][5] + " Time: " + dataList[0][6]);
              // console.log("Vol: " + dataList[1][5] + " Time: " + dataList[1][6]);
              // console.log("Vol: " + dataList[2][5] + " Time: " + dataList[2][6]);
              //break;
            }
          }


          // if(dataList.length == 3 && (parseFloat(dataList[2][5]) - 5.0 * (parseFloat(dataList[0][5]) + parseFloat(dataList[1][5]))) > 0){
          //     let message = ' - ' + currency + ' -- '+ interval + ' -- ' + symbolList[j].substring(0, symbolList[j].indexOf(currency))  + ' -- Vol Up -- ' + getCurrentTime() + '-- https://www.binance.com/en/trade/'+ symbolList[j].substring(0, symbolList[j].indexOf(currency)) +'_USDT';
          //     bot.telegram.sendMessage('1724440021', message, {});
          //     console.log(message);
          // }
        }
      });
    }, 100);
  }

}

function getCandleInFuture(currency, symbolList, interval, limit, percent) {
  for (let j = 0; j < symbolList.length; j++) {
    setTimeout(function () {
      getCandleStickInfoFuture(symbolList[j], interval, limit).then(res => {
        dataList = res;
        for (let i = 0; i < dataList.length; i++) {
          if ((dataList[i][4] - dataList[i][1]) > 0) {
            let percentUp = ((dataList[i][2] - dataList[i][3]) / dataList[i][3]) * 100;
            if (percentUp > percent) {
              //let message = ' - ' + currency + ' -- '+ interval + ' -- ' + symbolList[j].substring(0, symbolList[j].indexOf(currency))  + ' -- ' + Math.round(percentUp*100)/100 + ' % -- ' + getCurrentTime();
              let message = ' - ' + currency + ' -- ' + interval + ' -- ' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + ' -- UP ' + Math.round(percentUp * 100) / 100 + ' % -- ' + getCurrentTime() + '-- https://www.binance.com/en/futures/' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + 'USDT';
              bot.telegram.sendMessage('1724440021', message, {});
              console.log(message);
              break;
            }
          }
          else if ((dataList[i][1] - dataList[i][4]) > 0) {
            let percentDown = ((dataList[i][2] - dataList[i][3]) / dataList[i][3]) * 100;
            if (percentDown > percent) {
              let message = ' - ' + currency + ' -- ' + interval + ' -- ' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + ' -- DOWN ' + Math.round(percentDown * 100) / 100 + ' % -- ' + getCurrentTime() + '-- https://www.binance.com/en/futures/' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + 'USDT';
              bot.telegram.sendMessage('1724440021', message, {});
              console.log(message);
              break;
            }
          }
        }

      });
    }, 100);
  }
}

function getCurrentTime() {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  let timeString = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  //return timeString;
  return new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
}


async function mainFlow() {
   bot.telegram.sendMessage('1724440021', 'Bot is started at ' + getCurrentTime(), {});
  // // let symbolList = symbolStringUSDTFuture.split(',');

  // // for(let i = 0; i < symbolList.length; i++) {
  // //     console.log("https://www.binance.com/en/futures/" + symbolList[i]);
  // // }

  // //getCandleIn("USDT" ,symbolStringUSDT.split(','), '5m', '2', 0.5);
  // //getCandleIn("BUSD" ,symbolStringBUSD.split(','), '5m', '2', 2);
  // //getCandleIn("ETH" ,symbolStringETH.split(','), '5m', '2', 1);
  // //getCandleIn("BNB" ,symbolStringBNB.split(','), '5m', '2', 2);
  // //getCandleIn("BTC" ,symbolStringBTC.split(','), '15m', '2', 2);


  // // getCandleIn(symbolList, '5m', '1', 1);
  // // setInterval(function() { 
  // //     bot.telegram.sendMessage('1724440021', 'Bot is still alive.. ' + getCurrentTime(), {});
  // //     getCandleIn("USDT" ,symbolStringUSDT.split(','), '1m', '2', 1.3); 
  // // }, 60*1000);
  // //setInterval(function() { bot.telegram.sendMessage('1724440021', 'Bot is still alive.. ' + getCurrentTime(), {})}, 5*60*1000);

  // //setInterval(function() { getCandleIn("USDT" ,symbolStringUSDT.split(','), '1m', '2', 1.1); }, 60*1000);
  // setInterval(function() { getCandleInFuture("USDT" ,symbolStringUSDTFuture.split(','), '1m', '2', 0.89); }, 60*1000);
  // //setInterval(function() { getCandleIn("USDT" ,symbolStringUSDT.split(','), '3m', '2', 0.9); }, 3*60*1000);
  // //setInterval(function() { getCandleIn("USDT" ,symbolStringUSDT.split(','), '5m', '1', 1.1); }, 5*60*1000);
  // // setInterval(function() { getCandleIn("USDT" ,symbolStringUSDT.split(','), '15m', '1', 1.7); }, 15*60*1000);
  // // setInterval(function() { getCandleIn("BUSD" ,symbolStringBUSD.split(','), '1m', '1', 1.3); }, 60*1000);
  // //setInterval(function() { getCandleIn("BTC" ,symbolStringBTC.split(','), '3m', '2', 1.7); }, 3*60*1000);

  // // setInterval(function() {
  // //     getCurrentTime();
  // //     getCandleIn("BUSD" ,symbolStringUSDT.split(','), '1m', '2', 1);
  // // }, 60*1000);
  // // getCandleIn(symbolList, '15m', '1', 1.5);
  // // setInterval(function() {getCandleIn(symbolList, '15m', '1', 1.5)},15*60*1000);
  // // getCandleIn(symbolList, '15m', '1', 1.5);
  // // getCandleIn(symbolList, '30m', '1', 2);
  // // getCandleIn(symbolList, '1h', '1', 3);
  // // setInterval(function() {getCandleIn(symbolList, '3m', '1', 0.5)},3*60*1000);
  // //==========================
  // // getCandleIn(symbolList, '5m', '1', 1);
  // //setInterval(function() {getCandleIn(symbolList, '5m', '1', 1)},5*60*1000);
  // //==========================
  // //getCandleIn(symbolList, '15m', '1', 2.5);
  // //==========================
  // //getCandleIn(symbolList, '30m', '1', 3);
  // //getCandleIn(symbolList, '5m', '1', 1);
  // // setInterval(function() {getCandleIn(symbolList, '5m', '1', 1)},4*60*1000);
  // // let symbolList = [];
  // // let exchangeInfo = getExchangeInfo().then(res => {
  // //     let dataList = res.symbols;
  // //     for(let i = 0; i < dataList.length; i++){
  // //         if(dataList[i].quoteAsset == 'USDT'
  // //             && dataList[i].baseAsset != 'BCHSV'){
  // //             symbolList.push(dataList[i].symbol);
  // //         }
  // //     }

  // //     for(let i = symbolList.length - 1; i >= 0; i--){
  // //         if(symbolList[i].includes("DOWN") || symbolList[i].includes("UP") || symbolList[i].includes("BULL")){
  // //             symbolList.splice(i, 1);
  // //         }
  // //     }
  // //     console.log("=========1m=======");
  // //     console.log(symbolList.length);
  // //     console.log(symbolList.toString());
  // //     //getCandleIn(symbolList, '15m', '1', 3);
  // //     //setInterval(function() {getCandleIn(symbolList, '1m', '1')},60000);

  // // });

  const groupData = await getGroupData();

  const BTCdata = groupData["BTC"].map(item => (item.symbol));
  const USDTdata = groupData["USDT"].map(item => (item.symbol));
  const BUSDdata = groupData["BUSD"].map(item => (item.symbol));

  const smallData = BTCdata.slice(0,9);
  //console.log("item: " + JSON.stringify(smallData));
  USDTdata.forEach(item => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/" + item.toLowerCase() + "@kline_1s");
  
    ws.on('message', function incoming(data) {
      const jsonData = JSON.parse(data.toString());
      //const persent = ((parseFloat(jsonData.k.h) - parseFloat(jsonData.k.l))/parseFloat(jsonData.k.l)) * 100;
      const persent = ((jsonData.k.h - jsonData.k.l)/jsonData.k.l) * 100;
      if(persent > 0.49){
        let message = ' - ' + jsonData.s + ' -- ' + persent + ' % -- ' + getCurrentTime() ;
        bot.telegram.sendMessage('1724440021', message, {});
        console.log(`persent: ${persent} -- ${jsonData.s}`);
      }
      //console.log(`h: ${jsonData.k.h} l: ${jsonData.k.l} `);
    });
  });
}

app.get('/', function (req, res) {
  res.send("Hello world");
});


bot.launch();
mainFlow();
app.listen(8080);
//setInterval(mainFlow,10000);