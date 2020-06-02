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

export {toFloat, toCost, toFloatView}