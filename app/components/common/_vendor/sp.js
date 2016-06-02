import {message,Select, DatePicker, Switch, Checkbox, Radio} from 'antd';

var classSet = require('./class-set');
var validator = require('./validator');
var Message = message;

var SP = {
    classSet: classSet,
    validator: validator,
    message: Message
};

module.exports = SP;
