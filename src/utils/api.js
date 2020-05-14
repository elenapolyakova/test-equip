import axios from 'axios'
import {endpoint} from './config'
  
const api = () => {
  return axios.create ({
     baseURL: endpoint//,
    // headers:
    //   { 
    //     common: {Authorization: 'user123'}
    //   }
  })
}


       // Here set the header of your ajax library to the token value.
       //axios.defaults.headers.common['Authorization'] = data.token

  const apiCall = ({ url, method }) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(mocks[url][method || "GET"]);
          console.log(`Mocked '${url}' - ${method || "GET"}`);
          console.log("response: ", mocks[url][method || "GET"]);
        } catch (err) {
          reject(new Error(err));
        }
      }, 1000);
    });
  
  export default api;