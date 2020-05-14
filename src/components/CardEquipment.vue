<template lang="html">
<div>
    <div class="eq-card-body">
        <div class="eq-card-body-item">
            <div class="label"><label for="devision">Подразделенеие</label></div>
            <div class="div-25">
                <dynamic-select 
                    :options="eqDevisionList"
                    option-value="id"
                    option-text="name"
                    placeholder=''
                    v-model="eqCard.devision"
                    :name="devision" 
                    v-if="actionMode !=='view'"/>
                <p name="devision" v-if="actionMode =='view'">{{eqCard.devision.name}}</p>
            </div> 
            <div class="label"><label for="responsible">Ответственный</label></div>
            <div style="width:55%">
                <dynamic-select 
                    :options="responsibleList"
                        option-value="id"
                        option-text="name"
                        v-model="eqCard.responsible"
                        placeholder=''
                        :name="responsible" 
                        v-if="actionMode !=='view'"/>
                 <p name="responsible" v-if="actionMode =='view'">{{eqCard.responsible.name}}</p>
            </div> 
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqType">Вид оборудования</label></div>
            <div class="div-25">
                <dynamic-select 
                    :options="eqTypeList"
                    option-value="id"
                    option-text="name"
                    v-model="eqCard.eqType"
                    placeholder=''
                    :name="eqType" 
                    v-if="actionMode !=='view'"/>
                <p name="eqType" v-if="actionMode =='view'">{{eqCard.eqType.name}}</p>
            </div> 
            <div class="label"><label for="regNum">№ в госреестре</label></div>
            <div style="width: 20%">
                <input name="regNum" v-model="eqCard.regNum" v-if="actionMode !=='view'"></input>
                <p name="regNum" v-if="actionMode =='view'">{{eqCard.regNum}}</p>
            </div> 
            <div class="label"><label for="eqReadiness">Готовность</label></div>
            <div class="div-25">
                <dynamic-select 
                    :options="eqReadinessList"
                        option-value="id"
                        option-text="name"
                        v-model="eqCard.eqReadiness"
                        placeholder=''
                        :name="eqReadiness" 
                        v-if="actionMode !=='view'"/>
                 <p name="eqReadiness" v-if="actionMode =='view'">{{eqCard.eqReadiness.name}}</p>
            </div> 
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqName">Название</label> </div>
            <div class="div-90">
                <textarea name="eqName" v-if ="actionMode !=='view'" v-model="eqCard.eqName"></textarea>
                <p name="eqName" v-if="actionMode =='view'">{{eqCard.eqName}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqPurpose">Назначение</label> </div>
            <div class="div-90">
                <textarea name="eqPurpose" v-if ="actionMode !=='view'" v-model="eqCard.eqPurpose"></textarea>
                <p name="eqPurpose" v-if="actionMode =='view'">{{eqCard.eqPurpose}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqPassport">Паспортные характеристики</label> </div>
            <div class="div-90">
                <textarea name="eqPassport" v-if ="actionMode !=='view'" v-model="eqCard.eqPassport"></textarea>
                <p name="eqPassport" v-if="actionMode =='view'">{{eqCard.eqPassport}}</p>
            </div>
        </div>
        <div class="eq-card-body-item" v-if="false">
            <div class="label"><label for="eqDocumentation">Документация</label> </div>
            <div class="div-90">
                <p name="eqDocumentation" >{{eqCard.eqDocumentation}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label>Документация</label> </div>
            <div class="doc-container">
                <div class="doc-item" v-for="(doc, i) in docList">
                    <div class="doc-name">{{fileName(doc.docTypeId)!=null ? fileName(doc.docTypeId) : doc.name}}</div>
                    <div class="doc-button">
                        <a :href='doc.path' target='_blank'><i  class="fa fa-download" title="загрузить документ" ></i></a>
                        <i v-if ="addEnable" class="fa fa-trash-alt" title="удалить документ" v-on:click="$emit('deleteDoc', {idDoc: doc.idDoc})"></i>
                    </div>
                </div>
            </div>
            <div class="file-button"  v-if ="actionMode !=='view' && eqCard.id != -1"> 
                <label @click="$emit('showAddDoc')"> 
                    <i  class="fa fa-plus" title="добавить документ"></i>
                    добавить документ
                </label>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqTechState">Техническое состояние</label> </div>
            <div class="div-90">
                <textarea name="eqTechState" v-if ="actionMode !=='view'" v-model="eqCard.eqTechState"></textarea>
                <p name="eqTechState" v-if="actionMode =='view'">{{eqCard.eqTechState}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqProducer">Производитель</label></div>
            <div style="width: 65%">
                <input style="width:100%" name="eqProducer" v-model="eqCard.eqProducer" v-if="actionMode !=='view'"></input>
                <p name="eqProducer" v-if="actionMode =='view'">{{eqCard.eqProducer}}</p>
            </div>
            <div class="label"><label for="factDate">Дата выпуска</label></div>
            <div class="div-15">
                <date-picker v-model="eqCard.factDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' v-if="actionMode !=='view'"></date-picker>
                <p name="factDate" v-if="actionMode =='view'">{{eqCard.factDateFormat}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqCostKeep">Затраты на содержание в год</label> </div>
            <div class="div-15">
                <p name="eqCostKeep">{{eqCard.eqCostKeep}}</p>
            </div>
            <div class="label"><label for="eqWorkLoad">Средняя загрузка в год, %</label> </div>
            <div class="div-15">
                <p name="eqWorkLoad">{{eqCard.eqWorkLoad}}</p>
            </div>
            <div class="label"><label for="eqAtt">Аттестация от</label> </div>
            <div class="div-15">
                <p name="eqAtt">{{eqCard.eqAtt}}</p>
            </div>
            <div class="label"><label for="eqVer">Поверка до</label> </div>
            <div class="div-15">
                <p name="eqVer">{{eqCard.eqVer}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqResValue">Остаточная стоимость</label> </div>
            <div class="div-15">
                <input name="eqResValue" v-model="eqCard.eqResValue" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9.,]/g, '')"></input>
                <p name="eqResValue" v-if="actionMode =='view'">{{eqCard.eqResValue}}</p>
            </div>
            <div class="label"><label for="resValueDate">Дата определ. остат. стоимости</label> </div>
            <div class="div-15">
                <date-picker v-model="eqCard.resValueDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' v-if="actionMode !=='view'"></date-picker>
                <p name="resValueDate" v-if="actionMode =='view'">{{eqCard.resValueDateFormat}}</p>
            </div>
            <div class="label"><label for="comDate">Дата ввода в эксплуатацию</label> </div>
            <div class="div-15">
                <date-picker v-model="eqCard.comDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' v-if="actionMode !=='view'"></date-picker>
                <p name="comDate" v-if="actionMode =='view'">{{eqCard.comDateFormat}}</p>
            </div>
            <div class="label"><label for="repDate">Год послед. модернизации</label> </div>
            <div class="div-15">
                <input name="repDate" v-model="eqCard.repDate" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input>
                <p name="repDate" v-if="actionMode =='view'">{{eqCard.repDate}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqCalInterval">МПИ/МАИ (мес.)</label> </div>
            <div class="div-15">
                <input name="eqCalInterval" type="number" v-model="eqCard.eqCalInterval" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input>
                <p name="eqCalInterval" v-if="actionMode =='view'">{{eqCard.eqCalInterval}}</p>
            </div>
            <div class="label"><label for="costLaborTime">Стоимость нормо-час</label> </div>
            <div class="div-15">
                <input name="costLaborTime" v-model="eqCard.costLaborTime" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9,.]/g, '')"></input>
                <p name="costLaborTime" v-if="actionMode =='view'">{{eqCard.costLaborTime}}</p>
            </div>
            <div class="label"><label for="TOInterval">Интервал ТО (мес.)</label> </div>
            <div class="div-15">
                <input name="TOInterval" type="number" v-model="eqCard.TOInterval" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input>
                <p name="TOInterval" v-if="actionMode =='view'">{{eqCard.TOInterval}}</p>
            </div>
            <div class="label"><label for="orderTime">Мин. время заказа</label> </div>
            <div class="div-15">
                <dynamic-select 
                    :options="orderTimeList"
                    option-value="id"
                    option-text="name"
                    v-model="eqCard.orderTime"
                    placeholder=''
                    :name="orderTime" 
                    v-if="actionMode !=='view'"/>
                <p name="orderTime" v-if="actionMode =='view'">{{eqCard.orderTime.name}}</p>                            
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="div-50">
                <div class="foto_label">Фото оборудования </div>
                <div class="image-button" v-if="addEnable">
                    <input type="file" name="file" id="input__file_image" ref='fileImage' class="input input__file" accept="image/x-png,image/gif,image/jpeg" v-on:change="$emit('handleImageUpload', {imageArr: imagesEq, ref: $refs.fileImage, phototype: 1})"/>
                    <label for="input__file_image"> 
                        <i  class="fa fa-plus" title="добавить фото"></i>
                        добавить фото
                     </label>
                </div>
                <div class="image-container">
                    <div class="image-item" v-for="(image, i) in imagesEq">
                        <img class="image" :src="image" @click="indexEq = i"><i v-if="actionMode!=='view'" class='fa fa-trash-alt' title='удалить фото' @click="$emit('deleteImage', {imageArr: imagesEq, index: i, phototype: 1})"></i></img>
                    </div>
                </div>
                <vue-gallery-slideshow :images="imagesEq" :index="indexEq" @close="indexEq = null"></vue-gallery-slideshow>
            </div>
            <div class="div-50">
                <div class="foto_label">Схема расположения </div>
                <div class="image-button" v-if="addEnable">
                    <input type="file" name="file" id="input__file_loc" ref='fileLoc' class="input input__file" accept="image/x-png,image/gif,image/jpeg" v-on:change="$emit('handleImageUpload', {imageArr: imagesLoc, ref: $refs.fileLoc, phototype: 2})"/>
                    <label for="input__file_loc"> 
                        <i class="fa fa-plus" title="добавить схему"> </i>
                        добавить схему
                    </label>
                </div>
                <div class="image-container">
                    <div class="image-item" v-for="(image, i) in imagesLoc">
                        <img class="image"  :src="image" @click="indexLoc = i"><i v-if="actionMode!=='view'" class='fa fa-trash-alt' title="удалить схему" @click="$emit('deleteImage', {imageArr: imagesLoc, index: i, phototype: 2})"></i></img>
                    </div>
                </div>
                <vue-gallery-slideshow :images="imagesLoc" :index="indexLoc" @close="indexLoc = null"></vue-gallery-slideshow>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqLocation">Расположение</label> </div>
            <div class="div-90">
                <textarea name="eqLocation" v-if ="actionMode !=='view'" v-model="eqCard.eqLocation"></textarea>
                <p name="eqLocation" v-if="actionMode =='view'">{{eqCard.eqLocation}}</p>
            </div>
        </div>
        <div class="eq-card-body-item">
            <div class="label"><label for="eqNote">Примечание</label> </div>
            <div class="div-90">
                <textarea name="eqNote" v-if ="actionMode !=='view'" v-model="eqCard.eqNote"></textarea>
                <p name="eqNote" v-if="actionMode =='view'">{{eqCard.eqNote}}</p>
            </div>
        </div>
    </div>
</div>
</template>
<script>
  import DynamicSelect from 'vue-dynamic-select'
  import DatePicker from 'vue2-datepicker'
  import VueGallerySlideshow from 'vue-gallery-slideshow'
  var _ = require('lodash');

  export default {
    name:"card-equipment",
    props:  {
                eqId: {type: Number, required: true},
                eqCard: {type: Object, required: true},
                actionMode: {type: String},
                eqDevisionList: {type: Array}, 
                eqTypeList: {type: Array}, 
                eqReadinessList: {type: Array},
                docList: {type: Array}, 
                docTypeList: {type: Array}, 
                orderTimeList: {type: Array},
                responsibleList: {type: Array},
                lang: {type: Object},
                imagesEq: {type: Array},
                imagesLoc: {type: Array},
                factDate:{type: Date},
                comDate:{type: Date},
                resValueDate:{type: Date}
                
    },
    data() { 
            return { 
                 indexEq: null,
                 indexLoc: null,
                 show: false
                }
    },
    components: {
        DynamicSelect,
        DatePicker,
        VueGallerySlideshow
    },
    computed: {
        addEnable: function()
        {
            return this.actionMode!=='view' && this.eqId != -1;
        }
    },
    methods: {
        fileName: function (_id){
        let docType = _.find(this.docTypeList, {id: _id});
        if (docType) return docType.name;
        return null;
      },
    },
    mounted: function(){
    }
  }
</script>

<style lang="scss" scoped>
.eq-card-body
  {
    width: 100%;
    padding-right: 1rem;
  }
  .eq-card-body-item{
     width: 100%;
     display: flex;
     padding: .1rem 0;
  }
  .eq-card-body label {
    display: inline-block;
    margin-left: auto;
    margin-right: .5em;
  }
  .foto_label {
    display: inline-block;
    margin-left: .5em;
    margin-right: auto;
    text-align: left;
    width: 20em;
  }
  .image-button, 
  .file-button{
    display: inline-block;
    margin-right: .5em;
    margin-left: auto;
    text-align: right;
    color:#337ab7;
  }
  .image-button label:hover,
  .file-button label:hover{
    cursor: pointer;
    color: #ed9b19;
  }
  .eq-card-body input,
  .eq-card-body span {
    border: 1px solid #ced4da;
    position: relative;
    border-radius: .25em;
    cursor: text;
    //display: inline;
    width: 100%;
  }
  .eq-card-body textarea,
  .eq-card-body p {
    border: 1px solid #ced4da;
    position: relative;
    border-radius: .25em;
    cursor: text;
    width: 100%;
    min-height: 2em;
    text-align: left;
  }
  .div-15{
    display: inline-block;
    width: 15%;
  }
  .label{
    width: 10%;
    text-align: right;
  }
  .div-25{
    display: inline-block;
    width: 25%;
  }
   .div-50{
    display: inline-block;
    width: 50%;

  }
  .div-60{
    display: inline-block;
    width: 60%;
  }
  .div-90{
    display: inline-block;
    width: 90%;
  }
  .mx-datepicker{
    width: 100%;
  }
  .image-container
  {
    display: flex;
    overflow: auto;
   
  }
  .doc-container
  {
    max-height: 7vh;
    display: inline-block;
    overflow: auto;
    margin-left: 5em;
    width: 70%;
  }
  .image-item
  {
     margin-left: .5em;
     display: flex;
  }
   .doc-item
  {
     margin-left: .5em;
     display: flex;
  }
  .image
  {
    width: 7em;
  }
  .image-item i,
  .doc-item
  {
    vertical-align: top;
    color: #337ab7;
  }
  .image-item i:hover,
  .doc-item:hover
  {
    cursor: pointer;
     color: #ed9b19;
  }

.input__file {
  opacity: 0;
  visibility: hidden;
  display: none;
  position: absolute;
}
.doc-name{
  width:90%;
}
.doc-button
{
    display: flex;
    justify-content: flex-end;
    margin-right: .5em;
}
.doc-button i
{
  color: #337ab7;
  padding-right: 1.5em;
  padding-left: 1.5em;
}
.doc-button i:hover{
    color: #ed9b19;
}



</style>