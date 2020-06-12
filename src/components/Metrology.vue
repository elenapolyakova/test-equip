<template lang="html">
  <div>
        <div v-if="rights.add">
            <button class="add-button" @click="actionAddClick" ><i class='fa fa-plus'> </i> Добавить  аттестацию/поверку</button></td>
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
  import {getAttType, getMType} from '../utils/dictionary'

    import '../css/v-datatable-light.css'
  export default {
   name: "metrology",
   components: {
        DataTable,
        DatePicker
    },
      props: {
             idEq: {type: Number, required: true},
             updatedMetData: {type:Object, required:false}
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
          { name: "attDateFormat", label: "Дата аттестации",  sortable: true},
          { name: "attTypeName", label: "Вид", sortable: true},
          { name: "M_TypeName", label: "Тип", sortable: true},
          { name: "eqEnableName", label: "Допущен к работе",  sortable: true},
          { name: "attEndFormat", label: "Дата оконч. срока действия", sortable: true},
          { name: "attDocPath", label: "Аттестат/св-во о поверке",  sortable: false, customElement: "attDoc" },
          { name: "protocolDocPath", label: "Протокол",  sortable: false, customElement: "protocolDoc" }
        ],
       rowCurrentIndex: 0,
       datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center metrology-table',
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
          eqMetItem.M_Type = value.M_Type.id; 
          eqMetItem.M_TypeName = value.M_Type.name
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
                    eqMetItem.attDate = item.attestatdate ? new Date(item.attestatdate) : '';
                    eqMetItem.attDateFormat = formatDate(eqMetItem.attDate);
                    eqMetItem.M_Type = item.m_type; 
                    eqMetItem.M_TypeName = this.MTypeName(item.m_type);
                    eqMetItem.attType = item.atttype; 
                    eqMetItem.attTypeName = this.attTypeName(item.atttype);
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
                alert ('Ошибка при получении данных об аттестации/поверке: ' + error);
                  
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
               alert('Ошибка при удалении аттестации/поверки:  '+ error);
            });
      },
      initCard: function(params)
      {
         this.metCard = {
            idEq: this.idEq,
            metId: params? params.rowData.metId : -1,
            attDate: params? params.rowData.attDate : '',
            attDateFormat:  params? params.rowData.attDateFormat : '',
            M_Type: {
              id: params? params.rowData.M_Type : '',
              name: params? params.rowData.M_TypeName : ''
            },
            attType: {
              id: params? params.rowData.attType : '',
              name: params? params.rowData.attTypeName : ''
            },
            eqEnable:  params? params.rowData.eqEnable : false,
            eqEnableName:  params? params.rowData.eqEnableName : 'нет',
            attEnd: params? params.rowData.attEnd : '',
            attEndFormat: params? params.rowData.attEndFormat : '',
            attDocPath: params? params.rowData.attDocPath : '',
            protocolDocPath: params? params.rowData.protocolDocPath : ''

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
    width: 300px;
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
</style>