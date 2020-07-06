const toFloat = val => {
    if (val && val !== '')
    {
        val = val.replace (/[^0-9,]/g, '')
       return parseFloat(val.toString().replace(',','.'));
    }
    return null;
}
const toCost = val => {
    if (val && val !== '')
    {
        return toFloatView(val).replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ') + ' ₽'
    }
    return ''
}
const toFloatView = val => {
    if (val && val !== '')
    {
        return val.toString().replace (/[^0-9.,]/g, '').replace('.',',')
    }
    return null;
}
const inMonth = i =>  ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'][i]
const ofMonth = i =>  ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][i]
const forMonth = i =>  ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'][i]

const truncated = num => Math.trunc(parseFloat(num).toFixed(2) * 100) / 100;



export {toFloat, toCost, toFloatView, inMonth, ofMonth, truncated, forMonth}