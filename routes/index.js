var express = require("express");
var router = express.Router();
const axios = require("axios");
const url = require("url");

const baseUrl = "https://api.binance.com";
const apiUrl = {
  exchangeInfo: "/api/v3/exchangeInfo",
  candleStick: "/api/v3/klines",
};

const headersParams = { "Content-Type": "application/json" };
const params = {};

function getExchangeInfo() {
  let res;

  const config = {
    method: "get",
    url: baseUrl + apiUrl.exchangeInfo,
    headers: headersParams,
  };

  axios(config)
  .then((response) => {
    console.log(response);
    res = response.data;
  }, (error) => {
    console.log(error);
  });
  
  return res;
}

getExchangeInfo();


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "text" });
});

module.exports = router;

// async function getCandleStickInfo(symbolVal) {
//   let payload = { symbol: symbolVal, interval: "5m", limit: "1" };
//   const params = new url.URLSearchParams(payload);

//   const config = {
//     method: "get",
//     url: baseUrl + apiUrl.candleStick + "?" + params.toString(),
//     headers: { "Content-Type": "application/json" },
//   };

//   let res = await axios(config);
//   return res.data;
// }

// function mainFlow() {
//   //console.clear();
//   console.log("=====================");
//   let symbolList = [];
//   let result = [];
//   let exchangeInfo = getExchangeInfo().then((res) => {
//       let dataList = res.symbols;
//       for (let i = 0; i < dataList.length; i++) {
//         if (dataList[i].quoteAsset == "USDT") {
//           symbolList.push(dataList[i]);
//         }
//       }

//       for (let j = 0; j < symbolList.length; j++) {
//         getCandleStickInfo(symbolList[j].symbol).then((res) => {
//             dataList = res;
//             for (let i = 0; i < dataList.length; i++) {
//               if (dataList[i][4] - dataList[i][1] > 0) {
//                 let percentUp =
//                   ((dataList[i][4] - dataList[i][1]) / dataList[i][1]) * 100;
//                 if (percentUp > 1) {
//                   result.push(symbolList[j]);
//                   console.log(symbolList[j].baseAsset + " : " + percentUp);
//                   break;
//                 }
//               }
//             }
//         });
//       }
//   });
// }

// setInterval(() => mainFlow(), 60*1000);
