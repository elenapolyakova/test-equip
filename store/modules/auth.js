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
    id_user: localStorage.getItem("id_user") || "",
    hasLoadedOnce: false
  };

  const getters = {
    isAuthenticated: state => !!state.id_user,
    authStatus: state => state.status,
    userRights: state => state.rights,
    username: state => state.username,
    id_user: state => state.id_user,
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
                localStorage.setItem("id_user", data.id_user);
                commit(AUTH_SUCCESS, data);
                resolve(resp);

           })
           .catch(error => {
             console.log(error);
             commit(AUTH_ERROR, error);
             localStorage.removeItem("user-rights");
             localStorage.removeItem("username");
             localStorage.removeItem("id_user");
             reject(error);
           })
        })
      },
      [AUTH_LOGOUT]: ({ commit }) => {
        return new Promise(resolve => {
          commit(AUTH_LOGOUT);
          localStorage.removeItem("user-rights");
          localStorage.removeItem("username");
          localStorage.removeItem("id_user");
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
          state.id_user= resp.id_user;
          state.hasLoadedOnce = true;
        },
        [AUTH_ERROR]: state => {
          state.status = "error";
          state.hasLoadedOnce = true;
        },
        [AUTH_LOGOUT]: state => {
          state.rights = "";
          state.username = "";
          state.id_user = ""
        }
      };
      
      export default {
        state,
        getters,
        actions,
        mutations
      };