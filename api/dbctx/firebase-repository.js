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
                        var type = item.Eatery.Menus[i].Menu.Type;
                        if(helper.checkMenuTypeAvailability(restname,type) == true)
                        {
                            menutypes.push(type);
                            response = 'Available menus are ' + type;
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

module.exports = {
    getAllEatery,
    getMenuType
 }