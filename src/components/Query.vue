<template lang="html">
   <div class="vld-parent">
      <loading :active.sync="isLoading"
          :can-cancel="false"
          :is-full-page="true"
          color='#e21a1a'>
      </loading>
    <filter-equipment
             @filterData="filterData"
             @clearFilter="clearFilter"
             @actionAddQueryClick="actionAddClick"
             :hasAddButton="false"
             :hasAddQueryButton="hasAddQueryButton"
             :fData="fData" 
             :eqNameList="eqNameList"
             :eqDevisionList="eqDevisionList"
             :eqTypeList=[]
             :eqProducerList=[]
             :eqReadinessList=[]
             :responsibleList=[]
             :hasExtended="false">
    </filter-equipment>
    <div class="query-content">
    
     <DataTable
            :header-fields="headerFields"
            :data="queryData || []"
            :is-loading="isLoading"
            :css="datatableCss"
            @on-update="dtUpdateSort"> 
          <template v-slot:actionsEdit="props">
              <button class="btn btn-act" @click="actionEditClick(props);" title='редактировать заявку'><i class = 'fa fa-edit'></i></button>
          </template>
          <template v-slot:actionsDelete="props">
              <button class="btn btn-act" @click="actionDeleteClick(props);" title='удалить заявку'><i class = 'fa fa-trash-alt'></i></button>
          </template>
        </DataTable> 

    </div>
  </div>
</template>

<script>
  import { DataTable } from 'v-datatable-light'
  import {getFunRight, hasRight}  from "../utils/right";
  import api from "../utils/api";
  import Loading from 'vue-loading-overlay'
  import {formatDate, dateFromString, formatDateTime} from '../utils/date'
  import {getQueryType} from '../utils/dictionary'
  import FilterEquipment from './FilterEquipment'
  import Plan from '../components/Plan'

  import '../css/v-datatable-light.css'
  import 'vue-loading-overlay/dist/vue-loading.css'

  export default {
    name:"query",
    components: {
      DataTable,
      Loading,
      FilterEquipment
    },
    data() {
      return {
         rights: {},
         funShortName: 'q',
         isLoading: false,
         queryTypeList: [],
         queryData: [],
         queryInitialList: [],
         hasAddQueryButton: false,

          fData: {
          cardNum: '', 
          invNum: '',
          eqName: null,
          devision: null,
          eqType: null,
          eqProducer: null,
          factNum: '',
          factDate: null,
          comDate: null,
          repDate: '',
          responsible: null,
          eqReadiness: null
        },
         //dictionary
        eqNameList:[],
        eqDevisionList: [],

         formatDate:"DD.MM.YYYY",
          headerFields: [
              "__slot:actions:actionsEdit",
              "__slot:actions:actionsDelete",
              { name: "queryDate", label: "Дата заявки" , format: formatDate,  sortable: true },
              { name: "dateStart", label: "Начало использ.", sortable: true },
              { name: "dateEnd", label: "Окончание использ.", sortable: true },
              { name: "cardNum", label: "Номер карточки",  sortable: true },
              { name: "invNum", label: "Инвентарный номер",  sortable: true },
              { name: "eqName", label: "Наименование оборудования",  sortable: true },
              { name: "devisionName", label: "Подразделение",  sortable: true },
              { name: "Q_name", label: "Тип заявки",  sortable: true} ,
              { name: "author", label: "Автор заявки",  sortable: true },
              { name: "contract", label: "Договор",  sortable: true },
            ],
            rowCurrentIndex: 0,
            datatableCss: {
              table: 'table table-hover table-center query-table',
              theadTh: 'header-item',
              tbodyTd: 'body-item',
              tbodyTr: 'body-row'
            },
            sort: 'asc',
      }
    },
    methods: {
       dtUpdateSort: function({ sortField, sort }) {
        const sortedData = _.orderBy(this.queryData, [sortField],[sort]);
        this.queryData = sortedData;
      },
      actionEditClick: function(props){
        let queryId = props.rowData.queryId;
        let eqId = props.rowData.eqId;
        let dateStart = props.rowData.dateStartOriginal;
        this.$router.push({name:'plan', component: Plan,  
              params: {
                action: "edit",
                queryId: queryId,
                eqId: eqId,
                dateStart: dateStart
              }
          });
      },
      actionDeleteClick: function(props){
          this.isLoading = true;
          let queryId = props.rowData.queryId;

        api().
              delete('/query/' + queryId)
              .then(response => { 
                this.queryInitialList = _.reject(this.queryInitialList, {queryId: queryId});
                this.filterData(false);
                this.eqNameList = this.fillDict(this.eqNameList , 'eqName');
                this.isLoading = false;
              })
           .catch(error => {
              this.isLoading = false;
              this.$alert('Ошибка при удалении заявки: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при удалении заявки:  '+ error);
            });
      },
      actionAddClick: function(){
          this.$router.push({name:'plan', component: Plan, 
            params: {
              invNum: this.fData.invNum,
              action: 'add'
            }
        });
      },
      clearFilter: function(){

          this.fData = {
          cardNum: '', 
          invNum: '',
          eqName: null,
          devision: null,
          eqType: null,
          eqProducer: null,
          factNum: '',
          factDate: null,
          comDate: null,
          repDate: '',
          responsible: null,
          eqReadiness: null
        };
        this.filterData(true);
      },

        filterData: function(showLoading){
        if (showLoading)
          this.isLoading = true;
        this.queryData = this.queryInitialList;
        if (this.fData.cardNum !== '') 
          this.queryData = _.filter(this.queryData,  {'cardNum': this.fData.cardNum})
        if (this.fData.invNum !== '') 
          this.queryData = _.filter(this.queryData, {'invNum': this.fData.invNum})
        if (this.fData.devision) 
          this.queryData = _.filter(this.queryData, {'devision': this.fData.devision.id})
        if (this.fData.eqName) 
          this.queryData = _.filter(this.queryData, {'eqName': this.fData.eqName.name})
       
        //this.queryData.push({}); this.queryData.pop(); //костыль: без этого не обновлялись данные в таблице, если редактировала карточку для нового оборудования? 
        if (showLoading)
          this.isLoading = false;
      },
      initData: function(){
        this.isLoading = true;
        api().
          get('/dictionary')
           .then(response => {
             let dict = response.data;
             this.eqDevisionList =  dict.divisionList;
             api().
               get('/queryList')
               .then(response => 
               {
                 let data = response.data;
                 data.forEach(item =>{
                    let queryItem = {
                      queryId: item.id_eqquery,
                      eqId: item.id_eq_equipment,
                      queryDate: item.q_date ? new Date(item.q_date) : null,
                      dateStartOriginal: item.date_start ? new Date(item.date_start) : null,
                      dateStart: formatDateTime(item.date_start),
                      dateEndOriginal: item.date_end ? new Date(item.date_end) : null,
                      dateEnd: formatDateTime(item.date_end),
                      Q_type: item.q_type,
                      Q_name: this.queryName(item.q_type),
                      cardNum: item.card_num,
                      invNum: item.inv_num,
                      eqName: item.eqname,
                      devision: item.id_dicdev_dicdevision,
                      devisionName: this.devisionName(item.id_dicdev_dicdevision),
                      author: `${item.us_surname ? item.us_surname : ''} ${item.us_name ? item.us_name: ''} ${item.us_patname ? item.us_patname: ''}`,
                      contract: `${item.con_num ? '№'+item.con_num : ''} ${item.con_date ? ' от ' + formatDate(item.con_date): ''}`,
                      conId: item.id_cont_contract
                    }
                     this.queryInitialList.push(queryItem);
                 });

                 this.eqNameList = this.fillDict(this.eqNameList , 'eqName');
                 this.queryData = this.queryInitialList ;
                 this.rowCurrentIndex = 0;
                 this.isLoading = false;
               })
               .catch(error => 
               {
                 this.isLoading = false;
                 this.$alert('Ошибка при получении данных о заявках: '+ error, '', 'error', {allowOutsideClick: false});
                   //alert ('Ошибка при получении данных о заявках: ' + error);
                  
               })
           })
           .catch(error => {
             this.isLoading = false;
             this.$alert('Ошибка при получении справочников: '+ error, '', 'error', {allowOutsideClick: false});
             //alert ('Ошибка при получении справочников: ' + error);
            
           });
     },
     fillDict: function(list, key){
       list = [];
       this.queryInitialList.forEach(item => {
           if(!_.find(list, {name: item[key]}))
              list.push({id: list.length, name: item[key]});
       })
      return list;
     },
     devisionName: function (_id){
        let devisionItem = _.find(this.eqDevisionList, {id: _id});
        return devisionItem ? devisionItem.name : '';
      },
      queryName (_id){
        let queryItem = _.find(this.queryTypeList, {id: _id});
        return queryItem ? queryItem.name : '';
      }	
    },
    created: function(){
        this.queryTypeList = getQueryType();
    },
    mounted: function(){
        
        this.rights = getFunRight(this.funShortName);

         this.hasAddQueryButton = this.rights.add;
         if (!this.rights.edit){
             this.datatableCss.tbodyTd += ' edit-hide'
            this.datatableCss.theadTh += ' edit-hide'
          }

          if (!this.rights.delete){
            this.datatableCss.tbodyTd += ' delete-hide'
            this.datatableCss.theadTh += ' delete-hide'
          }

         this.$nextTick(() => {
          $('.query-table .header-item:visible').first().addClass('first-th')
        })

         this.initData();
      }

  }
</script>

<style lang="scss" scoped>
 .query-content {
    display: block; 
    overflow: auto;
    padding: 15px;
  }
  
 
</style>