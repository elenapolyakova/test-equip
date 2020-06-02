<template lang="html">
  <div>
     <loading :active.sync="isLoading"
          :can-cancel="false"
          :is-full-page="true"
          color='#337ab7'>
      </loading>
        <div v-if="rights.add">
            <button class="add-button" @click="actionAddClick" ><i class='fa fa-plus'> </i> Добавить договор</button></td>
        </div>
        <label class='contract-tip'>Выберите договор для объединения</label>
        <label class='contract-error'></label>
        <DataTable
            :header-fields="headerFields"
            :data="contractData || []"
            :css="datatableCss"
            @on-update="dtUpdateSort"> 
           <template v-slot:actionsEdit="props">
              <button v-if="!isEdit(props)" class="btn btn-act" @click="actionEditClick(props);" title='редактировать'><i class = 'fa fa-edit'></i></button>
              <button v-if="isEdit(props)" class="btn btn-act" @click="actionSaveClick(props);" title='cохранить'><i class = 'fa fa-save'></i></button>
          </template>
          <template v-slot:actionsDelete="props">
              <button class="btn btn-act" @click="actionDeleteClick(props);" title='удалить'><i class = 'fa fa-trash-alt'></i></button>
          </template>
          <template v-slot:actionsUnite="props">
              <button v-if="!isUnite(props)" class="btn btn-act" @click="actionUniteClick(props);" title='Объединить'><i class = 'fa fa-link'></i></button>
              <button v-if="isUnite(props)" class="btn btn-act" @click="actionCancelClick(props);" title='Отменить'><i class = 'fa fa-reply'></i></button>
          </template>
          <div slot="Num" slot-scope="props">
              <p v-if="!isEdit(props)"> {{props.rowData.Num}}</p>
              <input v-if="isEdit(props)" v-model="props.rowData.Num"></input>
          </div>
          <div slot="conDate" slot-scope="props">
              <span v-if="!isEdit(props)">{{formatDate(props.rowData.Date)}}</span>
               <date-picker v-if="isEdit(props)" v-model="props.rowData.Date" format='DD.MM.YYYY' popup-class='calPopup'></date-picker>
          </div> 
          <div slot="conPurpose" slot-scope="props">
              <p v-if="!isEdit(props)"> {{props.rowData.Purpose}}</p>
              <textarea v-if="isEdit(props)" v-model="props.rowData.Purpose"></textarea>
          </div>
          
        </DataTable>
  </div>
</template>

<script>
  import { DataTable } from 'v-datatable-light'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/locale/ru'
  import Loading from 'vue-loading-overlay'

  import {endpoint} from '../utils/config'
  import {formatDate, dateFromString} from '../utils/date'
  import {getFunRight, hasRight}  from "../utils/right";
  import api from "../utils/api";


    import '../css/v-datatable-light.css'
  export default {
   name: "contract",
   components: {
        DataTable,
        DatePicker,
        Loading
    },
      props: {
    },
    data() {
      return {
         rights: {},
         extRights: {},
         actionMode: 'view',
         funShortName: 'con',
         funExtShortName: 'conExt',

         isLoading: false,

         contractData: [],
         currentId: -1,
        headerFields: [
          "__slot:actions:actionsEdit",
          "__slot:actions:actionsDelete",
          "__slot:actions:actionsUnite",
          { name: "Num", label: "Номер",  sortable: true, customElement: "Num"},
          { name: "Date", label: "От", sortable: true, customElement: "conDate"},
          { name: "Purpose", label: "Предмет договора", sortable: true, customElement: "conPurpose"},

        ],
       msgError: "Необходимо завершить редактирование",
       msgErrorUnite: "Необходимо завершить объединение",
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center contract-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
       parentId: -1
      }
    },
    methods: {
        initData: function(){
          this.isLoading = true;
           api().
              get('/contract')
              .then(response => 
              {
                let data = response.data;
                data.forEach(item =>
                {
                   let contractItem = {};
                      contractItem.idCon = item.id_cont;
                      contractItem.Num = item.con_num ? item.con_num.trim() : '';
                      contractItem.Date = item.con_date ? new Date(item.con_date) : '';
                      contractItem.Purpose = item.con_purpose ? item.con_purpose.trim() : '';
                    this.contractData.push(contractItem);
                });
  
                this.isLoading = false;
              })
              .catch(error => 
              {
                this.isLoading = false;
                alert ('Ошибка при получении данных о договорах: ' + error);
                  
              })


        },
        dtUpdateSort: function({ sortField, sort }) {
        this.contractData = _.orderBy(this.contractData, [sortField],[sort]);
      },
       isEdit: function(params)
      {
        if (this.actionMode === 'view' || this.currentId !== params.rowData.idCon) return false; 
        if (this.actionMode === "edit" && this.currentId == params.rowData.idCon) return true;
      },
        isUnite: function(params)
      {
        if (this.actionMode === 'view' || this.parentId !== params.rowData.idCon) return false; 
        if (this.actionMode === "unite" && this.parentId == params.rowData.idCon) return true;
      },
      formatDate: function(date)
      {
        return formatDate(date);
      },
     actionAddClick: function() {
        if (!this.checkEdit() || !this.checkUnite()) return;
  
        this.actionMode = "edit";
        this.currentId = -1;
        this.contractData.push({
          idCon: -1,
          Num: '',
          Date: null, 
          Purpose: ''
          });
      },
      actionEditClick: function (params) {
        if (!this.checkEdit() || !this.checkUnite()) return;

         this.currentId =  params.rowData.idCon;
         this.actionMode = 'edit'
      },
      actionSaveClick: function (params) {
         let idCon = params.rowData.idCon;
         this.isLoading = true;
         if(idCon == -1) //добавляем новый договор
         {
            api().
              post('/contract', {contractData: params.rowData})
              .then(response => {
                 let idCon = response.data.idContract;
                 params.rowData.idCon = idCon;
                 this.actionMode = 'view';
                $('.contract-error').removeClass('has-error').html('');
                this.isLoading = false;
            }) 
            .catch(error => {
              this.isLoading = false;
               alert('Ошибка при добавлении договора '+ error);
            });
         }
         else { //редактируем существующий договор
           api().
              put('/contract/' + idCon, {contractData: params.rowData})
              .then(response => {
                    this.actionMode = 'view';
                    $('.contract-error').removeClass('has-error').html('');
                    this.isLoading = false;
                })
            .catch(error => { //ошибка при обновлении данных о договоре
              this.isLoading = false;
               alert('Ошибка при обновлении данных о договоре '+ error);
            });
         }
      },
       actionDeleteClick: function (params) {
        if (!this.checkEdit() || !this.checkUnite()) return;
        this.isLoading = true;
        let idCon = params.rowData.idCon;
        if (idCon != -1) 
        {
           api().
              delete('/contract/' + idCon)
              .then(response => { 
                this.contractData = _.reject(this.contractData, {idCon: idCon});
                this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
               alert('Ошибка при удалении договора  '+ error);
            });
        }

      },
       actionUniteClick: function (params) {
         if (!this.checkEdit()) return;

       if(this.parentId === -1){ //первый раз нажали на объединение
           $('.contract-tip').addClass('visible');
          this.parentId =  params.rowData.idCon;
          this.actionMode = 'unite'
        }
        else if (this.parentId && this.parentId > -1)
        {
          this.isLoading = true;
          let idCon = params.rowData.idCon;
          //console.log ('unite ' + this.parentId + '____' + params.rowData.idCon);

          api().
              post('/contractUnite/' + this.parentId + '&' + idCon) //todo проверить
              .then(response => { 
                this.contractData = _.reject(this.contractData, {idCon: idCon});
                this.actionMode = 'view';
                this.parentId = -1;
                $('.contract-error').removeClass('has-error').html('');
                $('.contract-tip').removeClass('visible');
                this.isLoading = false;

            })
            .catch(error => {
               this.actionMode = 'view';
               this.parentId = -1;
               $('.contract-error').removeClass('has-error').html('');
              $('.contract-tip').removeClass('visible');
              this.isLoading = false;
               alert('Ошибка при объединении договоров  '+ error);
            });
        }


      },
      actionCancelClick: function (params) {
          this.actionMode = 'view';
          this.parentId = -1;
          $('.contract-error').removeClass('has-error').html('');
          $('.contract-tip').removeClass('visible');
      },
      checkEdit: function(){
         if (this.actionMode === 'edit'){
         $('.contract-error').addClass('has-error').html(this.msgError);
          return false;
        }
        return true;
      },
      checkUnite: function(){
         if (this.actionMode === 'unite'){
         $('.contract-error').addClass('has-error').html(this.msgErrorUnite);
          return false;
        }
        return true;
      }
      
     
     
    },
     mounted: function()
      {
        this.rights = getFunRight(this.funShortName);
        this.extRights = hasRight(this.funExtShortName);
  
        if (!this.rights.edit){
          this.datatableCss.tbodyTd += ' edit-hide'
          this.datatableCss.theadTh += ' edit-hide'
        }
        if (!this.rights.delete){
          this.datatableCss.tbodyTd += ' delete-hide'
          this.datatableCss.theadTh += ' delete-hide'
        }
        if (!this.extRights){
          this.datatableCss.tbodyTd += ' unite-hide'
          this.datatableCss.theadTh += ' unite-hide'
        }
        this.initData();
      
      }

  }
</script>

<style lang="scss" scoped>
   .add-button
  {
    border: 1px solid #ced4da;
    position: relative;
    padding: .425em .5em;
    border-radius: .25em;
    cursor: pointer;
    margin: 10px;
    width: 250px;
  }
  .add-button:hover
  {
    color: #337ab7;
  }
  .act-btn i{
    color: #337ab7;
    cursor: pointer;
  }
  .act-btn i:hover{
    color: #ed9b19
  }
  .contract-table input,
  .contract-table textarea
  {
    border: 1px solid #ced4da;
    position: relative;
    margin: .25em 0;
    border-radius: .25em;
    cursor: text;
    display: inline-block;
    text-align: left;
    width: 100%;
    height: 2em;
  }
  .contract-table textarea
  {
    height: 4em;
  }
  .contract-error
	{
		color: red;
		display: inline-block;
    font-size: small;
     visibility: hidden;
  }
  .contract-tip
  	{
		color: green;
		display: inline-block;
    font-size: small;
     visibility: hidden;
  }
  .has-error,
  .visible
  {
    visibility: visible;
  }
  
</style>