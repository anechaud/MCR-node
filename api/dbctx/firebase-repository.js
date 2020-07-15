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
                outputText = outputText + item.Eatery.name + ',    ';
                }
                else
                {
                    outputText = 'Sorry! No restaurant is sevring at this moment.';
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
    var flag = false;
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
                            menutypes.push(type+'.');
                            response = 'Available menus are ' + menutypes;
                            flag=true;
                        }
                        
                    }
                    if(flag == true)
                    {
                        response = response + ' Do you want to explore the menu items?';
                    }
                    else
                        {
                            response = "Sorry! Nothing is being served at this hour. Can I help you with anything else?";
                        }
                }
                else
                {
                    response = "Sorry! The eatery is closed. Can I help you with anything else?";
                }
            }
        });
        console.log(menutypes);
    },
    function (errorObject) {
        console.log("Read failed: " + errorObject.code);
        response="Can you please say one more time?";
   });
    return response;
}

var getItemByType = function getItemByType(restname,reqtype, specialCategory)
{
    var menutypes = [];
    var lst = [];
    var flag = false;
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
                        if(type.indexOf(reqtype)>-1)
                        {
                            if(specialCategory == null)
                            {
                                for(var j=0;j<item.Eatery.Menus[i].Menu.Items.length;j++)
                                {
                                    var name = item.Eatery.Menus[i].Menu.Items[j].name;
                                    var price = item.Eatery.Menus[i].Menu.Items[j].price;
                                    var output = name + ' ' + price + ' rupees. '
                                    response = response + output;
                                    flag=true;
                                }
                            }
                                for(var j=0;j<item.Eatery.Menus[i].Menu.SpecialItems.length;j++)
                                {
                                    var name = item.Eatery.Menus[i].Menu.SpecialItems[j].name;
                                    var price = item.Eatery.Menus[i].Menu.SpecialItems[j].price;
                                    var output = name + ' ' + price + ' rupees. '
                                    response = response + output;
                                    flag=true;
                                }
                        }
                    }
                    if(flag == true)
                        {
                            if(specialCategory == null)
                            {
                                response = 'For ' + reqtype + ' we have ' + response + ' What else do you need?'
                            }
                            else
                            {
                                response = 'For ' + reqtype + ' in special menu section we have ' + response + ' What else you want to check?'
                            }
                        }
                    else
                        {
                            if(specialCategory != null)
                            {
                                response = 'We no not have any special menu for ' +reqtype +' today. Why dont you check our daily menu?';
                            }
                            else
                            {
                                response = 'The eatery is currently not serving ' + reqtype +'. Is there anything else I can help you with?';
                            }
                        }
                }
                else
                {
                    response = 'Sorry! The eatery is currently non operating. Is there anything else I can help you with?'
                }
            }
        });
    },
    function (errorObject) {
        console.log("Read failed: " + errorObject.code);
        response="Sorry, I missed that. Could you please say that again?";
   });
    return response;
}

var getItemByName = function getItemByName(restname,reqItem)
{
    var menutypes = [];
    var output = '';
    var lst = [];
    var flag = false;
    var response = 'The item requested is not being served. ';
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                if(helper.checkIfEateryOperating(restname) == true)
                {
                    for (var i = 0; i < item.Eatery.Menus.length; i++) {
                        var type = item.Eatery.Menus[i].Menu.Type.toLowerCase();
                        //if(helper.checkMenuTypeAvailability(restname,type) == true)
                        //{
                            for(var j=0;j<item.Eatery.Menus[i].Menu.Items.length;j++)
                            {
                                if(item.Eatery.Menus[i].Menu.Items[j].name.toLowerCase().indexOf(reqItem.toLowerCase())>-1)
                                {
                                    var name = item.Eatery.Menus[i].Menu.Items[j].name;
                                    var price = item.Eatery.Menus[i].Menu.Items[j].price;
                                    if(!lst.includes(name))
                                    {
                                     output = output + ' The price of ' + name + ' is '+ price +'.';
                                    }
                                    lst.push(name);
                                    response = output;
                                    flag=true;
                                }
                            }
                        //}
                    }
                    if(flag == true)
                    {
                        response = response + ' Do you need anything else?'
                    }
                    else
                        {
                            response = 'The eatery is currently not serving ' + reqItem +'. Is there anything else I can help you with?';
                        }
                }
                else
                {
                    response = 'Sorry! The eatery is currently non operating. Is there anything else you need?'
                }
            }
        });
    },
    function (errorObject) {
        console.log("Read failed: " + errorObject.code);
        response="Pardon me for being unmindful! Can you please say louder?";
   });
    return response;
}    

var checkMenuAvailability = function checkMenuAvailability(restname, reqType, reqItem)
{
    var menutypes = [];
    var output = '';
    var lst = [];
    var flag = false;
    var response = 'Yes. ' + reqItem + ' is available in ' + reqType;
    db.on("value", snap => {
        var restaurant= snap.val();
        restaurant.forEach(function(item){
            if(item.Eatery.name==restname)
            {
                if(helper.checkIfEateryOperating(restname) == true)
                {
                    for (var i = 0; i < item.Eatery.Menus.length; i++) {
                        var type = item.Eatery.Menus[i].Menu.Type.toLowerCase();
                        var q = reqType;
                        //if(helper.checkMenuTypeAvailability(restname,type) == true)
                        //{
                        if(type.indexOf(q.toLowerCase())>-1)
                        { 
                            for(var j=0;j<item.Eatery.Menus[i].Menu.Items.length;j++)
                            {
                                if(item.Eatery.Menus[i].Menu.Items[j].name.toLowerCase().indexOf(reqItem.toLowerCase())>-1)
                                {
                                    var name = item.Eatery.Menus[i].Menu.Items[j].name;
                                    var price = item.Eatery.Menus[i].Menu.Items[j].price;
                                    if(!lst.includes(name))
                                    {
                                     output = output + ' The price of ' + name + ' is '+ price +'.';
                                    }
                                    lst.push(name);
                                    //response = output;
                                    flag=true;
                                }
                            }
                        }
                        //}
                    }
                    if(flag == true)
                    {
                        response =response + output + ' Do you need anything else?'
                    }
                    else
                        {
                            response = 'The eatery is currently not serving ' + reqItem + ' in ' + reqType  + '. Is there anything else I can help you with?';
                        }
                }
                else
                {
                    response = 'Sorry! The eatery is currently non operating. Is there anything else you need?'
                }
            }
        });
    },
    function (errorObject) {
        console.log("Read failed: " + errorObject.code);
        response="My Bad! Please say one more time.";
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
    operatingHours,
    checkMenuAvailability
 }