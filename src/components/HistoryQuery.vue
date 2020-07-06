<template lang="html">
   <stack-modal
          :show="showHistoryQuery"
          :modal-class="{[modalClass]: true}"
          @close="$emit('close')">
      <div slot="modal-header">
          <div class="title">История изменения заявки</div>
      </div>
      <div class="query-card-content">
             <DataTable
            :header-fields="headerFields"
            :data="historyData || []"
            :css="datatableCss"> 
        </DataTable>
      </div>
      <div slot="modal-footer">
        <div class ="query-card-footer">
            <button class="modal-button" @click="$emit('close')" title='закрыть'><i class = 'fa fa-times'></i> Закрыть</button>
        </div>
      </div>  

    </stack-modal>
</template>

<script>
  import StackModal from '@innologica/vue-stackable-modal'
  import api from "../utils/api"
  import '../css/stackable-modal.scss'
  import {getQueryType, getFunId, getEventType} from '../utils/dictionary'
  import {formatDate, formatDateTime} from '../utils/date'
  import { DataTable } from 'v-datatable-light'

  export default {
    name:"history-query",
    components: {
     StackModal,
     DataTable
    },
    props: {
        queryId: {type: Number},
		showHistoryQuery: {type: Boolean}
  },
  watch:{
    showHistoryQuery(value)
    {

      if(value) {
        this.$emit('loading', true);
        this.historyData = [];
        let funId = getFunId(this.funShortName)
           api().
               get('/queryHistory', {
                  params: { queryId: this.queryId, funId: funId }
               }).then(response => 
               {
                 let data = response.data;
                 data.forEach(item =>{
                    let historyItem = {
                        login: item.us_login,
                        userName: `${item.us_surname} ${item.us_name} ${item.us_patname}`,
                        eventDate: item.event_date ? new Date(item.event_date) : null,
                        eventDateFormat:  item.event_date ? formatDateTime(item.event_date) : '',
                        change: this.getChange(item.event_type_id, item.new_value, item.old_value)
                      
                    }
                     this.historyData.push(historyItem);
                 });
                 this.$emit('loading', false);
               })
               .catch(error => {
                  this.$emit('loading', false);
                   alert ('Ошибка при получении данных об истории заявки: ' + error);
               })
        }
    }
  },
    data() {
      return {
          
        modalClass:'modal-90per',
        funShortName: 'q',
        contractList: [],
        queryTypeList: [],
        historyData: [],
        headerFields: [{ name: "login", label: "Имя пользователя"},
          { name: "userName", label: "Ф.И.О."} ,
          { name: "eventDateFormat", label: "Дата операции"},
          { name: "change", label: "Изменения"}],
        datatableCss: {
            table: 'table table-bordered table-hover table-striped table-center history-table',
            theadTh: 'header-item',
            tbodyTd: 'body-item',
            tbodyTr: 'body-row'
        },
        eventType: {},
        observeChange:{
              "date_start": {name: "начало использования: ", format: val => formatDateTime(val)},
              "date_end": {name: "окончание использования: ", format: val => formatDateTime(val)},
              "q_type": {name: "тип заявки: ", format: val => this.queryType(val)},
              "id_cont_contract": {name: "договор: ", format: val => this.contractName(val)}
        }
       
       }
    },
    mounted() {
            this.$emit('loading', true);
            api().
             get('/contract')
                .then(response => 
                {
                    let data = response.data;
                    data.forEach(item =>{
                        let contractItem = {   
                            name: `${item.con_num ? '№'+item.con_num.trim() : ''} ${item.con_date ? ' от ' + formatDate(item.con_date): ''}`,
                            id: item.id_cont
                        }
                        this.contractList.push(contractItem);
                    });
                    this.$emit('loading', false);
                })
                .catch(error =>  {
                    this.$emit('loading', false);
                    alert ('Ошибка при получении данных о договорах: ' + error);
                            
                })
            this.queryTypeList = getQueryType();
            this.eventType = getEventType();

        },
    methods: {
      getChange: function (eventTypeId, newValue, oldValue){
        let result = '';
          switch (eventTypeId){
            case this.eventType.INSERT:
                  result = "Добавлена заявка: "
              break;
            case this.eventType.UPDATE:
              result = "Обновлена заявка: "
              break;
            case this.eventType.DELETE:
               result = "Заявка удалена."
              break;
          }
          let newObj = JSON.parse(newValue);
          let oldObj = JSON.parse(oldValue);
          Object.keys(newObj).forEach(key => {
            if (this.observeChange[key]){
                if (newObj[key] != oldObj[key])
                {
                  let value = this.observeChange[key].format ? this.observeChange[key].format(newObj[key]) : newObj[key];
                   result += `${this.observeChange[key].name}${value}; `
                }
            }
            
          })          
        return result;
      },
      queryType (_id){
        let queryItem = _.find(this.queryTypeList, {id: _id});
        return queryItem ? queryItem.name : '';
      },
      contractName(_id){
        let contrItem = _.find(this.contractList, {id: _id});
        return contrItem ? contrItem.name : '';
        
      }
    }
  }
</script>

<style lang="scss" scoped>
.query-card-content,
.query-card-contract{
    display: block;
    width: 800px;
    text-align: center;
    margin: auto;
    border-bottom: 3px solid #4285f4;
}
.query-card-contract{
    border: 1px solid #ced4da;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
}
.query-card-content-item{
   display: inline-block;
    padding-top: .5em;
     margin-left: 1.5em;
}
  .query-card-content-item label {
    display: inline-block;
    max-width: 200px;
    margin-left: auto;
    margin-right: .5em;
    font-style: italic;
    font-size: 12pt;
    color:#337ab7;
  }
   .query-card-contract label{
     max-width: 70px;
   }
   .query-card-content-item i{
     color: #337ab7;
     width: 200px;
   }
  .query-card-content-item i:hover {
      color: #ed9b19;
      cursor: pointer;
  }
.query-card-content-item select,
.query-card-content-item input,
.query-card-content-item textarea,
.query-card-content-item p
  {
    border: 1px solid #ced4da;
    position: relative;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
    cursor: text;
    margin-left: 10px;
    display: inline-block;
    text-align: left;
    margin-right: 2em;
  }
  .query-card-content-item select,
  .query-card-content-item p{
    width: 330px;
    padding: .5em .5em;
  }
  .query-card-dynamic-select{
     width: 330px !important;
    display: inline-block !important;
  }
  .query-card-content-item input
  {
    width: 210px;
  }
  .query-card-content-item textarea
  {
    width: 310px;
  }
@media screen and (max-width: 980px) {
  .query-card-content,
  .query-card-contract{
      width: auto;
      float: none;
  }
  .query-card-content{
   margin: 20px 0;
   }
  .query-card-contract{
    margin: 5px 0;
  }
  .query-card-content-item{
       width: 90%;
  }
  .query-card-content-item label {
     max-width: 200px;
  }
  .query-card-contract label{
     max-width: 70px;
   }
  .query-card-content-item select,
  .query-card-content-item input,
  .query-card-content-item textarea,
  .query-card-content-item p,
  .query-card-dynamic-select{
    width: 210px !important;
  }

}
@media screen and (max-width: 480px) {
   html {
      -webkit-text-size-adjust: none;
   }
}

.query-card-footer {
    padding-bottom: 1em;
    display: flex;
    justify-content: flex-end;
  }

.modal-button { 
      border: 1px solid #ced4da;
      position: relative;
      padding: .425em .5em;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      width: 10rem;
      margin: 0 .5em;
  }
.modal-button:hover{
    color: #337ab7;
    border-color: #337ab7;
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
  .query-error
	{
		color: red;
		display: inline-block;
		font-size: small;
  }
  .has-error
  {
    visibility: visible;
  }
</style>