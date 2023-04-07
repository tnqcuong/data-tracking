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
  const groupData = await getGroupData();

  const BTCdata = groupData["BTC"].map(item => (item.symbol));
  const USDTdata = groupData["USDT"].map(item => (item.symbol)).filter(e => e !== "BTTCUSDT");
  const BUSDdata = groupData["BUSD"].map(item => (item.symbol));

  const smallData = USDTdata.slice(0, 2);
  //console.log("item: " + JSON.stringify(smallData));
  USDTdata.forEach(item => {
    //const ws = new WebSocket("wss://fstream.binance.com/ws/" + item.toLowerCase() + "@kline_1m");
    const ws = new WebSocket("wss://stream.binance.com/ws/" + item.toLowerCase() + "@kline_1m");
    //let info = { Q: 0 };

    ws.on('message', function incoming(data) {
      const jsonData = JSON.parse(data.toString());
      // console.log("item: " + item);
      // console.log("jsonData: " + JSON.stringify(jsonData));
      const persent = ((jsonData.k.h - jsonData.k.l) / jsonData.k.l) * 100;

      /*if (jsonData.s === "BTCUSDT") {
        if (jsonData.k.x && jsonData.k.q > 50000000) {
          let message = ' - ' + jsonData.s + ' -- ' + persent + ' % -- ' + getCurrentTime();
          bot.telegram.sendMessage('1724440021', message, {});
          console.log(message);
        }
      }
      else {
        if (jsonData.k.x && jsonData.k.q > 15000000) {
          let message = ' - ' + jsonData.s + ' -- ' + persent + ' % -- ' + getCurrentTime();
          bot.telegram.sendMessage('1724440021', message, {});
          console.log(message);
        }
      }*/


       /*if (jsonData.k.x) {
         info.Q = (+jsonData.k.Q + +info.Q) / 2;
       }*/
       if (persent > 1.11 && jsonData.k.x) {
         let message = ' - ' + jsonData.s + ' -- ' + persent + ' % -- ' + getCurrentTime();
         let symbol = jsonData.s.substring(0, jsonData.s.indexOf("USDT"))
         bot.telegram.sendMessage('1724440021', message, {});
         console.log(`persent: ${persent} -- ${getCurrentTime()} -- ${jsonData.s} -- https://www.binance.com/en/trade/${symbol}_USDT?theme=dark&type=spot`);
       }
      //console.log(`h: ${jsonData.k.h} l: ${jsonData.k.l} `);
    });
  });
}

app.get('/', function (req, res) {
  res.send("Hello world");
});


//bot.launch();
mainFlow();
app.listen(8080);
//setInterval(mainFlow,10000);