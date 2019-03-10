var queryParams = getUrlVars();

var timezoneOffset = queryParams["timezoneOffset"] || 0; // UTC if nothing specified.
var locale = queryParams["lc"] || "en";

var Localization = {
  translate: function(lcKey, value) {
  var loc = this.locales[this.currentLocale];
  var translation = loc[lcKey];
  return translation[loc.plural(value)];
  },

  currentLocale: locale,

  locales: {
  en: {
    D: [" DAY", " DAYS"],
    H: [" HOUR", " HOURS"],
    M: [" MINUTE", " MINUTES"],
      S: [" SECOND", " SECONDS"],
    IN: ["IN"],
    AGO: ["AGO"],
    DOWNLOAD: ["Download Timepage to create a countdown on your iPhone or iPad."],
    plural: function(nr) {
          return (nr == 1) ? 0 : 1;
        }
  },
  fr: {
    D: [" JOUR", " JOURS"],
    H: [" HEURE", " HEURES"],
    M: [" MINUTE", " MINUTES"],
      S: [" SECONDE", " SECONDES"],
    IN: ["DANS"],
    AGO: ["DEPUIS"],
    DOWNLOAD: ["Téléchargez Timepage pour créer un compte à rebours sur votre iPhone ou votre iPad."],
    plural: function(nr) {
          return (nr == 1) ? 0 : 1;
        }
  },
  it: {
    D: [" GIORNO", " GIORNI"],
    H: [" ORA", " ORE"],
    M: [" MINUTO", " MINUTI"],
      S: [" SECONDO", " SECONDI"],
    IN: ["TRA"],
    AGO: ["FA"],
    DOWNLOAD: ["Scarica Timepage per crare un conto alla rovescia sul tuo iPhone o iPad."],
    plural: function(nr) {
          return (nr == 1) ? 0 : 1;
        }
  },
  de: {
    D: [" TAG", " TAGE"],
    H: [" STUNDE", " STUNDEN"],
    M: [" MINUTE", " MINUTEN"],
      S: [" SEKUNDE", " SEKUNDEN"],
    IN: ["IN"],
    AGO: ["VOR"],
    DOWNLOAD: ["Timepage herunterladen, um auf Ihrem iPhone oder iPad einen Countdown zu erstellen."],
    plural: function(nr) {
          return (nr == 1) ? 0 : 1;
        }
  },
  ja: {
    D: ["日"],
    H: ["時間"],
    M: ["分"],
      S: ["秒"],
    IN: ["あと"],
    AGO: ["前"],
    DOWNLOAD: ["Timepageをダウンロードして、iPhoneまたはiPadでカウントダウンを作成します。"],
    plural: function(nr) {
          return 0;
        }
  },
  zhHans: {
    D: ["天"],
    H: ["小时"],
    M: ["分钟"],
      S: ["秒钟"],
    IN: ["于"],
    AGO: ["前"],
    DOWNLOAD: ["下载Timepage，给您的iPhone或iPad创建倒计时。"],
    plural: function(nr) {
          return 0;
        }
  },
  zhHant: {
    D: ["天"],
    H: ["小時"],
    M: ["分鐘"],
      S: ["秒"],
    IN: ["還有"],
    AGO: ["前"],
    DOWNLOAD: ["下載 Timepage，在您的 iPhone 或 iPad 倒數計時。"],
    plural: function(nr) {
          return 0;
        }
  }
  }
};

var daysWrapper = $('#daysWrapper');
var hoursWrapper = $('#hoursWrapper');
var minutesWrapper = $('#minutesWrapper');
var secondsWrapper = $('#secondsWrapper');
var agoLabel = $('#tp-countdown-ago');
var inLabel = $('#tp-countdown-in');

$(document).ready(function() {
  $('.ce-countdown').countEverest({
    // Set your target date here!
    day: queryParams["day"],
    month: queryParams["month"],
    year: queryParams["year"],
    hour: queryParams["hour"],
    minute: queryParams["minute"],
    second: queryParams["second"],
    daysLabel: Localization.translate("D",2),
    dayLabel: Localization.translate("D",1),
    hoursLabel: Localization.translate("H",2),
    hourLabel: Localization.translate("H",1),
    minutesLabel: Localization.translate("M",2),
    minuteLabel: Localization.translate("M",1),
    secondsLabel: Localization.translate("S",2),
    secondLabel: Localization.translate("S",1),
    timeZone: timezoneOffset,
    countUp: true,
    onChange: function() {
      console.log("Days: " + this.days + " Hours: " + this.hours + " Minutes: " + this.minutes + " Seconds: " + this.seconds);
      if (Math.abs(this.days) > 0) {
        //console.log("Days" + this.days);
        $('#daysWrapper').appendTo('#tp-countdown-top-line');
        hoursWrapper.appendTo('#tp-countdown-bottom-line');
        hoursWrapper.append(" ");
        minutesWrapper.appendTo('#tp-countdown-bottom-line');
        minutesWrapper.append(" ");
        secondsWrapper.appendTo('#tp-countdown-bottom-line');
      } else {
        daysWrapper.detach();

        if (Math.abs(this.hours) > 0) {
          //console.log("Hours" + this.hours);
          hoursWrapper.appendTo('#tp-countdown-top-line');
          minutesWrapper.appendTo('#tp-countdown-bottom-line');
          minutesWrapper.append(" ");
          secondsWrapper.appendTo('#tp-countdown-bottom-line');
        } else {
          hoursWrapper.detach();

          if (Math.abs(this.minutes) > 0) {
            //console.log("Minutes" + this.minutes);
            minutesWrapper.appendTo('#tp-countdown-top-line');
            secondsWrapper.appendTo('#tp-countdown-bottom-line');
          } else {
            //console.log("Seconds" + this.seconds);
            minutesWrapper.detach();
            secondsWrapper.appendTo('#tp-countdown-top-line');
          }
        }
      }

      var target = new Date(Date.UTC(this.settings.year, this.settings.month - 1, this.settings.day, this.settings.hour, this.settings.minute, this.settings.second));
      if (target > this.currentDate) {
        agoLabel.detach();
      } else {
        agoLabel.appendTo('#ago-wrapper');
        inLabel.detach();
      }
    },
    onComplete: function() {
//            location.reload();
    }
  });
});

var backgroundColor = queryParams["color"];
if (!backgroundColor) backgroundColor = "#1d2424";
document.body.style.background = backgroundColor;

var icon = queryParams["icon"];
if (icon) {
  var iconName = "./images/" + decodeURIComponent(icon) + ".png";
    $('#tp-countdown-icon').attr('src', iconName);
} else {
  $('#tp-countdown-icon').detach();
}

document.getElementById('tp-countdown-ago').innerHTML = Localization.translate("AGO",1);

var title = queryParams["title"];
if (title) {
  document.getElementById('tp-countdown-in').innerHTML = Localization.translate("IN",1);
  document.getElementById('tp-download-text').innerHTML = Localization.translate("DOWNLOAD",1);

  var decodedTitle = decodeURIComponent(title);
  document.getElementById('tp-countdown-event-title').innerHTML = decodedTitle;
  document.title = decodedTitle + " via Timepage";
} else {
  document.getElementById('tp-countdown-in').innerHTML = "";
  document.title = "Timepage Countdown";
}
