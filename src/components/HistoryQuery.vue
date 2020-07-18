<template lang="html">
   <stack-modal
          :show="showHistoryQuery"
          :modal-class="{[modalClass]: true}"
          @close="$emit('close')">
      <div slot="modal-header">
          <div class="title history-query-header">История изменения заявки</div>
      </div>
      <div class="history-query-content">
             <DataTable
            :header-fields="headerFields"
            :data="historyData || []"
            :css="datatableCss"> 
        </DataTable>
      </div>
      <div slot="modal-footer">
        <div class ="history-query-footer">
            <button class="modal-button" @click="$emit('close')" title='закрыть'>Закрыть</button>
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

$(window).on('resize', function(){
        let header = $('.history-query-header').height();
        let footer = $('.history-query-footer').height();
        $('.history-query-content ').css("height", ($(window).height() - header - footer) -120 + 'px');
});


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

        setTimeout(() => { 
             let header = $('.history-query-header').height();
             let footer = $('.history-query-footer').height();
              $('.history-query-content ').css("height", ($(window).height() - header - footer) -120 + 'px');
            }, 10)

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
                  this.$alert('Ошибка при получении данных об истории заявки: '+ error, '', 'error', {allowOutsideClick: false});
                   //alert ('Ошибка при получении данных об истории заявки: ' + error);
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
            table: 'table table-hover  table-center history-table',
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
                    this.$alert('Ошибка при получении данных о договорах: '+ error, '', 'error', {allowOutsideClick: false});
                    //alert ('Ошибка при получении данных о договорах: ' + error);
                            
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
.history-query-content{
    display: block;
    width: 100%;
    text-align: center;
    margin: auto;
    overflow: auto;
    border-bottom: 3px solid #e21a1a;
}

@media screen and (max-width: 980px) {
  .history-query-content{
      width: auto;
      float: none;
  }
  
}
@media screen and (max-width: 480px) {
   html {
      -webkit-text-size-adjust: none;
   }
}

.history-query-footer {
    padding-bottom: 1em;
    display: flex;
    justify-content: flex-end;
  }

.modal-button { 
      border: 1px solid #e21a1a;
      color: #ffffff;
      background: #e21a1a;
      position: relative;
      padding: .425em .5em;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      width: 200px;
      margin: 0 .5em;
  }
.modal-button:hover{
    color: #000000;
  }
  
</style>