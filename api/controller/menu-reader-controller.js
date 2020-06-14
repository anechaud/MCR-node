'use strict';
var db = require('../dbctx/firebase-context');
var helper = require('../helper/helper');
var repo = require('../dbctx/firebase-repository');
var itemMenu = '';

exports.get_all_eatery = function(req, res) {
    console.log("HTTP Get Eatery Name Request");
    //Attach an asynchronous callback to read the data
    var response = "response";
    response = repo.getAllEatery();
    res.json(response);
  };

  exports.get_menu_type = function(req, res) {
    console.log("HTTP Get Menu Type Request");
    var restname = req.params.restName;
    var response = repo.getMenuType(restname);
    res.json(response);
  };

  exports.handle_dialogflow= function(req, res) {
    var requestObj = req.body.queryResult;
    var intent = requestObj.intent.displayName;
    var fulfillmentText = "Sorry! Please try again";
    var restname= "Dell 6 Cafeteria"
    if(intent == "1 - checkIfOperating-MenuType")
    {
        fulfillmentText = repo.getMenuType(restname);
        itemMenu = fulfillmentText.split(' ')[3];
    }

    if(intent == "2 - findCostOfItem")
    {
        var reqItem = requestObj.parameters.foodItem;
        fulfillmentText = repo.getItemByName(restname,reqItem);
    }

    if(intent == "4 - fetchMenuByType")
    {
        var reqType = requestObj.parameters.menuType;
        fulfillmentText = repo.getItemByType(restname,reqType)
    }

    if(intent == "1b - checkIfOperatingMenuType - yes")
    {
        var reqType = itemMenu;
        fulfillmentText = repo.getItemByType(restname,reqType)
    }

    if(intent == "5 - findOperatingHours")
    {
        fulfillmentText = repo.operatingHours(restname);
    }
    return res.json({
        fulfillmentText: fulfillmentText
    })

  };

  exports.get_operating_hours = function(req, res) {
    console.log("HTTP Get Menu Type Request");
    var restname = req.params.restName;
    var response = repo.operatingHours(restname);
    res.json({fulfillmentText : response});
  };

  exports.get_item_by_type = function(req, res) {
    console.log("HTTP Get Item by Type Request");
    var restname = req.params.restName;
    var reqtype = req.params.type;
    var response = repo.getItemByType(restname,reqtype);
    res.json(response);
  };

  exports.get_item_by_Name = function(req, res) {
    console.log("HTTP Get Item by Type Request");
    var restname = req.params.restName;
    var reqItem = req.params.itemName;
    var response = repo.getItemByName(restname,reqItem);
    res.json(response);
  };