import { getFunList }  from "./dictionary";
import store  from '../../store'

  const getFunRight = funShortName =>
  {
      let funList = getFunList();
      let fun = funList.find(fun => fun.shortName === funShortName);
      let funId = fun ? fun.id : -1;
      let userRights = store.getters.userRights;
      let rgt = parseInt(userRights[funId], 16);
      let rights = {};
      rights.add = (rgt&1) > 0 //  добавление
      rights.view = (rgt&2) > 0 // просмотр
      rights.edit =  (rgt&4) > 0 // редактирование      
      rights.delete =  (rgt&8) > 0 // удаление

      return rights;
  }

  const hasRight = funShortName => { 
    let funList = getFunList();
    let fun = funList.find(fun => fun.shortName === funShortName);
    let funId = fun ? fun.id : -1;
    let userRights = (store.getters.userRights);
    return parseInt(userRights[funId], 16) > 0
  }

  
  export {getFunRight, hasRight};