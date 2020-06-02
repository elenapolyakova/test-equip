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
             idEq: {type: Number, required: true}
    },
    data() {
      return {
         rights: {},
         funShortName: 'met',
         //dictionary
         attTypeList: [],
         MTypeList: [],

         eqMetrologyData: [],

        headerFields: [
          "__slot:actions:actionsView",
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
    methods: {
        initData: function(){
          this.$emit('loading', true);
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
                    eqMetItem.id_met = item.id_metr;
                    eqMetItem.attDate = item.attestatdate ? new Date(item.attestatdate) : '';
                    eqMetItem.attDateFormat = formatDate(eqMetItem.attDate);
                    eqMetItem.M_Type = item.m_type; 
                    eqMetItem.M_TypeName = this.MTypeName(item.m_type);
                    eqMetItem.attType = item.atttype; 
                    eqMetItem.attTypeName = this.attTypeName(item.atttype);
                    eqMetItem.eqEnable = typeof(item.eqenable) === "number" ? item.eqenable : 1;
                    eqMetItem.eqEnableName = eqMetItem.eqEnable === 1 ? 'Да' : 'Нет';
                    eqMetItem.attEnd = item.atestatend ? new Date(item.atestatend) : '';
                    eqMetItem.attEndFormat = formatDate(eqMetItem.attEnd);
                    eqMetItem.attDocPath = item.att_docpath ? `${endpoint}${item.att_docpath.trim()}` : '';
                    eqMetItem.protocolDocPath = item.protocol_docpath ? `${endpoint}${item.protocol_docpath.trim()}` : '';

                    this.eqMetrologyData.push(eqMetItem);
                });
                this.rowCurrentIndex = 0;
               // this.eqCard = this.eqData[this.rowCurrentIndex];
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
        // this.actionMode = 'add';
        // this.rowCurrentIndex = -1;
        // this.initCard(null);
        // this.eqCard.id = -1;
        // this.showEqCard = true;
      },
      actionEditClick: function (params) {
        // this.actionMode = 'edit';
        // this.initCard(params);
        // this.eqCard.id = params.rowData.id;
        // this.rowCurrentIndex = params.rowIndex;
        // this.showEqCard = true;
      },
      actionViewClick: function(params){
          // this.actionMode = 'view';
          // this.initCard(params);
          // this.eqCard.id = params.rowData.id;
          // this.rowCurrentIndex = params.rowIndex;
          // this.showEqCard = true;
      },
      actionDeleteClick: function(params){
         this.$emit('loading', true);
          let idMet = params.rowData.id_met;
          api().
              delete('/metrology/' + idMet)
              .then(response => { 
                this.eqMetrologyData = _.reject(this.eqMetrologyData, {id_met: idMet});
     
                this.$emit('loading', false);
              })
            .catch(error => {
              this.$emit('loading', false);
               alert('Ошибка при удалении аттестации/поверки:  '+ error);
            });
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