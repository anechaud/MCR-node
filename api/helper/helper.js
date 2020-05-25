'use strict';
var db = require('../dbctx/firebase-context');

var checkIfEateryOperating = function checkIfEateryOperating(input)
{
    var current_hour = new Date().getHours();
    var isOpen = false;
    db.on("value", snap => {
        var restName= snap.val();
        restName.forEach(function(item) 
        { 
            if(item.Eatery.name == input)
            {
                if(current_hour > Number(item.Eatery.schedule.StartTime.split(':')[0]) && current_hour < Number(item.Eatery.schedule.EndTime.split(':')[0]))
                {
                    isOpen = true;
                }
                else
                {
                    isOpen = true;
                }
            }
        });
    });
    return isOpen;
}

var checkMenuTypeAvailability = function checkMenuTypeAvailability(inputName, inputType)
{
    var current_hour = new Date().getHours();
    var isOpen = false;
    db.on("value", snap => {
        var restName= snap.val();
        restName.forEach(function(item) 
        { 
            if(item.Eatery.name == inputName)
            {
                for (var i = 0; i < item.Eatery.Menus.length; i++) {
                    var type = item.Eatery.Menus[i].Menu.Type;
                    if(type == inputType)
                    {
                        if(current_hour > Number(item.Eatery.Menus[i].Menu.StartTime.split(':')[0]) && current_hour < Number(item.Eatery.Menus[i].Menu.EndTime.split(':')[0]))
                        {
                            isOpen = true;
                        }
                        else
                        {
                            isOpen = true;
                        }
                    }
                }
            }
        });
    });
    return isOpen;
}

module.exports = {
    checkIfEateryOperating,
    checkMenuTypeAvailability
 }