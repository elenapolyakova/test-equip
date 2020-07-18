<template lang="html">
  <div>
        <div v-if="rights.add && !isArchive" class="pb-2"> 
            <button class="add-button" @click="actionAddClick" > Добавить  аттестацию/поверку</button></td>
        </div>
        <DataTable
            :header-fields="headerFields"
            :data="eqMetrologyData || []"
            :css="datatableCss"
            @on-update="dtUpdateSort"> 
            <template v-slot:actionsView="props">
              <button class="btn btn-act" @click="actionViewClick(props);" title='просмотр'><i class = 'fa fa-search'></i></button>
          </template>
          <template v-slot:actionsEdit="props">
              <button class="btn btn-act" @click="actionEditClick(props);" title='редактировать'><i class = 'fa fa-edit'></i></button>
          </template>
          <template v-slot:actionsDelete="props">
              <button class="btn btn-act" @click="actionDeleteClick(props);" title='удалить'><i class = 'fa fa-trash-alt'></i></button>
          </template>
          <div slot="attDoc" slot-scope="props">
            <div v-if="props.rowData.attDocPath !==''" class='act-btn'>
                <a :href="props.rowData.attDocPath" target="_blank"><i class="fa fa-download" title="Загрузить аттестат/св-во о поверке" ></i></a> 
            </div>
          </div> 
          <div slot="protocolDoc" slot-scope="props">
            <div v-if="props.rowData.protocolDocPath !==''" class='act-btn'>
                <a :href="props.rowData.protocolDocPath" target="_blank"><i class="fa fa-download" title="Загрузить протокол" ></i></a> 
            </div>
          </div> 
        </DataTable>

       
  </div>
</template>

<script>

  import { DataTable } from 'v-datatable-light'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/locale/ru'
  import {endpoint} from '../utils/config'
  import {formatDate, dateFromString} from '../utils/date'
  import {getFunRight, hasRight}  from "../utils/right";
  import api from "../utils/api";
  import {getAttType, getMType, getFunId} from '../utils/dictionary'

    import '../css/v-datatable-light.css'
  export default {
   name: "metrology",
   components: {
        DataTable,
        DatePicker
    },
      props: {
             idEq: {type: Number, required: true},
             updatedMetData: {type:Object, required:false},
             isArchive: {type: Boolean, required: false},
    },
    data() {
      return {
         rights: {},
         funShortName: 'met',
         //dictionary
         attTypeList: [],
         MTypeList: [],

         eqMetrologyData: [],
         metCard: {metId: -1},

        headerFields: [
        //  "__slot:actions:actionsView",
          "__slot:actions:actionsEdit",
          "__slot:actions:actionsDelete",
          { name: "recDateFormat", label: "Дата",  sortable: true},
          { name: "attTypeName", label: "Вид", sortable: true},
          { name: "M_TypeName", label: "Тип", sortable: true},
         // { name: "attNum", label: "Номер документа", sortable: true},
        //  { name: "eqEnableName", label: "Допущен к работе",  sortable: true},
          { name: "attEndFormat", label: "Дата оконч. срока действия", sortable: true},
          { name: "attDocPath", label: "Аттестат/св-во о поверке",  sortable: false, customElement: "attDoc" },
          { name: "protocolDocPath", label: "Протокол",  sortable: false, customElement: "protocolDoc" }
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-hover table-center metrology-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
      }
    },
    watch: {
      updatedMetData(value){
          let eqMetItem = {};
          eqMetItem.metId = value.metId;
          eqMetItem.attDate = value.attDate ? new Date(value.attDate) : '';
          eqMetItem.attDateFormat = formatDate(eqMetItem.attDate);
          eqMetItem.protocolDate = value.protocolDate ? new Date(value.protocolDate) : '';
          eqMetItem.protocolDateFormat = formatDate(eqMetItem.protocolDate);
          eqMetItem.recDate = value.recDate ? new Date(value.recDate) : '';
          eqMetItem.recDateFormat = formatDate(eqMetItem.recDate);
          eqMetItem.M_Type = value.M_Type.id; 
          eqMetItem.M_TypeName = value.M_Type.name
          eqMetItem.attNum = value.attNum;
          eqMetItem.protocolNum = value.protocolNum;
          eqMetItem.attType = value.attType.id; 
          eqMetItem.attTypeName = value.attType.name;
          eqMetItem.eqEnable = value.eqEnable;
          eqMetItem.eqEnableName = value.eqEnable ? 'Да' : 'Нет';
          eqMetItem.attEnd = value.attEnd ? new Date(value.attEnd) : '';
          eqMetItem.attEndFormat = formatDate(eqMetItem.attEnd);
          eqMetItem.attDocPath = value.attDocPath;
          eqMetItem.protocolDocPath = value.protocolDocPath;
          if ( this.rowCurrentIndex === -1){
           this.eqMetrologyData.push(eqMetItem);
          }
          else{
             var oldValue =_.find(this.eqMetrologyData, {metId: eqMetItem.metId});
             Object.assign(oldValue, eqMetItem);
            this.eqMetrologyData.push({});  this.eqMetrologyData.pop();
          }

      },
      idEq(value){
        this.initData();
      }
    },
    methods: {
        initData: function(){
          this.$emit('loading', true);
          this.eqMetrologyData = [];
          this.attTypeList = getAttType();
          this.MTypeList = getMType();
           api().
              get('/metrology/' + this.idEq)
              .then(response => 
              {
                let data = response.data;
                data.forEach(item =>
                {
                   let eqMetItem = {};
                    eqMetItem.metId = item.id_metr;
                    eqMetItem.recDate = item.recdate ? new Date(item.recdate) : '';
                    eqMetItem.recDateFormat = formatDate(eqMetItem.recDate);
                    eqMetItem.attDate = item.attestatdate ? new Date(item.attestatdate) : '';
                    eqMetItem.attDateFormat = formatDate(eqMetItem.attDate);
                    eqMetItem.protocolDate = item.protocol_date ? new Date(item.protocol_date) : '';
                    eqMetItem.protocolDateFormat = formatDate(eqMetItem.protocolDate);
                    eqMetItem.M_Type = item.m_type; 
                    eqMetItem.M_TypeName = this.MTypeName(item.m_type);
                    eqMetItem.attType = item.atttype; 
                    eqMetItem.attTypeName = this.attTypeName(item.atttype);
                    eqMetItem.attNum = item.atestatnum;
                    eqMetItem.protocolNum = item.protocol_num;
                    eqMetItem.eqEnable = typeof(item.eqenable) === "number" ? !!item.eqenable : false;
                    eqMetItem.eqEnableName = eqMetItem.eqEnable ? 'Да' : 'Нет';
                    eqMetItem.attEnd = item.atestatend ? new Date(item.atestatend) : '';
                    eqMetItem.attEndFormat = formatDate(eqMetItem.attEnd);

                    eqMetItem.attDocPath = item.att_docpath ? `${endpoint}${item.att_docpath.trim()}` : '';
                    eqMetItem.protocolDocPath = item.protocol_docpath ? `${endpoint}${item.protocol_docpath.trim()}` : '';

                    this.eqMetrologyData.push(eqMetItem);
                });
                this.rowCurrentIndex = 0;
                this.metCard = this.eqMetrologyData[this.rowCurrentIndex];
                 this.$emit('loading', false);
              })
              .catch(error => 
              {
                this.$emit('loading', false);
                this.$alert('Ошибка при получении данных об аттестации/поверке: '+ error, '', 'error', {allowOutsideClick: false});
                //alert ('Ошибка при получении данных об аттестации/поверке: ' + error);
                  
              })


        },
        dtUpdateSort: function({ sortField, sort }) {
        const sortedData = _.orderBy(this.eqMetrologyData, [sortField],[sort]);
        this.eqMetrologyData = sortedData;
      },
       attTypeName: function (_id){
        let attTypeItem = _.find(this.attTypeList, {id: _id});
        return attTypeItem ? attTypeItem.name : '';
      },
       MTypeName: function (_id){
        let MTypeItem = _.find(this.MTypeList, {id: _id});
        return MTypeItem ? MTypeItem.name : '';
      },
      actionAddClick: function()
      {
         this.initCard(null);
         this.rowCurrentIndex = -1;
         this.$emit('addMet', this.metCard)
      },
      actionEditClick: function (params) {
         this.initCard(params);
         this.rowCurrentIndex = params.rowIndex;
         this.$emit('editMet', this.metCard)
      },
      actionViewClick: function(params){
           this.initCard(params);
           this.rowCurrentIndex = params.rowIndex;
           this.$emit('viewMet', this.metCard)
      },
      actionDeleteClick: function(params){
         this.$emit('loading', true);
          let metId = params.rowData.metId;
          api().
              delete('/metrology/' + metId)
              .then(response => { 
                this.eqMetrologyData = _.reject(this.eqMetrologyData, {metId: metId});
     
                this.$emit('loading', false);
              })
            .catch(error => {
              this.$emit('loading', false);
              this.$alert('Ошибка при удалении аттестации/поверки: '+ error, '', 'error', {allowOutsideClick: false});
               //alert('Ошибка при удалении аттестации/поверки:  '+ error);
            });
      },
      initCard: function(params)
      {
         this.metCard = {
            idEq: this.idEq,
            metId: params? params.rowData.metId : -1,
            recDate: params? params.rowData.recDate : '',
            recDateFormat:  params? params.rowData.recDateFormat : '',
            attDate: params? params.rowData.attDate : '',
            attDateFormat:  params? params.rowData.attDateFormat : '',
            protocolDate: params? params.rowData.protocolDate : '',
            protocolDateFormat:  params? params.rowData.protocolDateFormat : '',
            M_Type: {
              id: params? params.rowData.M_Type : '',
              name: params? params.rowData.M_TypeName : ''
            },
            attType: {
              id: params? params.rowData.attType : '',
              name: params? params.rowData.attTypeName : ''
            },
            attNum: params? params.rowData.attNum : '',
            protocolNum: params? params.rowData.protocolNum : '',
            eqEnable:  params? params.rowData.eqEnable : false,
            eqEnableName:  params? params.rowData.eqEnableName : 'нет',
            attEnd: params? params.rowData.attEnd : '',
            attEndFormat: params? params.rowData.attEndFormat : '',
            attDocPath: params? params.rowData.attDocPath : '',
            protocolDocPath: params? params.rowData.protocolDocPath : '',
            funId: getFunId (this.funShortName)

         }
      }
     
    },
     mounted: function()
      {
        this.rights = getFunRight(this.funShortName);

        // if (!this.rights.view || this.rights.edit){
        //   this.datatableCss.tbodyTd += ' view-hide'
        //   this.datatableCss.theadTh += ' view-hide'
        // }
        if (this.isArchive){
            this.datatableCss.tbodyTd += ' edit-hide'
            this.datatableCss.theadTh += ' edit-hide'
            this.datatableCss.tbodyTd += ' delete-hide'
            this.datatableCss.theadTh += ' delete-hide'
        }
        else {
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
          $('.metrology-table .header-item:visible').first().addClass('first-th')
        });
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
      width: 250px;
      height: 39px;
  }
  .add-button:hover
  {
    color: #000000;
  }
  .act-btn i{
    color: #e21a1a;
    cursor: pointer;
  }
  .act-btn i:hover{
    color: #000000
  }
</style>