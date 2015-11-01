// ==UserScript==
// @name         Hacker Experience Helper EXTREME EDITION
// @description This userscript will help you during gameplay. It will automatically remove your myIP from logs, and many things more!
// @include       https://hackerexperience.com/*
// @include       http://hackerexperience.com/*
// @exclude       http://hackerexperience.com/
// @exclude       https://hackerexperience.com/
// @copyright   2015+, OC66
// @version    1.0.2
// @oujs:author oc66
// ==/UserScript==


/////////////////////////////Script Settings
var AutoUpload = false;
var AlternateClear = false;

var bankID = "297489606,519176813,789192727,804639267,1gzEEmX6tZJmYPbdV86ct1H1xFySfPIY5h,CKDAQ7AAtypEMlNSyhUfirVQkaG29LjMwXmm5WWyvmdiI1bgi5wBxrsRC8TLUdxq"; //Enter your banks in order as they appear on finances page
var bankIPs = "24.61.139.163,195.164.251.86,220.103.138.119,166.144.91.52,157.218.117.4,176.69.198.168"; //Enter your banks IPS in order 
var virusLocal = "5488949";
var virusRemote = "vminer";
//https://hackerexperience.com/software?action=install&id=5488949

////////////////////////////////////////////

//Static Variables ###### DO NOT EDIT ######
var ALERT_SUCCESS = 'alert alert-success'; 
var ALERT_FAILURE = 'alert alert-error';



/////////////////////////////////////////////



function setupScript() {
    //Run on the finances page
    //Gets your bank accounts and saves them so we can clear them from logs
    if (page == "finances") {
        banks.length = 0;
        var bankAccounts = document.getElementsByClassName('collapse in');
        for (var i = 0; i < bankAccounts.length; i++) {
            if (bankAccounts[i].innerText.indexOf('#') != -1) {
                var tmp = bankAccounts[i].innerText.split('#')[1];
                banks[banks.length] = tmp;
            }
        }
    }
    if (page == "internet?ip=157.218.117.4") {
        var button = document.getElementById('btc-buy');
        var rate = button.innerText.split('$')[1];
        console.log(rate);
        button.dispatchEvent(evt);
        var checkExist = setInterval(function() {
   			if ($('#gen-modal').length) {
                buyBTC(rate);
      			clearInterval(checkExist);
   			}
		}, 3000); // check every 100ms        
    }
}

//Gets and returns the status message or undefined if not found
function getStatusMsg() {
	var result = undefined;
    if (document.getElementsByClassName(ALERT_SUCCESS)[0] !== undefined) {
    	result = document.getElementsByClassName(ALERT_SUCCESS)[0].innerText;
        return result;
    }
    if (document.getElementsByClassName(ALERT_FAILURE)[0] !== undefined) {
     	result = document.getElementsByClassName(ALERT_FAILURE)[0].innerText;
        return result;
    }
    return result;
}

function log(text) {
    console.log("[HEH]: " + text);   
}

function buyBTC(rate) {
    log("laundering money / purchasing bitcoins");
    var window = document.getElementById('gen-modal');
    if (window !== undefined) {
        var inputBox = document.getElementById('btc-amount');
        var btcToBuy = ((cash / rate ) - 0.01);
        inputBox.value = btcToBuy + " BTC";
        document.getElementById('btc-submit').dispatchEvent(evt);
        log(btcToBuy + " BTC purchased for $" + cash);
    }
    else
        log('ERROR: gen-modal window not found - Are you logged into your bitcoin wallet?');
}

function getBankArray() {
    var arrayFromString = bankID.split(',');
    return arrayFromString;
}

function matchBank(ip) {
    var bankIP = "";
    var tmp = bankIPs.split(',');
    for (var i = 0; i < tmp.length; i++) {
        if (tmp[i].indexOf(ip) > -1) {
            bankIP = tmp[i];
            return getBankArray()[i];
    	}
    }
}

function getVirusID(type) {
    //Return the virus ID if we can find it
    var table_span9;
    if (page == "internet" || page == "internet?view=software")
        table_span9 = document.getElementsByClassName('span9')[1];
    if (page == "software")
        table_span9 = document.getElementsByClassName('span9')[0];
    var rows = table_span9.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        if(rows[i].innerText.indexOf(type) != -1) {
            return rows[i].getAttribute("id");
        }
    }
}

////
// Calculate Up/Download time
// Accuracy ~95%
function getUpDownloadTime(iSize, iSpeed, sOutput) {
	var iSec = parseInt(iSize.replace(/(0\.00|0\.0|0\.|\.)/gm, '')*(1000/iSpeed)*1.045+3);
	
	if ( sOutput == 'sec' ) {
		return iSec;
	}
	var iMin = 0;
	var iHou = 0;
	
	while ( iSec >= 60 ) {
		iMin = iMin +1;
		iSec = iSec - 60;
	}
	
	while ( iMin >= 60 ) {
		iHou = iHou + 1;
		iMin = iMin - 60;
	}
	
	return ((iHou>0) ? (iHou + 'h') : '') + ((iMin>0) ? (((iHou>0) ? ' ' : '') + iMin + 'm') : '') + ((iSec>0) ? (((iHou>0 || iMin>0) ? ' ' : '') + iSec + 's') : '');
}



var myIP = "";
var page = "";
var cash;

var evt = document.createEvent("HTMLEvents");
evt.initEvent("click", true, true);

//When the document finishes loading, sleep and execute the following....
window.addEventListener('load', function() {
    setTimeout(function() {
        
        log("STATUS_MSG: " + getStatusMsg());
        log("setting up debug menu");
        //Navbar mods
        var navBar = document.getElementsByClassName('nav btn-group')[0];
        var btnSetup = document.createElement('li');
        btnSetup.setAttribute("class", "btn btn-inverse");
        var t = document.createElement('a');
        t.setAttribute('id', 'debug_button');
        t.innerText = "Debug";
        btnSetup.appendChild(t);
        navBar.appendChild(btnSetup);
        btnSetup.addEventListener('click', function() { setupScript(); } ,true);
        
        myIP = document.getElementsByClassName('header-ip-show')[0].innerText;
        page = document.location['href'].split('/')[3];
        cash = document.getElementsByClassName('small nomargin green header-finances')[0].innerText.replace('$','').replace(',','');
        
        log("Information - IP " + myIP + " cash $" + cash);
        log("page - " + page);
        
        if (getStatusMsg() !== undefined) {
            if (getStatusMsg().indexOf("This IP") > -1) {
                log("we already hacked this IP, logging on");
            	document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt);
            }
            if (getStatusMsg().indexOf("Bank account hacked!") > -1) {
             	log("bank account hacked, logging in");
                document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt);
            }
            if (getStatusMsg().indexOf("Successfully cracked") > -1) {
             	log("remote pc hacked, logging in");
                document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt);   
            }
            if (getStatusMsg().indexOf("downloaded") > -1 || getStatusMsg().indexOf("installed") > -1) {
                window.location.href = "http://hackerexperience.com/internet?view=logs";
            }
            if (getStatusMsg().indexOf("transferred") > -1) {
                window.location.href = "http://hackerexperience.com/internet?action=hack";
//                window.location.href = "http://hackerexperience.com/internet?view=logs";  
            }
            var success = document.getElementsByClassName('alert alert-success')[0];
            if (success !== undefined && success.innerText.indexOf("Disconnected") == -1) {
                //alert(success.innerText);
                
            }
        }
       
        
        //If were logged into a bank account check the balance and xfer cash to one of our accounts at the current bank
        if (page == "internet?bAction=show") {
            log("logged into bank, checking cash");
            var cashInAccount = parseInt(document.getElementsByClassName('finance-box')[0].innerText.replace('$', ""));
            if (cashInAccount > 0) {
                log("cash in account, transferring");
                var destinationAcc = document.getElementsByName('acc')[0];
                var destinationIP = document.getElementsByName('ip')[0].value;
                var bankIP = document.getElementsByName('ip')[1];
                if (destinationAcc !== undefined) {
                    console.log(destinationIP);
                    destinationAcc.value = matchBank(destinationIP);
                    bankIP.value = destinationIP;
                    document.getElementsByClassName('btn btn-success')[0].dispatchEvent(evt);
                    log("bank transfer for $" + cashInAccount + " complete. CLEAR YOUR LOGS");
                }
            }
            else { console.log("Not enough cash to merit xfer"); }
    	}
                
        //Target internet
        if(page == "internet" || page == "internet?view=software" || page == "internet?view=logs") {
            log("logged into a remote pc");
            var errorMsg = getStatusMsg();
            if (errorMsg == undefined) {
                var logBox = document.getElementsByName('log')[0];
                if(!(logBox===undefined) ){
                    var btn = document.createElement("BUTTON");
                    var t = document.createTextNode("Clear Log");
                    
                    btn.appendChild(t);
                    btn.setAttribute("class", "btn btn-inverse");
                    document.getElementsByClassName('log')[0].appendChild(btn);
                    
                    btn.addEventListener('click', function() {
                        logBox.value = "";
                        document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt);
                        
                    },true);
                    
                    var oldLog = logBox.value;
                    
                    if (logBox.value.indexOf(myIP) > -1)
                        logBox.value = logBox.value.replace(new RegExp(myIP, 'g'), "");
                    for (var i = 0; i < getBankArray().length; i++) {
                        logBox.value = logBox.value.replace(new RegExp(getBankArray()[i], 'g'), "");
                    }    
                    if (logBox.value != oldLog)
                        document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt); //click the edit button                    
                } 
            }
            
            var uploadButton = document.getElementById('link');  
            if (!(uploadButton === null) ) {
                
                var btn = document.createElement("SPAN");
                var t = document.createTextNode("Upload Virus");
                var btn2 = document.createElement("SPAN");
                var t2 = document.createTextNode("Install Virus");
                
                btn.appendChild(t);
                btn.setAttribute("class", "btn btn-primary");
                document.getElementById("toBeHidden").appendChild(btn);
                btn2.appendChild(t2);
                btn2.setAttribute("class", "btn btn-primary");
                document.getElementById("toBeHidden").appendChild(btn2);
                
                btn.addEventListener('click', function() { 
                    window.location.href = "http://hackerexperience.com/internet?view=software&cmd=up&id=" + virusLocal;
                },true);
                btn2.addEventListener('click', function() { 
                    window.location.href = "http://hackerexperience.com/internet?view=software&cmd=install&id=" + getVirusID('vspam');
                },true);
            }
            
            
        }
        
        //If we are logging into a bank that we've already hacked, copy and paste the user and pass into the login box and proceed to login
        if (page == "internet?action=login&type=bank") {
            var errorMsg = document.getElementsByClassName('alert alert-error')[0];
            console.log(errorMsg.innerText);
            if (errorMsg !== null) {
                if (errorMsg.innerText.indexOf("You already hacked the bank account")) {
                    var acc = errorMsg.innerText.split('account')[1].split('!')[0];
                    var pwd = errorMsg.innerText.split('password is ')[1].split('.')[0];
                    console.log("Username and password found already logging in with: " + acc + "/" + pwd);
                    document.getElementsByName('acc')[0].value = acc;
                    document.getElementsByName('pass')[0].value = pwd;
                    document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt);        
                }
            }
        }
        
        //Target log
        if(page == "internet?view=logs" || page == "internet"){
            
        }
        
        //our own log
        if(page == "log"){
            var logBox = document.getElementsByName('log')[0];
            if(!(logBox===null) ){
                var btn = document.createElement("BUTTON");
                var t = document.createTextNode("Clear Log");
                btn.appendChild(t);
                btn.setAttribute("class", "btn btn-inverse");
                document.getElementsByClassName('log')[0].appendChild(btn);
                
                var oldLog = logBox.value;
                
                for (var i = 0; i < getBankArray().length; i++) {
                    if(logBox.value.indexOf(getBankArray()[i]) > -1){
                        logBox.value = logBox.value.replace(new RegExp(getBankArray()[i], 'g'), "");
                        //logBox.value = logBox.value.replace(new RegExp(bankID, 'g'), "");
                    }
                }
                
                if (logBox.value != oldLog)
                    document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt);   
                
                btn.addEventListener('click', function() {
                    logBox.value = "";
                    document.getElementsByClassName('btn btn-inverse')[6].dispatchEvent(evt);   
                },true); 
            }
        }                
    }, 150);    
}, false);