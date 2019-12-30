/***
*author: 网友*/
//undefined  防止出现undefined 问题
;(function(undefined) {
  "use strict"
  var _global;
 
  // 构造方法 初始化 setting
  function extend(o,n,override) {
    for(var key in n){
      if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)){
        o[key]=n[key];
      }
    }
    return o;
  };
 
  // 插件构造函数 - 返回数组结构
  function PickerCascade(opt){
    this._initial(opt);
  };
 
  PickerCascade.prototype = {
    constructor: this,
    _initial: function(opt) {
      // 默认参数 和 初始化 暴露的内部方法
      var def = {
        datepickerBeginDate: '',
        datepickerEndDate: '',
        datepickerYear: '',
        datepickerMonth: '',
        beginTime:'',
        endTime:'',
        interval:'',
        number:'',
        date:'',
        beginDate:'',
        endDate:'',
        ev:{},
        _gotoDate : PickerCascade.prototype._gotoDate(this.ev),
        _changeTime:PickerCascade.prototype._changeTime(),
        _updateSele:PickerCascade.prototype._updateSele(this.beginTime,this.endTime),
        _diffMonth:PickerCascade.prototype._diffMonth(this.beginTime,this.endTime),
        _getIntervalMonth:PickerCascade.prototype._getIntervalMonth(this.beginDate,this.endDate),
        _dateAdd:PickerCascade.prototype._dateAdd(this.interval,this.number,this.date),
      };
      this.def = extend(def,opt,true); //配置参数
    },
 
   _gotoDate : function (ev){
      if(JSON.stringify(ev)=='{}'||typeof ev === "undefined"){
        return false;
      }
      $("input[name = '"+ev.target.name+"']").val(ev.format());
 
      var endTime = $("#"+this.def.datepickerEndDate).val();
      if(typeof endTime === "undefined"||endTime == ''){
        return false;
      }
      var beginTime = $("#"+this.def.datepickerBeginDate).val();
      if(typeof beginTime === "undefined"||beginTime == ''){
        return false;
      }
      this._updateSele(beginTime,endTime);
    },
    _changeTime: function (){
      if(typeof this.def === "undefined")
        return false;
 
 
      var beginTime = $("#"+this.def.datepickerBeginDate).val();
      if(typeof beginTime === "undefined"||beginTime == ''){
        return false;
      }
      var BeginDate = new Date(beginTime.replace(/-/g,"/"));
 
      var year = $("#"+this.def.datepickerYear).val();
      var month = $("#"+this.def.datepickerMonth).val();
      if(typeof year === "undefined"||year == ''){
        year = 0;
      }
      if(typeof month === "undefined"||month == ''){
        month = 0;
      }
 
      var endDate = this._dateAdd('month',parseInt(month),BeginDate);
      endDate = this._dateAdd('year',parseInt(year),endDate);
      $("#"+this.def.datepickerEndDate).val(endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate());
 
    },
    _updateSele: function (beginTime,endTime){
      if(typeof beginTime === "undefined"||typeof endTime === "undefined"){
        return false;
      }
      var intervalMonth = this._diffMonth(beginTime,endTime);
      $("#"+this.def.datepickerYear).val(parseInt(intervalMonth/12));
      $("#"+this.def.datepickerMonth).val(parseInt(intervalMonth%12));
    },
    _diffMonth: function (beginTime,endTime){
      if(typeof beginTime === "undefined"||typeof endTime === "undefined"){
        return false;
      }
      //计算时间差  年份 和  月份
      beginTime = beginTime.replace(/-/g,"/");
      endTime = endTime.replace(/-/g,"/");
      //相差的总月份
      return this._getIntervalMonth(new Date(beginTime) , new Date(endTime) );
    },
    _getIntervalMonth: function(beginDate,endDate){
      if(typeof beginDate === "undefined"||typeof endDate === "undefined"||JSON.stringify(endDate)=='null'||endDate=='')
        return false;
 
      return (endDate.getFullYear()*12 + endDate.getMonth()) - (beginDate.getFullYear()*12 + beginDate.getMonth());
    },
    _dateAdd: function(interval, number, date) {
      if(typeof interval === "undefined"||typeof number === "undefined"){
        return false;
      }
      if (typeof date === 'string') {
        date = new Date(date.replace(/-/g, "/"));
      }
      switch (interval) {
        case "year": {
          date.setFullYear(date.getFullYear() + number);
          break;
        }
        case "quar": {
          date.setMonth(date.getMonth() + number * 3);
          break;
        }
        case "month": {
          date.setMonth(date.getMonth() + number);
          break;
        }
        case "week": {
          date.setDate(date.getDate() + number * 7);
          break;
        }
        case "day": {
          date.setDate(date.getDate() + number);
          break;
        }
        case "hour": {
          date.setHours(date.getHours() + number);
          break;
        }
        case "minute": {
          date.setMinutes(date.getMinutes() + number);
          break;
        }
        case "second": {
          date.setSeconds(date.getSeconds() + number);
          break;
        }
        default: {
          date.setDate(date.getDate() + number);
          break;
        }
      }
      return date;
    }
  }
 
// 将插件对象暴露给全局对象（考虑兼容性）
  _global = (function(){ return this || (0, eval)('this'); }());
  if (typeof module !== "undefined" && module.exports) {
    module.exports = PickerCascade;
  } else if (typeof define === "function" && define.amd) {
    define(function(){return PickerCascade;});
  } else {
    !('PickerCascade' in _global) && (_global.PickerCascade = PickerCascade);
  }
}());