<template lang="html">
<div>
   
    <div class="eq-card-content eq-card-container">
        <div class="eq-card-col-50 eq-card-container">
            <div class="eq-card-label"><label class="mb-0">Наименование оборудования</label></div>
            <div class="eq-card-item"> 
                <textarea name="eqName" v-if ="actionMode !=='view'" v-model="eqCard.eqName"></textarea>
                <p name="eqName" v-if="actionMode =='view'">{{eqCard.eqName}}</p>
            </div>
        </div>
        <div class="eq-card-col-50 eq-card-container">
            <div class="eq-card-label"><label class="mb-0">Категория</label></div>
            <div class="eq-card-item">
                <dynamic-select 
                    :options="eqTypeList"
                    option-value="id"
                    option-text="name"
                    v-model="eqCard.eqType"
                    placeholder=''
                    v-if="actionMode !=='view'"/>
                <p name="eqType" v-if="actionMode =='view'">{{eqCard.eqType.name}}</p>
            </div>
            <div class="eq-card-label"><label class="mb-0">Ответственный</label></div>
            <div class="eq-card-item">
                <dynamic-select 
                    :options="responsibleList"
                        option-value="id"
                        option-text="name"
                        v-model="eqCard.responsible"
                        placeholder=''
                        v-if="actionMode !=='view'"/>
                 <p name="responsible" v-if="actionMode =='view'">{{eqCard.responsible.name}}</p>
            </div>
        </div>
        <div class="eq-card-col-50 eq-card-container">
            <div class="eq-card-label"><label class="mb-0">Назначение</label></div>
            <div class="eq-card-item">
                 <textarea name="eqPurpose" v-if ="actionMode !=='view'" v-model="eqCard.eqPurpose"></textarea>
                <p name="eqPurpose" v-if="actionMode =='view'">{{eqCard.eqPurpose}}</p>
            </div>
        </div>
        <div class="eq-card-col-50 eq-card-container">
            <div class="eq-card-col-30">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Год выпуска</label></div>
                <div class="eq-card-item eq-card-small">
                    <date-picker v-model="eqCard.factDate" 
                    :lang="lang" 
                    format='YYYY' 
                    popup-class='calPopup' 
                    type="year"
                    v-if="actionMode !=='view'"></date-picker>
                    <p name="factDate" v-if="actionMode =='view'">{{eqCard.factDateFormat}}</p>
                </div>
            </div>
            <div class="eq-card-col-30">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Год ввода в эксплуатацию</label></div>
                <div class="eq-card-item eq-card-small">
                     <date-picker v-model="eqCard.comDate" 
                     :lang="lang" 
                     format='YYYY' 
                     popup-class='calPopup'
                     type="year"
                      v-if="actionMode !=='view'"></date-picker>
                    <p name="comDate" v-if="actionMode =='view'">{{eqCard.comDateFormat}}</p>
                </div>
            </div>
            <div class="eq-card-col-30">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Год последней модернизации</label></div>
                <div class="eq-card-item eq-card-small">
                     <!-- <input name="repDate" v-model="eqCard.repDate" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input>
                    <p name="repDate" v-if="actionMode =='view'">{{eqCard.repDate}}</p> -->
                     <p name="repDate">{{eqCard.repDateFormat}}</p>
                </div>
            </div>
           
        </div>
        <div class="eq-card-col-50 eq-card-container">
            <div class="eq-card-label"><label class="mb-0">Паспортные характеристики</label></div>
            <div class="eq-card-item"> 
                <textarea name="eqPassport" v-if ="actionMode !=='view'" v-model="eqCard.eqPassport"></textarea>
                <p name="eqPassport" v-if="actionMode =='view'">{{eqCard.eqPassport}}</p>
            </div>
        </div>
        <div class="eq-card-col-50 eq-card-container">
             <div class="eq-card-label"><label class="mb-0">Техническое состояние</label></div>
            <div class="eq-card-item">
                 <!-- <input name="eqTechState" v-if ="actionMode !=='view'" v-model="eqCard.eqTechState"></input>
                <p name="eqTechState" v-if="actionMode =='view'">{{eqCard.eqTechState}}</p> -->
                <dynamic-select 
                    :options="eqReadinessList"
                        option-value="id"
                        option-text="name"
                        v-model="eqCard.eqReadiness"
                        placeholder=''
                        v-if="actionMode !=='view'"/>
                 <p name="eqReadiness" v-if="actionMode =='view'">{{eqCard.eqReadiness.name}}</p>
            </div>
            <div class="eq-card-label"><label class="mb-0">Производитель</label></div>
            <div class="eq-card-item"> 
                <input style="width:100%" type="text" name="eqProducer" v-model="eqCard.eqProducer" v-if="actionMode !=='view'"></input>
                <p name="eqProducer" v-if="actionMode =='view'">{{eqCard.eqProducer}}</p>
            </div>
        </div>
        <div class="eq-card-col-100 eq-card-container-doc">
        <div class="eq-card-label"><label class="mb-0">Наличие техдокументации</label></div>
            <!-- <div class="eq-card-item"> -->
                <div class="eq-card-file-button" v-if="addEnable"> 
                    <label @click="$emit('showAddDoc')"> 
                        <i  class="fa fa-plus" title="добавить документ"></i>
                        добавить документ
                    </label>
                </div>
                <input type="file" name="file" id="input__file_doc" ref='fileDoc' class="eq-card-input-file" v-on:change="handleFileDocUpload()"/>
                <div class="eq-card-col-30-doc" v-for="(doc, i) in docList">
                    <!-- <div class="doc-container"> -->
                        <div class="doc-item">
                            <div class="doc-name">{{fileName(doc.docTypeId)!=null ? fileName(doc.docTypeId) : doc.name}}</div>
                            <div class="doc-button">
                                <a v-if="doc.path !== ''" :href='doc.path' target='_blank'><i  class="fa fa-download" title="скачать документ" ></i></a>
                                <label v-if ="addEnable && doc.path === ''" for="input__file_doc" class="mb-0 label-file">
                                    <i  class="fa fa-upload" title="загрузить документ" @click="addDocClick({idDoc: doc.idDoc})"></i>
                                </label>
                                <label class="mb-0">
                                    <i v-if ="addEnable" class="fa fa-trash-alt" title="удалить документ" v-on:click="$emit('deleteDoc', {idDoc: doc.idDoc})"></i>
                                </label>
                            </div>
                        </div>
                    <!-- </div> -->
                </div>
            <!-- </div> -->
        </div>


         <div class="eq-card-col-100 eq-card-container">
              <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Номер в госреестре</label></label></div>
                <div class="eq-card-item eq-card-small"> 
                    <input type="text" v-model="eqCard.regNum" v-if="actionMode !=='view'"></input>
                    <p name="regNum" v-if="actionMode =='view'">{{eqCard.regNum}}</p>
                </div>
            </div>
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Аттестация от</label></div>
                <div class="eq-card-item eq-card-small"> <p name="eqAtt">{{eqCard.eqAtt}}</p></div>
            </div>
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Поверка до</label></div>
                <div class="eq-card-item eq-card-small"><p name="eqVer">{{eqCard.eqVer}}</p></div>
            </div>
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">МПИ/МАИ (мес.)</label></div>
                <div class="eq-card-item eq-card-small"> 
                    <input name="eqCalInterval" type="number" v-model="eqCard.eqCalInterval" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input>
                    <p name="eqCalInterval" v-if="actionMode =='view'">{{eqCard.eqCalInterval}}</p>
                </div>
            </div>
        </div>
        <div class="eq-card-col-100 eq-card-container">
              <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Остаточная стоимость, ₽</label></label></div>
                <div class="eq-card-item eq-card-small">
                    <input type="text" name="eqResValue" v-model="eqCard.eqResValue" v-if="actionMode !=='view'"
                     @keyup="eqCard.eqResValue = toFloatView(eqCard.eqResValue)" 
                     @focus="eqCard.eqResValue = toFloatView(eqCard.eqResValue)" 
                     @blur="eqCard.eqResValue = toCost(eqCard.eqResValue)"></input>
                    <p name="eqResValue" v-if="actionMode =='view'">{{eqCard.eqResValue}}</p>
                </div>
            </div>
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Дата определ. остат. стоимости</label></div>
                <div class="eq-card-item eq-card-small">
                     <date-picker v-model="eqCard.resValueDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' v-if="actionMode !=='view'"></date-picker>
                   <p name="resValueDate" v-if="actionMode =='view'">{{eqCard.resValueDateFormat}}</p>
                </div>
            </div>
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Затраты на содержание</label></div>
                <div class="eq-card-item eq-card-small"> <p name="eqCostKeep">{{eqCard.eqCostKeep}}</p></div>
            </div>
             <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Стоимость нормо-часа, ₽</label></label></div>
                <div class="eq-card-item eq-card-small">
                    <input type="text" name="costLaborTime" v-model="eqCard.costLaborTime" v-if="actionMode !=='view'" 
                    @keyup="eqCard.costLaborTime = toFloatView(eqCard.costLaborTime)" 
                    @focus="eqCard.costLaborTime = toFloatView(eqCard.costLaborTime)" 
                    @blur="eqCard.costLaborTime = toCost(eqCard.costLaborTime)"></input>
                    <p name="costLaborTime" v-if="actionMode =='view'">{{eqCard.costLaborTime}}</p>
                </div>
            </div>
        </div>
        <div class="eq-card-col-100 eq-card-container">
             
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Минимальное время заказа</label></div>
                <div class="eq-card-item eq-card-small"> 
                    <dynamic-select 
                        :options="orderTimeList"
                        option-value="id"
                        option-text="name"
                        v-model="eqCard.orderTime"
                        placeholder=''
                        v-if="actionMode !=='view'"/>
                    <p name="orderTime" v-if="actionMode =='view'">{{eqCard.orderTime.name}}</p>         
            </div>
            </div>
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Режим работы</label></div>
                <div class="eq-card-item eq-card-small">
                    <dynamic-select 
                        :options="workingModeList"
                        option-value="id"
                        option-text="name"
                        v-model="eqCard.workingMode"
                        placeholder=''
                        v-if="actionMode !=='view'"/>
                    <p name="workingMode" v-if="actionMode =='view'">{{eqCard.workingMode.name}}</p>             
                </div>
            </div>
            <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Интервал ТО</label></div>
                <div class="eq-card-item eq-card-small">
                    <input name="TOInterval" type="number" v-model="eqCard.TOInterval" v-if="actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input>
                    <p name="TOInterval" v-if="actionMode =='view'"><span>{{eqCard.TOInterval}}</span></p>
                </div>
            </div>
             <div class="eq-card-col-25">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Наличие в паспорте ИЦ</label></div>
                <div class="eq-card-item eq-card-small">
                    <div class="checkbox"> 
                        <input id="inPassport"  type="checkbox"  v-model="eqCard.inPassport" :disabled="actionMode =='view'"></input>
                        <label for="inPassport"></label>
                        <!-- <p name="inPassport" v-if="actionMode =='view'">{{eqCard.inPassport}}</p> -->
                    </div>
                </div>
            </div>
              <div class="eq-card-col-50">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Примечание</label></div>
                <div class="eq-card-item eq-card-small">
                    <input type="text" name="eqNote" v-if ="actionMode !=='view'" v-model="eqCard.eqNote"></input>
                    <p name="eqNote" v-if="actionMode =='view'">{{eqCard.eqNote}}</p>
                </div>
            </div>
              <div class="eq-card-col-50">
                <div class="eq-card-label eq-card-small"><label class="mb-0">Адрес местоположения</label></div>
                <div class="eq-card-item eq-card-small">
                    <input type="text" name="placeAddr" v-if ="actionMode !=='view'" v-model="eqCard.placeAddr"></input>
                    <p name="placeAddr" v-if="actionMode =='view'">{{eqCard.placeAddr}}</p>
                </div>
            </div>
        </div>
         <div class="eq-card-col-100 eq-card-top-container">
            <div class="eq-card-col-50" v-if="addEnable">
                <div class="eq-card-label"><label class="mb-0">Фото оборудования</label></div>
                <div class="eq-card-item-image">
                    <div class="eq-card-image-button">
                        <input type="file" name="file" id="input__file_image" ref='fileImage' class="eq-card-input-file" accept="image/x-png,image/gif,image/jpeg" v-on:change="$emit('handleImageUpload', {imageArr: imagesEq, ref: $refs.fileImage, phototype: 1})"/>
                        <label for="input__file_image"> 
                            <i  class="fa fa-plus" title="добавить фото"></i>
                            добавить фото
                        </label>
                    </div>
                    <div class="image-container">
                        <div class="image-item" v-for="(image, i) in imagesEq">
                            <img class="image" :src="image" @click="showImg(i)"><i v-if="actionMode!=='view'" class='fa fa-trash-alt' title='удалить фото' @click="$emit('deleteImage', {imageArr: imagesEq, index: i, phototype: 1})"></i></img>
                        </div>
                    </div>
                </div>
                
            </div>
            <vue-gallery-slideshow :images="imagesEq" :index="indexEq" @close="indexEq = null"></vue-gallery-slideshow>
            <div class="eq-card-col-50" v-if="addEnable">
                <div class="eq-card-label"><label class="mb-0">Схема расположения</label></div>
                <div class="eq-card-item-image">
                    <div class="eq-card-image-button">
                        <input type="file" name="file" id="input__file_loc" ref='fileLoc' class="eq-card-input-file" accept="image/x-png,image/gif,image/jpeg" v-on:change="$emit('handleImageUpload', {imageArr: imagesLoc, ref: $refs.fileLoc, phototype: 2})"/>
                        <label for="input__file_loc"> 
                            <i class="fa fa-plus" title="добавить схему"> </i>
                            добавить схему
                        </label>
                    </div>
                    <div class="image-container">
                        <div class="image-item" v-for="(image, i) in imagesLoc">
                            <img class="image"  :src="image" @click="showLoc(i)"><i v-if="actionMode!=='view'" class='fa fa-trash-alt' title="удалить схему" @click="$emit('deleteImage', {imageArr: imagesLoc, index: i, phototype: 2})"></i></img>
                        </div>
                    </div>
                    <vue-gallery-slideshow :images="imagesLoc" :index="indexLoc" @close="indexLoc = null"></vue-gallery-slideshow>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
  import DynamicSelect from 'vue-dynamic-select'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/locale/ru'
  import VueGallerySlideshow from 'vue-gallery-slideshow'
  import {toCost, toFloatView} from '../utils/commonJS'
  
  var _ = require('lodash');

$(window).on('resize', function(){

    let header = $('.eq-card-header').height();
    let footer = $('.eq-card-footer').height();
    let tabs = $('.tabs').height();
     $('.content ').css("height", ($(window).height() - header - footer - tabs) -120 + 'px');

     let img = $('.vgs__container__img');
     if ( $('.vgs__close').length > 0  && img.length > 0)
     {  
        if ($('.vgs__container').length > 0) $('.vgs__container').css({top: 0, marginTop: 0});
        $('.vgs__close').css({top: img.offset().top, left: img.offset().left + img.width() -  $('.vgs__close').width() - 12});
     }
      
});
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
                workingModeList: {type: Array},
                responsibleList: {type: Array},
                lang: {type: Object},
                imagesEq: {type: Array},
                 imagesLoc: {type: Array}
                
    },
    data() { 
            return { 
                 indexEq: null,
                 indexLoc: null,
                 show: false,
                 currentIdDoc: '',
                 fileDoc: ''
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
        showLoc(i){ 
            this.indexLoc = i;
            this.renderButtonVGSClose();
        },
         showImg(i){ 
            this.indexEq = i;
            this.renderButtonVGSClose();
           
         }, 
         renderButtonVGSClose(){
            setTimeout(() => { 
            if ($('.vgs__container').length > 0) $('.vgs__container').css({top: 0, marginTop: 0});
            let img = $('.vgs__container__img');
             $('.vgs__close').css({top: img.offset().top, left: img.offset().left + img.width()-  $('.vgs__close').width() - 12});
            $('.vgs__close').html('X закрыть')
            
            }, 100);
         },

        fileName: function (_id){
        let docType = _.find(this.docTypeList, {id: _id});
        if (docType) return docType.name;
        return null;
      },
      toFloatView: function(target){
            return toFloatView(target);
      },
      toCost: function(target){
            return toCost(target);
      },
        addDocClick(params){
            this.currentIdDoc = params.idDoc;
       },
       handleFileDocUpload(){
           this.fileDoc = this.$refs.fileDoc.files[0];
           if(this.fileDoc !== '')
                this.$emit('handleFileDocUpload', {idDoc: this.currentIdDoc, ref: this.$refs.fileDoc});

       }

    },
    mounted: function(){
        let header = $('.eq-card-header').height();
        let footer = $('.eq-card-footer').height();
        let tabs = $('.tabs').height();
        $('.content ').css("height", ($(window).height() - header - footer - tabs) -120 + 'px');
    }
  }
</script>

<style lang="scss" scoped>
.eq-card-content{
    width: 100%;
    text-align: center;
}
.eq-card-container,
.eq-card-container-doc,
.eq-card-container-single {
  display: flex;
   flex-wrap: wrap;
   align-items: flex-end;
}
.eq-card-container-single{
    align-items: flex-start
}
.eq-card-container-doc {
    justify-content: left;
    align-items:flex-start;
}
.eq-card-top-container {
  display: flex;
   flex-wrap: wrap;
   align-items: flex-start;
}
.eq-card-col-100{
   width: 100%;//calc(100% - 1px);
    text-align: center;
}
.eq-card-col-50{
   
   width: 50%;//calc(50% - 1px);
   min-width: 360px;
    text-align: center;
}
.eq-card-col-30{
   display: inline-block;
   width: 33%;
   min-width: 120px;
    text-align: center;
}
.eq-card-col-30-doc{
     display: inline-block;
    width: 33%;
     border: 1px solid #E21A1A;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
    margin-bottom:.25em;
    margin-left:.25em;
    padding: .25em;
 
}
.eq-card-col-25{
   display: inline-block;
   width: 25%;
   min-width: 150px;
    text-align: center;
}
.eq-card-label {
    display: inline-block;
    min-width: 300px;
    width: 100%;
    text-align: left;
    color:#000000;
    font-size: 12pt;
    padding-top: .5em;
    padding-left: 15px;
  }
  .eq-card-item,
  .eq-card-item-image {
      display: block;
      width: 100%;
      min-width: 300px;
      padding-left: 15px;
      padding-right: 15px;
  }
.eq-card-small {
    min-width: 120px;
}

.eq-card-item select,
.eq-card-item input[type=text],
.eq-card-item input[type=number],
.eq-card-item textarea,
.eq-card-item p
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
     padding-left: 5px;
  }
.checkbox{
    height: 40px;
}

  .eq-card-item  p
  {
      margin: 0;
      padding-left: 5px;
      color: #000000;
  }
  .eq-card-image-button,
  .eq-card-file-button{
      width: 100%;
      margin-right: .5em;
      margin-left: auto;
      text-align: right;
      color:#E21A1A
  }
  .eq-card-image-button label:hover,
  .eq-card-file-button label:hover{
    cursor: pointer;
    color: #000000;
  }
 
.eq-card-item textarea{
    height: 100px;
}
.eq-card-input-file {
  opacity: 0;
  display: none;
  position: absolute;
  height: 0px;
}

  .image-container
  {
    display: flex;
    overflow: auto;
    flex-wrap: nowrap;
    justify-content:flex-start;
    align-items: flex-start;
  }
  .doc-container{
    display: block;
    overflow: auto;
    width: 100%;
  }
  .image-item
  {
     margin-left: .5em;
     width: 100%;
     min-width: 350px;
     display: inline-block;
  }
  .doc-item{
     width: 100%;
     min-width: 200px;
     display: flex;
    flex-wrap: nowrap;
    justify-content:flex-start;
    align-items: flex-start;
  }

  .image
  {
    width: 90%;
    min-width:300px;
  }
  .image-item i,
  .doc-item
  {
    vertical-align: top;
    color: #E21A1A
  }
  .image-item i:hover,
  .doc-item:hover
  {
    cursor: pointer;
     color: #000000;
  }

.input__file {
  opacity: 0;
  display: none;
  position: absolute;
}
.doc-name{
  width:80%;
  min-width:150px;
  text-align: left;
}
.doc-button
{
    display: flex;
    justify-content: flex-end;
    margin-left: .5em;
}
.doc-button i
{
  color: #E21A1A;
  padding-right: 1.5em;
  padding-left: 1.5em;
}
.doc-button i:hover{
    color: #000000
}
 img {
    max-width: 100%;
    height: auto;
    width: auto\9; /* ie8 */
 }


@media screen and (max-width: 900px) {
    .eq-card-col-50{
        width: 100%;
    }
    .eq-card-col-100{
        width: 100%;
    }
    .eq-card-item textarea{
        height: 50px;
    }
  .eq-card-small label {
     font-size: 10pt;
    }
    .eq-card-col-25{
        width: 49%;
    }
    
    
}
@media screen and (max-width: 1200px) {
    .image-container
    {
         flex-wrap: wrap;
    }
    .eq-card-col-30-doc{
        width: 100%;
    }
}
@media (max-width: 767px){
.vgs__container {
    top: 0% !important;
}
}

@media screen and (max-width: 480px) {
   html {
      -webkit-text-size-adjust: none;
   }
}

// .eq-card-item select:focus, 
// .eq-card-item textarea:focus, 
// .eq-card-item input:focus {
//     outline-style: solid;
//     outline-width: .5px !important;
//     outline-color: #337ab7 !important;
// }


  .mx-datepicker{
    width: 100%;
  }




</style>