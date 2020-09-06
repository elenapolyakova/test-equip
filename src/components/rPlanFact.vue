<template lang="html">
   <div class="vld-parent">
        <loading :active.sync="isLoading"
            :can-cancel="false"
            :is-full-page="true"
            color='#e21a1a'>
        </loading>
      <div class="action-panel-end">
             <filter-plan
                @filterData="filterData"
                :fData="fData" 
                @loading="loading"
            ></filter-plan>
           <div class="export-button"><i class="fa fa-file-excel" title="Экспорт в excel" @click="exportExcel"></i></div>
           <div class="export-button"><i class="fa fa-file-pdf" title="Экспорт в pdf" @click="exportPDF"></i></div>
      </div>
      <div class="report-content">
        <div class='title'>{{report_name}}</div>
         <div id ="chart" class="chart">
          <div id="chartBar" class="chartBar">
              <apexchart width="500" type="bar" :options="chartBarOptions" :series="seriesBar"></apexchart>
              
          </div>
          <img id="imgBar" class="img-hidden"></img>
      </div>
      </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
   import Loading from 'vue-loading-overlay';
   import canvg from 'canvg';
   import FilterPlan from './FilterPlan'
   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
  import VueApexCharts from 'vue-apexcharts'
   import {toCost} from '../utils/date'

   export default {
    name: "rPlanFact",
    components: {
       FilterPlan,
       Loading
     },
    props: {
      eqId: {type: Number},
    },
  
    data() {
       return {
            curEqId: -1,
            isLoading: false,
         report_name: 'План и факт работы обуродования',
          fData: {},
          eqDataWork: {},
          hasLoadedImg: 0,
          month: 8,
          year: 2020,
           labels: [],

            chartBarOptions: {
           chart: {
             id: 'vuechart-example',
             toolbar: {
               tools:{
                 download: false
               }
             }
           },
           xaxis: {
             categories:  []
           },
            yaxis: {
              title: {text: 'Время работы, ч' }
           },
            tooltip: {
              enabled: false,
              y: {
                formatter: function (val) {
                  return  val + ' ч..'
                }
              }
           }
         },
         seriesBar: [{ name: '1', data: [] }],
       }
    },
    methods: {
        exportExcel: function(){},
        exportPDF: function(){},
        filterData(eqData){
          this.curEqId = eqData.eqId;
          if (this.hasEquip()){
            this.initData();
          }
      },
         loading(isLoading)
        {
            this.isLoading = isLoading
        },
       hasEquip: function(){
			return (this.curEqId && this.curEqId > -1);
		},
       initData: function(){
         
        this.isLoading = true;


          api().
              get('/rPlanFact/' + this.curEqId)
              .then(response => 
              {
                this.eqDataWork = response.data;

                 this.hasLoadedImg = 0;
                 
                    var daysInMonth = new Date(this.year, this.month - 1, 1).daysInMonth();
                let newData = Array(daysInMonth).fill(0);
                this.labels = [];
                for (var i = 1; i<=daysInMonth; i++ ){
                    labels[i] = i.toString();
                }
            this.chartBarOptions = {...this.chartBarOptions, ...{
                xaxis: {
                    categories: this.labels
                }
            }}
            
          this.eqDataWork.forEach(item => {

              newData[new Date(item.days).getDate()] = item.minute_count/60;
           } ) 
          this.seriesBar = [{
              data: newData
          }]
        
        
           setTimeout(() => {
               this.renderImage('chartBar', 'imgBar')
              }
              , 3000);


                this.isLoading = false;
             })
              .catch(error => 
              {
                this.isLoading = false;
                this.$alert('Ошибка при получении данных об оборудовании: '+ error, '', 'error', {allowOutsideClick: false});
                  //alert ('Ошибка при получении данных об оборудовании: ' + error);
                  
              })

        },
         renderImage: function(chartId, imgId){
            var chart = document.getElementById(chartId);
            var $chart = $(chart);
            var img = document.getElementById(imgId);

            var canvas = $($chart.find('.apexcharts-canvas')[0]);

            $(img).width(canvas.width());

             html2canvas(chart, {onclone: (document) =>{}} 
                ).then((canvas) => {
                  const dataURL = canvas.toDataURL('image/png');
                 img.src = dataURL;
               
                 });
         }

    },
    created: function(){
       this.fData.eqIdQ = this.eqId;
        window.html2canvas = html2canvas;
    }
}

</script>

<style lang="scss" scoped>
.chart{
   display: flex;
   flex-wrap: nowrap;
  justify-content:center;
}
.chartBar{
  margin-top: .5em;
  width: 500px;
}

 img {
    max-width: 100%;
    height: auto;
    width: auto\9; /* ie8 */
 }
 .img-hidden{
   display: none;
 }


</style>