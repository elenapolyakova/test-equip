import axios from 'axios'
import {endpoint} from './config'
  
const api = () => {
  return axios.create ({
     baseURL: endpoint//,
     
       // Here set the header of your ajax library to the token value.
       //axios.defaults.headers.common['Authorization'] = data.token
    // headers:
    //   { 
    //     common: {Authorization: 'user123'}
    //   }
  })
}



  
  export default api;