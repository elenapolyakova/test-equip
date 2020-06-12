<template lang="html">
<div class="vld-parent">
    <loading :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        color='#337ab7'>
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
                                :options="locationList"
                                option-value="id"
                                option-text="name"
                                v-model="fData.location"
                                placeholder=''/>
                    </div>
              </div>
               <div class="action-panel-filter-button">
                   <button class="filter-button" @click="getReport"><i class='fa fa-check'> </i> Применить фильтр</button></td>
              </div>

          </div>
          <div class="action-panel-btn">
            <div class="export-button"><i class="fa fa-file-excel" title="Экспорт в excel" @click="exportExcel"></i></div>
            <div class="export-button"><i class="fa fa-file-pdf" title="Экспорт в pdf" @click="exportPDF"></i></div>
         </div>
      </div>
        <div class='title'>{{report_name}}</div>
        <div>
             <DataTable
                :header-fields="headerFields"
                :data="eqData || []"
                :css="datatableCss"
                @on-update="dtUpdateSort"> 
            </DataTable>
        </div>
        <div>
            <table id='myTable'>  <thead>
        <tr>
          <th>Привет</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Email</th>
          <th>Country</th>
          <th>IP-address</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Donna</td>
          <td>Moore</td>
          <td>dmoore0@furl.net</td>
          <td>China</td>
          <td>211.56.242.221</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Janice</td>
          <td>Henry</td>
          <td>jhenry1@theatlantic.com</td>
          <td>Ukraine</td>
          <td>38.36.7.199</td>
        </tr>
      </tbody></table>
        </div>
  </div>
</template>

<script>
   /*import html2canvas from 'html2canvas'
   import canvg from 'canvg';
   import '../js/arial-normal.js'
   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
   import Loading from 'vue-loading-overlay';
   // import  jsPDF  from 'jspdf'; 
   import 'jspdf-autotable';
   import DynamicSelect from 'vue-dynamic-select'
   import {getEqReadiness} from '../utils/dictionary'
   import {toCost} from '../utils/commonJS'
   import { DataTable } from 'v-datatable-light'

   export default {
    name: "rEqList",
     props: ['id'],
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
         fData: [],
         sort: 'asc',
        isLoading: false,
         headerFields: [
            { name: "devisionName", label: "Подразделение",  sortable: true },
            { name: "responsibleName", label: "Ответственный",  sortable: true },
            { name: "name", label: "Название оборудования",  sortable: true} ,
            { name: "location", label: "Месторасположение",  sortable: true },
            { name: "invNum", label: "Инвентарный номер",  sortable: true },
            { name: "comDateYear", label: "Год выпуска",  sortable: true },
            { name: "resValue", label: "Остаточная стоимость на конец предыдущего года",  sortable: true },
            { name: "note", label: "Примечание", sortable: true }
        ],
       datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center equipment-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
       }
    },
    methods: {
        exportExcel: function(){},
        exportPDF: function(){
            const doc = new jsPDF('l', 'pt', 'a4');
            doc.setFont("arial", "normal");
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

            let title = this.report_name;
            doc.setFontSize(18);
            doc.text(title,pageWidth/2, 22,{align: "center"});
            doc.setFontSize(11);

              
              var finalY = doc.previousAutoTable.finalY || 10

           const head = [['Подразделение', 'Ответственный', 'Название оборудования', 'Месторасположение']]
           const data = [
            [1, 'Finland', 7.632, 'привет'],
            [2, 'Norway', 7.594, 'Oslo'],
            [3, 'Denmark', 7.555, 'Copenhagen'],
            [4, 'Iceland', 7.495, 'Reykjavík'],
            [5, 'Switzerland', 7.487, 'Bern'],
            [9, 'Sweden', 7.314, 'Stockholm'],
            [73, 'Belarus', 5.483, 'Minsk'],
            ]
                 doc.autoTable({startY: finalY + 20, 
                             head: head,
                             body: data,
                            willDrawCell: function (data) {
                                
                                 if (data.row.index === 5 || data.row.cells["1"].raw === "Finland") {
                                    //  console.log(JSON.stringify(data.row));
                                     doc.setFont("arial", "normal");
                                     doc.setTextColor(231, 76, 60);
                                    // data.cell.styles.fillColor = [40, 170, 100]
                                 }
                             }
                            //{ headStyles: {
                            //     fillColor: [241, 196, 15],
                         //  fontSize: 15,
                         //    }, 
                       
                        // addPageContent: function(data) {
                        //     doc.text("", 40, 30);
                         //}
                     });
               // doc.autoTable({ html: '#myTable' })
                doc.save('test.pdf');
        },
        getReport: function(){
             this.eqData = this.eqInitialList;
            if (this.fData.devision) 
                this.eqData = _.filter(this.eqData, {'devision': this.fData.devision.id})
        
            if (this.fData.readiness) 
                this.eqData = _.filter(this.eqData, {'eqReadiness': this.fData.readiness.id})

            if (this.fData.location) 
                this.eqData = _.filter(this.eqData, {'location': this.fData.location.name})
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
                api().
                get('/equipment')
                .then(response => 
                {
                    let data = response.data;
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
                        eqItem.comDateYear = eqItem.comDate.getFullYear();
                        eqItem.resValue = toCost(item.eqprice);
                        eqItem.note = item.remark ? item.remark.trim() : '';
                        eqItem.eqReadiness = item.is_ready;
                        this.eqInitialList.push(eqItem);
                    });
                    this.locationList = this.fillDict(this.locationList , 'location');
                    this.eqData = this.eqInitialList ;
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
        dtUpdateSort: function({ sortField, sort }) {
            this.eqData = _.orderBy(this.eqData, [sortField],[sort]);
        }
    },
     mounted: function()
      {
      
        this.initData();
      
      }
    
}
*/
</script>

<style lang="scss">
.action-panel {
    display:flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-bottom: .25em;
    border-bottom: 3px solid #4285f4;
}
.action-panel-filter {
    display:flex;
    justify-content: flex-start;
    width: calc(100vw - 300px);
    flex-wrap: nowrap;
    align-content: flex-end;
}
.action-panel-filter-item{
    display: block;
    width: calc((100vw - 620px)/3);
    padding: 0 1.5em; 
}
.action-panel-filter-button{
    display: inline-block;
    padding-left: 1.5em;
    text-align: center;
    vertical-align: bottom;
}
.action-panel-filter-item-label{
    width: 100%;
    text-align: center;
    color:#337ab7;
}
.filter-button {
     border: 1px solid #ced4da;
    position: relative;
    padding: .425em .5em;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius: .25em;
    cursor: pointer;
    margin: 10px;
    width: 250px;
}
.action-panel-filter-item-select{
   
    display: inline-block;
    text-align: center;
    width: 100%;
}
.action-panel-btn{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin-right: 1.5em;
    margin-left: 1.5em;
    width: 130px;
}
.export-button i{
    padding-left: 1.5em;
    padding-top:.5em;
    color: #337ab7;
    font-size: 30px;
}

.filter-button:hover{
    color: #337ab7;
    border-color: #337ab7;
}
.export-button i:hover {
    cursor: pointer;
    color: #ed9b19;
}

.title{
    width:100%;
    font-size: 18px;
    text-align: center;
    padding-top: .5em;
}
@media screen and (max-width: 1400px) {
 
    .action-panel-filter{
        flex-wrap: wrap;
    }
    .action-panel-filter-item{
        width: 100%;
    }
    .action-panel-filter-button{
        width: 100%;
    }
}

</style>