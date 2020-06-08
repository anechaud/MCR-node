'use strict';
var db = require('../dbctx/firebase-context');
var helper = require('../helper/helper')

var getAllEatery = function getAllEatery()
{
    var outputText = 'The eateries available are : ';
	db.on("value", snap => {
        var restName= snap.val();
        console.log(restName);
        var names = [];
        restName.forEach(function(item) 
            { 
                if(helper.checkIfEateryOperating(item.Eatery.name) == true)
                {
                names.push(item.Eatery.name);
                outputText = outputText + item.Eatery.name + '    ';
                }
                else
                {
                    outputText = 'Sorry! No restaurant is sevring at this moment';
                }
            });
        console.log(names);
    });
    return outputText;
}

var getMenuType = function getMenuType(restname)
{
    var menutypes = [];
    var response = '';
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                if(helper.checkIfEateryOperating(restname) == true)
                {
                    for (var i = 0; i < item.Eatery.Menus.length; i++) {
                        var type = item.Eatery.Menus[i].Menu.Type.toLowerCase();
                        if(helper.checkMenuTypeAvailability(restname,type) == true)
                        {
                            menutypes.push(type);
                            response = 'Available menus are ' + menutypes;
                        }
                        else
                        {
                            response = "Sorry! Nothing is being served at this hour.";
                        }
                    }
                }
                else
                {
                    response = "Sorry! The eatery is closed";
                }
            }
        });
        console.log(menutypes);
    });
    return response;
}

var getItemByType = function getItemByType(restname,reqtype)
{
    var menutypes = [];
    var lst = [];
    var response = 'Available items are ';
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                if(helper.checkIfEateryOperating(restname) == true)
                {
                    for (var i = 0; i < item.Eatery.Menus.length; i++) {
                        var type = item.Eatery.Menus[i].Menu.Type.toLowerCase();
                        if(type.indexOf(reqtype)>-1)
                        {
                        if(helper.checkMenuTypeAvailability(restname,type) == true)
                        {
                            for(var j=0;j<item.Eatery.Menus[i].Menu.Items.length;j++)
                            {
                                var name = item.Eatery.Menus[i].Menu.Items[j].name;
                                var price = item.Eatery.Menus[i].Menu.Items[j].price;
                                var output = name + ' ' + price + ' rupees '
                                response = response + output;
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
    });
    return response;
}

var getItemByName = function getItemByName(restname,reqItem)
{
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
                        var type = item.Eatery.Menus[i].Menu.Type.toLowerCase();
                        if(helper.checkMenuTypeAvailability(restname,type) == true)
                        {
                            for(var j=0;j<item.Eatery.Menus[i].Menu.Items.length;j++)
                            {
                                //console.log(item.Eatery.Menus[i].Menu.Items[j].name);
                                if(item.Eatery.Menus[i].Menu.Items[j].name.toLowerCase().indexOf(reqItem.toLowerCase())>-1)
                                {
                                    var dict = {};
                                var name = item.Eatery.Menus[i].Menu.Items[j].name;
                                var price = item.Eatery.Menus[i].Menu.Items[j].price;
                                lst.push(dict);
                                console.log(dict);
                                response = 'The price of ' + name + ' is '+ price;
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
    });
    return response;
}    

var operatingHours = function operatingHours(restname)
{
    var response = "The operating hours are ";
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                response = response + item.Eatery.schedule.StartTime + ' to ' + item.Eatery.schedule.EndTime;
                console.log(item.Eatery.schedule.StartTime,'-',item.Eatery.schedule.EndTime)
            }
        });
    });
    return response;
}

module.exports = {
    getAllEatery,
    getMenuType,
    getItemByType,
    getItemByName,
    operatingHours
 }