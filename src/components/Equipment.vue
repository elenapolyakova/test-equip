<template lang="html">
  <div class="vld-parent">
    <loading :active.sync="isLoading"
    :can-cancel="false"
    :is-full-page="true"
    color='#337ab7'>
    </loading>
   <filter-equipment 
                  @filterData="filterData"
                   :fData="fData" 
                  :eqNameList="eqNameList"
                  :eqDevisionList="eqDevisionList"
                  :eqTypeList="eqTypeList"
                  :eqProducerList="eqProducerList"
                  :eqReadinessList="eqReadinessList"
                   :responsibleList="responsibleList"
                  :lang="lang"
                  :hasExtended="true">
   </filter-equipment> 
      <div class="eqContent">
        <div v-if="rights.add">
            <button class="add-button" @click="actionAddClick"><i class='fa fa-plus'> </i> Добавить оборудование</button></td>
        </div>
        <DataTable
            :header-fields="headerFields"
            :data="eqData || []"
            :is-loading="isLoading"
            :css="datatableCss"
            @on-update="dtUpdateSort"> 
          <template v-slot:actionsView="props">
              <button class="btn btn-act" @click="actionViewClick(props);" title='просмотр карточки'><i class = 'fa fa-search'></i></button>
          </template>
          <template v-slot:actionsEdit="props">
              <button class="btn btn-act" @click="actionEditClick(props);" title='редактировать'><i class = 'fa fa-edit'></i></button>
          </template>
           <template v-slot:actionsCopy="props">
              <button class="btn btn-act" @click="actionCopyClick(props);" title='дублировать'><i class = 'fa fa-copy'></i></button>
          </template>
          <template v-slot:actionsDelete="props">
              <button class="btn btn-act" @click="actionDeleteClick(props);" title='удалить'><i class = 'fa fa-trash-alt'></i></button>
          </template>
        </DataTable>
      </div>

       <stack-modal
                :show="showEqCard"
                @close="closeModal"
                :modal-class="{[modalClass]: true}"
                :saveButton= "{title: 'Сохранить'}"
                :cancelButton= "{title: 'Отмена'}"
                >
           <div slot="modal-header">
              <div class="eq-card-header eq-card-header-container">
                <div class="eq-card-col-25">
                  <label for="cardNum">Карточка №</label>
                    <input name="cardNum" v-model="eqCard.cardNum" v-if="activetab === 0 && actionMode !=='view'"></input>
                    <p name="cardNum" v-if="actionMode =='view' || activetab !== 0 ">{{eqCard.cardNum}}</p>
                </div>
                <div class="eq-card-col-25">
                  <label for="invNum">Инвентарный №</label>
                    <input name="invNum" v-model="eqCard.invNum" v-if="activetab === 0 && actionMode !=='view'" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input>
                    <p name="invNum" v-if="actionMode =='view' || activetab !== 0 ">{{eqCard.invNum}}</p>
                </div>
                 <div class="eq-card-col-25">
                  <label for="invNum">Подразделение</label>
                    <div class="eq-card-dyn-select"  v-if="activetab === 0 && actionMode !=='view'">
                      <dynamic-select 
                        :options="eqDevisionList"
                        option-value="id"
                        option-text="name"
                        placeholder=''
                        v-model="eqCard.devision" />
                    </div>
                  <p name="devision" v-if="actionMode =='view' || activetab !== 0">{{eqCard.devision.name}}</p>
                </div>
                 <div class="eq-card-col-25">
                  <label for="invNum">Расположение</label>
                   <input name="eqLocation" v-if="activetab === 0 && actionMode !=='view'" v-model="eqCard.eqLocation"></input>
                    <p name="eqLocation" v-if="actionMode =='view' || activetab !== 0">{{eqCard.eqLocation}}</p>
                </div>
              </div>
           </div>   
           <div id="tabs" class="container">
              <div class="tabs">
                  <a @click="activetab=0" :class="[activetab === 0 ? 'active' : '']">Карточка оборудования</a>
                  <a @click="activetab=1" :class="[activetab === 1 ? 'active' : '']" v-if="eqCard.id !== -1 && hasRight('q')">Заявки</a>
                  <a @click="activetab=2" :class="[activetab === 2 ? 'active' : '']" v-if="eqCard.id !== -1 && hasRight('rep')">Ремонты</a>
                  <a @click="activetab=3" :class="[activetab === 3 ? 'active' : '']" v-if="eqCard.id !== -1 && hasRight('met')">Метрология</a>
              </div>
              <div class='content'>
                <div v-if="activetab===0" class='tabcontent'>
                  <card-equipment
                            @handleFileUpload="handleFileUpload"
                            @deleteDoc="deleteDoc"
                            @handleImageUpload="handleImageUpload"
                            @deleteImage="deleteImage"
                            @showAddDoc="showModalDoc"
                            :eqId="eqCard.id"
                            :eqCard="eqCard"
                            :actionMode="actionMode"
                            :eqDevisionList="eqDevisionList"
                            :eqTypeList="eqTypeList"
                            :eqReadinessList="eqReadinessList"
                            :responsibleList="responsibleList"
                            :docList="docList"
                            :docTypeList="docTypeList"
                            :orderTimeList="orderTimeList"
                            :workingModeList="workingModeList"
                            :imagesEq="imagesEq"
                            :imagesLoc="imagesLoc"
                            :lang="lang"/>
                  </div>
                  <div v-if="activetab===1" class='tabcontent'>
                      		<Schedule  :eqId="eqCard.id"
                                    :workingMode="workingMode"
                                     @editQuery="editQuery"
                                     @addQuery="addQuery"
                                     :updatedQueryData="updatedQueryData"
                                     @loading="loadingSchedule">
                          </Schedule>	
                  </div>
                  <div v-if="activetab===2" class='tabcontent'>
                        <repair :idEq="eqCard.id"
                                @loading="loading"></repair>
                  </div>
                  <div v-if="activetab===3" class='tabcontent'>
                      <metrology :idEq="eqCard.id"
                                @loading="loading"></metrology>

                  </div>
              </div>
          </div>  
             <div slot="modal-footer">
               <div class ="eq-card-footer">
                <button class="modal-button"  v-if="actionMode !=='view' && activetab===0" @click = 'saveModal' title='сохранить'><i class = 'fa fa-save'></i> Сохранить</button>
                <button class="modal-button" @click = "closeModal" title='закрыть'><i class = 'fa fa-times'></i> Закрыть</button>
              </div>
          </div> 
    
        </stack-modal> 
         <stack-modal
                    :show="showAddDoc"
                    @close="showAddDoc=false"
                    :modal-class="{[modal2Class]: true}"
                    :saveButton= "{title: 'Сохранить'}"
                    :cancelButton= "{title: 'Отмена'}"
                    >
            <div slot="modal-header"></div>
            <div class='add_document_content'>
              <div class="label"> Тип документа</div>
              <select v-model="selectedDocType" onchange="$('.modal-doc-error').html('').removeClass('has-error')">
                <option disabled value="">Не выбрано</option>
                <option v-for="docType in docTypeList" :value="docType.id">
                    {{docType.name}}
                </option>
              </select>
              <input type="file" name="file" id="input__file" ref='file' class="input input__file" v-on:change='handleFileUpload'/>
              <!-- accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*" -->
              <label for="input__file" class="label-file">
                <i class="fa fa-upload"></i>
                <span class="js-fileName">Загрузить файл</span>
              </label>
            </div>
            <div slot="modal-footer">
              <div class ="eq-add-doc-footer">
                <label class='modal-doc-error'></label>
                <button class="modal-button"  @click='submitFile' title='сохранить'><i class = 'fa fa-save'></i> Сохранить</button>
                <button class="modal-button" @click='showAddDoc=false' title='закрыть'><i class = 'fa fa-times'></i> Закрыть</button>
              </div>
            </div>

        </stack-modal>
        <card-query
                    :queryData="queryData"
                    :showQueryCard="showQueryCard"
                     @save="saveCardQuery"
                     @delete="deleteCardQuery"
                     @close="closeCardQuery"
                    @loading="loading"
          ></card-query>
  </div>
</template>

<script>
  import FilterEquipment from './FilterEquipment'
  import CardEquipment from './CardEquipment'
  import Repair from './Repair'
  import Metrology from './Metrology'
  import Loading from 'vue-loading-overlay'
  import { DataTable } from 'v-datatable-light'
  import StackModal from '@innologica/vue-stackable-modal'
  import {getFunRight, hasRight}  from "../utils/right";
  import api from "../utils/api";
  import {endpoint} from '../utils/config'
  import {formatDate, dateFromString} from '../utils/date'
  import {getEqReadiness, getOrderTime, getDocType, getWorkingMode, getOrderTimeHours} from '../utils/dictionary'
  import Schedule from './Schedule'
  import CardQuery from './CardQuery'
  import {toCost, toFloat} from '../utils/commonJS'
  import DynamicSelect from 'vue-dynamic-select'

  import 'vue2-datepicker/index.css'
  import '../css/v-datatable-light.css'
  import '../css/stackable-modal.scss'
  import '../css/tab-pages.css'
  import 'vue-loading-overlay/dist/vue-loading.css'


  export default {
    name: 'equipment',
    components:  {
      FilterEquipment,
      CardEquipment,
      DataTable,
      StackModal,
      Repair,
      Metrology,
      Loading,
      Schedule, 
      CardQuery,
      DynamicSelect

    },
    data() {
      return {
        
        eqInitialList: [],

        //dictionary
        eqNameList:[],
        eqDevisionList: [],
        eqTypeList: [],
        eqProducerList: [],
        eqReadinessList:[],
        orderTimeList:[],
        workingModeList:[],
        docTypeList: [],
        responsibleList: [],
        
        //filter
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

        //список оборудования
        eqData:  [],
        eqDataItem: {},

        //карточка оборудования
        eqCard: {id: -1},
        lang: {
          days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
          pickers: ['след 7 дней', 'след 30 дней', 'пред 7 дней', 'пред 30 дней'],
          placeholder: {
            date: 'Выберите дату',
            dateRange: 'Выберите период'
          },
       },
       headerFields: [
          "__slot:actions:actionsView",
          "__slot:actions:actionsEdit",
          "__slot:actions:actionsCopy",
          "__slot:actions:actionsDelete",
          { name: "cardNum", label: "Номер карточки" /*, format: formatDate*/,  sortable: true },
          { name: "invNum", label: "Инвентарный номер",  sortable: true },
          { name: "eqDevisionName", label: "Подразделение",  sortable: true },
          { name: "eqName", label: "Наименование",  sortable: true} ,
          { name: "eqTypeName", label: "Вид/категория",  sortable: true },
          { name: "eqProducer", label: "Производитель",  sortable: true },
          { name: "factNum", label: "Заводской номер",  sortable: true },
          { name: "factDateFormat", label: "Дата выпуска", sortable: true },
          { name: "comDateFormat", label: "Дата ввода в эксплуатацию", sortable: true },
          { name: "repDate", label: "Год последней модернизации",  sortable: true },
          { name: "responsibleName", label: "Ответственный",  sortable: true },
          { name: "eqReadinessName", label: "Готовность",  sortable: true }
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center equipment-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
       imagesEq:[],
       imagesLoc:[],
       imagesEqList: [],
       imagesLocList: [],
       docList: [],
       isLoading: false,
       isLoadingData: false,
       isLoadingSchedule: false,
       showEqCard: false,
       modalClass: 'modal-90per',
       modal2Class: 'modal-xl',
       activetab: 0,
       file: '',
       rights: {},
       actionMode: '',
       sort: 'asc',
       showAddDoc: false,
       selectedDocType: '',
       funShortName: 'eq',
       showQueryCard: false,
       updatedQueryData: {},
       queryId: -1,
       orderTimeHours: 0,
       workingMode: 1,
       queryData: {}
      }
 
    }, 
    props:
      {

    },
    watch:{
      
    },
    computed: {
     
    },
    methods: {
    
      initData: function(){
        this.isLoading = true;

         api().
          get('/dictionary')
          .then(response => {
            let dict = response.data;
            this.eqDevisionList =  dict.divisionList;
            this.eqTypeList = dict.eqTypeList;
            this.responsibleList = dict.userList;
            this.responsibleList.forEach(item => item.name =`${item.us_surname} ${item.us_name} ${item.us_patname}`);
            this.eqReadinessList = getEqReadiness();
            this.orderTimeList = getOrderTime();
            this.workingModeList = getWorkingMode();
            this.docTypeList = getDocType();
            api().
              get('/equipment')
              .then(response => 
              {
                let data = response.data;
                data.forEach(item =>
                {
                   let eqItem = {};
                    eqItem.id = item.id_eq;
                    eqItem.cardNum = item.card_num ? item.card_num.trim() : '';
                    eqItem.invNum = item.inv_num ? item.inv_num.trim() : '';
                    eqItem.eqName = item.eqname ? item.eqname.trim() : '';
                    eqItem.devision = item.id_dicdev_dicdevision;
                    eqItem.eqDevisionName = this.eqDevisionName(eqItem.devision);
                    eqItem.eqType = item.id_eqtype_diceqtype;
                    eqItem.eqTypeName = this.eqTypeName(eqItem.eqType);
                    eqItem.eqProducer = item.eqproducer ? item.eqproducer.trim() : '';
                    eqItem.comDate =  item.eq_comdate ? new Date(item.eq_comdate) : '';
                    eqItem.comDateFormat	= formatDate(eqItem.comDate);
                    eqItem.factNum = item.fact_num ? item.fact_num.trim() : '';
                    eqItem.factDate = item.fact_date ? new Date(item.fact_date) : '';
                    eqItem.factDateFormat	= formatDate(eqItem.factDate);
                    eqItem.responsible = item.id_respose_man;
                    eqItem.responsibleName = this.responsibleName(eqItem.responsible);
                    eqItem.eqReadiness = item.is_ready;
                    eqItem.eqReadinessName	= this.eqReadinessName(eqItem.eqReadiness);
                    eqItem.eqPurpose = item.eqpurpose ? item.eqpurpose.trim() : '';
                    eqItem.eqPassport = item.eqpassport ? item.eqpassport.trim() : '';
                    eqItem.eqTechState = item.condition ? item.condition.trim() : '';
                    eqItem.regNum = item.reg_num ? item.reg_num.trim() : '';
                    eqItem.eqCalInterval = item.mpi_mai;
                    eqItem.eqResValue = toCost(item.eqprice);
                    eqItem.resValueDate = item.price_date ? new Date(item.price_date) : '';
                    eqItem.costLaborTime = toCost(item.hourprice);
                    eqItem.TOInterval = item.totime;
                    eqItem.orderTime = item.minworktime;
                    eqItem.orderTimeName = this.orderTimeName(eqItem.orderTime);
                    eqItem.workingMode = 1; //item.workingmode; /todo загружать из базы
                    eqItem.workingModeName = this.workingModeName(eqItem.workingMode);
                    eqItem.eqLocation = item.eq_place ? item.eq_place.trim() : '';
                    eqItem.eqNote = item.remark ? item.remark.trim() : '';
                    eqItem.repDate = item.repdate ? formatDate(new Date(item.repdate)): '';
                    eqItem.eqCostKeep = item.eqcostkeep ? + item.eqcostkeep +' ₽' : '0 ₽';
                    eqItem.eqWorkLoad = item.eqworkload;
                    eqItem.eqAtt = item.eqatt ? formatDate(new Date(item.eqatt)): '';
                    item.eqVer = item.eqver ? formatDate(new Date(item.eqver)): '';
                    this.eqInitialList.push(eqItem);
                });
                this.eqNameList = this.fillDict(this.eqNameList , 'eqName');
                this.eqProducerList = this.fillDict(this.eqProducerList , 'eqProducer');
                this.eqData = this.eqInitialList ;
                this.rowCurrentIndex = 0;
                this.eqCard = this.eqData[this.rowCurrentIndex];
                this.isLoading = false;
              })
              .catch(error => 
              {
                this.isLoading = false;
                  alert ('Ошибка при получении данных об оборудовании: ' + error);
                  
              })
          })
          .catch(error => {
            this.isLoading = false;
            alert ('Ошибка при получении справочников: ' + error);
            
          });
     },
     fillDict: function(list, key){
       list = [];
       this.eqInitialList.forEach(item => {
           if(!_.find(list, {name: item[key]}))
              list.push({id: list.length, name: item[key]});
       })
      return list;
     },
     toFloat: function (val)
     {
        if (val && val !== '')
          return parseFloat(val.toString().replace(',','.'));
        return null;
     },
     saveModal: function()
     {
       this.isLoading = true;
       if (this.activetab == 0)
       {
         this.eqDataItem = {
              id: this.eqCard.id,
              cardNum: this.eqCard.cardNum,
              invNum: this.eqCard.invNum,
              factNum: this.eqCard.factNum,
              devision: this.eqCard.devision ? this.eqCard.devision.id : 0,
              eqDevisionName: this.eqCard.devision ? this.eqCard.devision.name : '',
              responsible: this.eqCard.responsible ? this.eqCard.responsible.id : 0,
              responsibleName: this.eqCard.responsible.id ? this.eqCard.responsible.name : '',
              eqName: this.eqCard.eqName,
              eqType: this.eqCard.eqType ? this.eqCard.eqType.id : 0,
              eqTypeName: this.eqCard.eqType ? this.eqCard.eqType.name : '',
              eqPurpose: this.eqCard.eqPurpose,
              eqPassport: this.eqCard.eqPassport,
              eqTechState: this.eqCard.eqTechState,
              eqReadiness: this.eqCard.eqReadiness ? this.eqCard.eqReadiness.id : 0,
              eqReadinessName: this.eqCard.eqReadiness ? this.eqCard.eqReadiness.name : '',
              eqProducer: this.eqCard.eqProducer,
              factDate: this.eqCard.factDate,
              factDateFormat: formatDate(this.eqCard.factDate),
              comDate: this.eqCard.comDate,
              comDateFormat: formatDate(this.eqCard.comDate),
              repDate: this.eqCard.repDate,
              eqResValue: toFloat(this.eqCard.eqResValue),
              eqLocation: this.eqCard.eqLocation,
              eqNote: this.eqCard.eqNote, 
              regNum: this.eqCard.regNum,
              eqCalInterval: this.eqCard.eqCalInterval,
              resValueDate: this.eqCard.resValueDate,
              resValueDateFormat: formatDate(this.eqCard.resValueDate),
              costLaborTime: toFloat(this.eqCard.costLaborTime),
              TOInterval: this.eqCard.TOInterval,
              orderTime: this.eqCard.orderTime ? this.eqCard.orderTime.id : 0,
              orderTimeName: this.eqCard.orderTime ? this.eqCard.orderTime.name: '',
              workingMode: this.eqCard.workingMode ? this.eqCard.workingMode.id : 0,
              workingModeName: this.eqCard.workingMode ? this.eqCard.workingMode.name : '',
              eqDocumentation: this.eqCard.eqDocumentation,
              eqCostKeep: this.eqCard.eqCostKeep,
              eqWorkLoad: this.eqCard.eqWorkLoad,
              eqAtt: this.eqCard.eqAtt,
              eqVer: this.eqCard.eqVer
         }
        

         if (this.eqCard.id === -1)
         {
           api().
             post('/equipment', {equipmentData: this.eqDataItem})
              .then(response => {
                 let newId = response.data.idEq;
                this.eqDataItem.id = newId;
                this.eqCard.id =  this.eqDataItem.id; 
                
                this.eqInitialList.push(this.eqDataItem);
                this.filterData(false);
                this.eqNameList = this.fillDict(this.eqNameList , 'eqName');
                this.eqProducerList = this.fillDict(this.eqProducerList , 'eqProducer');
                this.isLoading = false;
                alert ('Данные сохранены!');
                
              })
            .catch(error => {
               this.isLoading = false;
               alert('Ошибка при добавлении нового оборудования: '+ error);
               return;
            });

         }
        else {
            api().
              put('/equipment/' + this.eqDataItem.id, {equipmentData: this.eqDataItem})
              .then(response => {
                  var oldValue =_.find(this.eqInitialList, {id: this.eqDataItem.id});
                  Object.assign(oldValue, this.eqDataItem);
                  this.filterData(false);
                  this.eqNameList = this.fillDict(this.eqNameList , 'eqName');
                  this.eqProducerList = this.fillDict(this.eqProducerList , 'eqProducer');
                  this.isLoading = false;
                  alert ('Данные сохранены!');

              })
              .catch(error => {
                this.isLoading = false;
                alert('Ошибка при редактировании оборудования:  '+ error);
                return;
            });
        }
          let orderTimeParams = this.getOrderTimeParams();
          this.orderTimeHours = orderTimeParams.hours;
          this.workingMode = orderTimeParams.workingMode;
       }
       

     },
      closeModal: function()
      {
        this.showEqCard = false;
        this.activetab = 0;
      },
      eqDevisionName: function (_id){
        let devisionItem = _.find(this.eqDevisionList, {id: _id});
        return devisionItem ? devisionItem.name : '';
      },
      eqTypeName: function (_id){
        let eqTypeItem = _.find(this.eqTypeList, {id: _id});
        return eqTypeItem ? eqTypeItem.name: '';
      },
      eqReadinessName: function (_id){
        let eqReadinessItem = _.find(this.eqReadinessList, {id: _id});
        return eqReadinessItem ? eqReadinessItem.name: '';
      },
      orderTimeName: function (_id){
        let orderTime = _.find(this.orderTimeList, {id: _id});
        return orderTime ? orderTime.name : '';
      },
      workingModeName: function(_id){
        let workingMode = _.find(this.workingModeList, {id: _id});
        return workingMode ? workingMode.name : '';
      },
       responsibleName: function (_id){

        let responsibleItem = _.find(this.responsibleList, {id: _id});
        return responsibleItem ? responsibleItem.name: '';
      },
      dtUpdateSort: function({ sortField, sort }) {
        const sortedData = _.orderBy(this.eqData, [sortField],[sort]);
        this.eqData = sortedData;
      },
      actionAddClick: function()
      {
        this.actionMode = 'add';
        this.rowCurrentIndex = -1;
        this.initCard(null);
        this.eqCard.id = -1;
        this.showEqCard = true;
      },
      actionEditClick: function (params) {
        this.actionMode = 'edit';
        this.initCard(params);
        this.eqCard.id = params.rowData.id;
        this.rowCurrentIndex = params.rowIndex;
        this.showEqCard = true;
      },
      actionViewClick: function(params){
          this.actionMode = 'view';
          this.initCard(params);
          this.eqCard.id = params.rowData.id;
          this.rowCurrentIndex = params.rowIndex;
          this.showEqCard = true;
      },
      actionCopyClick: function(params){
          this.actionMode = 'copy';
          this.initCard(params);
          this.eqCard.id = -1;
          this.rowCurrentIndex = -1;
          this.showEqCard = true;
      },
      actionDeleteClick: function(params){
         this.isLoading = true;
          let idEq = params.rowData.id;
          api().
              delete('/equipment/' + idEq)
              .then(response => { 
                this.eqInitialList = _.reject(this.eqInitialList, {id: idEq});
                this.filterData(false);
                this.eqNameList = this.fillDict(this.eqNameList , 'eqName');
                this.eqProducerList = this.fillDict(this.eqProducerList , 'eqProducer');
                this.isLoading = false;
              })
            .catch(error => {
              this.isLoading = false;
               alert('Ошибка при удалении оборудования:  '+ error);
            });
      },
      initCard: function(params){
        this.isLoading = true;
          this.eqCard = {
            cardNum: params? params.rowData.cardNum : '',
            invNum:  params? params.rowData.invNum : '',
            factNum: params? params.rowData.factNum : '',
            devision: {
              id: params? params.rowData.devision : '',
              name: params? params.rowData.eqDevisionName : ''
            },
            responsible: 
            {
              id: params? params.rowData.responsible : '',
              name: params ? params.rowData.responsibleName : ''
            },
            eqName:  params? params.rowData.eqName : '',
            eqType: {
              id: params? params.rowData.eqType : '',
              name:  params? params.rowData.eqTypeName : ''
            },
            eqPurpose: params? params.rowData.eqPurpose : '',
            eqPassport:  params? params.rowData.eqPassport : '',
            eqTechState: params? params.rowData.eqTechState : '',
            eqReadiness:{
              id: params? params.rowData.eqReadiness : '',
              name:  params? params.rowData.eqReadinessName : ''
            },
            eqProducer:  params? params.rowData.eqProducer : '',
            factDate: params? params.rowData.factDate : '',
            factDateForma: params?  formatDate(params.rowData.factDate) : '', 
            comDate:  params? params.rowData.comDate : '',
            comDateFormat: params?  formatDate(params.rowData.comDate) : '', 
            repDate: params? params.rowData.repDate : '',
            eqResValue:  params? toCost(params.rowData.eqResValue) : '',
            eqLocation: params? params.rowData.eqLocation : '',
            eqNote:  params? params.rowData.eqNote : '',
            regNum:  params? params.rowData.regNum : '',
            eqCalInterval:  params? params.rowData.eqCalInterval : '',
            resValueDate: params? params.rowData.resValueDate : '',
            resValueDateFormat: params?  formatDate(params.rowData.resValueDate) : '', 
            costLaborTime: params?  toCost(params.rowData.costLaborTime) : '',
            TOInterval:  params? params.rowData.TOInterval : '',
            orderTime: {
              id: params? params.rowData.orderTime : '',
              name: params? params.rowData.orderTimeName : ''
            },
            workingMode: {
              id: params? params.rowData.workingMode : '',
              name: params? params.rowData.workingModeName : ''
            },
            eqDocumentation: '',
            eqCostKeep: params? params.rowData.eqCostKeep : '',
            eqWorkLoad:  params? params.rowData.eqWorkLoad : '',
            eqAtt:  params? params.rowData.eqAtt : '',
            eqVer:  params? params.rowData.eqVer : ''
         }
        let orderTimeParams = this.getOrderTimeParams();
        this.orderTimeHours = orderTimeParams.hours;
        this.workingMode = orderTimeParams.workingMode;
        this.imagesEq =  [];
        this.imagesEqList = [];
        this.imagesLoc = [];
        this.imagesLocList = [];
        this.docList = [];

        if (this.actionMode === 'edit' ||  this.actionMode === 'view'){
          let hasLoad = 0;
           let idEq =  params.rowData.id;
           if (idEq){
              api().
                get('/equipment/imgList/' + idEq)
                .then(response => {
                      this.imagesEqList = response.data;
                      this.imagesEqList.forEach((item, i) =>{
                          this.imagesEq.push(`${endpoint}${item.path}`);
                         // this.imagesEq.push(item.path);

                      })
                      hasLoad++;
                      this.isLoading = (hasLoad < 3)
                  })
                  .catch(error => {
                    this.isLoading = false;
                    alert('Ошибка при загрузке фотографий: '+ error);
                  });
            
            api().
              get('/equipment/locList/' + idEq)
              .then(response => {
                    this.imagesLocList = response.data;
                    this.imagesLocList.forEach((item, i) =>{
                          this.imagesLoc.push(`${endpoint}${item.path}`);
                          //this.imagesLoc.push(item.path);
                    })
                    hasLoad++;
                    this.isLoading = (hasLoad < 3)
                   
                })
                .catch(error => {
                  this.isLoading = false;
                  alert('Ошибка при загрузке схемы расположения:  '+ error);
                });

            api().
              get('/equipment/docList/' + idEq)
              .then(response => {
     
                    this.docList = response.data;
                    this.docList.forEach((item, i) =>{
                          item.path = `${endpoint}${item.path}`;
                    })
                    hasLoad++;
                    this.isLoading = (hasLoad < 3)
                })
                .catch(error => {
                  this.isLoading = false;
                  alert('Ошибка при загрузке документов:  '+ error);
                });
          

          }
          else this.isLoading = false;
        }
        else this.isLoading = false;
      },

      filterData: function(showLoading){
        if (showLoading)
          this.isLoading = true;
        this.eqData = this.eqInitialList;
        if (this.fData.cardNum !== '') 
          this.eqData = _.filter(this.eqData,  {'cardNum': this.fData.cardNum})
        if (this.fData.invNum !== '') 
          this.eqData = _.filter(this.eqData, {'invNum': this.fData.invNum})
        if (this.fData.devision) 
          this.eqData = _.filter(this.eqData, {'devision': this.fData.devision.id})
        if (this.fData.eqName) 
          this.eqData = _.filter(this.eqData, {'eqName': this.fData.eqName.name})
        if (this.fData.eqType) 
          this.eqData = _.filter(this.eqData, {'eqType': this.fData.eqType.id})
        if (this.fData.eqProducer) 
          this.eqData = _.filter(this.eqData, {'eqProducer': this.fData.eqProducer.name})
        if (this.fData.factNum !== '') 
          this.eqData = _.filter(this.eqData, {'factNum': this.fData.factNum})
        if (this.fData.factDate) 
         this.eqData = _.filter(this.eqData, {'factDate': formatDate(this.fData.factDate)})
        if (this.fData.comDate) 
          this.eqData = _.filter(this.eqData, {'comDate': formatDate(this.fData.comDate)})  
        if (this.fData.repDate !== '') 
          this.eqData = _.filter(this.eqData, {'repDate': this.fData.repDate}) 
        if (this.fData.responsible) 
          this.eqData = _.filter(this.eqData, {'responsible': this.fData.responsible.id}) 
        if (this.fData.eqReadiness) 
          this.eqData = _.filter(this.eqData, {'eqReadiness': this.fData.eqReadiness.id})
        this.eqData.push({}); this.eqData.pop(); //костыль: без этого не обновлялись данные в таблице, если редактировала карточку для нового оборудования? 
        if (showLoading)
          this.isLoading = false;
      },
      deleteImage: function(params){
          this.isLoading = true;
          let fileName = params.imageArr[params.index];
          let idPhoto = 0;
          let fileSname = fileName.substring(`${endpoint}`.length);
          if (params.phototype === 1) idPhoto = _.find(this.imagesEqList, {path: fileSname}).idPhoto;
          else if (params.phototype === 2) idPhoto = _.find(this.imagesLocList, {path: fileSname}).idPhoto;

           
          if (idPhoto)
          {
          api().
            delete('/image',{
                  data: {
                    fileName: fileSname,
                    idPhoto: idPhoto
                  }
              })
              .then(response => {
                params.imageArr.splice(params.index, 1);
                
                 if (params.phototype === 1)
                  this.imagesEqList = _.reject( this.imagesEqList, {idPhoto: idPhoto});
                else if (params.phototype === 2)
                  this.imagesLocList = _.reject( this.imagesLocList, {idPhoto: idPhoto});
                this.isLoading = false;
              })
              .catch(error => {
                this.isLoading = false;
                alert('Ошибка при удалении фотографии: '+error);
              });
          }
          else this.isLoading = false;
      },
      deleteDoc: function(params){
        this.isLoading = true;
        var fileName = _.find(this.docList, {idDoc: params.idDoc}).path;
          api().
             delete('/file',{
                 data: {
                   fileName: fileName.substring(`${endpoint}`.length),
                   idDoc:  params.idDoc,
                   funShortName: this.funShortName

                 }
             })
             .then(response => {
                this.docList = _.reject(this.docList, {idDoc: params.idDoc});
                this.isLoading = false;
             })
             .catch(error => {
               this.isLoading = false;
                alert('Ошибка при удалении документа:  '+error);
             });
          
      },
      handleFileUpload: function(){
        this.file = this.$refs.file.files[0];
        var $input = $('.input__file');
        var $label = $input.next('.label-file');
        
        if (this.file) 
        {
            $('.modal-doc-error').html('').removeClass('has-error');
            $label.addClass('has-file').find('.js-fileName').html(this.file.name); 
        }
        else 
          $label.removeClass('has-file').find('.js-fileName').html('Загрузить файл');
      },
      submitFile: function(){

          if (!this.file) {
            $('.modal-doc-error').addClass('has-error').html('Выберите файл');
            return;
          }
          if (this.selectedDocType === ''){
             $('.modal-doc-error').addClass('has-error').html('Выберите тип документа');
              return;
          }
          this.isLoading = true;
          let formData = new FormData();
          formData.append('file',  this.file);
          api().
            post('/file',
              formData,
                {
                  headers: {'Content-Type': 'multipart/form-data'},
                  params: {
                    idEq: this.eqCard.id,
                    docTypeId: this.selectedDocType,
                    funShortName: this.funShortName
                  }
                }
            ).then(response => {
                let filename = response.data.filename;
                let idDoc = response.data.idDoc;
                if (filename)
                {
                  this.docList.push(
                    {
                      idDoc: idDoc, 
                      path: `${endpoint}${filename}`,
                      docTypeId: this.selectedDocType
                    });
                  //alert ('Файл добавлен!')
                  this.showAddDoc = false;
                  this.isLoading = false;
                  
                }
                else  this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
               alert('Ошибка при сохранении документа:  '+ error);
            });
      },
      
      handleImageUpload:  function(params){
         this.isLoading = true;
          let fileImage = params.ref.files[0];
          let imageList = [];
          if (params.phototype === 1) {
            imageList = this.imagesEqList;
          }
          else if (params.phototype === 2){ 
            imageList =  this.imagesLocList;
          }
          let formData = new FormData();
          formData.append('file', fileImage);
          api().
            post('/image',
              formData,
                {
                  headers: {'Content-Type': 'multipart/form-data'},
                  params: {
                    idEq: this.eqCard.id,
                    phTypeId: params.phototype
                  }

                }
            ).then(response => {
                let filename = response.data.filename;
                let idPhoto = response.data.idPhoto;
                if (filename)
                {
                  params.imageArr.push(`${endpoint}${filename}`);
                  imageList.push({idPhoto: idPhoto, path: filename})
                  //alert ('Файл добавлен!')
                }
                else alert (response.data);
                this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
               alert('Ошибка при сохранении фотографии:  '+error);
            });
      },
      showModalDoc: function()
      {
        this.selectedDocType = '';
        this.file ='';
        this.showAddDoc = true;
      },
      editQuery(params)
      {
        this.queryData = params;
        this.queryData.orderTimeHours = this.orderTimeHours;
        this.queryData.workingMode = this.workingMode;
        this.showQueryCard = true;
      },
      addQuery(params){
        this.queryData = params;
        this.queryData.orderTimeHours = this.orderTimeHours;
        this.queryData.workingMode = this.workingMode;
        this.showQueryCard = true;
      },
      saveCardQuery(updatedQueryData){
        this.updatedQueryData=updatedQueryData;
        this.showQueryCard = false;
      },
      deleteCardQuery(updatedQueryData)
      {
        this.updatedQueryData=updatedQueryData;
        this.showQueryCard = false;
      },
      closeCardQuery(){
        this.showQueryCard = false;
      },
       getOrderTimeParams(){
         
         let orderTime = this.eqCard.orderTime ?  this.eqCard.orderTime.id : 0;
         let workingMode = this.eqCard.workingMode ?  this.eqCard.workingMode.id :1; 
         let hours = getOrderTimeHours(orderTime, workingMode );

         return {hours: hours, workingMode:workingMode};
      },
      loading(isLoading)
      {
        this.isLoadingData = isLoading;
        this.isLoading = isLoading || this.isLoadingSchedule;
      },
      loadingSchedule(isLoading)
      {
         this.isLoadingSchedule = isLoading;
         this.isLoading = isLoading || this.isLoadingData;
      },
      hasRight: function(funShortName)
      {
        return hasRight(funShortName)
      }
    },
      mounted: function()
      {
        this.rights = getFunRight(this.funShortName);

        if (!this.rights.view || this.rights.edit){
          this.datatableCss.tbodyTd += ' view-hide'
          this.datatableCss.theadTh += ' view-hide'
        }
        if (!this.rights.edit){
          this.datatableCss.tbodyTd += ' edit-hide'
          this.datatableCss.theadTh += ' edit-hide'
        }
        if (!this.rights.add){
          this.datatableCss.tbodyTd += ' copy-hide'
          this.datatableCss.theadTh += ' copy-hide'
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
  .eqContent {
    display: block; 
    overflow: auto;
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
  .modal-button:hover,
  .add-button:hover
  {
    color: #337ab7;
    border-color: #337ab7;
  }
  .btn-act{
     color: #337ab7;
     cursor: pointer;
  }
  .add-button
  {
    border: 1px solid #ced4da;
    position: relative;
    padding: .425em .5em;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius: .25em;
    cursor: pointer;
    margin: 10px;
    width: 15em
  }

 .div-15{
    display: inline-block;
    width: 15%;
  }
  .label{
    width: 10%;
    text-align: right;
  }
.eq-card-header
{
    border-bottom: 3px solid #4285f4;
    margin-top: .5rem;
    width: 100%;
    text-align: center
}
.eq-card-header-container {
  display: flex;
   flex-wrap: wrap;
   align-items: flex-end;
   justify-content: center;
}
.eq-card-col-25{
   display: flex;
   flex-wrap: nowrap;
   align-items: flex-start;
   width: 25%;
   min-width: 300px;
   padding-left: 15px;
   padding-right: 15px;
   margin-bottom: 10px;
}
.eq-card-col-25 label {
  width: 35%;
  font-size: 10pt;

}
.eq-card-col-25 input,
.eq-card-col-25 p{
  width: 65%;
  border: 1px solid #ced4da;
  -moz-border-radius: .25em;
  -webkit-border-radius:  .25em;
  border-radius:  .25em;
  cursor: text;
  text-align: left;
  height: 2.5em;
}
.eq-card-dyn-select {
  width: 65%;
  height: 2.5em;
}
@media screen and (max-width: 1400px) {
  .eq-card-col-25 {
    width: 50%;
  }
}
@media screen and (max-width: 600px) {
  .eq-card-col-25 {
    width: 100%;
  }
}

// .eq-card-col-25 input:focus {
//     outline-style: solid;
//     outline-width: .5px !important;
//     outline-color: #337ab7 !important;
// }


 
  .eq-card-footer,
  .eq-add-doc-footer {
    padding-bottom: 1em;
    display: flex;
    justify-content: flex-end;
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
      padding: .425em .5em;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      width: 30%;
      margin: 0 .5em;
      color: #337ab7;
  }
.add_document_content
{
  display: flex
}
.add_document_content select
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
    width: 60%;
    height: 3em;
  }
 
.label-file:hover{
    color: #ed9b19;
  }
 .has-file {
    color: green;
  }
  .modal-doc-error
  {
    color: red;
    display: block;
    font-size: small;
    visibility: hidden;
  }
  .has-error
  {
    visibility: visible;
  }
  

</style>