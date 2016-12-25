/*
  Import plugin.
  Note that jQuery & Moment.js have already been loaded via webpack.config.js ProvidePlugin method. This is the same as adding script tags into the index.html file (in the right sequence, of course).
*/
import './moment-jd';

var date = moment.utc();
var jd = moment.fn.toJD(date);
// moment.fn.fromJD() will return UNIX time
var convertedDate = moment.fn.fromJD(jd).toISOString();

$(function(){

  $('#date').html('Current ISO-8601: ' + date.toISOString());
  $('#jd').html('Corresponding JD: ' + jd);
  $('#convertedDate').html('Date converted from JD: ' + convertedDate);

});
