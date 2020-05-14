import {
    AUTH_REQUEST,
    AUTH_ERROR,
    AUTH_SUCCESS,
    AUTH_LOGOUT
  } from "../actions/auth";
//import { USER_REQUEST } from "../actions/user";
import {endpoint} from "../../src/utils/config";
import axios from 'axios';


const state = {
    status: "",
    rights: localStorage.getItem("user-rights") || "",
    username: localStorage.getItem("username") || "",
    hasLoadedOnce: false
  };

  const getters = {
    isAuthenticated: state => !!state.username,
    authStatus: state => state.status,
    userRights: state => state.rights,
    username: state => state.username
  };
  const actions = { 
    [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
        return new Promise((resolve, reject) => {
        commit(AUTH_REQUEST);
        axios
           .post(`${endpoint}/auth`, {username: user.username, password: user.password})
           .then(resp => {
               let data = resp.data;
                localStorage.setItem("user-rights", data.rights);
                localStorage.setItem("username", data.username);
                commit(AUTH_SUCCESS, data);
                resolve(resp);

           })
           .catch(error => {
             console.log(error);
             commit(AUTH_ERROR, error);
             localStorage.removeItem("user-rights");
             localStorage.removeItem("username");
             reject(error);
           })
        })
      },
      [AUTH_LOGOUT]: ({ commit }) => {
        return new Promise(resolve => {
          commit(AUTH_LOGOUT);
          localStorage.removeItem("user-rights");
          localStorage.removeItem("username");
          resolve();
        });
      }
    };
    const mutations = {
        [AUTH_REQUEST]: state => {
          state.status = "loading";
        },
        [AUTH_SUCCESS]: (state, resp) => {
          state.status = "success";
          state.rights= resp.rights;
          state.username= resp.username;
          state.hasLoadedOnce = true;
        },
        [AUTH_ERROR]: state => {
          state.status = "error";
          state.hasLoadedOnce = true;
        },
        [AUTH_LOGOUT]: state => {
          state.rights = "";
          state.username = ""
        }
      };
      
      export default {
        state,
        getters,
        actions,
        mutations
      };