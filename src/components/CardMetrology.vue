<template lang="html">
   <stack-modal
          :show="showMetrologyCard"
          :modal-class="{[modalClass]: true}"
          @close=""> 
      <div slot="modal-header"></div>
      <div class="met-card-content">
        <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Дата</label></div>
          <div class="met-card-item">
                <date-picker v-model="metCard.recDate" popup-class='calPopup' format='DD.MM.YYYY' v-if="actionMode !=='view'"></date-picker>
                <p name="comDate" v-if="actionMode =='view'">{{metCard.recDateFormat}}</p>
          </div>
        </div>
        <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Вид</label></div>
          <div class="met-card-item">  
             <dynamic-select 
                    :options="attTypeList"
                    option-value="id"
                    option-text="name"
                    v-model="metCard.attType"
                    placeholder=''
                    v-if="actionMode !=='view'"/>
               
                <p v-if="actionMode =='view'">{{metCard.attType.name}}</p>         
            </div>
        </div>
        <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Тип</label></div>
          <div class="met-card-item">
               <dynamic-select 
                    :options="MTypeList"
                    option-value="id"
                    option-text="name"
                    v-model="metCard.M_Type"
                    placeholder=''
                    v-if="actionMode !=='view'"/>
                <p v-if="actionMode =='view'">{{metCard.M_Type.name}}</p>      
          </div>
        </div>
         <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Номер документа</label></div>
          <div class="met-card-item">
                 <input type="text" v-model="metCard.attNum" v-if="actionMode !=='view'" class="met-card-item-input"></input>
                <p v-if="actionMode =='view'">{{metCard.attNum}}</p>      
          </div>
        </div>
        
        <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Дата аттестата/св-ва о поверке</label></div>
          <div class="met-card-item">
                <date-picker v-model="metCard.attDate" popup-class='calPopup' format='DD.MM.YYYY' v-if="actionMode !=='view'"></date-picker>
                <p name="comDate" v-if="actionMode =='view'">{{metCard.attDateFormat}}</p>
          </div>
        </div>
        <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Дата оконч. срока действия</label></div>
          <div class="met-card-item">
               <date-picker v-model="metCard.attEnd" popup-class='calPopup'  format='DD.MM.YYYY' v-if="actionMode !=='view'"></date-picker>
                <p name="comDate" v-if="actionMode =='view'">{{metCard.attEndFormat}}</p>
          </div>
        </div>
        <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Номер протокола</label></div>
          <div class="met-card-item">
                 <input type="text" v-model="metCard.protocolNum" v-if="actionMode !=='view'" class="met-card-item-input"></input>
                <p v-if="actionMode =='view'">{{metCard.protocolNum}}</p>      
          </div>
        </div>
        
        <div class="met-card-col-30">
          <div class="met-card-label"><label class="mb-0">Дата протокола</label></div>
          <div class="met-card-item">
                <date-picker v-model="metCard.protocolDate" popup-class='calPopup' format='DD.MM.YYYY' v-if="actionMode !=='view'"></date-picker>
                <p name="comDate" v-if="actionMode =='view'">{{metCard.protocolDateFormat}}</p>
          </div>
        </div>
        <div class="met-card-col-30">
          <div class="met-card-label-small"><label class="mb-0">Допущен к работе</label></div>
          <div class="met-card-item-small">
              <input id="eqEnable" v-if="actionMode !=='view'" type='checkbox' v-model="metCard.eqEnable" @change="eqEnableChange"/>
              <label for="eqEnable"></label>
              <p name="comDate" v-if="actionMode =='view'">{{metCard.eqEnableName}}</p>
          
          </div>
        </div>
        <div class="met-card-col-50" v-if="metCard.attDocPath !=='' || actionMode !=='view'">
          <div class="met-card-label"><label class="mb-0">Аттестат/св-во о поверке</label></div>
          <div class="met-card-item">
             <div v-if="metCard.attDocPath !=='' && actionMode ==='view'" class='act-btn'>
                <label class="label-file">
                    <a :href="metCard.attDocPath" target="_blank"> <i class="fa fa-download" title="скачать " ></i> </a>
                    <span v-if="metCard.attDocPath !==''" class="js-fileName">Скачать файл</span>
                </label>
            </div> 
            <div v-if="actionMode !=='view'">
                <input type="file" name="fileAtt" id="input__file_att" ref='fileAtt' class="input input__file" v-on:change='handleFileAttUpload'/>
                <!-- accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*" -->
                <label for="input__file_att" class="label-file label-file-att">
                    <i class="fa fa-upload"></i>
                    <span v-if="metCard.attDocPath !==''" class="js-fileName">Обновить файл</span>
                    <span v-if="metCard.attDocPath ===''" class="js-fileName">Загрузить файл</span>
                </label>
            </div>
          </div>
        </div>
        <div class="met-card-col-50"  v-if="metCard.protocolDocPath !=='' || actionMode !=='view'">
          <div class="met-card-label"><label class="mb-0" >Протокол</label></div>
          <div class="met-card-item">
            <div v-if="metCard.protocolDocPath !=='' && actionMode ==='view'" class='act-btn'>
                <label class="label-file">
                    <a :href="metCard.protocolDocPath" target="_blank"> <i class="fa fa-download" title="скачать " ></i> </a>
                    <span v-if="metCard.protocolDocPath !==''" class="js-fileName">Скачать файл</span>
                </label>
            </div> 
            <div v-if="actionMode !=='view'">
                <input type="file" name="fileProtocol" id="input__file_protocol" ref='fileProtocol' class="input input__file" v-on:change='handleFileProtocolUpload'/>
                <!-- accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*" -->
                <label for="input__file_protocol" class="label-file label-file-protocol">
                    <i class="fa fa-upload"></i>
                    <span v-if="metCard.protocolDocPath !==''" class="js-fileName">Обновить файл</span>
                    <span v-if="metCard.protocolDocPath ===''" class="js-fileName">Загрузить файл</span>
                </label>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class ="met-card-footer">
          <label class='metrology-error'></label>
          <button class="modal-button" v-if="actionMode!=='view'" @click="saveMetrology" title='Сохранить аттестацию/поверку'>Сохранить</button>
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
import {getAttType, getMType} from '../utils/dictionary'
import DynamicSelect from 'vue-dynamic-select'
  import {endpoint} from '../utils/config'

 import api from "../utils/api"

  import '../css/stackable-modal.scss'

  import {formatDate, HoursDiff} from '../utils/date'

  export default {
    name:"card-metrology",
    components: {
     DatePicker,
     StackModal,
     DynamicSelect
    },
    props: {
            metCard: {type: Object, required: true},
            actionMode: {type: String},
		        showMetrologyCard: {type: Boolean}
  },

    data() {
      return {
        rights: {},
		   funShortName: 'met',
        modalClass:'modal-xxl',
        //dictionary
         attTypeList: [], //вид
         MTypeList: [], //тип
         fileAtt: '',
         fileProtocol: ''


       }
    },
    watch: {
        showMetrologyCard(value)
        {
            if (value) {
                this.fileAtt = '';
                this.fileProtocol = '';
            }
        }   
    },
    mounted() {
            this.datetimeStart= null;
            this.datetimeEnd= null;
            this.rights = getFunRight(this.funShortName);
            this.attTypeList = getAttType();
            this.MTypeList = getMType();

           
            
        },
    methods: {
    eqEnableChange:function(){
        this.metCard.eqEnableName = this.metCard.eqEnable ? 'Да' : 'Нет';
    },

    handleFileAttUpload: function(){
        this.fileAtt = this.$refs.fileAtt.files[0];
        
        if (this.fileAtt) {
             $('.label-file-att').addClass('has-file').find('.js-fileName').html(this.fileAtt.name); 
        }
        else {
           $('.label-file-att').removeClass('has-file').find('.js-fileName').html(this.metCard.attDocPath === '' ? 'Загрузить файл' : 'Обновить файл');
        }
    },
    handleFileProtocolUpload: function(){
         this.fileProtocol = this.$refs.fileProtocol.files[0];
        
        if (this.fileProtocol) {
             $('.label-file-protocol').addClass('has-file').find('.js-fileName').html(this.fileProtocol.name); 
        }
        else {
           $('.label-file-protocol').removeClass('has-file').find('.js-fileName').html(this.metCard.protocolDocPath === '' ? 'Загрузить файл' : 'Обновить файл');
        }

    },
    saveMetrology: function(){
  
          this.$emit('loading', true);

       if (this.metCard.metId === -1)  {
            api().
              post('/metrology', {metrologyData: this.metCard})
               .then(response => {
                 let newId = response.data.idMet;
                  this.metCard.metId = newId;
                  this.sendFiles();
               })
             .catch(error => {
                this.$emit('loading', false);
                this.$alert('Ошибка при добавлении аттестации/поверки: '+ error, '', 'error', {allowOutsideClick: false});
                //alert('Ошибка при добавлении аттестации/поверки: '+ error);
                return;
         });


         }
        else {
            api().
               put('/metrology/' + this.metCard.metId, {metrologyData: this.metCard})
               .then(response => {
                   this.sendFiles();
               })
               .catch(error => {
                 this.$emit('loading', false);
                 this.$alert('Ошибка при редактировании аттестации/поверки: '+ error, '', 'error', {allowOutsideClick: false});
                 //alert('Ошибка при редактировании аттестации/поверки: '+ error);
                 return;
             });
        }

       },
    sendFiles: function()
      { 
        let attSent = false;
        let protocolSent = false;

        if (this.fileAtt){
            let formData = new FormData(); 
            formData.append('file', this.fileAtt);
            api().
                post('/file',
                    formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }, 
                    params:{ 
                        idMet: this.metCard.metId,
                        docTypeId: 1,
                        funShortName: this.funShortName
                    }
                    }).then(response => {
                        var filename = response.data.filename;
                        if (filename)
                            this.metCard.attDocPath =  `${endpoint}${filename}`;
        
                        attSent = true;
                        if(attSent && protocolSent){
                            this.$emit('loading', false);
                            this.$alert('Данные сохранены!', '', 'success', {allowOutsideClick: false});
                            //alert ('Данные сохранены!');
                            this.$emit('save', this.metCard);
                        }
                    }).catch(error => {//ошибка при добавлении файла
                    this.$emit('loading', false);
                    this.$alert('Ошибка при сохранении файла с аттестатом/свидетельством о поверке: '+ error, '', 'error', {allowOutsideClick: false});
                    //alert('Ошибка при сохранении файла с аттестатом/свидетельством о поверке: '+ error);
                })
        }
        else attSent = true;

        if (this.fileProtocol){
            let formData = new FormData(); //добавляем новый 
            formData.append('file', this.fileProtocol);
            api().
                post('/file',
                    formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }, 
                    params:{ 
                        idMet: this.metCard.metId,
                        docTypeId: 2,
                        funShortName: this.funShortName
                    }
                    }).then(response => {
                        var filename = response.data.filename;
                        if (filename)
                            this.metCard.protocolDocPath =  `${endpoint}${filename}`;
                             
                        protocolSent = true;
                        if(attSent && protocolSent){
                            this.$emit('loading', false);
                            this.$alert('Данные сохранены!', '', 'success', {allowOutsideClick: false});
                            //alert ('Данные сохранены!');
                            this.$emit('save', this.metCard);
                        }
                    }).catch(error => {//ошибка при добавлении файла
                    this.$emit('loading', false);
                    this.$alert('Ошибка при сохранении файла с протоколом: '+ error, '', 'error', {allowOutsideClick: false});
                    //alert('Ошибка при сохранении файла с протоколом: '+ error);
                })
        }
        else protocolSent = true;

        if(!this.fileAtt && !this.fileProtocol){
             this.$emit('loading', false);
             this.$alert('Данные сохранены!', '', 'success', {allowOutsideClick: false});
             //alert ('Данные сохранены!');
              this.$emit('save', this.metCard);
        }

      }
    }
}

</script>

<style lang="scss" scoped>
.met-card-content{
    width: 100%;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
     justify-content:space-evenly;
}
.met-card-col-30{
   width: 33%;
    text-align: center;
    min-width: 300px;
}
.met-card-col-20{
   width: 20%;
    text-align: center;
    min-width: 160px;
}
.met-card-col-50{
   
   width: 50%;
   min-width: 360px;
    text-align: center;
}

.met-card-label,
.met-card-label-small {
    display: inline-block;
    min-width: 300px;
    width: 100%;
    text-align: left;
    padding-left: 15px;
    color:#000000;
    font-size: 12pt;
    padding-top: .5em;
  }
  
.met-card-label-small  {
   
    min-width: 100%;
   
  }
  .met-card-item,
.met-card-item-small {
      display: block;
      width: 100%;
      min-width: 300px;
      padding-left: 15px;
      padding-right: 15px;
  }
    .met-card-item-small {
      min-width: 150px;
  }

.met-card-item  select,
.met-card-item input[type=text],
.met-card-item  p
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
  .met-card-item  p
  {
      margin-bottom: 0;
      padding-left: 5px;
  }

.met-card-input-file {
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
    .met-card-col-20{
        width: 100%;
    }
    .met-card-col-40{
        width: 100%;
    }
    .met-card-col-50{
        width: 100%;
    }

}

@media screen and (max-width: 480px) {
   html {
      -webkit-text-size-adjust: none;
   }
}

.met-card-footer {
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
 
  .metrology-error
	{
		color: #e21a1a;
		display: inline-block;
		font-size: small;
  }
  .has-error
  {
    visibility: visible;
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