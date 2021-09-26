const axios = require('axios');
const url = require('url');
const { Telegraf } = require('telegraf')

const bot = new Telegraf('2002135323:AAH7h98z9jMnDrke6_UU0zzy2IS5nXfA3gY');

const baseUrl = 'https://api.binance.com';
const apiUrl = {
    exchangeInfo: '/api/v3/exchangeInfo',
    candleStick: '/api/v3/klines',
}

async function getExchangeInfo() {
    const config = {
        method: 'get',
        url: baseUrl + apiUrl.exchangeInfo,
        headers: { 'Content-Type': 'application/json' }
    }
    let res = await axios(config);
    return res.data;
}

async function getCandleStickInfo_1m(symbolVal) {
    let payload = {symbol: symbolVal, interval: '1m', limit: '1'};
    const params = new url.URLSearchParams(payload);

    const config = {
        method: 'get',
        url: baseUrl + apiUrl.candleStick + '?' + params.toString(),
        headers: { 'Content-Type': 'application/json' }
    }

    let res = await axios(config);
    return res.data;
}

async function getCandleStickInfo(symbolVal, interval, limit) {
    let payload = {symbol: symbolVal, interval: interval, limit: limit};
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

function getCandleIn(currency, symbolList, interval, limit, percent){
    for(let j = 0; j < symbolList.length; j++){
        setTimeout(function() {
            getCandleStickInfo(symbolList[j], interval, limit).then(res =>{
                dataList = res;
                for(let i = 0; i < dataList.length; i++) {
                    if((dataList[i][4] - dataList[i][1]) > 0){
                        let percentUp = ((dataList[i][4] - dataList[i][1])/dataList[i][1]) * 100;
                        if (percentUp > percent){
                            let message = ' - ' + currency + ' ---- ' + symbolList[j].substring(0, symbolList[j].indexOf(currency)) + ' : Up ' + Math.round(percentUp*100)/100 + ' % ---- ' + getCurrentTime();
                            console.log(message);
                            bot.telegram.sendMessage('1724440021', message, {});
                            break;
                        }
                    }
                }
            });
          }, 10);
        
    }
}

function getCurrentTime(){
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
    return new Date().toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
}


function mainFlow(){
    
    let symbolStringUSDT = 'BTCUSDT,ETHUSDT,BNBUSDT,NEOUSDT,LTCUSDT,QTUMUSDT,ADAUSDT,XRPUSDT,EOSUSDT,TUSDUSDT,IOTAUSDT,XLMUSDT,ONTUSDT,TRXUSDT,ETCUSDT,ICXUSDT,VENUSDT,NULSUSDT,VETUSDT,PAXUSDT,BCHABCUSDT,USDCUSDT,LINKUSDT,WAVESUSDT,BTTUSDT,USDSUSDT,ONGUSDT,HOTUSDT,ZILUSDT,ZRXUSDT,FETUSDT,BATUSDT,XMRUSDT,ZECUSDT,IOSTUSDT,CELRUSDT,DASHUSDT,NANOUSDT,OMGUSDT,THETAUSDT,ENJUSDT,MITHUSDT,MATICUSDT,ATOMUSDT,TFUELUSDT,ONEUSDT,FTMUSDT,ALGOUSDT,USDSBUSDT,GTOUSDT,ERDUSDT,DOGEUSDT,DUSKUSDT,ANKRUSDT,WINUSDT,COSUSDT,NPXSUSDT,COCOSUSDT,MTLUSDT,TOMOUSDT,PERLUSDT,DENTUSDT,MFTUSDT,KEYUSDT,DOCKUSDT,WANUSDT,FUNUSDT,CVCUSDT,CHZUSDT,BANDUSDT,BUSDUSDT,BEAMUSDT,XTZUSDT,RENUSDT,RVNUSDT,HCUSDT,HBARUSDT,NKNUSDT,STXUSDT,KAVAUSDT,ARPAUSDT,IOTXUSDT,RLCUSDT,MCOUSDT,CTXCUSDT,BCHUSDT,TROYUSDT,VITEUSDT,FTTUSDT,EURUSDT,OGNUSDT,DREPUSDT,TCTUSDT,WRXUSDT,BTSUSDT,LSKUSDT,BNTUSDT,LTOUSDT,AIONUSDT,MBLUSDT,COTIUSDT,STPTUSDT,WTCUSDT,DATAUSDT,SOLUSDT,CTSIUSDT,HIVEUSDT,CHRUSDT,GXSUSDT,ARDRUSDT,LENDUSDT,MDTUSDT,STMXUSDT,KNCUSDT,REPUSDT,LRCUSDT,PNTUSDT,COMPUSDT,BKRWUSDT,SCUSDT,ZENUSDT,SNXUSDT,VTHOUSDT,DGBUSDT,GBPUSDT,SXPUSDT,MKRUSDT,DAIUSDT,DCRUSDT,STORJUSDT,MANAUSDT,AUDUSDT,YFIUSDT,BALUSDT,BLZUSDT,IRISUSDT,KMDUSDT,JSTUSDT,SRMUSDT,ANTUSDT,CRVUSDT,SANDUSDT,OCEANUSDT,NMRUSDT,DOTUSDT,LUNAUSDT,RSRUSDT,PAXGUSDT,WNXMUSDT,TRBUSDT,BZRXUSDT,SUSHIUSDT,YFIIUSDT,KSMUSDT,EGLDUSDT,DIAUSDT,RUNEUSDT,FIOUSDT,UMAUSDT,BELUSDT,WINGUSDT,UNIUSDT,NBSUSDT,OXTUSDT,SUNUSDT,AVAXUSDT,HNTUSDT,FLMUSDT,ORNUSDT,UTKUSDT,XVSUSDT,ALPHAUSDT,AAVEUSDT,NEARUSDT,FILUSDT,INJUSDT,AUDIOUSDT,CTKUSDT,AKROUSDT,AXSUSDT,HARDUSDT,DNTUSDT,STRAXUSDT,UNFIUSDT,ROSEUSDT,AVAUSDT,XEMUSDT,SKLUSDT,SUSDUSDT,GRTUSDT,JUVUSDT,PSGUSDT,1INCHUSDT,REEFUSDT,OGUSDT,ATMUSDT,ASRUSDT,CELOUSDT,RIFUSDT,BTCSTUSDT,TRUUSDT,CKBUSDT,TWTUSDT,FIROUSDT,LITUSDT,SFPUSDT,DODOUSDT,CAKEUSDT,ACMUSDT,BADGERUSDT,FISUSDT,OMUSDT,PONDUSDT,DEGOUSDT,ALICEUSDT,LINAUSDT,PERPUSDT,RAMPUSDT,SUPERUSDT,CFXUSDT,EPSUSDT,AUTOUSDT,TKOUSDT,PUNDIXUSDT,TLMUSDT,BTGUSDT,MIRUSDT,BARUSDT,FORTHUSDT,BAKEUSDT,BURGERUSDT,SLPUSDT,SHIBUSDT,ICPUSDT,ARUSDT,POLSUSDT,MDXUSDT,MASKUSDT,LPTUSDT,NUUSDT,XVGUSDT,ATAUSDT,GTCUSDT,TORNUSDT,KEEPUSDT,ERNUSDT,KLAYUSDT,PHAUSDT,BONDUSDT,MLNUSDT,DEXEUSDT,C98USDT,CLVUSDT,QNTUSDT,FLOWUSDT,TVKUSDT,MINAUSDT,RAYUSDT,FARMUSDT,ALPACAUSDT,QUICKUSDT,MBOXUSDT,FORUSDT,REQUSDT,GHSTUSDT,WAXPUSDT,TRIBEUSDT,GNOUSDT,XECUSDT,ELFUSDT,DYDXUSDT,POLYUSDT,IDEXUSDT,VIDTUSDT,USDPUSDT,GALAUSDT';
    let symbolStringBUSD = 'BNBBUSD,BTCBUSD,XRPBUSD,ETHBUSD,LTCBUSD,LINKBUSD,ETCBUSD,TRXBUSD,EOSBUSD,XLMBUSD,ADABUSD,BCHBUSD,QTUMBUSD,VETBUSD,EURBUSD,BULLBUSD,BEARBUSD,ETHBULLBUSD,ETHBEARBUSD,ICXBUSD,BTSBUSD,BNTBUSD,ATOMBUSD,DASHBUSD,NEOBUSD,WAVESBUSD,XTZBUSD,EOSBULLBUSD,EOSBEARBUSD,XRPBULLBUSD,XRPBEARBUSD,BATBUSD,ENJBUSD,NANOBUSD,ONTBUSD,RVNBUSD,STRATBUSD,AIONBUSD,ALGOBUSD,BTTBUSD,TOMOBUSD,XMRBUSD,ZECBUSD,BNBBULLBUSD,BNBBEARBUSD,DATABUSD,SOLBUSD,CTSIBUSD,ERDBUSD,HBARBUSD,MATICBUSD,WRXBUSD,ZILBUSD,KNCBUSD,REPBUSD,LRCBUSD,IQBUSD,GBPBUSD,DGBBUSD,COMPBUSD,BKRWBUSD,SXPBUSD,SNXBUSD,VTHOBUSD,DCRBUSD,STORJBUSD,IRISBUSD,MKRBUSD,DAIBUSD,RUNEBUSD,MANABUSD,DOGEBUSD,LENDBUSD,ZRXBUSD,AUDBUSD,FIOBUSD,AVABUSD,IOTABUSD,BALBUSD,YFIBUSD,BLZBUSD,KMDBUSD,JSTBUSD,SRMBUSD,ANTBUSD,CRVBUSD,SANDBUSD,OCEANBUSD,NMRBUSD,DOTBUSD,LUNABUSD,IDEXBUSD,RSRBUSD,PAXGBUSD,WNXMBUSD,TRBBUSD,BZRXBUSD,SUSHIBUSD,YFIIBUSD,KSMBUSD,EGLDBUSD,DIABUSD,BELBUSD,SWRVBUSD,WINGBUSD,CREAMBUSD,UNIBUSD,AVAXBUSD,FLMBUSD,CAKEBUSD,XVSBUSD,ALPHABUSD,VIDTBUSD,AAVEBUSD,NEARBUSD,FILBUSD,INJBUSD,AERGOBUSD,ONEBUSD,AUDIOBUSD,CTKBUSD,BOTBUSD,KP3RBUSD,AXSBUSD,HARDBUSD,DNTBUSD,CVPBUSD,STRAXBUSD,FORBUSD,UNFIBUSD,FRONTBUSD,ROSEBUSD,SYSBUSD,HEGICBUSD,PROMBUSD,SKLBUSD,COVERBUSD,GHSTBUSD,DFBUSD,JUVBUSD,PSGBUSD,BTCSTBUSD,TRUBUSD,DEXEBUSD,USDCBUSD,TUSDBUSD,PAXBUSD,CKBBUSD,TWTBUSD,LITBUSD,SFPBUSD,FXSBUSD,DODOBUSD,BAKEBUSD,UFTBUSD,1INCHBUSD,BANDBUSD,GRTBUSD,IOSTBUSD,OMGBUSD,REEFBUSD,ACMBUSD,AUCTIONBUSD,PHABUSD,TVKBUSD,BADGERBUSD,FISBUSD,OMBUSD,PONDBUSD,DEGOBUSD,ALICEBUSD,CHZBUSD,BIFIBUSD,LINABUSD,PERPBUSD,RAMPBUSD,SUPERBUSD,CFXBUSD,XVGBUSD,EPSBUSD,AUTOBUSD,TKOBUSD,TLMBUSD,BTGBUSD,HOTBUSD,MIRBUSD,BARBUSD,FORTHBUSD,BURGERBUSD,SLPBUSD,SHIBBUSD,ICPBUSD,ARBUSD,POLSBUSD,MDXBUSD,MASKBUSD,LPTBUSD,NUBUSD,RLCBUSD,CELRBUSD,ATMBUSD,ZENBUSD,FTMBUSD,THETABUSD,WINBUSD,KAVABUSD,XEMBUSD,ATABUSD,GTCBUSD,TORNBUSD,COTIBUSD,KEEPBUSD,SCBUSD,CHRBUSD,STMXBUSD,HNTBUSD,FTTBUSD,DOCKBUSD,ERNBUSD,KLAYBUSD,UTKBUSD,IOTXBUSD,BONDBUSD,MLNBUSD,LTOBUSD,ADXBUSD,QUICKBUSD,C98BUSD,CLVBUSD,QNTBUSD,FLOWBUSD,XECBUSD,MINABUSD,RAYBUSD,FARMBUSD,ALPACABUSD,ORNBUSD,MBOXBUSD,WAXPBUSD,TRIBEBUSD,GNOBUSD,MTLBUSD,OGNBUSD,POLYBUSD,DYDXBUSD,ELFBUSD,USDPBUSD';
    let symbolStringETH = 'QTUMETH,EOSETH,SNTETH,BNTETH,BNBETH,OAXETH,DNTETH,MCOETH,ICNETH,WTCETH,LRCETH,OMGETH,ZRXETH,STRATETH,SNGLSETH,BQXETH,KNCETH,FUNETH,SNMETH,NEOETH,IOTAETH,LINKETH,XVGETH,SALTETH,MDAETH,MTLETH,SUBETH,ETCETH,MTHETH,ENGETH,ZECETH,ASTETH,DASHETH,BTGETH,EVXETH,REQETH,VIBETH,TRXETH,POWRETH,ARKETH,YOYOETH,XRPETH,MODETH,ENJETH,VENETH,KMDETH,RCNETH,NULSETH,RDNETH,XMRETH,DLTETH,AMBETH,BCCETH,BATETH,BCPTETH,ARNETH,GVTETH,CDTETH,GXSETH,POEETH,QSPETH,BTSETH,XZCETH,LSKETH,TNTETH,FUELETH,MANAETH,BCDETH,DGDETH,ADXETH,ADAETH,PPTETH,CMTETH,XLMETH,CNDETH,LENDETH,WABIETH,LTCETH,TNBETH,WAVESETH,GTOETH,ICXETH,OSTETH,ELFETH,AIONETH,NEBLETH,BRDETH,EDOETH,WINGSETH,NAVETH,LUNETH,TRIGETH,APPCETH,VIBEETH,RLCETH,INSETH,PIVXETH,IOSTETH,CHATETH,STEEMETH,NANOETH,VIAETH,BLZETH,AEETH,NCASHETH,POAETH,ZILETH,ONTETH,XEMETH,WANETH,WPRETH,QLCETH,SYSETH,GRSETH,CLOAKETH,GNTETH,LOOMETH,REPETH,TUSDETH,ZENETH,SKYETH,CVCETH,THETAETH,IOTXETH,QKCETH,AGIETH,NXSETH,DATAETH,SCETH,NPXSETH,KEYETH,NASETH,MFTETH,DENTETH,ARDRETH,HOTETH,VETETH,DOCKETH,PHXETH,HCETH,PAXETH,STMXETH,WBTCETH,SCRTETH,AAVEETH,EASYETH,RENBTCETH,SLPETH,CVPETH,STRAXETH,FRONTETH,HEGICETH,SUSDETH,COVERETH,GLMETH,GHSTETH,DFETH,GRTETH,DEXEETH,FIROETH,BETHETH,PROSETH,UFTETH,PUNDIXETH,EZETH,VGXETH';
    let symbolStringBNB = 'VENBNB,YOYOBNB,POWRBNB,NULSBNB,RCNBNB,RDNBNB,DLTBNB,WTCBNB,AMBBNB,BCCBNB,BATBNB,BCPTBNB,NEOBNB,QSPBNB,BTSBNB,XZCBNB,LSKBNB,IOTABNB,ADXBNB,CMTBNB,XLMBNB,CNDBNB,WABIBNB,LTCBNB,WAVESBNB,GTOBNB,ICXBNB,OSTBNB,AIONBNB,NEBLBNB,BRDBNB,MCOBNB,NAVBNB,TRIGBNB,APPCBNB,RLCBNB,PIVXBNB,STEEMBNB,NANOBNB,VIABNB,BLZBNB,AEBNB,RPXBNB,NCASHBNB,POABNB,ZILBNB,ONTBNB,STORMBNB,QTUMBNB,XEMBNB,WANBNB,SYSBNB,QLCBNB,ADABNB,GNTBNB,LOOMBNB,BCNBNB,REPBNB,TUSDBNB,ZENBNB,SKYBNB,EOSBNB,CVCBNB,THETABNB,XRPBNB,AGIBNB,NXSBNB,ENJBNB,TRXBNB,ETCBNB,SCBNB,NASBNB,MFTBNB,ARDRBNB,VETBNB,POLYBNB,PHXBNB,GOBNB,PAXBNB,RVNBNB,DCRBNB,USDCBNB,MITHBNB,RENBNB,BTTBNB,ONGBNB,HOTBNB,ZRXBNB,FETBNB,XMRBNB,ZECBNB,IOSTBNB,CELRBNB,DASHBNB,OMGBNB,MATICBNB,ATOMBNB,PHBBNB,TFUELBNB,ONEBNB,FTMBNB,ALGOBNB,ERDBNB,DOGEBNB,DUSKBNB,ANKRBNB,WINBNB,COSBNB,COCOSBNB,TOMOBNB,PERLBNB,CHZBNB,BANDBNB,BEAMBNB,XTZBNB,HBARBNB,NKNBNB,STXBNB,KAVABNB,ARPABNB,CTXCBNB,BCHBNB,TROYBNB,VITEBNB,FTTBNB,OGNBNB,DREPBNB,TCTBNB,WRXBNB,LTOBNB,STRATBNB,MBLBNB,COTIBNB,STPTBNB,SOLBNB,CTSIBNB,HIVEBNB,CHRBNB,MDTBNB,STMXBNB,IQBNB,DGBBNB,COMPBNB,SXPBNB,SNXBNB,VTHOBNB,IRISBNB,MKRBNB,DAIBNB,RUNEBNB,FIOBNB,AVABNB,BALBNB,YFIBNB,JSTBNB,SRMBNB,ANTBNB,CRVBNB,SANDBNB,OCEANBNB,NMRBNB,DOTBNB,LUNABNB,RSRBNB,PAXGBNB,WNXMBNB,TRBBNB,BZRXBNB,SUSHIBNB,YFIIBNB,KSMBNB,EGLDBNB,DIABNB,BELBNB,WINGBNB,SWRVBNB,CREAMBNB,UNIBNB,AVAXBNB,BAKEBNB,BURGERBNB,FLMBNB,CAKEBNB,SPARTABNB,XVSBNB,ALPHABNB,AAVEBNB,NEARBNB,FILBNB,INJBNB,CTKBNB,KP3RBNB,AXSBNB,HARDBNB,UNFIBNB,PROMBNB,BIFIBNB,ICPBNB,ARBNB,POLSBNB,MDXBNB,MASKBNB,LPTBNB,NUBNB,ATABNB,GTCBNB,TORNBNB,KEEPBNB,ERNBNB,KLAYBNB,BONDBNB,MLNBNB,QUICKBNB,C98BNB,CLVBNB,QNTBNB,FLOWBNB,MINABNB,RAYBNB,FARMBNB,ALPACABNB,MBOXBNB,WAXPBNB,TRIBEBNB,GNOBNB,DYDXBNB';
    let symbolStringBTC = 'ETHBTC,LTCBTC,BNBBTC,NEOBTC,BCCBTC,GASBTC,HSRBTC,MCOBTC,WTCBTC,LRCBTC,QTUMBTC,YOYOBTC,OMGBTC,ZRXBTC,STRATBTC,SNGLSBTC,BQXBTC,KNCBTC,FUNBTC,SNMBTC,IOTABTC,LINKBTC,XVGBTC,SALTBTC,MDABTC,MTLBTC,SUBBTC,EOSBTC,SNTBTC,ETCBTC,MTHBTC,ENGBTC,DNTBTC,ZECBTC,BNTBTC,ASTBTC,DASHBTC,OAXBTC,BTGBTC,EVXBTC,REQBTC,VIBBTC,TRXBTC,POWRBTC,ARKBTC,XRPBTC,MODBTC,ENJBTC,STORJBTC,VENBTC,KMDBTC,RCNBTC,NULSBTC,RDNBTC,XMRBTC,DLTBTC,AMBBTC,BATBTC,ARNBTC,GVTBTC,CDTBTC,GXSBTC,POEBTC,QSPBTC,BTSBTC,XZCBTC,LSKBTC,TNTBTC,MANABTC,BCDBTC,DGDBTC,ADXBTC,ADABTC,PPTBTC,CMTBTC,XLMBTC,CNDBTC,LENDBTC,WABIBTC,WAVESBTC,GTOBTC,ICXBTC,OSTBTC,ELFBTC,AIONBTC,NEBLBTC,BRDBTC,EDOBTC,WINGSBTC,NAVBTC,LUNBTC,TRIGBTC,APPCBTC,VIBEBTC,RLCBTC,PIVXBTC,IOSTBTC,CHATBTC,STEEMBTC,NANOBTC,VIABTC,BLZBTC,NCASHBTC,POABTC,ZILBTC,ONTBTC,XEMBTC,WANBTC,WPRBTC,QLCBTC,SYSBTC,GRSBTC,CLOAKBTC,GNTBTC,LOOMBTC,REPBTC,TUSDBTC,ZENBTC,SKYBTC,CVCBTC,THETABTC,IOTXBTC,QKCBTC,AGIBTC,NXSBTC,DATABTC,NPXSBTC,KEYBTC,NASBTC,MFTBTC,ARDRBTC,HOTBTC,VETBTC,DOCKBTC,POLYBTC,PHXBTC,HCBTC,GOBTC,PAXBTC,RVNBTC,DCRBTC,MITHBTC,RENBTC,BTTBTC,ONGBTC,FETBTC,CELRBTC,MATICBTC,ATOMBTC,PHBBTC,TFUELBTC,ONEBTC,FTMBTC,BTCBBTC,ALGOBTC,ERDBTC,DOGEBTC,DUSKBTC,ANKRBTC,WINBTC,COSBTC,COCOSBTC,TOMOBTC,PERLBTC,CHZBTC,BANDBTC,BEAMBTC,XTZBTC,HBARBTC,NKNBTC,STXBTC,KAVABTC,ARPABTC,CTXCBTC,BCHBTC,TROYBTC,VITEBTC,FTTBTC,OGNBTC,DREPBTC,TCTBTC,WRXBTC,LTOBTC,MBLBTC,COTIBTC,STPTBTC,SOLBTC,CTSIBTC,HIVEBTC,CHRBTC,MDTBTC,STMXBTC,PNTBTC,DGBBTC,COMPBTC,SXPBTC,SNXBTC,IRISBTC,MKRBTC,DAIBTC,RUNEBTC,FIOBTC,AVABTC,BALBTC,YFIBTC,JSTBTC,SRMBTC,ANTBTC,CRVBTC,SANDBTC,OCEANBTC,NMRBTC,DOTBTC,LUNABTC,IDEXBTC,RSRBTC,PAXGBTC,WNXMBTC,TRBBTC,BZRXBTC,WBTCBTC,SUSHIBTC,YFIIBTC,KSMBTC,EGLDBTC,DIABTC,UMABTC,BELBTC,WINGBTC,UNIBTC,NBSBTC,OXTBTC,SUNBTC,AVAXBTC,HNTBTC,FLMBTC,SCRTBTC,ORNBTC,UTKBTC,XVSBTC,ALPHABTC,VIDTBTC,AAVEBTC,NEARBTC,FILBTC,INJBTC,AERGOBTC,AUDIOBTC,CTKBTC,BOTBTC,AKROBTC,AXSBTC,HARDBTC,RENBTCBTC,STRAXBTC,FORBTC,UNFIBTC,ROSEBTC,SKLBTC,SUSDBTC,GLMBTC,GRTBTC,JUVBTC,PSGBTC,1INCHBTC,REEFBTC,OGBTC,ATMBTC,ASRBTC,CELOBTC,RIFBTC,BTCSTBTC,TRUBTC,CKBBTC,TWTBTC,FIROBTC,LITBTC,SFPBTC,FXSBTC,DODOBTC,FRONTBTC,EASYBTC,CAKEBTC,ACMBTC,AUCTIONBTC,PHABTC,TVKBTC,BADGERBTC,FISBTC,OMBTC,PONDBTC,DEGOBTC,ALICEBTC,LINABTC,PERPBTC,RAMPBTC,SUPERBTC,CFXBTC,EPSBTC,AUTOBTC,TKOBTC,TLMBTC,MIRBTC,BARBTC,FORTHBTC,EZBTC,ICPBTC,ARBTC,POLSBTC,MDXBTC,LPTBTC,AGIXBTC,NUBTC,ATABTC,GTCBTC,TORNBTC,BAKEBTC,KEEPBTC,KLAYBTC,BONDBTC,MLNBTC,QUICKBTC,C98BTC,CLVBTC,QNTBTC,FLOWBTC,MINABTC,FARMBTC,ALPACABTC,MBOXBTC,VGXBTC,WAXPBTC,TRIBEBTC,GNOBTC,PROMBTC,DYDXBTC';
    //let symbolList = symbolString.split(',');

    //getCandleIn("USDT" ,symbolStringUSDT.split(','), '5m', '2', 0.5);
    //getCandleIn("BUSD" ,symbolStringBUSD.split(','), '5m', '2', 2);
    //getCandleIn("ETH" ,symbolStringETH.split(','), '5m', '2', 1);
    //getCandleIn("BNB" ,symbolStringBNB.split(','), '5m', '2', 2);
    //getCandleIn("BTC" ,symbolStringBTC.split(','), '15m', '2', 2);
    
    
    // getCandleIn(symbolList, '5m', '1', 1);
    setInterval(function() { getCandleIn("USDT" ,symbolStringUSDT.split(','), '1m', '2', 1.3); }, 60*1000);
    setInterval(function() { getCandleIn("BUSD" ,symbolStringUSDT.split(','), '1m', '2', 1.7); }, 60*1000);
    // setInterval(function() {
    //     getCurrentTime();
    //     getCandleIn("BUSD" ,symbolStringUSDT.split(','), '1m', '2', 1);
    // }, 60*1000);
    // getCandleIn(symbolList, '15m', '1', 1.5);
    // setInterval(function() {getCandleIn(symbolList, '15m', '1', 1.5)},15*60*1000);
    // getCandleIn(symbolList, '15m', '1', 1.5);
    // getCandleIn(symbolList, '30m', '1', 2);
    // getCandleIn(symbolList, '1h', '1', 3);
    // setInterval(function() {getCandleIn(symbolList, '3m', '1', 0.5)},3*60*1000);
    //==========================
    // getCandleIn(symbolList, '5m', '1', 1);
    //setInterval(function() {getCandleIn(symbolList, '5m', '1', 1)},5*60*1000);
    //==========================
    //getCandleIn(symbolList, '15m', '1', 2.5);
    //==========================
    //getCandleIn(symbolList, '30m', '1', 3);
    //getCandleIn(symbolList, '5m', '1', 1);
    //setInterval(function() {getCandleIn(symbolList, '5m', '1', 1)},4*60*1000);
    // let symbolList = [];
    // let exchangeInfo = getExchangeInfo().then(res => {
    //     let dataList = res.symbols;
    //     for(let i = 0; i < dataList.length; i++){
    //         if(dataList[i].quoteAsset == 'USDT'
    //             && dataList[i].baseAsset != 'BCHSV'){
    //             symbolList.push(dataList[i].symbol);
    //         }
    //     }

    //     console.log("=========1m=======");
    //     console.log(symbolList.length);
    //     console.log(symbolList.toString());
    //     //getCandleIn(symbolList, '15m', '1', 3);
    //     //setInterval(function() {getCandleIn(symbolList, '1m', '1')},60000);
        
    // });

}

mainFlow();
bot.telegram.sendMessage('1724440021', 'Bot is started at ' + getCurrentTime(), {});
bot.launch();
//setInterval(mainFlow,10000);