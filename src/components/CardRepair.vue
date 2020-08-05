<template lang="html">
   <stack-modal
          :show="showRepairCard"
          :modal-class="{[modalClass]: true}"
          @close=""> 
      <div slot="modal-header"></div>
      <div class="rep-card-content">
        <div class="rep-card-col-50">
          <div class="rep-card-label"><label class="mb-0">Дата</label></div>
          <div class="rep-card-item">
                <date-picker v-model="repCard.repDate" popup-class='calPopup' format='DD.MM.YYYY' v-if="actionMode !=='view'"></date-picker>
                <p name="comDate" v-if="actionMode =='view'">{{repCard.repDateFormat}}</p>
          </div>
        </div>
        <div class="rep-card-col-50">
          <div class="rep-card-label"><label class="mb-0">Вид</label></div>
          <div class="rep-card-item">  
             <dynamic-select 
                    :options="repTypeList"
                    option-value="id"
                    option-text="name"
                    v-model="repCard.repType"
                    placeholder=''
                    v-if="actionMode !=='view'"/>
               
                <p v-if="actionMode =='view'">{{repCard.repType.name}}</p>         
            </div>
        </div>
        

         <div class="rep-card-col-100">
            <div class="rep-card-label"><label class="mb-0">Выполненные работы</label></div>
                <div class="rep-card-item">
                        <textarea type="text" v-model="repCard.execWork" v-if="actionMode !=='view'"></textarea>
                        <p v-if="actionMode =='view'">{{repCard.execWork}}</p>      
                </div>
        </div>
         <div class="rep-card-col-50">
            <div class="rep-card-label"><label class="mb-0">ФИО мастера</label></div>
                <div class="rep-card-item">
                        <input type="text" v-model="repCard.repMasterFIO" v-if="actionMode !=='view'"></input>
                        <p v-if="actionMode =='view'">{{repCard.repMasterFIO}}</p>      
            </div>
        </div>
        <div class="rep-card-col-50" v-if="repCard.repDocPath !=='' || actionMode !=='view'">
          <div class="rep-card-label"><label class="mb-0">Акт</label></div>
          <div class="rep-card-item">
             <div v-if="repCard.repDocPath !=='' && actionMode ==='view'" class='act-btn'>
                <label class="label-file">
                    <a :href="repCard.repDocPath" target="_blank"> <i class="fa fa-download" title="скачать" ></i> </a>
                    <span v-if="repCard.repDocPath !==''" class="js-fileName">Скачать файл</span>
                </label>
            </div> 
            <div v-if="actionMode !=='view'">
                <input type="file" name="file" id="input__file" ref='file' class="input input__file" v-on:change='handleFileUpload'/>
                <!-- accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*" -->
                <label for="input__file" class="label-file label-file-att">
                    <i class="fa fa-upload"></i>
                    <span v-if="repCard.repDocPath !==''" class="js-fileName">Обновить файл</span>
                    <span v-if="repCard.repDocPath ===''" class="js-fileName">Загрузить файл</span>
                </label>
            </div>
          </div>
        </div>
    </div>
      <div slot="modal-footer">
        <div class ="rep-card-footer">
          <button class="modal-button" v-if="actionMode!=='view'" @click="saveRepair" title='Сохранить ремонт'>Сохранить</button>
          <button class="modal-button" @click="$emit('close')" title='закрыть'>Закрыть</button>
          </div>
      </div>  

    </stack-modal>
</template>

<script>
  import DatePicker from 'vue2-datepicker'

  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import StackModal from '@innologica/vue-stackable-modal'
  import {getFunRight}  from "../utils/right"
import {getRepType} from '../utils/dictionary'
import DynamicSelect from 'vue-dynamic-select'
  import {endpoint} from '../utils/config'

 import api from "../utils/api"

  import '../css/stackable-modal.scss'

  import {formatDate, HoursDiff} from '../utils/date'

  export default {
    name:"card-repair",
    components: {
     DatePicker,
     StackModal,
     DynamicSelect
    },
    props: {
            repCard: {type: Object, required: true},
            actionMode: {type: String},
		    showRepairCard: {type: Boolean}
  },

    data() {
      return {
        rights: {},
		   funShortName: 'rep',
        modalClass:'modal-xl',
        //dictionary
         repTypeList: [], //вид
       
         file: ''


       }
    },
    watch: {
        showRepairCard(value)
        {
            if (value) {
                this.file = '';
            }
        }   
    },
    mounted() {

            this.rights = getFunRight(this.funShortName);
            this.repTypeList = getRepType(); 
        },
    methods: {
    

    handleFileUpload: function(){
        this.file = this.$refs.file.files[0];
        
        if (this.file) {
             $('.label-file').addClass('has-file').find('.js-fileName').html(this.file.name); 
        }
        else {
           $('.label-file').removeClass('has-file').find('.js-fileName').html(this.repCard.repDocPath === '' ? 'Загрузить файл' : 'Обновить файл');
        }
    },
    saveRepair: function(){

         this.$emit('loading', true);
         if(this.repCard.idRep == -1) //добавляем новый ремонт
         {
            api().
              post('/repair', {repairData: this.repCard})
              .then(response => {
                 let idRep = response.data.idRep;
                 this.repCard.idRep = idRep;
                 
                 
                 if (this.file) { //если добавили файл
                   this.sendFile(this.repCard); 
                   
                 }
                 else {
                     this.$emit('save', this.repCard);
                   this.$emit('loading', false);
                 }
            })
            .catch(error => {
              this.$emit('loading', false);
              this.$alert('Ошибка при добавлении ремонта: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при добавлении ремонта '+ error);
            });
         }
         else { //редактируем существующий ремонт
           api().
              put('/repair/' + this.repCard.idRep, {repairData: this.repCard})
              .then(response => {

                
                 if (this.file) { // если добавили файл
                      this.sendFile(this.repCard);
                }
                else{
                    this.$emit('save', this.repCard);
                    this.$emit('loading', false);
                }
               
            })
            .catch(error => { //ошибка при обнолении данных о ремонте
                this.$emit('loading', false);
                this.$alert('Ошибка при обновлении данных о ремонте: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при обновлении данных о ремонте '+ error);
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
                idRep: this.repCard.idRep,
                docTypeId: -1,
                funShortName: this.funShortName
              }
            }
          ).then(response => {
            var filename = response.data.filename;
            
            if (filename){
              this.repCard.repDocPath = `${endpoint}${filename}`;
            }
             this.$emit('save', this.repCard);
            this.$emit('loading', false);
          })
        .catch(error => {//ошибка при добавлении файла
            this.$emit('loading', false);
          	this.$alert('Ошибка при сохранении файла: '+ error, '', 'error', {allowOutsideClick: false});
          //alert('Ошибка при сохранении файла '+ error);
        })
      }



    }
}

</script>

<style lang="scss" scoped>
.rep-card-content{
    width: 100%;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
     justify-content:space-evenly;
}
.rep-card-col-50{
   width: 50%;
    text-align: center;
    min-width: 360px;
}
.rep-card-col-100{
   width: 100%;
    text-align: center;
    min-width: 360px;
}


.rep-card-label,
.rep-card-label-small {
    display: inline-block;
    min-width: 300px;
    width: 100%;
    text-align: left;
    padding-left: 15px;
    color:#000000;
    font-size: 12pt;
    padding-top: .5em;
  }
  

  .rep-card-item{
      display: block;
      width: 100%;
      min-width: 300px;
      padding-left: 15px;
      padding-right: 15px;
  }
  

.rep-card-item  select,
.rep-card-item input[type=text],
.rep-card-item  p,
.rep-card-item  textarea
  {
    position: relative;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
    cursor: text;
    display: block;
    text-align: left;
    width: 100%;
    min-height: 2.5em;
  }
  .rep-card-item  p
  {
      margin-bottom: 0;
      padding-left: 5px;
  }
.rep-card-item  textarea {
    height: 50px;
}
.rep-card-input-file {
  opacity: 0;
  display: none;
  position: absolute;
  height: 0px;
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
  .act-btn i:hover,
  .label-file:hover{
    color: #000000
  }

  
  .mx-datepicker{
    width: 100%;
  }


@media screen and (max-width: 800px) {
    
    .rep-card-col-50{
        width: 100%;
    }

}

@media screen and (max-width: 480px) {
   html {
      -webkit-text-size-adjust: none;
   }
}

.rep-card-footer {
    padding-bottom: 1em;
    display: flex;
    justify-content: flex-end;
  }

.modal-button { 
      border: 1px solid #e21a1a;
      position: relative;
      padding-left: .5em;
      padding-right: .5em;
      margin: 0 .5em;
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
.modal-button:hover{
    color: #000000;
  }
 
 
   .has-file {
    color: green;
  }
.input__file {
   opacity: 0;
   visibility: hidden;
   display: none;
   position: absolute;
 }
</style>