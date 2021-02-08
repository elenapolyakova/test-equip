<template lang="html">
<div class="vld-parent">
    <loading :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        color='#e21a1a'>
    </loading>
      <div class="action-panel">
          <div class="action-panel-filter">
              <div class="action-panel-filter-item">
                  <div class="action-panel-filter-item-label">
                      <label class="mb-0">Подразделение</label> </div>
                  <div class="action-panel-filter-item-select">
                    <dynamic-select 
                                            :options="devisionList"
                                            option-value="id"
                                            option-text="name"
                                            v-model="fData.devision"
                                            placeholder=''/>
                 </div>
              </div>
              <div class="action-panel-filter-item">
                  <div class="action-panel-filter-item-label">
                      <label class="mb-0">Техническое состояние</label> </div>
                    <div class="action-panel-filter-item-select">
                        <dynamic-select 
                                :options="readinessList"
                                option-value="id"
                                option-text="name"
                                v-model="fData.readiness"
                                placeholder=''/>
                    </div>
              </div>
              <div class="action-panel-filter-item">
                  <div class="action-panel-filter-item-label">
                      <label class="mb-0">Месторасположение</label>
                  </div>
                  <div class="action-panel-filter-item-select">
                        <dynamic-select 
                                :options="placeTypeList"
                                option-value="id"
                                option-text="name"
                                v-model="fData.placeType"
                                placeholder=''/>
                    </div>
              </div>
               <div class="action-panel-filter-item">
                <div class="action-panel-filter-button">
                    <button class="filter-button" @click="getReport" title='Применить фильтр'><i class='fa fa-check'> </i> </button>
                    <button class="filter-button" @click="clearFilter" title='Сбросить фильтр'><i class='fa fa-eraser'> </i> </button>
                    <button class="export-button" @click="exportExcel"><i class="fa fa-file-excel" title="Экспорт в excel"></i></button>
                    <button class="export-button" @click="exportPDF"><i class="fa fa-file-pdf" title="Экспорт в pdf"></i></button>

                </div>
              </div>
          </div>
          
      </div>
      <div class="report-content">
        <div class='title'>{{report_name}}</div>
        <div>Выбрано оборудования: <b><span>{{eqData.length}}</span> ед. </b></div>
        
             <DataTable
                :header-fields="headerFields"
                :data="eqData || []"
                :css="datatableCss"
                @on-update="dtUpdateSort"> 
            </DataTable>
        </div>
      
  </div>
</template>

<script>

   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
   import Loading from 'vue-loading-overlay';
   import DynamicSelect from 'vue-dynamic-select'
   import {getEqReadiness, getPlaceType} from '../utils/dictionary'
   import {toCost} from '../utils/commonJS'
   import { DataTable } from 'v-datatable-light'
   import pdfMake from 'pdfmake/build/pdfmake'
   import pdfFonts from 'pdfmake/build/vfs_fonts'

   export default {
    name: "rEqList",
    components: {
        DataTable,
        DynamicSelect,
        Loading,
    },
    data() {
       return {
         report_name: 'Перечень оборудования',
         eqInitialList: [],
         eqData: [],
         devisionList: [],
         readinessList: [],
         locationList: [],
         placeTypeList: [],
         fData: {
                devision: null,
                readiness: null,
                location: null,
                placeType: null
          },
         sort: 'asc',
        isLoading: false,
         headerFields: [
             { name: "number", label: "№",  sortable: true },
            { name: "devisionName", label: "Подразделение",  sortable: true },
            { name: "responsibleName", label: "Ответственный",  sortable: true },
            { name: "name", label: "Название оборудования",  sortable: true} ,
            { name: "location", label: "Месторасположение",  sortable: true },
            { name: "invNum", label: "Инвентарный номер",  sortable: true },
            { name: "comDateYear", label: "Год ввода в экспл.",  sortable: true },
            { name: "resValue", label: "Остаточная стоимость на конец предыдущего года",  sortable: true },
            { name: "note", label: "Примечание", sortable: true }
        ],
       datatableCss: {
        table: 'table table-hover table-center eqlist-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
       }
    },
    methods: {
        exportExcel: function(){
  
  let wb = new ExcelJS.Workbook();
  let workbookName = `${this.report_name}.xlsx`;
  let worksheetName = this.report_name;
  let ws = wb.addWorksheet(worksheetName);

  ws.columns = [
    { 
      key: "number", 
      header: "№", 
      width: 7 
    },
    {
      key: "devisionName",
      header: "Подразделение",
      width: 20
    },
    { 
      key: "responsibleName", 
      header: "Ответственный", 
      width: 30
    },
    {
      key: "name",
      header: "Название оборудования",
      width: 50
    },
    { 
      key: "location", 
      header: "Месторасположение",
      width: 30
    },
    {
      key: "invNum",
      header: "Инвентарный номер",
      width: 15
    },
    {
      key: "comDateYear",
      header: "Год ввода в эксплуат.",
      width: 10
    },
    {
      key: "resValue",
      header: "Остаточная стоимость на конец предыдущего года",
      width: 20
    },
    {
      key: "note",
      header: "Примечание",
      width: 50
     
    },
    
  ];
  ws.addRows(this.eqData);

  ws.views = [{ state: "frozen", ySplit: 1}];
 for (let i = 1; i <= ws.columns.length; i++)
 {
    let cell = ws.getRow(1).getCell(i);
    cell.font = { 
      bold: true,  color: { argb: "000000" }
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "9cc2e5" }
    };
   cell.border = { top: {style: 'thin'}, 
                 left: {style: 'thin'}, 
                 bottom: {style: 'thin'}, 
                 right: {style: 'thin'}
               };
  cell.alignment = { horizontal: "center", vertical:"middle",  wrapText: true };
 }
  for(let i = 2; i < this.eqData.length + 2; i++)
  for (let j = 1; j < ws.columns.length + 1; j++)
  {
      let cell = ws.getRow(i).getCell(j);
    
    cell.border = { top: {style: 'thin'}, 
                  left: {style: 'thin'}, 
                  bottom: {style: 'thin'}, 
                  right: {style: 'thin'}
                };
    cell.alignment = { vertical:"middle", wrapText: true };
    }

  ws.autoFilter = {
    from: {
      row: 1,
      column: 1
    },
    to: {
      row: this.eqData.length + 1,
      column: ws.columns.length
    }
  }

    wb.xlsx.writeBuffer()
      .then(function(buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          workbookName
        );
    });
  
        },
        exportPDF: function(){

           var headers = [];
           var body = [];
           this.headerFields.forEach((hField) => {
                 headers.push({text: hField.label, style: 'tableHeader'});
            });
           body.push (headers);

           this.eqData.forEach((dItem) =>{
              let dataItem = [];
              this.headerFields.forEach((hField) => {
                   dataItem.push({text: dItem[hField.name], style:'defaultStyle'})
                 })
             body.push(dataItem);
            })

          var docDefenition = {
            content: [
                {text: this.report_name, style: 'header'},
                {
                  table: {

                  headerRows: 1,
                  widths: [15,50,70,180,100,45,30,60,150],

                  body: body
                }
              }],
        
            styles: {
              header: {fontSize: 11, alignment: 'center' },
              tableHeader: {alignment: 'center', verticalAlign: 'center', fontSize: 9, fillColor:"#9cc2e5", bold: true },
              defaultStyle: {fontSize: 9, alignment: 'center', color: '#000000', background:'#ffffff' }

            },
            pageOrientation: 'landscape'
            
          }
        pdfMake.createPdf(docDefenition).download(this.report_name + ".pdf");

        },
        clearFilter: function(){
            this.fData = {
                devision: null,
                readiness: null,
                location: null,
                placeType: null
                }
            this.getReport();

        },
        getReport: function(){
             this.eqData = this.eqInitialList;
            if (this.fData.devision) 
                this.eqData = _.filter(this.eqData, {'devision': this.fData.devision.id})
        
            if (this.fData.readiness) 
                this.eqData = _.filter(this.eqData, {'eqReadiness': this.fData.readiness.id})

            // if (this.fData.location) 
            //     this.eqData = _.filter(this.eqData, {'location': this.fData.location.name})
            if (this.fData.placeType) 
                this.eqData = _.filter(this.eqData, {'placeType': this.fData.placeType.id})

            this.$emit('resizeHeader');
        },
        fillDict: function(list, key){
            list = [];
            this.eqInitialList.forEach(item => {
                if(!_.find(list, {name: item[key]}))
                    list.push({id: list.length, name: item[key]});
            })
            return list;
        },
        devisionName: function (_id){
        let devisionItem = _.find(this.devisionList, {id: _id});
        return devisionItem ? devisionItem.name : '';
      },
      
        responsibleName: function (_id){
            let responsibleItem = _.find(this.responsibleList, {id: _id});
            return responsibleItem ? responsibleItem.name: '';
        },
        initData: function(){
            this.isLoading = true;

            api().
            get('/dictionary')
            .then(response => {
                let dict = response.data;
                this.devisionList =  dict.divisionList;
                this.responsibleList = dict.userList;
                this.responsibleList.forEach(item => item.name =`${item.us_surname} ${item.us_name} ${item.us_patname}`);
                this.readinessList = getEqReadiness();
                this.placeTypeList = getPlaceType();
                api().
                get('/equipment')
                .then(response => 
                {
                    let data = response.data;
                    let i = 0;
                    data.forEach(item =>
                    {
                    let eqItem = {};
                        eqItem.devision = item.id_dicdev_dicdevision;
                        eqItem.devisionName = this.devisionName(eqItem.devision);
                        eqItem.responsible = item.id_respose_man;
                        eqItem.responsibleName = this.responsibleName(eqItem.responsible);
                        eqItem.name = item.eqname ? item.eqname.trim() : '';
                        eqItem.location = item.eq_place ? item.eq_place.trim() : '';
                        eqItem.invNum = item.inv_num ? item.inv_num.trim() : '';
                        eqItem.comDate =  item.eq_comdate ? new Date(item.eq_comdate) : '';
                        eqItem.comDateYear = item.eq_comdate ? eqItem.comDate.getFullYear(): '';
                        eqItem.resValue = toCost(item.eqprice);
                        eqItem.note = item.remark ? item.remark.trim() : '';
                        eqItem.eqReadiness = item.is_ready;
                        eqItem.number = item.card_num;//++i;
                        eqItem.placeType = item.eq_placetype;
                        this.eqInitialList.push(eqItem);
                    });
                    
                    this.locationList = this.fillDict(this.locationList , 'location');
                    this.eqData = this.eqInitialList ;
                    this.$emit('resizeHeader');
                    this.isLoading = false;
                })
                .catch(error => 
                {
                    this.isLoading = false;
                    this.$alert('Ошибка при получении данных об оборудовании: '+ error, '', 'error', {allowOutsideClick: false});
                    //alert ('Ошибка при получении данных об оборудовании: ' + error);
                    
                })
            })
            .catch(error => {
                this.isLoading = false;
                this.$alert('Ошибка при получении справочников: '+ error, '', 'error', {allowOutsideClick: false});
                //alert ('Ошибка при получении справочников: ' + error);
                
            });
        },
        dtUpdateSort: function({ sortField, sort }) {
            this.eqData = _.orderBy(this.eqData, [sortField],[sort]);
        }
    },
     mounted: function()
      {
      
        this.initData();
      
      }
    
}
</script>

<style lang="scss">



@media screen and (max-width: 1500px) {
   .action-panel-filter{
     flex-wrap: wrap;
     justify-content: space-around;
   }
}

@media screen and (max-width: 900px) {
 
   
    .action-panel-filter-item,
    .action-panel-filter-button{
        width: 320px;
        padding: 0;
    }
    
}
@media screen and (max-width: 600px) {
     .action-panel-filter
    {
        display: block;
        width: 100%;
        text-align: center;

    }
    
}

</style>