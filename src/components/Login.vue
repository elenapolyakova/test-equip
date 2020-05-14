<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Вход в систему</h1>
      <label><i class='fa fa-user'></i> Имя пользователя</label>
     <input required v-model="username" type="text" placeholder="Имя пользователя" @keyup="hasError=false" /> 
     <label><i class='fa fa-key'></i> Пароль</label>
     <input required v-model="password" type="password" placeholder="Пароль"  @keyup="hasError=false"/>
    <br/>
     <button type="submit">Войти</button>
     <p class='hasError' v-if="hasError">Не верный имя пользователя или пароль</p>
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
      password : "",
      hasError : false
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
        this.hasError = true;
      });

    }
  }
};
  </script>
<style>
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}
.login input,
.login button {
    border: 1px solid #ced4da;
    position: relative;
    padding: .425em 0;
    border-radius: .25em;
    cursor: text;
    width: 100%;  
  }
  h1 {
    border-bottom: 3px solid #4285f4;
    width: 100%;
  }
  .hasError
  {
    color: red;
    display: block;
    font-size: small;
  }
</style>
