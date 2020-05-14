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

const dateFromString = str => {
if (!str)  return null;
return new Date(str.split('.')[2], parseInt(str.split('.')[1])-1, str.split('.')[0])
}
export {formatDate, dateFromString}