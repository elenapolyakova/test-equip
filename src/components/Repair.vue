<template lang="html">
      <div>
        <div v-if="rights.add && !this.isArchive">
            <button class="add-button" @click="actionAddClick" >Добавить ремонт</button></td>
        </div>
        <label class='repair-error'></label>
        <DataTable
            :header-fields="headerFields"
            :data="eqRepairData || []"
            :css="datatableCss"
            @on-update="dtUpdateSort"> 
        <template v-slot:actionsView="props">
              <div class="td-center">
                <button class="btn btn-act" @click="actionViewClick(props);" title='просмотр'><i class = 'fa fa-search'></i></button>
              </div>
          </template>
          <template v-slot:actionsEdit="props">
            <div class="td-center">
              <button class="btn btn-act" @click="actionEditClick(props);" title='редактировать'><i class = 'fa fa-edit'></i></button>
            </div>
          </template>
          <template v-slot:actionsDelete="props">
            <div class="td-center">
              <button class="btn btn-act" @click="actionDeleteClick(props);" title='удалить'><i class = 'fa fa-trash-alt'></i></button>
            </div>
          </template>
         <div slot="repDocPath" slot-scope="props">
            <div v-if="props.rowData.repDocPath !==''" class='act-btn td-center'>
                <a :href="props.rowData.repDocPath" target="_blank"><i class="fa fa-download" title="Загрузить протокол" ></i></a> 
            </div>
          </div> 
         
        </DataTable>
      </div>
</template>

<script>
  import { DataTable } from 'v-datatable-light'

  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/locale/ru'

  import DynamicSelect from 'vue-dynamic-select'
  import {endpoint} from '../utils/config'
  import {formatDate, dateFromString} from '../utils/date'
  import {getFunRight, hasRight}  from "../utils/right";
  import api from "../utils/api";
  import {getRepType, getFunId} from '../utils/dictionary'

  import '../css/v-datatable-light.css'
  export default {
    name: "repair",
    components: {
        DataTable,
        DatePicker,
        DynamicSelect
    },
    props: {
             idEq: {type: Number, required: true},
             updatedRepData: {type:Object, required:false},
             isArchive: {type: Boolean, required: false},
    },
    watch:{
      
      updatedRepData(value){
          let eqRepItem = {};
          eqRepItem.idRep = value.idRep;
          eqRepItem.repDate = value.repDate ? new Date(value.repDate) : '';
          eqRepItem.repDateFormat = formatDate(eqRepItem.repDate);
          
          eqRepItem.repType = value.repType.id; 
          eqRepItem.repTypeName = value.repType.name
          eqRepItem.execWork = value.execWork;
          eqRepItem.repMasterFIO = value.repMasterFIO;
          eqRepItem.repDocPath = value.repDocPath;
          if ( this.rowCurrentIndex === -1){
           this.eqRepairData.push(eqRepItem);
          }
          else{
             var oldValue =_.find(this.eqRepairData, {idRep: eqRepItem.idRep});
             Object.assign(oldValue, eqRepItem);
            this.eqRepairData.push({});  this.eqRepairData.pop();
          }

          this.addDblClick();

      },
        idEq(value) {
            this.initData();
        }
    },
    data() {
      return {
         repTypeList: [],
         eqRepairData: [],
         headerFields: [
          "__slot:actions:actionsView",
          "__slot:actions:actionsEdit",
          "__slot:actions:actionsDelete",
          { name: "repDateFormat", label: "Дата" /*, format: formatDate*/,  sortable: true },
          { name: "repTypeName", label: "Вид ремонта",  sortable: true },
          { name: "execWork", label: "Выполненные работы",  sortable: true},
          { name: "repMasterFIO", label: "ФИО мастера",  sortable: true},
          { name: "repDocPath", label: "Акт", sortable: false, customElement: "repDocPath"}
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-hover table-center repair-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row repair-row'
       },
       rights: {},
       funShortName: 'rep',
       repCard: {idRep: -1},
      }
    },
    methods: {
      dtUpdateSort:  function({ sortField, sort }) {
            this.eqRepairData = _.orderBy(this.eqRepairData, [sortField],[sort]);
      },
      initData: function()
      {
        this.$emit('loading', true);
        this.eqRepairData = [];
        this.repTypeList = getRepType();
        api().
            get('/repair/' + this.idEq)
            .then(response => {
                let data = response.data;
                 data.forEach(item =>
                 {
                   let repItem = {};
                     repItem.idRep = item.id_rep;
                     repItem.repDocPath = item.act_docpath && item.act_docpath !== '' ? `${endpoint}${item.act_docpath.trim()}` : '';
                     repItem.repDate = item.rep_date ? new Date(item.rep_date) : '';
                     repItem.repDateFormat = formatDate(repItem.repDate);
                     repItem.repType = item.rep_type ? item.rep_type : '';
                     repItem.repTypeName = this.repTypeName(item.rep_type);
                     repItem.execWork = item.rep_maintenance ? item.rep_maintenance.trim() : '';
                     repItem.repMasterFIO = item.rep_masterfio ? item.rep_masterfio.trim() : '';
                     this.eqRepairData.push(repItem);
                 })
                  this.$emit('loading', false);
                  this.addDblClick();
            })
            .catch(error => {
               this.$emit('loading', false);
               this.$alert('Ошибка при загрузке данных о ремонтах: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при загрузке данных о ремонтах '+ error);
            });

        
        
      },
      repTypeName: function  (_id){
        let repType = _.find(this.repTypeList, {id: _id});
        if (!repType) return ''
        return repType.name;
      },
      actionAddClick: function() {
         this.initCard(null);
         this.rowCurrentIndex = -1;
         this.$emit('addRep', this.repCard)
       
      },
      actionEditClick: function (params) {
         this.initCard(params.rowData);
         this.rowCurrentIndex = params.rowIndex;
         this.$emit('editRep', this.repCard)
      },
        actionViewClick: function(params){
           this.initCard(params.rowData);
           this.rowCurrentIndex = params.rowIndex;
           this.$emit('viewRep', this.repCard)
      },
      addDblClick: function(){
       this.$nextTick(()=>{
          $('.repair-row').unbind('dblclick', false);

          $('.repair-row').dblclick((event) => {
                        let tr = event.currentTarget;
                        if (tr.rowIndex)
                        {
                            this.rowCurrentIndex = tr.rowIndex-1;
                            this.initCard(this.eqRepairData[this.rowCurrentIndex]);
                           if (this.rights.edit && !this.isArchive)
                             this.$emit('editRep', this.repCard)
                           else this.$emit('viewRep', this.repCard)
                        }
                  });
          })
     },
       initCard: function(params)
      {
         this.repCard = {
            idEq: this.idEq,
            idRep: params? params.idRep : -1,
            repDate: params? params.repDate : '',
            repDateFormat:  params? params.repDateFormat : '',
            repType: {
              id: params? params.repType : '',
              name: params? params.repTypeName : ''
            },
            execWork: params? params.execWork : '',
            repMasterFIO: params? params.repMasterFIO : '',
            repDocPath: params? params.repDocPath : '',

            funId: getFunId (this.funShortName)
         }
      },
      
      actionDeleteClick: function (params) {

         this.$emit('loading', true);
        let idRep = params.rowData.idRep;
        if (idRep != -1) 
        {
           api().
              delete('/repair/' + idRep)
              .then(response => { 
                this.$emit('delRep');
                this.eqRepairData = _.reject(this.eqRepairData, {idRep: idRep});
                this.actionMode='view';
                this.$emit('loading', false);
            })
            .catch(error => {
              this.$emit('loading', false);
              	this.$alert('Ошибка при удалении ремонта: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при удалении ремонта '+ error);
            });
        }

      },
     
      formatDate: function(date)
      {
        return formatDate(date);
      }
    },
    mounted: function() {
        this.rights = getFunRight(this.funShortName);
        if (this.isArchive){
            this.datatableCss.tbodyTd += ' edit-hide'
            this.datatableCss.theadTh += ' edit-hide'
            this.datatableCss.tbodyTd += ' delete-hide'
            this.datatableCss.theadTh += ' delete-hide'
        }
        else {
          if (!this.rights.view || this.rights.edit){
            this.datatableCss.tbodyTd += ' view-hide'
            this.datatableCss.theadTh += ' view-hide'
          }

           if (!this.rights.edit){
            this.datatableCss.tbodyTd += ' edit-hide'
            this.datatableCss.theadTh += ' edit-hide'
          }
          if (!this.rights.delete){
            this.datatableCss.tbodyTd += ' delete-hide'
            this.datatableCss.theadTh += ' delete-hide'
          }

        }
        this.$nextTick(() => {
          $('.repair-table .header-item:visible').first().addClass('first-th')
        })
        this.initData();
    }

  }
</script>

<style lang="scss" scoped>
     .add-button{ 
      border: 1px solid #e21a1a;
      position: relative;
      padding-left: .5em;
      padding-right: .5em;
      margin-bottom: 0;
      text-align:center;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      background-color: #e21a1a;
      color: #ffffff;
      width: 200px;
      height: 39px;
  }
  
  .add-button:hover
  {
    color: #000000;
  }
  .repair-table select,
  .repair-table .input-repair-master,
  .repair-table textarea
  {
    border: 1px solid #e21a1a;
    position: relative;
    margin: .25em 0;
    border-radius: .25em;
    cursor: text;
    display: inline-block;
    text-align: left;
    width: 100%;
    height: 3em;
  }
  .input-repair-master{
    width: 350px;
  }
  .repair-table textarea
  {
    height: 6em;
  }
  .input__file {
   opacity: 0;
   visibility: hidden;
   display: none;
   position: absolute;
 }
 .label-file { 
      border: 1px solid #e21a1a;
      position: relative;
      border-radius: .25em;
      cursor: pointer;
      width: 100%;
      color: #e21a1a;
  }
  .act-btn i{
    color: #e21a1a;
    cursor: pointer;
  }
  .act-btn i:hover{
    color: #000000
  }
  .label-file:hover{
    color: #000000;
  }
 .has-file {
    color: green;
  }
  
  .repair-error
	{
		color: #e21a1a;
		display: inline-block;
    font-size: small;
     visibility: hidden;
  }
  
  .has-error
  {
    visibility: visible;
  }
  
   

  
</style>