<template>
 <div class="login-content">
   <form class="login" @submit.prevent="login">
     <label class ="login-title">Вход в систему</label>
     <input required v-model="username" type="text" placeholder="Имя пользователя" @keyup="hideError" /> 
     <input required v-model="password" type="password" placeholder="Пароль"  @keyup="hideError"/>
     <button type="submit"> Войти</button>
     <div>
        <p class='hasError'>Неверное имя пользователя или пароль</p>
     </div>
   </form>
 </div>
</template>
<script>

import { AUTH_REQUEST } from "../../store/actions/auth";

export default {
  name: "login",
  data() {
    return {
      username : "",
      password : ""
    }
  },
  methods: {
    login: function() {
      
      const { username, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { username: username, password: password }).then(() => {
        this.$router.push("/");
        this.$emit('getMenuList');
      })
      .catch(error =>
      {
        $(".hasError").addClass("visible");
      });
    },
    hideError: function(){
        $(".hasError").removeClass("visible");
    }
  }
};
  </script>
<style>
.login-content{
   display: flex;
   width: 100%;
   height: 100%;
   justify-content:center;
   align-items: center;
}
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}
.login input {
    position: relative;
    margin-top:10px;
    margin-bottom:10px;
    cursor: text;
    height: 39px;
    width: 100%;  
  }
.login button{
    border: 1px solid #000000;
      position: relative;
      text-align:center;
      margin-top:10px;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      background-color: #000000;
      color: #ffffff;
      width: 100%;  
      height: 39px;
}

.login button:hover
  {
    color: #e21a1a;
    border-color: #337ab7;
  }
.login-title{
  text-align: center;
  width: 100%;
  font-weight: 600px;
  font-size: 18pt;
}

  .hasError
  {
    color: red;
    display: block;
    font-size: small;
    visibility: hidden;
  }
  .visible{
    visibility: visible;
  }
</style>
