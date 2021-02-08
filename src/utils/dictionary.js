const FunList = [
    {id: 0, name:'equipmant', shortName: 'eq'},
    {id: 1, name:'query', shortName: 'q'},
    {id: 2, name:'contract', shortName: 'con'}, 
    {id: 3, name:'metrology', parFunId:'0', shortName: 'met' },
    {id: 4, name:'repair', parFunId: '0',  shortName: 'rep'},
    {id: 5, name:'report', shortName: 'rpt'},
    {id: 6, name:'uniteCon',  parFunId: '2', shortName: 'conExt'},//объединение договоров
    {id: 7, name:'adminUser', shortName: 'au'}  ] 

const eqReadinessList = [{id: 1, name: 'Готово к использованию'}, {id: 2, name: 'На ТО'}, {id: 3, name: 'На модернизации'}, {id: 4, name: 'На консервации'}];
const noWorkable = [4]; 

const orderTimeList = [{id:1, name: '1 час', hours: 1}, {id:2, name: '2 часа', hours: 2}, {id:3, name: '3 часа', hours: 3},
 {id:4, name: 'Смена',
    hours: [{workingMode:1, hours: 9}, {workingMode:2, hours: 8}, {workingMode:3, hours: 12}]
}];

const docTypeList = [{id:1, name: 'Паспорт/формуляр оборудования'}, {id:2, name: 'Инструкция/руководство по эксплуатации'}, {id:3, name: 'Инструкция по ТБ'}, {id:4, name: 'Методика поверки'},
    {id:5, name: 'Методика калибровки'}, {id:6, name: 'Программа и методика аттестации'}, {id:7, name: 'Методика испытаний'}];

const repTypeList = [{id: 1, name: 'Плановый'}, {id: 2, name: 'Капитальный'}, {id: 3, name: 'Модернизация'}]

const queryTypeList =[{id: 1, name: 'Проведение испытаний'}, {id: 2,  name: 'Техническое обслуживание'}, {id: 3, name: 'Аттестация/Поверка'}]

const workingModeList = [{id: 1, name: "с 9:00 до 18:00", timeStart: "09:00", timeEnd: "18:00"}, 
{id: 2, name: "3 смены по 8 часов", timeStart: "00:00", timeEnd: "24:00"}, {id: 3, name: "2 смены по 12 часов", timeStart: "00:00", timeEnd: "24:00"}]

const attTypeList =[{id:1, name: "Аттестация"}, {id:2, name:"Поверка"}, {id:3, name:"Калибровка"}]
const MTypeList =[{id:1, name: "Первичная"}, {id:2, name:"Периодическая"}, {id:3, name:"Первичная после ремонта"}, {id:43, name:"Внеочередная"}]

const devisionFullNameList =[{id: 2, name:"Научный центр «Нетяговый подвижной состав и автотормозные системы поезда»"},
    {id: 3, name: "Электрификация и теплоэнергетика"},
    {id: 4, name:"Научный аттестационный центр"},
    {id: 5, name:"Путевая инфраструктура и вопросы взаимодействия колесо-рельс"},
    {id: 6, name:"Центр «Охрана труда, экология и промышленная безопасность»"},
    {id: 7, name:"Транспортная механика "},
    {id: 8, name:"Научный центр «Высокоскоростные магистрали»"},
    {id: 9, name:"Тяговый подвижной состав "},
    {id: 11, name:"Научный центр «Рельсы, сварка, транспортное материаловедение»"},
]

const eventType = {"INSERT": 1, "UPDATE": 2, "DELETE": 3}

const placeType = [{id:1, name: "Москва-3"}, {id:2, name:"Щербинка"}]

const getFunList = () => FunList
const getFunId = (funShortName) => { let fun = FunList.find(fun => fun.shortName === funShortName); return fun ? fun.id : null};
const getEqReadiness = () => eqReadinessList 
const getOrderTime = () => orderTimeList
const getDocType = () => docTypeList
const getRepType = () => repTypeList
const getQueryType = () => queryTypeList
const getWorkingMode = () => { let res = [];  workingModeList.forEach(item => res.push({id: item.id, name: item.name})); return res}
const getOrderTimeHours = (orderTime, workingMode) => {
    if (orderTime && orderTime > 0)  {
        let orderTimeItem = _.find(getOrderTime(), {id: orderTime});
        if (typeof(orderTimeItem.hours) === "number")
            return orderTimeItem.hours;
        if (workingMode && workingMode > 0) {
            return _.find (orderTimeItem.hours, {workingMode: workingMode}).hours;
         }
    }
    return 0;
};
const getWorkingPeriod = (workingMode) => {
    let item = _.find(workingModeList, {id: workingMode});
    if (!item) item = workingModeList[0];
    return [item.timeStart, item.timeEnd];
}
const getAttType = () => attTypeList
const getMType = () => MTypeList
const getDevFullName = () => devisionFullNameList
const getEventType = () => eventType
const getPlaceType = () => placeType


export {getFunList, getEqReadiness, getOrderTime, getDocType, getRepType, getQueryType, 
    getWorkingMode, getOrderTimeHours, getWorkingPeriod, getAttType, getMType, getDevFullName, getFunId, getEventType, noWorkable, getPlaceType};