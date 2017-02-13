;(function() {

  //////
  // Julian Date (Julian day + time)
  ///
  /*
    Extracted from http://www.tondering.dk/claus/cal/julperiod.php:

    "JD 0 designates the 24 hours from noon TT on 1 January 4713 BC to noon TT on 2 January 4713 BC. (TT=Terrestrial Time, which is roughly equivalent to UTC. The current difference between the two is about one minute).

    This means that at noon TT on 1 January AD 2000, JD 2,451,545 started."
  */

  if (typeof moment !== 'undefined') {
    console.log('moment-jd: moment is defined.');
    var moment = moment;
  } else if (typeof require !== 'undefined') {
    console.log('moment-jd: moment is not defined; trying require("moment")...');
    var moment = require('moment');
  } else {
    throw new Error('moment-jd: moment is not defined.')
  }

  moment.fn.toJD = function(dateObj) {
    /*
    JD is the Julian Day that starts at noon UTC.
    JDN is JD + fraction of day (time) from noon UTC.

    Implemented from http://www.tondering.dk/claus/cal/julperiod.php

    "The algorithm below works fine for AD dates. If you want to use it for BC dates, in order to comply with ISO-8601, you must first convert the BC year to a negative year (e.g., 10 BC = -9). The algorithm works correctly for all dates after 4800 BC, i.e. at least for all positive Julian Day."
    */
    var year = dateObj.year() < 0 ? dateObj.year() + 1 : dateObj.year();

    if (year === 1582 && dateObj.month() === 9 && (dateObj.date() <= 14 && dateObj.date() >= 5)) {
      // 1582 Oct 05 - 14
      console.log('NO JD DEFINED BETWEEN 1582 Oct 05 - 14')
    } else {
      // Julian calendar ends on:
      // 1582 Oct 05 = 1582.994623655914
      var julCalDecYear = 1582.994623655914;
      var currDecYear = dateObj.year() +
                        (dateObj.month()+1) / 12 +
                        dateObj.date() / dateObj.daysInMonth();

      if (currDecYear < julCalDecYear) {
        // Julian calendar
        var a = Math.floor((14 - (dateObj.month()+1)) / 12);
        var y = year + 4800 - a;
        var m = (dateObj.month()+1) + 12 * a - 3;
        var jdn = dateObj.date() +
                  Math.floor((153 * m + 2) / 5) +
                  365 * y +
                  Math.floor(y / 4) -
                  32083;
        var jd = jdn +
                // validate UTC (JD is always in UTC)
                ((dateObj._isUTC ? dateObj.hour() : dateObj.hour() - dateObj.utcOffset() / 60) - 12) / 24 +
                dateObj.minute() / 1440 +
                dateObj.second() / 86400;
      } else {
        // Gregorian calendar
        var a = Math.floor((14 - (dateObj.month()+1)) / 12);
        var y = year + 4800 - a;
        var m = (dateObj.month()+1) + 12 * a - 3;
        var jdn = dateObj.date() +
                  Math.floor((153 * m + 2) / 5) +
                  365 * y +
                  Math.floor(y / 4) -
                  Math.floor(y / 100) +
                  Math.floor(y / 400) -
                  32045;
        var jd = jdn +
                // validate UTC (JD is always in UTC)
                ((dateObj._isUTC ? dateObj.hour() : dateObj.hour() - dateObj.utcOffset() / 60) - 12) / 24 +
                dateObj.minute() / 1440 +
                (dateObj.second() + dateObj.millisecond() / 1000) / 86400;
      }
    }
    return jd;
  }

  moment.fn.fromJD = function(myJD) {
    /*
      Convert a given Julian Date into Gregorian Date.

      The returned value is a Moment.js object.

      Example:
      > jd = 2299159.1414699075
      > date = moment.convertFromJD( jd )
      > date.year() (output: 1582)
      > date.hour() (output: 15 )
    */

    // Julian calendar ends on 1582 Oct 05.
    // Dates prior or equal to 1582 Oct 04 @ 23:59:59
    // correspond to JD <= 2299160.49999...
    if (myJD < 2299160.5) {
      // Julian calendar
      var b = 0;
      var c = myJD + 32082;
    } else {
      // Gregorian calendar
      var a = myJD + 32044;
      var b = Math.floor((4 * a + 3) / 146097);
      var c = a - Math.floor((146097 * b) / 4);
    }
    var d = Math.floor((4 * c) / 1461);
    var e = c - Math.floor((1461 * d) / 4);
    var m = Math.floor((5 * e + 2) / 153);
    var myDay = e - Math.floor((153 * m + 2) / 5) + 1;
    var myMonth = m + 3 - 12 * Math.floor(m / 10);
    var myYear = 100 * b + d - 4800 + Math.floor(m / 10);
    // deal with time
    var myHour, myMinute, mySecond, myMillisecond;
    if (myDay % 1 !== 0) {
      //
      // using 24 h format (00:00:00)
      //
      if (myDay % 1 === 0.5) {
        // it is midnight; bubble up the day
        myDay = Math.floor(myDay) + 1;
        myHour = 0;
        myMinute = 0;
        mySecond = 0;
        myMillisecond = 0;
      } else {
        myHour = Math.floor((myDay % 1) < 0.5 ?
        // (myDay % 1) <= 0.5 corresponds to afternoon + night (i.e. 12:00:01-23:59:59.999)
                            (myDay % 1) * 24 + 12 :
        // (myDay % 1) > 0.5 corresponds to the "wee" hours + morning (i.e. 00:00:01-11:59:59.999)
                            (myDay % 1) * 24 - 12);
        myMinute = ((myDay % 1) * 1440 - ((myDay % 1) * 1440) % 1) % 60;
        mySecond = ((myDay % 1) * 86400 - ((myDay % 1) * 86400) % 1) % 60;
        myMillisecond = (1000 * (((myDay % 1) * 86400) % 60 - mySecond)).toFixed(0);
        // Julian day begins at noon, so if mod < 0.5 -> same day
        myDay = myDay % 1 < 0.5 ?
                // still same day
                myDay - myDay % 1 :
                // next day
                myDay - myDay % 1 + 1;
      }
    } else {
      // it is noon
      myHour = 12;
      myMinute = 0;
      mySecond = 0;
      myMillisecond = 0;
    }

    // compensating for day "bubble up"
    // due to dates involving midnight
    // if (myDay > 31) {
    //   // reset day
    //   myDay = 1;
    //   // bubble up month
    //   myMonth += 1
    //   if (myMonth > 11) {
    //     // reset month
    //     myMonth = 1;
    //     // bubble up year
    //     myYear += 1;
    //   }
    // }

    // create final moment.utc() object with the current values
    // N.B.: the returned value complies with ISO-8601:
    // e.g. moment.utc().year(myYear) = -9 (result from the algorithm above)
    // corresponds to 10 B.C.E. which is the same as -10
    // which in turn is the actual returned value to the user
    var temp = moment.utc()
                      .year(myYear)
                      .month(myMonth-1)
                      .date(myDay)
                      .hour(myHour)
                      .minute(myMinute)
                      .second(mySecond)
                      .millisecond(myMillisecond)
    // accounting for B.C.E. - C.E. transition (no year = 0)
    temp.year(temp.year() <= 0 ? temp.year() - 1 : temp.year())


    // console.log(myYear, myMonth-1, myDay, myHour, myMinute, mySecond, myMillisecond);

    /*
    From Moment.js docs:
    "Date of Month"
    "Accepts numbers from 1 to 31. If the range is exceeded, it will bubble up to the months."
    "Note: if you chain multiple actions to construct a date, you should start from a year, then a month, then a day etc. Otherwise you may get unexpected results, like when day=31 and current month has only 30 days (the same applies to native JavaScript Date manipulation), the returned date will be 1st of the following month."

    "Bad: moment().date(day).month(month).year(year)"

    "Good: moment().year(year).month(month).date(day)"
    */
    // return moment.utc()
    //                   .year(myYear)
    //                   .month(myMonth-1)
    //                   .date(myDay)
    //                   .hour(myHour)
    //                   .minute(myMinute)
    //                   .second(mySecond)
    //                   .millisecond(myMillisecond);
    return temp

  }

  return moment;

}).apply(this);
