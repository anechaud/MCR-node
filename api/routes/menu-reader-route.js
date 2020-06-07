'use strict';
module.exports = function(app) {
  var todoList = require('../controller/menu-reader-controller');

app.route('/Eatery')
.get(todoList.get_all_eatery);
  
app.route('/Eatery/:restName')
.get(todoList.get_menu_type);

app.route('/Eatery/Hours/:restName')
.get(todoList.get_operating_hours); 

app.route('/Eatery/:restName/:type')
.get(todoList.get_item_by_type);

app.route('/Eatery/:restName/item/:itemName')
.get(todoList.get_item_by_Name);

app.route('/test')
.post(todoList.handle_dialogflow);

};