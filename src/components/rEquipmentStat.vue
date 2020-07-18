<template lang="html">
  <div>
      <div class="action-panel">
        <div class="action-panel-filter">
                      <div class="action-panel-filter-item">
                          <div class="action-panel-filter-item-label">
                              <label class="mb-0">Период:</label> </div>
                            <div class="action-panel-filter-calendar-item">
                            <date-picker 
                              v-model="datePeriod" 
                              type="date" 
                              :range="true"
                              :format="format"
                              :title-format="format"
                              :confirm="true"
                              confirm-text="Применить"
                              :editable=false
                              range-separator=" - "
                              ></date-picker>
                        </div>
                      </div>
                      <div class="action-panel-filter-item">
                          <div class="action-panel-filter-item-label">
                              <label class="mb-0">Подразделение:</label>
                          </div>
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
      </div>
  </div>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts'
  import html2canvas from 'html2canvas'
  import Loading from 'vue-loading-overlay';
 //  window.jsPDF = require('jspdf');
  //import jsPDF from 'jspdf'; 
//   import '../js/arial-normal.js'
//   import '../js/arial-bold.js'
   import api from "../utils/api";
  import { saveAs } from 'file-saver';
  import ExcelJS from 'exceljs'; 
 // import 'jspdf-autotable';
   import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
 // import '../css/my-style.css'
  import 'vue2-datepicker/locale/ru'
  import DynamicSelect from 'vue-dynamic-select'
   import {DateDiff} from '../utils/date'
  //import jsPDF from 'jspdf'; 

   export default {
    name: "rEqStat",
    components: {
       Loading,
       DatePicker,
       DynamicSelect,
     },
    data() {
       return {
         report_name: 'Статистика загрузки оборудования',
         fData: {},
         devisionList: [],
         format:'DD.MM.YYYY',
         datePeriod: [new Date(), new Date()],
       }
    },
    methods: {
        exportExcel: function(){},
        exportPDF: function(){},
        clearFilter: function(){

        },
            clearFilter: function(){
              this.fData = {
                    devision: null
            }
            this.getReport();
        },
        getReport: function(){
            let dateStart = this.datePeriod[0];
            let dateEnd = this.datePeriod[1];
            let daysCount = DateDiff(dateEnd, dateStart);
            if (daysCount <= 30){
              alert ("каждый день")
            }
            else if (daysCount < 366/2)
            {
              alert ("по неделям");
            }
            else 
             {
              alert ("по месяцам");
            }
        },
         devisionName: function (_id){
        let devisionItem = _.find(this.devisionList, {id: _id});
        return devisionItem ? devisionItem.name : '';
      },
      
      initData: function(){
            this.isLoading = true;
            let now = new Date();
            this.datePeriod = [];
            this.datePeriod.push(new Date(now.getFullYear(), now.getMonth(), 1));
            this.datePeriod.push(now);

            api().
            get('/dictionary')
            .then(response => {
                let dict = response.data;
                this.devisionList = [];
                this.devisionList = dict.divisionList;

               // let allDevision = {id: -1, name: 'АО «ВНИИЖТ»'}
               // this.devisionList.push(allDevision);
               // this.fData.devision = allDevision;
               /* api().
                get('/equipment')
                .then(response => 
                {
                    let data = response.data;
                    let i = 0;
                    data.forEach(item =>
                    {
                    let eqItem = {};
                        eqItem.cardNum = item.card_num ? item.card_num.trim() : '';
                        eqItem.devision = item.id_dicdev_dicdevision;
                        eqItem.devisionName = this.devisionName(eqItem.devision);
                        eqItem.location = item.eq_place ? item.eq_place.trim() : '';
                        eqItem.name = item.eqname ? item.eqname.trim() : '';
                        eqItem.invNum = item.inv_num ? item.inv_num.trim() : '';
                        eqItem.comDate =  item.eq_comdate ? new Date(item.eq_comdate) : '';
                        eqItem.comDateYear = eqItem.comDate.getFullYear();
                        eqItem.age = (new Date).getFullYear() - eqItem.comDateYear;
                        this.eqInitialList.push(eqItem);
                        
                    });
                    this.locationList = this.fillDict(this.locationList , 'location');
                    this.eqData = this.eqInitialList ;
                    this.countAge();
                })
                .catch(error => 
                {
                    this.isLoading = false;
                    this.$alert('Ошибка при получении данных об оборудовании: '+ error, '', 'error', {allowOutsideClick: false});
                    //alert ('Ошибка при получении данных об оборудовании: ' + error);
                    
                })*/
            })
            .catch(error => {
                this.isLoading = false;
                 this.$alert('Ошибка при получении справочников: '+ error, '', 'error', {allowOutsideClick: false});
                //alert ('Ошибка при получении справочников: ' + error);
                
            });
        },
    },
     mounted: function()
      {
      
       window.html2canvas = html2canvas;
        // let allDevision = {id: 1000, name: 'АО «ВНИИЖТ»'}
        // this.devisionList.push(allDevision);
        // this.fData.devision = allDevision;

        this.initData();
        
      
      }
}

</script>

<style lang="scss" scoped>




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