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
                  @actionAddClick="actionAddClick"
                  :hasAddButton="hasAddButton"
                  :hasAddQueryButton="false"
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
                @close=""
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
                            @handleFileDocUpload="handleFileDocUpload"
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
                                     @showHistory="showHistory"
                                     @addQuery="addQuery"
                                     :updatedQueryData="updatedQueryData"
                                     :isArchive="isArchive"
                                     @loading="loadingSchedule">
                          </Schedule>	
                  </div>
                  <div v-if="activetab===2" class='tabcontent'>
                        <repair :idEq="eqCard.id"
                                @loading="loading"
                                :isArchive="isArchive"></repair>
                  </div>
                  <div v-if="activetab===3" class='tabcontent'>
                      <metrology :idEq="eqCard.id"
                                :updatedMetData="updatedMetData"
                                @loading="loading"
                                @editMet="editMet"
                                @addMet="addMet"
                                @viewMet="viewMet"
                                :isArchive="isArchive"
                              ></metrology>

                  </div>
              </div>
          </div>  
             <div slot="modal-footer">
               <div class="eq-card-navigation" v-if="actionMode === 'edit' || actionMode === 'view'">
                    <div class="eq-card-navigation-item bordered" :class="{disabled: (rowCurrentIndex === 0), clicked:(rowCurrentIndex !== 0)}" @click="firstClick()">
                        <i class="fa fa-angle-double-left"></i>
                    </div>
                    <div class="eq-card-navigation-item bordered" :class="{disabled: (rowCurrentIndex === 0), clicked:(rowCurrentIndex !== 0)}" @click="prevClick()">
                      <i class="fa fa-angle-left"></i>
                    </div>
                    <div class="eq-card-navigation-item">запись</div>
                    <div class="eq-card-navigation-item">{{rowCurrentIndex + 1}}</div>
                    <div class="eq-card-navigation-item">из</div>
                    <div class="eq-card-navigation-item">{{eqData.length}}</div>
                    <div class="eq-card-navigation-item bordered" :class="{disabled: (rowCurrentIndex === (eqData.length-1)), clicked:(rowCurrentIndex !== (eqData.length-1))}" @click="nextClick()">
                      <i class="fa fa-angle-right"></i>
                    </div>
                    <div class="eq-card-navigation-item bordered" :class="{disabled: (rowCurrentIndex === (eqData.length-1)), clicked:(rowCurrentIndex !== (eqData.length-1))}" @click="lastClick()">
                      <i class="fa fa-angle-double-right"></i>
                      </div>
               </div>
               <div class ="eq-card-footer">
                <button class="modal-button"  v-if="eqCard.id != -1 && activetab===0" @click='cardShow' title='печать карточки'> Печать</button>
                <button class="modal-button"  v-if="actionMode !=='view' && activetab===0" @click = 'saveModal' title='сохранить'> Сохранить</button>
                <button class="modal-button" @click = "closeModal" title='закрыть'> Закрыть</button>
              </div>
          </div> 
    
        </stack-modal> 
         <stack-modal
                    :show="showAddDoc"
                    @close=""
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
                <button class="modal-button"  @click='saveDocument' title='сохранить'> Сохранить</button>
                <button class="modal-button" @click='showAddDoc=false' title='закрыть'> Закрыть</button>
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
           <history-query
                :queryId="historyQueryId"
                :showHistoryQuery="showHistoryQuery"
                @close="closeHistoryQuery"
                @loading="loading"
          ></history-query>
         <card-metrology
                            
                            :metCard="metCard"
                            :actionMode="actionModeMetrology"
                            :showMetrologyCard="showMetrologyCard"
                            @save="saveCardMet"
                            @close="closeCardMet"
                            @loading="loading"/>

        
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
  import {getEqReadiness, getOrderTime, getDocType, getWorkingMode, getOrderTimeHours, getFunId, noWorkable} from '../utils/dictionary'
  import Schedule from './Schedule'
  import CardQuery from './CardQuery'
  import HistoryQuery from './HistoryQuery'
  import CardMetrology from './CardMetrology'
  import {toCost, toFloat} from '../utils/commonJS'
  import DynamicSelect from 'vue-dynamic-select'
  import rEqCard from '../components/rEquipmentCard'
  import rEqCardF from '../components/rEquipmentCardWithFilter'

  import 'vue2-datepicker/index.css'
  import '../css/v-datatable-light.css'
  import '../css/stackable-modal.scss'
  import '../css/tab-pages.css'
  import 'vue-loading-overlay/dist/vue-loading.css'
  import '../css/common.css'
  import '../css/common-report.css'
   

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
      DynamicSelect,
      CardMetrology,
      HistoryQuery

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
        hasAddButton: false,
        
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
          { name: "eqName", label: "Наименование",  sortable: true} ,
          { name: "eqDevisionName", label: "Подразделение",  sortable: true} ,
          { name: "eqTypeName", label: "Вид/категория",  sortable: true },
          { name: "factDateFormat", label: "Год выпуска", sortable: true },
          { name: "responsibleName", label: "Ответственный",  sortable: true },
          { name: "eqReadinessName", label: "Тех. состояние",  sortable: true }
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-hover table-center equipment-table',
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
       modal3Class: 'modal-xl',
       showModal: false,
       hasCancelButton: false,
       modalMessage: '',
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
       queryData: {},
       historyQueryId: -1,
       showHistoryQuery: false,

       actionModeMetrology: '',
       showMetrologyCard: false,
       metCard: {metId: -1},
       updatedMetData: {},

       isDictLoad: false,
       isDictLoading: false,
       oldCard: {}
      }
 
    }, 
    props:
      {
           isArchive: {type: Boolean, required: true},
    },
    watch:{
      isArchive(value){
          this.reloadData();
      }
    },
    computed: {
     
    },
    methods: {
  
      getDictionaries: async function(){
          if (!this.isDictLoading)
          {
            this.isDictLoading = true;
            api().
              get('/dictionary')
              .then(response => {
                  let dict = response.data;
                  this.eqDevisionList =  dict.divisionFullList;
                  this.eqTypeList = dict.eqTypeList;
                  this.responsibleList = dict.userList;
                  this.responsibleList.forEach(item => item.name =`${item.us_surname} ${item.us_name} ${item.us_patname}`);
                  this.eqReadinessList = getEqReadiness();
                  this.orderTimeList = getOrderTime();
                  this.workingModeList = getWorkingMode();
                  this.docTypeList = getDocType();
                  this.isDictLoad = true;
                })
                .catch(error => {
                  this.isLoading = false;
                  this.isDictLoad = true;

                   this.$alert('Ошибка при получении справочников: ' + error, '', 'error', {allowOutsideClick: false});
                
                 //alert ('Ошибка при получении справочников: ' + error);
              
            });
          }

      },
      initData: function(){
        this.isLoading = true;

        if (!this.isDictLoad)
        {
            this.getDictionaries();
            setTimeout(() => {
                this.initData();
            }, 100)
        }
        else {
            api().
              get('/equipment')
              .then(response => 
              {
                this.eqInitialList = [];
                let data = response.data;
                
                data.forEach(item =>
                {
                  if ((!this.isArchive && (!item.is_ready || noWorkable.indexOf(item.is_ready) == -1))
                    || (this.isArchive && noWorkable.indexOf(item.is_ready) > -1))
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
                    eqItem.comDateFormat	= eqItem.comDate ? eqItem.comDate.getFullYear() : '';
                    eqItem.factNum = item.fact_num ? item.fact_num.trim() : '';
                    eqItem.factDate = item.fact_date ? new Date(item.fact_date) : '';
                    eqItem.factDateFormat	= eqItem.factDate ? eqItem.factDate.getFullYear() : '';
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
                    eqItem.workingMode = item.eq_worktime; 
                    eqItem.workingModeName = this.workingModeName(eqItem.workingMode);
                    eqItem.eqLocation = item.eq_place ? item.eq_place.trim() : '';
                    eqItem.eqNote = item.remark ? item.remark.trim() : '';
                    eqItem.repDate = item.repdate ? new Date(item.repdate): '';
                     eqItem.repDateFormat = eqItem.repDate ? eqItem.repDate.getFullYear(): '';
                    eqItem.eqCostKeep = item.eqcostkeep ? + item.eqcostkeep +' ₽' : '0 ₽';
                    eqItem.eqWorkLoad = item.eqworkload;
                    eqItem.eqAtt = item.eqatt ? formatDate(new Date(item.eqatt)): '';
                    eqItem.eqVer = item.eqver ? formatDate(new Date(item.eqver)): '';
                    eqItem.inPassport =  typeof(item.eqinpassport) === "number" ? !!item.eqinpassport : false; 
                    eqItem.placeAddr = item.eq_placeaddr;
                    this.eqInitialList.push(eqItem);
                  }
                });
                this.eqNameList = this.fillDict(this.eqNameList , 'eqName');
                this.eqProducerList = this.fillDict(this.eqProducerList , 'eqProducer');
                this.eqData = this.eqInitialList ;
                this.rowCurrentIndex = 0;
                this.initCard(this.eqData[this.rowCurrentIndex]);
                //this.eqCard = this.eqData[this.rowCurrentIndex];
               
                this.isLoading = false;
              })
              .catch(error => 
              {
                this.isLoading = false;
                this.$alert('Ошибка при получении справочников: ' + error, '', 'error', {allowOutsideClick: false});
                 //alert ('Ошибка при получении данных об оборудовании: ' + error);
                  
              })
        }
        
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
     cardShow: function(){
         let eqId =  this.eqCard.id;
         this.$router.push({name:'rEqCard', component: rEqCard,  
              params: {
                eqId: eqId,
              }
          });
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
              devision: this.eqCard.devision ? this.eqCard.devision.id : '',
              eqDevisionName: this.eqCard.devision ? this.eqCard.devision.name : '',
              responsible: this.eqCard.responsible ? this.eqCard.responsible.id : '',
              responsibleName: this.eqCard.responsible ? this.eqCard.responsible.name : '',
              eqName: this.eqCard.eqName,
              eqType: this.eqCard.eqType ? this.eqCard.eqType.id : '',
              eqTypeName: this.eqCard.eqType ? this.eqCard.eqType.name : '',
              eqPurpose: this.eqCard.eqPurpose,
              eqPassport: this.eqCard.eqPassport,
              eqTechState: this.eqCard.eqTechState,
              eqReadiness: this.eqCard.eqReadiness ? this.eqCard.eqReadiness.id : '',
              eqReadinessName: this.eqCard.eqReadiness ? this.eqCard.eqReadiness.name : '',
              eqProducer: this.eqCard.eqProducer,
              factDate: this.eqCard.factDate,
              factDateFormat: this.eqCard.factDate ? this.eqCard.factDate.getFullYear() : '',
              comDate: this.eqCard.comDate,
              comDateFormat: this.eqCard.comDate ? this.eqCard.comDate.getFullYear() : '',
              repDate: this.eqCard.repDate,
              repDateFormat: this.eqCard.repDate? this.eqCard.repDate.getFullYear() : '',
              eqResValue: toFloat(this.eqCard.eqResValue),
              eqLocation: this.eqCard.eqLocation,
              eqNote: this.eqCard.eqNote, 
              regNum: this.eqCard.regNum,
              eqCalInterval: this.eqCard.eqCalInterval,
              resValueDate: this.eqCard.resValueDate,
              resValueDateFormat: formatDate(this.eqCard.resValueDate),
              costLaborTime: toFloat(this.eqCard.costLaborTime),
              TOInterval: this.eqCard.TOInterval,
              orderTime: this.eqCard.orderTime ? this.eqCard.orderTime.id : '',
              orderTimeName: this.eqCard.orderTime ? this.eqCard.orderTime.name: '',
              workingMode: this.eqCard.workingMode ? this.eqCard.workingMode.id : '',
              workingModeName: this.eqCard.workingMode ? this.eqCard.workingMode.name : '',
              eqDocumentation: this.eqCard.eqDocumentation,
              eqCostKeep: this.eqCard.eqCostKeep,
              eqWorkLoad: this.eqCard.eqWorkLoad,
              eqAtt: this.eqCard.eqAtt,
              eqVer: this.eqCard.eqVer,
              inPassport: this.eqCard.inPassport,
              placeAddr: this.eqCard.placeAddr,
              funId: getFunId(this.funShortName)
         }
        
        this.oldCard = _.cloneDeep(this.eqCard);//JSON.parse(JSON.stringify(this.eqCard));

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
                this.$alert('Данные сохранены!', '', 'success', {allowOutsideClick: false});
                //alert ('Данные сохранены!');
                
              })
            .catch(error => {
               this.isLoading = false;
               this.$alert('Ошибка при добавлении нового оборудования: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при добавлении нового оборудования: '+ error);
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
                   this.$alert('Данные сохранены!', '', 'success', {allowOutsideClick: false});
                  //alert ('Данные сохранены!');

              })
              .catch(error => {
                this.isLoading = false;
                this.$alert('Ошибка при редактировании оборудования: '+ error, '', 'error', {allowOutsideClick: false});
                //alert('Ошибка при редактировании оборудования:  '+ error);
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
        //console.log('old:____' + JSON.stringify(this.oldCard));
        //console.log('new:____' + JSON.stringify(this.eqCard));
        let isCardChanged = !_.isEqual(this.oldCard, this.eqCard);
        if (isCardChanged)
        {
            this.$confirm('Вы уверены, что хотите закрыть карточку?', '', 'question', {allowOutsideClick: false, cancelButtonText: 'Отменить'})
            .then(() => {
                this.showEqCard = false;
                this.activetab = 0;
            })
           //if (confirm('Вы уверены, что хотите закрыть карточку?')){
           //   this.showEqCard = false;
           //   this.activetab = 0;
          //}
        }
        else {
            this.showEqCard = false;
            this.activetab = 0;
        }


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
        this.initCard(params.rowData);
        this.eqCard.id = params.rowData.id;
        this.rowCurrentIndex = params.rowIndex;
        this.showEqCard = true;
      },
      actionViewClick: function(params){
          this.actionMode = 'view';
          this.initCard(params.rowData);
          this.eqCard.id = params.rowData.id;
          this.rowCurrentIndex = params.rowIndex;
          this.showEqCard = true;
      },
      actionCopyClick: function(params){
          this.actionMode = 'copy';
          this.initCard(params.rowData);
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
              this.$alert('Ошибка при удалении оборудования: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при удалении оборудования:  '+ error);
            });
      },
      initCard: function(params){
        this.isLoading = true;
          this.eqCard = {
            id: params ? params.id : -1,
            cardNum: params? params.cardNum : '',
            invNum:  params? params.invNum : '',
            factNum: params? params.factNum : '',
            devision: {
              id: params? params.devision : '',
              name: params? params.eqDevisionName : ''
            },
            responsible: 
            {
              id: params? params.responsible : '',
              name: params ? params.responsibleName : ''
            },
            eqName:  params? params.eqName : '',
            eqType: {
              id: params? params.eqType : '',
              name:  params? params.eqTypeName : ''
            },
            eqPurpose: params? params.eqPurpose : '',
            eqPassport:  params? params.eqPassport : '',
            eqTechState: params? params.eqTechState : '',
            eqReadiness:{
              id: params? params.eqReadiness : '',
              name:  params? params.eqReadinessName : ''
            },
            eqProducer:  params? params.eqProducer : '',
            factDate: params? params.factDate : '',
            factDateFormat: params && params.factDate ? params.factDate.getFullYear() : '', 
            comDate:  params? params.comDate : '',
            comDateFormat: params && params.comDate ?  params.comDate.getFullYear() : '', 
            repDate: params? params.repDate : '',
            repDateFormat: params && params.repDate ? params.repDate.getFullYear() : '',
            eqResValue:  params? toCost(params.eqResValue) : '',
            eqLocation: params? params.eqLocation : '',
            eqNote:  params? params.eqNote : '',
            regNum:  params? params.regNum : '',
            eqCalInterval:  params? params.eqCalInterval : '',
            resValueDate: params? params.resValueDate : '',
            resValueDateFormat: params?  formatDate(params.resValueDate) : '', 
            costLaborTime: params?  toCost(params.costLaborTime) : '',
            TOInterval:  params? params.TOInterval : '',
            orderTime: {
              id: params? params.orderTime : '',
              name: params? params.orderTimeName : ''
            },
            workingMode: {
              id: params? params.workingMode : '',
              name: params? params.workingModeName : ''
            },
            eqDocumentation: '',
            eqCostKeep: params? params.eqCostKeep : '',
            eqWorkLoad:  params? params.eqWorkLoad : '',
            eqAtt:  params? params.eqAtt : '',
            eqVer:  params? params.eqVer : '',
            inPassport: params? params.inPassport : false,
            placeAddr: params? params.placeAddr : ''
         }

         this.oldCard = _.cloneDeep(this.eqCard);//JSON.parse(JSON.stringify(this.eqCard));
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
           let idEq =  params.id;
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
                    this.$alert('Ошибка при загрузке фотографий: '+ error, '', 'error', {allowOutsideClick: false});
                    //alert('Ошибка при загрузке фотографий: '+ error);
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
                  this.$alert('Ошибка при загрузке схемы расположения:'+ error, '', 'error', {allowOutsideClick: false});
                  //alert('Ошибка при загрузке схемы расположения:  '+ error);
                });

            api().
              get('/equipment/docList/' + idEq)
              .then(response => {
                    this.docList = response.data;
                    this.docList.forEach((item, i) =>{
                          item.path = item.path && item.path !== '' ? `${endpoint}${item.path}` : '';
                    })
                    hasLoad++;
                    this.isLoading = (hasLoad < 3)
                })
                .catch(error => {
                  this.isLoading = false;
                  this.$alert('Ошибка при загрузке документов: ' + error, '', 'error', {allowOutsideClick: false});
                  //alert('Ошибка при загрузке документов:  '+ error);
                });
          

          }
          else this.isLoading = false;
        }
        else this.isLoading = false;
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
          repDate: null,
          responsible: null,
          eqReadiness: null
        };
        this.filterData(true);
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
         this.eqData = _.filter(this.eqData, {'factDateFormat': this.fData.factDate.getFullYear()})
        if (this.fData.comDate) 
          this.eqData = _.filter(this.eqData, {'comDateFormat': this.fData.comDate.getFullYear()})  
        if (this.fData.repDate) 
          this.eqData = _.filter(this.eqData, {'repDateFormat': this.fData.repDate.getFullYear()}) 
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
                this.$alert('Ошибка при удалении фотографии: ' + error, '', 'error', {allowOutsideClick: false});
                //alert('Ошибка при удалении фотографии: '+error);
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
               this.$alert('Ошибка при удалении документа: ' + error, '', 'error', {allowOutsideClick: false});
                //alert('Ошибка при удалении документа:  '+error);
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
      saveDocument: function(){
        if (this.selectedDocType === ''){
             $('.modal-doc-error').addClass('has-error').html('Выберите тип документа');
              return;
          }
   
         if (!this.file){
          this.isLoading = true;
            api().
              post('/equipmentDoc', {eqDocData:  
                  {
                    idEq: this.eqCard.id,
                    docTypeId: this.selectedDocType,
                    funShortName: this.funShortName
                  }
                })
              .then(response => {
                let idDoc = response.data.idDoc;
                this.docList.push(
                    {
                      idDoc: idDoc, 
                      path: '',
                      docTypeId: this.selectedDocType
                    });
                  //alert ('Файл добавлен!')
                  this.showAddDoc = false;
                  this.isLoading = false;
                
              })
            .catch(error => {
               this.isLoading = false;
               this.$alert('Ошибка при сохранении документа: ' + error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при сохранении документа: '+ error);
               return;
            });
         }
         else this.submitFile();
      },
      submitFile: function(){

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
                    idDoc: -1,
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
              this.$alert('Ошибка при сохранении документа: ' + error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при сохранении документа:  '+ error);
            });
      },
      handleFileDocUpload: function(params){
          this.isLoading = true;
          let fileDoc = params.ref.files[0];
          let idDoc = params.idDoc;
          let formData = new FormData();
          formData.append('file',  fileDoc);
          api().
            post('/file',
              formData,
                {
                  headers: {'Content-Type': 'multipart/form-data'},
                  params: {
                    idEq: this.eqCard.id,
                    idDoc: idDoc,
                    funShortName: this.funShortName
                  }
                }
            ).then(response => {
                let filename = response.data.filename;
                if (filename)
                {
                  let docItem = _.find(this.docList, {idDoc: idDoc});
                  if (docItem) docItem.path = `${endpoint}${filename}`;
                  //alert ('Файл добавлен!')
                  this.isLoading = false;
                  
                }
                else  this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
              this.$alert('Ошибка при сохранении документа: ' + error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при сохранении документа:  '+ error);
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
                else this.$alert(response.data, '', 'error', {allowOutsideClick: false});
                //alert (response.data);
                this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
              this.$alert('Ошибка при сохранении фотографии:  ' + error, '', 'error', {allowOutsideClick: false});
              // alert('Ошибка при сохранении фотографии:  '+error);
            });
      },
      showModalDoc: function()
      {
        this.selectedDocType = '';
        this.file ='';
        this.showAddDoc = true;
      },

      firstClick: function(){
        if (this.rowCurrentIndex > 0) {
           this.rowCurrentIndex = 0;
          this.initCard(this.eqData[this.rowCurrentIndex]);
        }
      },
      prevClick: function(){
        if (this.rowCurrentIndex > 0) {
          this.rowCurrentIndex--;
          this.initCard(this.eqData[this.rowCurrentIndex]);
        }
      },
      nextClick: function(){
        if (this.rowCurrentIndex < this.eqData.length-1) 
        {
          this.rowCurrentIndex++;
          this.initCard(this.eqData[this.rowCurrentIndex]);
        }
      },
      lastClick: function(){
        if (this.rowCurrentIndex < this.eqData.length-1) {
          this.rowCurrentIndex =  this.eqData.length-1;
          this.initCard(this.eqData[this.rowCurrentIndex]);
        }
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
      showHistory(queryId){
          this.historyQueryId = queryId;
          this.showHistoryQuery = true;
      },
      closeHistoryQuery(){
         this.showHistoryQuery = false;
      },
      
       getOrderTimeParams(){
         
         let orderTime = this.eqCard.orderTime ?  this.eqCard.orderTime.id : 0;
         let workingMode = this.eqCard.workingMode ?  this.eqCard.workingMode.id :1; 
         let hours = getOrderTimeHours(orderTime, workingMode );

         return {hours: hours, workingMode:workingMode};
      },
      editMet(params){
        this.actionModeMetrology = 'edit';
        this.metCard = params;
        this.showMetrologyCard = true;
      },
      addMet(params){
        this.actionModeMetrology = 'add';
        this.metCard = params;
        this.showMetrologyCard = true;
      },
       viewMet(params){
        this.actionModeMetrology = 'view';
        this.metCard = params;
        this.showMetrologyCard = true;
      },
      saveCardMet(updatedMetData){
        this.updatedMetData=updatedMetData;
        this.showMetrologyCard = false;
      },
      closeCardMet(){
         this.showMetrologyCard = false;
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
      },
      reloadData: function(){
        
          this.datatableCss.tbodyTd = this.datatableCss.tbodyTd.replace(' edit-hide', '').replace(' copy-hide', '').replace(' delete-hide', '').replace(' view-hide', '');          
          this.datatableCss.theadTh = this.datatableCss.theadTh.replace(' edit-hide', '').replace(' copy-hide', '').replace(' delete-hide', '').replace(' view-hide', '');


          this.rights = getFunRight(this.funShortName);
        if (this.isArchive){
          this.hasAddButton = false;
            this.datatableCss.tbodyTd += ' edit-hide'
            this.datatableCss.theadTh += ' edit-hide'
            this.datatableCss.tbodyTd += ' copy-hide'
            this.datatableCss.theadTh += ' copy-hide'
            this.datatableCss.tbodyTd += ' delete-hide'
            this.datatableCss.theadTh += ' delete-hide'

        }
        else{
             this.hasAddButton = this.rights.add;

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
           // if (!this.rights.delete){
              this.datatableCss.tbodyTd += ' delete-hide'
              this.datatableCss.theadTh += ' delete-hide'
           // }
        }
        this.$nextTick(() => {
          $('.equipment-table .header-item:visible').first().addClass('first-th')
        })
        this.initData();
      }
    },
      mounted: function()
      {
        
          this.reloadData();
      }
    

  }
</script>

<style lang="scss" scoped>
  .eqContent {
    display: block; 
    overflow: auto;
    padding: 15px;
  }

   .modal-button { 
      color: #ffffff;
      background-color: #E21A1A;
      border: none;
      position: relative;
      padding: .425em .5em;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      width: 200px;
      margin: 0 .5em;
  }
  .modal-button:hover
  {
    color: #000000;
    cursor: pointer;
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
    border-bottom: 3px solid #E21A1A;
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
  -moz-border-radius: .25em;
  -webkit-border-radius:  .25em;
  border-radius:  .25em;
  cursor: text;
  text-align: left;
  height: 2.5em;
}

.eq-card-col-25 p{
  margin: 0 !important;
}

.eq-card-dyn-select {
  width: 65%;
  height: 2.5em;
}
@media screen and (max-width: 1400px) {
  .eq-card-col-25 {
    width: 50%;
  }
  .eq-card-navigation{
    margin-bottom: .5em;
  }
}
@media screen and (max-width: 600px) {
  .eq-card-col-25 {
    width: 100%;
  }
  
}
.eq-card-navigation{
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  
}
.eq-card-navigation-item{

   margin: 0 .5em;
   color:#e21A1A;
   font-size: 12pt;
}
.eq-card-navigation-item.clicked:hover{

   color: #000000;
   cursor: pointer;
}

.eq-card-navigation-item.disabled,
.eq-card-navigation-item.disabled:hover{
   color:gray;
   cursor:default;
}

.eq-card-navigation-item.bordered{
   border: 1px solid #e21a1a;
  -moz-border-radius: .25em;
  -webkit-border-radius:  .25em;
  border-radius:  .25em;
  padding: 0 1em;
}


// .eq-card-col-25 input:focus {
//     outline-style: solid;
//     outline-width: .5px !important;
//     outline-color: #337ab7 !important;
// }


 
  .eq-card-footer,
  .eq-add-doc-footer,
  .modal-footer {
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
      border: 1px solid #e21a1a;
      position: relative;
      padding: .425em .5em;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      text-align: center;
      width: 30%;
      margin: 0 .5em;
      color: #e21a1a;
  }
.add_document_content
{
  display: flex
}
.add_document_content select
  {
    border: 1px solid #e21a1a;
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
    color: #000000;
  }
 .has-file {
    color: green;
  }
  .modal-doc-error
  {
    color: #e21a1a;
    display: block;
    font-size: small;
    visibility: hidden;
  }
  .has-error
  {
    visibility: visible;
  }
  

</style>