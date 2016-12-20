;(function(moment) {
//////
// Julian Date (Julian day + time)
///
/*
  Extracted from http://www.tondering.dk/claus/cal/julperiod.php:

  "JD 0 designates the 24 hours from noon TT on 1 January 4713 BC to noon TT on 2 January 4713 BC. (TT=Terrestrial Time, which is roughly equivalent to UTC. The current difference between the two is about one minute).

  This means that at noon TT on 1 January AD 2000, JD 2,451,545 started."
*/

  moment.fn.toJD = (dateObj) => {
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
                dateObj.second() / 86400;
      }
    }
    return jd;
  }

  return moment;

  // function convertToJD(myDate) {
  //   /*
  //     Convert a Moment.js object into a Julian Date.
  //     N.B.: Julian Date = Julian Day Number + Time
  //
  //     Example:
  //     > date = moment.utc([1582, 9, 3, 15, 23, 43])
  //     > jd = moment.convertToJD(date)
  //     (console.log(jd) outputs 2299159.1414699075)
  //   */
  //   // return the result from the method implemented above
  //   return moment.utc(myDate).toJD();
  // }
  //
  // function convertFromJD(myJD) {
  //   /*
  //     Convert a given Julian Date into Gregorian Date.
  //
  //     The returned value is a Moment.js object.
  //
  //     Example:
  //     > jd = 2299159.1414699075
  //     > date = moment.convertFromJD( jd )
  //     > date.year() (output: 1582)
  //     > date.hour() (output: 15 )
  //   */
  //
  //   // Julian calendar ends on 1582 Oct 05.
  //   // Dates prior or equal to 1582 Oct 04 @ 23:59:59
  //   // correspond to JD <= 2299160.49999...
  //   if (myJD <= 2299160.5) {
  //     // Julian calendar
  //     var b = 0;
  //     var c = myJD + 32082;
  //   } else {
  //     // Gregorian calendar
  //     var a = myJD + 32044;
  //     var b = Math.floor((4 * a + 3) / 146097);
  //     var c = a - Math.floor((146097 * b) / 4);
  //   }
  //   var d = Math.floor((4 * c) / 1461);
  //   var e = c - Math.floor((1461 * d) / 4);
  //   var m = Math.floor((5 * e + 2) / 153);
  //   var myDay = e - Math.floor((153 * m + 2) / 5) + 1;
  //   var myMonth = m + 3 - 12 * Math.floor(m / 10);
  //   var myYear = 100 * b + d - 4800 + Math.floor(m / 10);
  //   // deal with time
  //   var myHour, myMinute, mySecond, myMillisecond;
  //   if (myDay % 1 !== 0) {
  //     //
  //     // using 24 h format (00:00:00)
  //     //
  //     if (myDay % 1 === 0.5) {
  //       // it is midnight; bubble up the day
  //       myDay = Math.floor(myDay) + 1;
  //       myHour = 0;
  //       myMinute = 0;
  //       mySecond = 0;
  //     } else {
  //       myHour = Math.floor((myDay % 1) < 0.5 ?
  //       // (myDay % 1) <= 0.5 corresponds to afternoon + night (i.e. 12:00:01-23:59:59)
  //                           (myDay % 1) * 24 + 12 :
  //       // (myDay % 1) > 0.5 corresponds to the "wee" hours + morning (i.e. 00:00:01-11:59:59)
  //                           (myDay % 1) * 24 - 12);
  //       myMinute = ((myDay % 1) * 1440 - ((myDay % 1) * 1440) % 1) % 60;
  //       mySecond = ((myDay % 1) * 86400 - ((myDay % 1) * 86400) % 1) % 60;
  //       myDay = myDay - myDay % 1;
  //     }
  //   } else {
  //     // it is noon
  //     myHour = 12;
  //     myMinute = 0;
  //     mySecond = 0;
  //   }
  //
  //   return moment.utc(
  //                     [myYear,
  //                     // keep Moment.js format for
  //                     // months, i.e., 0->Jan; 1->Feb...
  //                     myMonth - 1,
  //                     myDay,
  //                     myHour,
  //                     myMinute,
  //                     mySecond]
  //   );
  // }

  //

})(moment);
