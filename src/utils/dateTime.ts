export interface TimeRemainingResult {
  result: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export const MONTHS: string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface IDate { days: number, months: number, years: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number }

export function createDate(dateParams: IDate): Date {
  const currentDate: Date = new Date();
  if (dateParams.years) {
    currentDate.setFullYear(dateParams.years);
  }
  currentDate.setMonth(dateParams.months - 1);
  currentDate.setDate(dateParams.days);
  currentDate.setHours(dateParams.hours ?? currentDate.getHours());
  currentDate.setMinutes(dateParams.minutes ?? currentDate.getMinutes());
  currentDate.setSeconds(dateParams.seconds ?? currentDate.getSeconds());
  currentDate.setMilliseconds(dateParams.milliseconds ?? currentDate.getMilliseconds());

  return currentDate;

}

export function isValidISODateTime(dateTimeString: string): boolean {
  const ISODateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

  return ISODateTimeRegex.test(dateTimeString);
}

export function getMonth(monthNumber: number): string {
  if (monthNumber < 0 || monthNumber > 11) {
    throw new Error('Invalid month number. Month number must be between 1 and 12.');
  }

  return MONTHS[monthNumber];
}

export function getDaysInMonth(months: number, years: number): number {
  if (months < 0 || months > 11) {
    throw new Error('Invalid month. Month must be between 1 and 12.');
  }

  const daysInMonth = new Date(years, months + 1, 0).getDate();

  return daysInMonth;
}

export const formatTime = (time: number): string => {
  return time > 9 ? time.toString() : `0${time}`;
};

export function getTimeRemaining(timeDifference: number, format?: "addLeadingZero"): TimeRemainingResult {
  if (timeDifference < 0) {
    throw new Error('Invalid time difference. Time difference must be non-negative.');
  }

  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const millisecondsInHour = 1000 * 60 * 60;
  const millisecondsInMinute = 1000 * 60;
  const millisecondsInSecond = 1000;

  const days = Math.floor(timeDifference / millisecondsInDay);
  const remainingHours = timeDifference % millisecondsInDay;
  const hours = Math.floor(remainingHours / millisecondsInHour);
  const remainingMinutes = remainingHours % millisecondsInHour;
  const minutes = Math.floor(remainingMinutes / millisecondsInMinute);
  const remainingSeconds = remainingMinutes % millisecondsInMinute;
  const seconds = Math.floor(remainingSeconds / millisecondsInSecond);

  const formattedHours = format ? formatTime(hours) : hours.toString();
  const formattedMinutes = format ? formatTime(minutes) : minutes.toString();
  const formattedSeconds = format ? formatTime(seconds) : seconds.toString();

  const resultString = `${days} Days ${formattedHours} hours ${formattedMinutes} minutes ${formattedSeconds} seconds`;

  const result: TimeRemainingResult = {
    result: resultString,
    days: days.toString(),
    hours: format ? formattedHours : hours.toString(),
    minutes: format ? formattedMinutes : minutes.toString(),
    seconds: format ? formattedSeconds : seconds.toString()
  };

  return result;
}
