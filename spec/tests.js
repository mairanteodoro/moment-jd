var moment = require('moment');
require('../moment-jd');

/*
  All the test were ran against the results from USNO
  (http://aa.usno.navy.mil/data/docs/JulianDate.php)
*/

describe('fromDateToJD', function() {

  it('should convert simple Moment.js objects into JD', function() {
    // positive years (C.E.)
    expect(moment.fn.toJD(moment.utc([5000, 0, 1, 0, 0, 0]))).toEqual(3547272.5);
    expect(moment.fn.toJD(moment.utc([1900, 6, 1, 12, 0, 0]))).toEqual(2415202.0);
    expect(moment.fn.toJD(moment.utc([1, 0, 1, 12, 0, 0]))).toEqual(1721424.0);
    // both year=0 and year=-1 correspond to 1 B.C.E.
    // (technically, there is no year=0)
    expect(moment.fn.toJD(moment.utc([0, 0, 1, 0, 0, 0]))).toEqual(1721057.5);
    expect(moment.fn.toJD(moment.utc([-1, 0, 1, 0, 0, 0]))).toEqual(1721057.5);
    // negative years (B.C.E.)
    expect(moment.fn.toJD(moment.utc([-1000, 0, 1, 0, 0, 0]))).toEqual(1356173.5);
    expect(moment.fn.toJD(moment.utc([-3000, 0, 1, 0, 0, 0]))).toEqual(625673.5);
    expect(moment.fn.toJD(moment.utc([-4000, 0, 1, 0, 0, 0]))).toEqual(260423.5);
  });

  it('should be undefined (Gregorian Dates where Julian Dates are not defined)', function() {
    for (var i=5; i<=14; i++) {
      expect(moment.fn.toJD(moment.utc([1582, 9, i, 0, 0, 0]))).toBeUndefined();
    };
  });

  it('should return zero', function() {
    expect(moment.fn.toJD(moment.utc([-4713, 0, 1, 12, 0, 0]))).toEqual(0);
  });

});



describe('fromJDtoDate', function() {

  var jd, res;

  it('should convert a given JD into a UNIX timestamp', function() {
    jd = 3547272.5;
    res = moment.fn.fromJD(jd);
    expect(moment(res).year()).toEqual(5000);
    expect(moment(res).month()).toEqual(0);
    expect(moment(res).date()).toEqual(1);
    expect(moment(res).hour()).toEqual(0);
    expect(moment(res).minute()).toEqual(0);
    expect(moment(res).second()).toEqual(0);
    expect(moment(res).millisecond()).toEqual(0);

    jd = 2415202.0;
    res = moment.fn.fromJD(jd);
    expect(moment(res).year()).toEqual(1900);
    expect(moment(res).month()).toEqual(6);
    expect(moment(res).date()).toEqual(1);
    expect(moment(res).hour()).toEqual(12);
    expect(moment(res).minute()).toEqual(0);
    expect(moment(res).second()).toEqual(0);
    expect(moment(res).millisecond()).toEqual(0);
  });

  it('should test the continuity of Julian Dates despite the Gregorian 10-days gap', function() {
    jd = 2299159.5;
    res = moment.fn.fromJD(jd);
    expect(moment(res).date()).toEqual(4);
    jd = 2299160.5;
    res = moment.fn.fromJD(jd);
    expect(moment(res).date()).toEqual(15);
  });

  it('should test the begining of the Julian Date', function() {
    jd = 0;
    res = moment.fn.fromJD(jd);
    expect(moment(res).year()).toEqual(-4713);
    expect(moment(res).month()).toEqual(0);
    expect(moment(res).date()).toEqual(1);
    expect(moment(res).hour()).toEqual(12);
    expect(moment(res).minute()).toEqual(0);
    expect(moment(res).second()).toEqual(0);
    expect(moment(res).millisecond()).toEqual(0);
  });

  it('should test the C.E. to B.C.E. epoch transition', function() {
    jd = 1721423.499999; // B.C.E. 1 Dec 31 23:59:59.9
    res = moment.fn.fromJD(jd);
    expect(moment(res).year()).toEqual(-1);
    expect(moment(res).month()).toEqual(11);
    expect(moment(res).date()).toEqual(31);
    expect(moment(res).hour()).toEqual(23);
    expect(moment(res).minute()).toEqual(59);
    expect(moment(res).second()).toEqual(59);
    // the actual millisecond value returned is 914
    expect(moment(res).millisecond()).toBeCloseTo(900, -1.5);

    jd = 1721423.5; // C.E. 1 Jan 1 00:00:00.000
    res = moment.fn.fromJD(jd);
    expect(moment(res).year()).toEqual(1);
    expect(moment(res).month()).toEqual(0);
    expect(moment(res).date()).toEqual(1);
    expect(moment(res).hour()).toEqual(0);
    expect(moment(res).minute()).toEqual(0);
    expect(moment(res).second()).toEqual(0);
    expect(moment(res).millisecond()).toEqual(0);
  });

});
