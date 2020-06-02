const addZero = value => ("0" + value).slice(-2);

const formatDate = value => {
if (value) {
  const dt = new Date(value);
  return `${addZero(dt.getDate())}.${addZero(
    dt.getMonth() + 1
  )}.${dt.getFullYear()}`;
}
return "";
};

const formatDateTime = value => {
  if (value) {
    const dt = new Date(value);
    return `${addZero(dt.getDate())}.${addZero(dt.getMonth() + 1)}.${dt.getFullYear()} ${addZero(dt.getHours())}:${addZero(dt.getMinutes())}`;
  }
  return "";
  };

const dateFromString = str => {
if (!str)  return null;
return new Date(str.split('.')[2], parseInt(str.split('.')[1])-1, str.split('.')[0])
}
//Количество дней в месяце
Date.prototype.daysInMonth = function() {
  return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};
const DateDiff = (date1, date2) => {
  let datediff = date1.getTime() - date2.getTime(); 
  return (datediff / (24*60*60*1000)); 
}
const HoursDiff = (date1, date2) => {
  if (date1 && date2){
    let datediff = date1.getTime() - date2.getTime(); 
    return (datediff / (60*60*1000)); 
  }
  return 0;
}
const totalDays = (date1, date2) => {
  let de = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  let db = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  let datediff = de.getTime() - db.getTime(); 
  return (datediff / (24*60*60*1000) + 1); 
}
export {formatDate, dateFromString, DateDiff, totalDays, formatDateTime, HoursDiff}