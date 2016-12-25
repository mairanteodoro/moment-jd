import './moment-jd';

var date = moment.utc();
var jd = moment.fn.toJD(date);

$(function(){

  $('#date').html('Current ISO-8601: ' + date.toISOString());
  $('#jd').html('Corresponding JD: ' + jd);

});
