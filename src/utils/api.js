import axios from 'axios'
import {endpoint} from './config'
import store  from '../../store'
  
const api = () => {
  return axios.create ({
     baseURL: endpoint,
     
       // Here set the header of your ajax library to the token value.
       //axios.defaults.headers.common['Authorization'] = data.token
     headers:
       { 
         common: {userid: store.getters.id_user}
       }
  })
}



  
  export default api;