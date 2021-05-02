var express = require("express");
var router = express.Router();
const axios = require("axios");
const url = require("url");

const baseUrl = "https://api.binance.com";
const apiUrl = {
  exchangeInfo: "/api/v3/exchangeInfo",
  candleStick: "/api/v3/klines",
};

const headersParams = {
  "Content-Type": "application/json"
};
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
      // console.clear();
      console.log('===========================')
      res = response.data;
      let dataList = res.symbols;
      let symbolList = [];
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].quoteAsset == "USDT") {
          symbolList.push(dataList[i]);
        }
      }

      let result = [];

      for (let j = 0; j < symbolList.length; j++) {
        getCandleStickInfo(symbolList[j].symbol, '1m').then((res) => {
          if(res.data){
            dataList = res.data;
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i][4] - dataList[i][1] > 0) {
                let percentUp = ((dataList[i][4] - dataList[i][1]) / dataList[i][1]) * 100;
                if (percentUp > 0 && !symbolList[j].baseAsset.includes('BEAR') && !symbolList[j].baseAsset.includes('BULL') && !symbolList[j].baseAsset.includes('UP') && !symbolList[j].baseAsset.includes('DOWN') && symbolList[j].baseAsset != 'BCHSV' && symbolList[j].baseAsset != 'STORM' && symbolList[j].baseAsset != 'ERD' && symbolList[j].baseAsset != 'XZC') {
                  if(percentUp > 0.5){
                    console.log('==1m==: ' + symbolList[j].baseAsset + " : " + percentUp);
                  }
                  getCandleStickInfo(symbolList[j].symbol, '5m').then((res) => {
                    let dataList1 = res.data;
                    for (let i = 0; i < dataList1.length; i++) {
                      if (dataList1[i][4] - dataList1[i][1] > 0) {
                        let percentUp = ((dataList1[i][4] - dataList1[i][1]) / dataList1[i][1]) * 100;
                        if (percentUp > 0.5) {
                          if(percentUp > 1){
                            console.log('==5m==: ' + symbolList[j].baseAsset + " : " + percentUp);
                          }
                          getCandleStickInfo(symbolList[j].symbol, '15m').then((res) => {
                            let dataList2 = res.data;
                            for (let i = 0; i < dataList2.length; i++) {
                              if (dataList2[i][4] - dataList2[i][1] > 0) {
                                let percentUp = ((dataList2[i][4] - dataList2[i][1]) / dataList1[i][1]) * 100;
                                if (percentUp > 1) {
                                  if(percentUp > 1.5){
                                    console.log('==15m==: ',symbolList[j].baseAsset);
                                  }
                                  
                                  getCandleStickInfo(symbolList[j].symbol, '30m').then((res) => {
                                    let dataList3 = res.data;
                                    for (let i = 0; i < dataList3.length; i++) {
                                      if (dataList3[i][4] - dataList3[i][1] > 0) {
                                        let percentUp = ((dataList3[i][4] - dataList3[i][1]) / dataList1[i][1]) * 100;
                                        if (percentUp > 2) {
                                          console.log(symbolList[j].baseAsset + " : " + percentUp);
                                          break;
                                        }
                                      }
                                    }
                                  });
                                  
                                  //console.log(symbolList[j].baseAsset + " : " + percentUp);
                                  break;
                                }
                              }
                            }
                          });
  
                          //console.log(symbolList[j].baseAsset + " : " + percentUp);
                          break;
                        }
                      }
                    }
                  });
  
                  // result.push(symbolList[j]);
                  // console.log(symbolList[j].baseAsset + " : " + percentUp);
                  break;
                }
              }
            }
          }
        });
      }
    }, (error) => {
      console.log(error.data.message);
    });

  return res;
}

async function getCandleStickInfo(symbolVal, time) {
  
  let payload = {
    symbol: symbolVal,
    interval: time,
    limit: "1"
  };
  const params = new url.URLSearchParams(payload);

  const config = {
    method: "get",
    url: baseUrl + apiUrl.candleStick + "?" + params.toString(),
    headers: {
      "Content-Type": "application/json"
    },
  };

  try {
    return await axios(config);
  } catch (error) {
    //console.error(error.data.message)
  }
}

// getExchangeInfo();
setInterval(() => getExchangeInfo(), 60*1000);

//setInterval(() => dataTracking(), 1*1000);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "text"
  });
});

module.exports = router;

