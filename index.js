import * as moment from 'moment';
import './moment-jd';

var date = moment.utc();
var jd = moment.fn.toJD(date);

$(function(){

  $('#date').html(date.toISOString());
  $('#jd').html(jd);

});
