
const FunList = [
    {id: 0, name:'equipmant', shotName: 'eq'},
    {id: 1, name:'query', shotName: 'q'},
    {id: 2, name:'contract', shotName: 'con'}, 
    {id: 3, name:'metrology', parFunId:'0', shotName: 'met' },
    {id: 4, name:'repair', parFunId: '0',  shotName: 'rep'},
    {id: 5, name:'report', shotName: 'rpt'}]
const eqReadinessList = [{id: 1, name: 'Готово'}, {id: 2, name: 'Не готово'}];
const orderTimeList = [{id:1, name: '1 час'}, {id:2, name: '2 часа'}, {id:3, name: '3 часа'}, {id:4, name: 'Смена'}];
const docTypeList = [{id:1, name: 'Паспорт/формуляр оборудования'}, {id:2, name: 'Инструкция/руководство по эксплуатации'}, {id:3, name: 'Инструкция по ТБ'}, {id:4, name: 'Методика поверки'},
    {id:5, name: 'Методика калибровки'}, {id:6, name: 'Программа и методика аттестации'}, {id:7, name: 'Методика испытаний'}];
const repTypeList = [{id: 1, name: 'Плановый'}, {id: 2, name: 'Капитальный'}]

const getFunList = () => FunList
const getEqReadiness = () => eqReadinessList 
const getOrderTime = () => orderTimeList
const getDocType = () => docTypeList
const getRepType = () => repTypeList

export {getFunList, getEqReadiness, getOrderTime, getDocType, getRepType};