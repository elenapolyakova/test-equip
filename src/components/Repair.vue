<template lang="html">
      <div class="eqContent">
        <div v-if="rights.add">
            <button class="add-button" @click="actionAddClick" ><i class='fa fa-plus'> </i> Добавить ремонт</button></td>
        </div>
        <DataTable
            :header-fields="headerFields"
            :data="eqRepairData || []"
            :css="datatableCss"
            @on-update="dtUpdateSort"> 
          <template v-slot:actionsEdit="props">
              <button v-if="!isEdit(props)" class="btn btn-act" @click="actionEditClick(props);" title='редактировать'><i class = 'fa fa-edit'></i></button>
              <button v-if="isEdit(props)" class="btn btn-act" @click="actionSaveClick(props);" title='cохранить'><i class = 'fa fa-save'></i></button>
          </template>
          <template v-slot:actionsDelete="props">
              <button class="btn btn-act" @click="actionDeleteClick(props);" title='удалить'><i class = 'fa fa-trash-alt'></i></button>
          </template>
          <div slot="repDateItem" slot-scope="props">
              <span v-if="!isEdit(props)">{{formatDate(props.rowData.repDate)}}</span>
               <date-picker v-if="isEdit(props)" v-model="props.rowData.repDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup'></date-picker>
          </div> 
          <div slot="repTypeNameItem" slot-scope="props">
            <p name="repType" v-if="!isEdit(props)">{{repTypeName(props.rowData.repType)}}</p>   
            <select name="repType" v-if="isEdit(props)" v-model="props.rowData.repType">
                <option disabled value="">Не выбрано</option>
                <option v-for="repType in repTypeList" :value="repType.id">
                    {{repType.name}}
                </option>
            </select>              
           </div> 
          <div slot="execWorkItem" slot-scope="props">
              <p v-if="!isEdit(props)"> {{props.rowData.execWork}}</p>
              <textarea v-if="isEdit(props)" v-model="props.rowData.execWork"></textarea>
          </div>
          
         <div slot="repDocAct" slot-scope="props">
            <div v-if="!isEdit(props) && props.rowData.repDocPath !==''" class='act-btn'>
              <a :href="props.rowData.repDocPath" target="_blank"><i class="fa fa-download" title="загрузить документ" ></i></a>
            </div>
            <div v-if="isEdit(props)">
              <input type="file" name="file" id="input__file" ref='file' class="input input__file" v-on:change='handleFileUpload'/>
                <!-- accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*" -->
                <label for="input__file" class="label-file">
                  <i class="fa fa-upload"></i>
                  <span v-if="props.rowData.repDocPath !==''" class="js-fileName">Обновить файл</span>
                  <span v-if="props.rowData.repDocPath ===''" class="js-fileName">Загрузить файл</span>
                </label>
            </div>
          </div> 
        </DataTable>
      </div>
</template>

<script>
  import { DataTable } from 'v-datatable-light'

  import DatePicker from 'vue2-datepicker'
  import DynamicSelect from 'vue-dynamic-select'
  import {endpoint} from '../utils/config'
  import {formatDate, dateFromString} from '../utils/date'
  import {getFunRight, hasRight}  from "../utils/right";
  import api from "../utils/api";
  import {getRepType} from '../utils/dictionary'

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
             lang: {type: Object}
    },
    data() {
      return {
         repTypeList: [],
         eqRepairData: [],
         headerFields: [
          "__slot:actions:actionsEdit",
          "__slot:actions:actionsDelete",
          { name: "repDate", label: "Дата" /*, format: formatDate*/,  sortable: true, customElement: "repDateItem" },
          { name: "repType.repTypeName", label: "Вид ремонта",  sortable: true,  customElement: "repTypeNameItem" },
          { name: "execWork", label: "Выполненные работы",  sortable: true, customElement: "execWorkItem" },
          { name: "repDocPath", label: "Акт", sortable: false, customElement: "repDocAct"}
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center repair-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
       repDate: '',
       rights: {},
       actionMode: 'view',
       currentId: -1,
       nextId: 0,
       msgError: "Необходимо завершить редактирование",
       funShortName: 'rep'
      }
    },
    methods: {
      dtUpdateSort:  function({ sortField, sort }) {
            this.eqRepairData = _.orderBy(this.eqRepairData, [sortField],[sort]);
      },
      initData: function()
      {
        
        api().
            get('/repair',
                {
                  params: {
                    idEq: this.idEq
                  }
                }
            ).then(response => {
                this.eqRepairData = response.data;
                 this.eqRepairData.forEach(function(item)
                 {
                     item.repDate = new Date(item.repDate);
                     item.repDocPath = item.docName  !== '' ? `${endpoint}${item.docName}` : '';
                 })
                 this.nextId = this.eqRepairData.length + 1;  //todo когда будет база удалить
                
            })
            .catch(error => {
               alert('error '+ error);
            });

        this.repTypeList = getRepType();
        
      },
      repTypeName: function  (_id){
        let repType = _.find(this.repTypeList, {id: _id});
        if (!repType) return ''
        return repType.name;
      },
      actionAddClick: function() {
        if (this.actionMode === 'edit'){
          alert (this.msgError)
          return;
        }
        this.actionMode = "add";
        this.currentId = -1;
        this.file = '';
        this.eqRepairData.push({
          idRep: -1, 
          repDate: null, 
          execWork: '',
          repDocPath: ''});
      },
      actionEditClick: function (params) {
        if (this.actionMode === 'edit'){
          alert (this.msgError)
          return;
        }
         this.file = '';
         this.currentId =  params.rowData.idRep;
         this.actionMode = 'edit'
      },
      actionSaveClick: function (params) {
         let idRep = params.rowData.idRep;
         if(idRep == -1) //добавляем новый ремонт
         {
            api().
              post('/repair', {repairData: params.rowData})
              .then(response => {
                 let idRep = response.data.idRep;
                 idRep = this.nextId++;  //todo удалить
                 params.rowData.idRep = idRep;
                 if (this.file) { //если добавили файл
                   this.sendFile(params); 
                   
                 }
                 else {
                    this.actionMode = 'view';
                 }
            })
            .catch(error => {
               alert('error '+ error);
            });
         }
         else { //редактируем существующий ремонт
           api().
              put('/repair/' + idRep, {repairData: params.rowData})
              .then(response => {
                 if (this.file) { // если добавили файл
                  let fileName = params.rowData.repDocPath; //если был старый файл - удаляем
                  if (fileName!= ''){
                      api().
                        delete('/file',{
                            data: {
                              fileName: fileName.substring(`${endpoint}`.length),
                              idRep: idRep,
                              funShortName: this.funShortName
                            }
                        })
                        .then(response => { 
                            this.sendFile(params); //добавляем новый файл
                          })
                        .catch(error => { //ошибка при удалении старого файла
                            alert('error '+error);
                        });
                  }//удаление старого файла
                  else{ //добавляем новый файл
                      this.sendFile(params);
                  }
                }
                else{
                    this.actionMode = 'view';
                }
               
            })
            .catch(error => { //ошибка при обнолении данных о ремонте
               alert('error '+ error);
            });
         }

       
      },
      sendFile: function(params)
      { 
        let formData = new FormData(); //добавляем новый 
        formData.append('file', this.file);
        api().
          post('/file',
            formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }, 
              params:{ 
                idRep: params.rowData.idRep,
                docTypeId: -1,
                funShortName: this.funShortName
              }
            }
          ).then(response => {
            var filename = response.data.filename;
            
            if (filename){
              params.rowData.repDocPath = `${endpoint}${filename}`;
              this.actionMode = 'view';
            }
            else alert (response.data);
          })
        .catch(error => {//ошибка при добавлении нового
         alert('error '+ error);
        })
      },
      actionDeleteClick: function (params) {
         if (this.actionMode === 'edit'){
          alert (this.msgError)
          return;
        }
        let idRep = params.rowData.idRep;
        if (idRep != -1) 
        {
            let fileName = params.rowData.repDocPath;
            if (fileName!= '')
              {
                api(). //удаляем файл
                  delete('/file',{
                    data: {
                      fileName: fileName.substring(`${endpoint}`.length),
                      idRep: idRep,
                      funShortName: this.funShortName
                     }
                  })
                  .then(response => {})
                  .catch(error => { //ошибка при удалении  файла
                      alert('error '+error);
                });
              }

           api().
              delete('/repair/' + idRep)
              .then(response => { 
                this.eqRepairData = _.reject(this.eqRepairData, {idRep: idRep});
                this.actionMode='view';
            })
            .catch(error => {
               alert('error '+ error);
            });
        }

      },
      handleFileUpload: function()
      {
         this.file = this.$refs.file.files[0];
         var $input = $('.input__file');
         var $label = $input.next('.label-file');
        
        if (this.file) 
        {
            $label.addClass('has-file').find('.js-fileName').html(this.file.name); 
        }
        else 
          $label.removeClass('has-file').find('.js-fileName').html('Загрузить файл');
      },
      isEdit: function(params)
      {
        if (this.actionMode === 'view' || this.currentId !== params.rowData.idRep) return false; 
        if (this.actionMode === "edit" && this.currentId == params.rowData.idRep) return true;
        if (this.actionMode === "add" && this.currentId == params.rowData.idRep) return true;
      },
      formatDate: function(date)
      {
        return formatDate(date);
      }
    },
    mounted: function() {
        this.rights = getFunRight(this.funShortName);
        if (!this.rights.edit){
          this.datatableCss.tbodyTd += ' edit-hide'
          this.datatableCss.theadTh += ' edit-hide'
        }
        if (!this.rights.delete){
          this.datatableCss.tbodyTd += ' delete-hide'
          this.datatableCss.theadTh += ' delete-hide'
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
    width: 15em
  }
  .add-button:hover
  {
    color: #337ab7;
  }
  .repair-table select,
  .repair-table textarea
  {
    border: 1px solid #ced4da;
    position: relative;
    margin: .25em 0;
    border-radius: .25em;
    cursor: text;
    display: inline-block;
    text-align: left;
    width: 100%;
    height: 3em;
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
      border: 1px solid #ced4da;
      position: relative;
      border-radius: .25em;
      cursor: pointer;
      width: 100%;
      color: #337ab7;
  }
  .act-btn i{
    color: #337ab7;
    cursor: pointer;
  }
  .act-btn i:hover{
    color: #ed9b19
  }
  .label-file:hover{
    color: #ed9b19;
  }
 .has-file {
    color: green;
  }
  .btn-act{
     color: #337ab7;
     cursor: pointer;
  }
  
   

  
</style>