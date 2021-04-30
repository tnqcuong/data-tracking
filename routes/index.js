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
