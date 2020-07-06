<template lang="html">
   <stack-modal
          :show="showQueryCard"
          :modal-class="{[modalClass]: true}"
          @close="$emit('close')">
      <div slot="modal-header"></div>
      <div class="query-card-content">
        <div class="query-card-content-item">
          <label>Начало использ.</label>
          <date-picker 
              v-model="dateStart" 
              type="datetime" 
              :format="format"
              :title-format="format"
              :time-title-format="format"
              :time-picker-options="timePickerOptions"
              :disabled-date="disabledDate"
              :disabled-time="disabledTimeStart"
              :editable=false
              @change="dataChange"
              ></date-picker>
         </div>
        <div class="query-card-content-item">
          <label>Окончание использ.</label>
          <date-picker 
              v-model="dateEnd" 
              type="datetime" 
              :format="format"
              :title-format="format"
              :time-title-format="format"
              :time-picker-options="timePickerOptions"
              :disabled-date="disabledDate"
              :disabled-time="disabledTimeEnd"
              :editable=false
              @change="dataChange"
            ></date-picker>
           </div>
          <div class="query-card-content-item">
            <label>Тип заявки</label>
                <select v-model="Q_type" @change="dataChange">
                  <option disabled value="" selected>Не выбрано</option>
                  <option v-for="queryType in queryTypeList" :value="queryType.id">
                      {{queryType.name}}
                  </option>
                </select>
            </div>
            <div class="query-card-content-item">
            <label>Автор заявки</label>
                <p>{{author}}</p>
            </div>
          <div class="query-card-content-item">
          <label>Договор</label>
              <dynamic-select class ="query-card-dynamic-select" :options="contractList"
                        option-value="id"
                        option-text="name"
                        v-model="contract"
                        placeholder=''
                        @search="dataChange"
                        @input="dataChange"/>
             </div>
             <div class="query-card-content-item  con-action">
              <label @click="showAddCon=!showAddCon" v-if="!showAddCon" title="Добавить договор"><i class="fa fa-plus"> Добавить договор</i></label>
            </div>
            <transition name="fade"> 
             <div class="query-card-contract" v-if="showAddCon">
                <div class="query-card-content-item">
                    <label>Номер</label>
                    <input v-model="contractData.Num"></input>
                </div>
                <div class="query-card-content-item">
                    <label>от</label>  
                    <date-picker 
                      v-model="contractData.Date" 
                      type="date" 
                      :format="titleFormat"
                      :editable=false
                    ></date-picker>
                </div>
                 <div class="query-card-content-item">
                    <label>Предмет договора</label>  
                    <textarea v-model="contractData.Purpose"></textarea>
                 </div>
                 <div class="query-card-content-item  con-action">
                  <label @click="saveContract" v-if="showAddCon"><i class="fa fa-save" title="Сохранить договор"> Сохранить договор</i></label>
                </div>
            </div>
          </transition> 
      </div>
      <div slot="modal-footer">
        <div class ="query-card-footer">
          <label class='query-error'></label>
          <button class="modal-button" v-if="rights.edit || rights.add" @click="saveQuery" title='Сохранить заявку'><i class = 'fa fa-save' ></i> Сохранить</button>
           <button class="modal-button" v-if="rights.delete && queryData.queryId !== -1"  @click="deleteQuery" title='Удалить заявку'><i class = 'fa fa-trash-alt'></i> Удалить</button>
          <button class="modal-button" @click="$emit('close')" title='закрыть'><i class = 'fa fa-times'></i> Закрыть</button>
          </div>
      </div>  

    </stack-modal>
</template>

<script>
  import DatePicker from 'vue2-datepicker'
  import DynamicSelect from 'vue-dynamic-select'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import StackModal from '@innologica/vue-stackable-modal'
  import {getFunRight}  from "../utils/right"


  import api from "../utils/api"

  import '../css/stackable-modal.scss'
  import {getQueryType, getWorkingPeriod, getFunId} from '../utils/dictionary'
  import {formatDate, HoursDiff} from '../utils/date'

  export default {
    name:"card-query",
    components: {
     DatePicker,
     StackModal, 
     DynamicSelect
    },
    props: {
        queryData: {type: Object},
		    showQueryCard: {type: Boolean}
  },
  watch:{
    showQueryCard(value)
    {

      if(value) {

        this.showAddCon=false;
        this.dateStart = null;
        this.dateEnd = null;
        this.contractData = {};
        this.updateQueryData = {};
        this.contract ={}
        this.author = '';
  
        if(this.queryData.dateStartOriginal)
           this.dateStart = this.queryData.dateStartOriginal;
        else if(this.queryData.dateStart)
            this.dateStart = this.queryData.dateStart;
        if(this.queryData.dateEndOriginal)
            this.dateEnd = this.queryData.dateEndOriginal;
        else if(this.queryData.dateEnd)
            this.dateEnd = this.queryData.dateEnd;
        this.Q_type = this.queryData.Q_type;
        this.author = this.authorName(this.queryData.userId);
        this.contract = _.find(this.contractList, {id:this.queryData.conId});



        if(this.curEqId !== this.queryData.eqId)
        {
           this.equipTime = getWorkingPeriod(this.queryData.workingMode);
            this.timePickerOptions = {
              start: this.equipTime[0], 
              step: this.timeStep, 
              end: this.equipTime[1]
            };
            this.minTime = this.equipTime[0].split(':')[0]*60 + this.equipTime[0].split(':')[1]*1;
            this.maxTime = this.equipTime[1].split(':')[0]*60 + this.equipTime[1].split(':')[1]*1;
        }

        if (this.queryInitialList === [] || this.curEqId !== this.queryData.eqId)
        {
          this.curEqId = this.queryData.eqId;
          this.queryInitialList = [];
           this.$emit('loading', true);
           api().
               get('/queryDate',{
                  params: { idEq: this.curEqId }
               }).then(response => 
               {
                 let data = response.data;
                 data.forEach(item =>{
                    let queryItem = {
                      queryId: item.id_eqquery,
                      dateStart: item.date_start ? new Date(item.date_start) : null,
                      dateEnd: item.date_end ? new Date(item.date_end) : null
                    }
                     this.queryInitialList.push(queryItem);
                 });
                 this.$emit('loading', false);
               })
               .catch(error => {
                  this.$emit('loading', false);
                   alert ('Ошибка при получении данных о промежутках заявок: ' + error);
               })
        }
      }
    }
  },
    data() {
      return {
        rights: {},
		  	funShortName: 'q',
        modalClass:'modal-xl',
        queryInitialList: [],
        updateQueryData: {},
        authorList: [],
        dateStart: null,
        dateEnd: null,
        Q_type: 0, 
        contract: {},
        author: '',
        minTime: 9*60,
        maxTime: 18*60,
        format:'DD.MM.YYYY HH:mm',
        titleFormat:'DD.MM.YYYY',
        contractList: [],
        queryTypeList: [],
        curEqId: 0,
        showAddCon: false,
        conDate: null,
        conNum: '',
        conPurpose: '',
        contractData: {},
        timePickerOptions: {
                start:'09:00',
                step:'00:10',
                end: '18:00'
              },
        equipTime: ['09:00', '18:00'],
        timeStep: '00:10'
       }
    },
    mounted() {
            this.datetimeStart= null;
            this.datetimeEnd= null;
            this.rights = getFunRight(this.funShortName);
            this.$emit('loading', true);
             api().
               get('/dictionary')
               .then(response => 
               {
                 let dict = response.data;
                 this.authorList = dict.userList;
                 this.authorList.forEach(item => item.name =`${item.us_surname} ${item.us_name} ${item.us_patname}`);
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
               })
               .catch(error =>  {
                  this.$emit('loading', false);
                   alert ('Ошибка при получении данных о пользователях: ' + error);
                  
               })
            this.queryTypeList = getQueryType();
           
            
        },
    methods: {
        disabledDate(date){
            let disabled = false;
            let start = date.getTime();
            let end = start + 24*60*60*1000 - 1;
             let queryByDates = _.orderBy( _.filter(this.queryInitialList, //выбираем все заявки за выбранный день (кроме редактируемой)
                (query) => { 
                  return ((query.dateStart.getTime() <= end) && (query.dateEnd.getTime()>= start) && this.queryData.queryId !== query.queryId)
                }), 'dateStart', 'asc')
            if(queryByDates.length > 0)
            {
                if (queryByDates[0].dateStart.getTime() > (start + this.minTime*60*1000) //если первая заявка в этот день начинается после минимально возможного времени, например с 10
                  || queryByDates[queryByDates.length-1].dateEnd.getTime() < (start + this.maxTime*60*1000)) // последняя заканчивается раньше максимального времени, например до 17
                  return false; 
                if(queryByDates.length > 1) { // если заявок 2 и более, смотрим есть ли между ними свободное окно
                  let curEnd = queryByDates[0].dateEnd.getTime();
                  for(var i = 1; i < queryByDates.length; i++)
                  {
                    if (curEnd != queryByDates[i].dateStart.getTime())
                      return false;
                    curEnd = queryByDates[i].dateEnd.getTime();
                  }
                }
                return true;
                
            }
             return false;
        },
        disabledTimeStart(date){
             let disabled = false;
               let queryByDateTime =  _.filter(this.queryInitialList, 
                (query) => {
                  let minStart = query.dateStart.getHours()*60 + query.dateStart.getMinutes()*1;
                  let minEnd = query.dateEnd.getHours()*60 + query.dateEnd.getMinutes()*1;
                  return ((this.queryData.queryId !== query.queryId) && ( //исключаем из проверки редактируемую заявку, ее даты нам доступны для выбора
                      (query.dateStart <= date) && (query.dateEnd > date) //время занято
                      || ((query.dateStart.getTime() == date.getTime())//заявка начинается с самого раннего времени (например 9 утра), то 9 утра блокируем. иначе можно выбрать для начала или конца крайнее время по другой заявке
                            && (minStart === this.minTime))
                      || ((query.dateEnd.getTime() == date.getTime())//заканчивается самым поздним временем (например 18:00), то 18:00 блокируем.
                            && (minEnd === this.maxTime))
                    ))
           
                })
                if(queryByDateTime.length > 0) return true;
             return false;
         },
        disabledTimeEnd(date){
             let disabled = false;
               let queryByDateTime =  _.filter(this.queryInitialList, 
                (query) => {
                  let minStart = query.dateStart.getHours()*60 + query.dateStart.getMinutes()*1;
                  let minEnd = query.dateEnd.getHours()*60 + query.dateEnd.getMinutes()*1;
                  return ((this.queryData.queryId !== query.queryId) && (
                      (query.dateStart < date) && (query.dateEnd > date) //если дата начала заявки строго меньше выбранной даты
                      || ((query.dateStart.getTime() == date.getTime())
                            && (minStart === this.minTime))
                      || ((query.dateEnd.getTime() == date.getTime())
                            && (minEnd === this.maxTime))
                    ))
           
                })
                if(queryByDateTime.length > 0) return true;
             return false;
         },
        dateChange()
        {
          //???
        },
        authorName: function (_id){
          if (_id) _id = parseInt(_id);
          let authorItem = _.find(this.authorList, {id: _id});
          return authorItem ? authorItem.name: '';
        },
       saveContract: function(){
         this.dataChange();
         this.$emit('loading', true);

         api().
             post('/contract', {contractData: this.contractData})
              .then(response => {
                 let newId = response.data.idContract;
                let contractItem = {id: newId, name:  `№${this.contractData.Num} от ${formatDate(this.contractData.Date)}`};
                this.contractList.push(contractItem);
                this.contract = contractItem;
                this.showAddCon = false;
                this.contractData = {};
                this.$emit('loading', false);
                alert ('Договор сохранён!');
              })
            .catch(error => {
               this.$emit('loading', false);
               alert('Ошибка при добавлении нового договора: '+ error);
               return;
            });
 
       },
       dataChange: function(){
           $('.query-error').removeClass('has-error').html('');
       } ,
       saveQuery: function(){

          if (HoursDiff(this.dateEnd, this.dateStart) < 0){
             $('.query-error').addClass('has-error').html('Дата окончания меньше даты начала использования');
             return;
          }
          if (HoursDiff(this.dateEnd, this.dateStart) < this.queryData.orderTimeHours) {
             $('.query-error').addClass('has-error').html(`Промежуток заявки должен быть больше минимального времени заказа (${this.queryData.orderTimeHours} часа)`);
             return;
          }
          if (!this.Q_type || this.Q_type == "") {
             $('.query-error').addClass('has-error').html(`Выберите тип заявки`);
             return;
          }
          if (!this.contract || this.contract.id == 0) {
             $('.query-error').addClass('has-error').html(`Выберите договор`);
             return;
          }
         let queryDate = _.filter(this.queryInitialList, (query) => { 
                   return ((query.dateStart.getTime() < this.dateEnd.getTime()) && (query.dateEnd.getTime()> this.dateStart.getTime()) && this.queryData.queryId !== query.queryId)
                 })
          if (queryDate.length > 0) {
             $('.query-error').addClass('has-error').html(`В ходе выбранного промежутка времени оборудование будет использоваться в других заявках`);
             return;
          }
          
          this.$emit('loading', true);
          this.updateQueryData = { 
              queryId: this.queryData.queryId,
              eqId: this.queryData.eqId,
              dateStart: this.dateStart,
              dateEnd: this.dateEnd,
              Q_type: this.Q_type,
              conId: this.contract.id,
              userId: this.$store.getters.id_user,
              funId: getFunId(this.funShortName)
          }
          if (this.queryData.queryId === -1)
         {
           api().
             post('/query', {queryData: this.updateQueryData})
              .then(response => {
                 let newId = response.data.idQuery;
                 this.updateQueryData.queryId = newId;
                 this.queryInitialList.push( {queryId: newId,
                      dateStart: this.updateQueryData.dateStart,
                      dateEnd: this.updateQueryData.dateEnd
                 });

                 this.$emit('loading', false);
                 alert ('Данные сохранены!');
                 this.$emit('save', this.updateQueryData);
                
              })
            .catch(error => {
               this.$emit('loading', false);
               alert('Ошибка при добавлении новой заявки: '+ error);
               return;
            });

         }
        else {
            api().
              put('/query/' + this.queryData.queryId, {queryData: this.updateQueryData})
              .then(response => {
                  let query =_.find(this.queryInitialList, {queryId: this.queryData.queryId});
                  query.dateStart = this.updateQueryData.dateStart;
                  query.dateEnd =  this.updateQueryData.dateEnd;
                  this.$emit('loading', false);
                  alert ('Данные сохранены!');
                  this.$emit('save', this.updateQueryData);

              })
              .catch(error => {
                this.$emit('loading', false);
                alert('Ошибка при редактировании заявки:  '+ error);
                return;
            });
        }
  
          
          
       },
       deleteQuery: function(){
          this.$emit('loading', true);
          let queryId = this.queryData.queryId;

        api().
              delete('/query/' + queryId)
              .then(response => { 
                this.queryInitialList = _.reject(this.queryInitialList, {queryId: queryId});
                this.$emit('delete', {queryId: queryId})
                this.$emit('loading', false);
              })
           .catch(error => {
                this.$emit('loading', false);
               alert('Ошибка при удалении заявки:  '+ error);
            });
         
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