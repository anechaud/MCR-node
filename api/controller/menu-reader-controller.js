'use strict';
var db = require('../dbctx/firebase-context');
var helper = require('../helper/helper');
var repo = require('../dbctx/firebase-repository');

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
    if(intent == "4 - fetchMenuByType")
    {
        fulfillmentText = repo.getMenuType(restname);
    }
    return res.json({
        fulfillmentText: fulfillmentText
    })

  };

  exports.get_operating_hours = function(req, res) {
    console.log("HTTP Get Menu Type Request");
    var restname = req.params.restName;
    var response = 'The operating hours are ';
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                response = response + item.Eatery.schedule.StartTime + ' to ' + item.Eatery.schedule.EndTime;
                console.log(item.Eatery.schedule.StartTime,'-',item.Eatery.schedule.EndTime)
            }
        });
        res.json({fulfillmentText : response});
    });
  };

  exports.get_item_by_type = function(req, res) {
    console.log("HTTP Get Item by Type Request");
    var restname = req.params.restName;
    var reqtype = req.params.type;
    var menutypes = [];
    var lst = [];
    var response = '';
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                if(helper.checkIfEateryOperating(restname) == true)
                {
                    for (var i = 0; i < item.Eatery.Menus.length; i++) {
                        var type = item.Eatery.Menus[i].Menu.Type;
                        if(type.indexOf(reqtype)>-1)
                        {
                        if(helper.checkMenuTypeAvailability(restname,type) == true)
                        {
                            for(var j=0;j<item.Eatery.Menus[i].Menu.Items.length;j++)
                            {
                                var dict = {};
                                dict['name'] = item.Eatery.Menus[i].Menu.Items[j].name;
                                dict['price'] = item.Eatery.Menus[i].Menu.Items[j].price;
                                lst.push(dict);
                                console.log(dict);
                                response = lst;
                            }
                        }
                        else
                        {
                            response = 'The eatery is currently not serving ' + req.params.type;
                        }
                        }
                    }
                }
                else
                {
                    response = 'Sorry! The eatery is currently non operating.'
                }
            }
        });
        res.json(response);
    });
  };

  exports.get_item_by_Name = function(req, res) {
    console.log("HTTP Get Item by Type Request");
    var restname = req.params.restName;
    var reqItem = req.params.itemName;
    var menutypes = [];
    var lst = [];
    var response = '';
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                if(helper.checkIfEateryOperating(restname) == true)
                {
                    for (var i = 0; i < item.Eatery.Menus.length; i++) {
                        var type = item.Eatery.Menus[i].Menu.Type;
                        if(helper.checkMenuTypeAvailability(restname,type) == true)
                        {
                            for(var j=0;j<item.Eatery.Menus[i].Menu.Items.length;j++)
                            {
                                //console.log(item.Eatery.Menus[i].Menu.Items[j].name);
                                if(item.Eatery.Menus[i].Menu.Items[j].name.indexOf(reqItem)>-1)
                                {
                                    var dict = {};
                                dict['name'] = item.Eatery.Menus[i].Menu.Items[j].name;
                                dict['price'] = item.Eatery.Menus[i].Menu.Items[j].price;
                                lst.push(dict);
                                console.log(dict);
                                response = 'The price of ' + reqItem + ' is '+ item.Eatery.Menus[i].Menu.Items[j].price;
                                }
                                //else
                                //{
                                    //response = 'The eatery is currently not serving ' + reqItem;
                                //}
                            }
                        }
                        else
                        {
                            response = 'The eatery is currently not serving ' + reqItem;
                        }
                    }
                }
                else
                {
                    response = 'Sorry! The eatery is currently non operating.'
                }
            }
        });
        res.json(response);
    });
  };