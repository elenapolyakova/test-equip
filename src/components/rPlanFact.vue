<template lang="html">
   <div class="vld-parent">
        <loading :active.sync="isLoading"
            :can-cancel="false"
            :is-full-page="true"
            color='#e21a1a'>
        </loading>
      <div class="action-panel-end">
             <filter-plan-date
                @filterData="filterData"
                :fData="fData" 
                @loading="loading"
            ></filter-plan-date>
           <div class="export-button"><i class="fa fa-file-excel" title="Экспорт в excel" @click="exportExcel"></i></div>
           <div class="export-button"><i class="fa fa-file-pdf" title="Экспорт в pdf" @click="exportPDF"></i></div>
      </div>
      <div class="report-content" v-if="hasEquip()">
        <div class='title'>{{report_name}} за {{monthName}} {{curYear}} года</div>
         <div id ="chart" class="chart">
          <div id="chartBar" class="chartBar">
              <apexchart width="1000" type="bar" :options="chartBarOptions" :series="seriesBar"></apexchart>
              
          </div>
          <img id="imgBar" class="img-hidden"></img>
      </div>
      </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import Loading from "vue-loading-overlay";
import canvg from "canvg";
// import FilterPlan from './FilterPlan';
import FilterPlanDate from "./FilterPlanDate";
import api from "../utils/api";
import { saveAs } from "file-saver";
import { truncated, forMonth } from "../utils/commonJS";
import ExcelJS from "exceljs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import VueApexCharts from "vue-apexcharts";
import { toCost } from "../utils/date";

export default {
  name: "rPlanFact",
  components: {
    // FilterPlan,
    FilterPlanDate,
    Loading,
  },
  props: {
    eqId: { type: Number },
  },

  data() {
    return {
      curEqId: -1,
      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth(),
      monthName: "",
      isLoading: false,
      report_name: "План и факт работы обуродования",
      fData: {},
      eqDataWork: {},
      hasLoadedImg: 0,
      labels: [],

      chartBarOptions: {
        chart: {
          id: "vuechart-example",
          toolbar: {
            tools: {
              download: false,
            },
          },
        },
        xaxis: {
          categories: [],
          title: { text: "день месяца" },
        },
        yaxis: {
          title: { text: "Время работы, ч" },
        },
        tooltip: {
          enabled: false,
          y: {
            formatter: function (val) {
              return val + " ч.";
            },
          },
        },
      },
      seriesBar: [{ name: "1", data: [] }],
    };
  },
  watch: {
    curMonth(value) {
      this.monthName = forMonth(value);
    },
  },

  methods: {
    exportExcel: function () {
      this.isLoading = true;
      if (this.hasLoadedImg == 1) {
        this.isLoading = false;
        let wb = new ExcelJS.Workbook();
        let workbookName = `${this.report_name}.xlsx`;
        let worksheetName = this.report_name;
        let ws = wb.addWorksheet(worksheetName, {
          pageSetup: { paperSize: 9, orientation: "landscape"//, printArea: "A1:P35"
           },
        });

        let title = `План и факт работы обуродования за ${this.monthName} ${this.curYear} года`;

        var imgBar = document.getElementById("imgBar");

        const imageBar = wb.addImage({
          base64: imgBar.src,
          extension: "png",
        }); 
       
       ws.mergeCells("A1:P1");
        let cell = ws.getCell('A1');

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.value = title;

        ws.addImage(imageBar, {
          tl: { col: 0, row: 1 },
          ext: { width: $(imgBar).width(), height: $(imgBar).height() },
        });

        wb.xlsx.writeBuffer().then(function (buffer) {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            workbookName
          );
        });
      } else {
        setTimeout(() => {
          this.exportExcel();
        }, 1000);
      }
    },
    exportPDF: function () {
           this.isLoading = true;
          if(this.hasLoadedImg == 1){
            this.isLoading = false;

            var imgBar = document.getElementById('imgBar');
          
            
           let title = `План и факт работы обуродования за ${this.monthName} ${this.curYear} года`;
           
            
            var docDefenition = {
              content: [
                {text:title, style: 'header'},
                  {columns:[
                    {image: imgBar.src, width:700, alignment: 'center' },
                    
                  ]
                  
                }],
          
              styles: {
                header: {fontSize: 11, alignment: 'center' },
             
              },
              pageOrientation: 'landscape'
              
            }
            pdfMake.createPdf(docDefenition).download(this.report_name + ".pdf");
         }
         else{
           setTimeout(()=>{
              this.exportPDF();
           },1000)
           
         }


    },
    filterData(eqData) {
      this.curEqId = eqData.eqId;
      this.curYear = eqData.year;
      this.curMonth = eqData.month;

      if (this.hasEquip()) {
        this.initData();
      }
    },
    loading(isLoading) {
      this.isLoading = isLoading;
    },
    hasEquip: function () {
      return this.curEqId && this.curEqId > -1;
    },
    initData: function () {
      this.isLoading = true;
      this.hasLoadedImg = 0;

      api()
        .get(
          "/rPlanFact/" ,{params: {
                            idEq: this.curEqId,
                            month: this.curMonth + 1,
                            year: this.curYear,
                           
                  }
                })
         //  + this.curEqId)
        //get('/rPlanFact/' + this.curEqId+this.month+this.year)
        .then((response) => {
          this.eqDataWork = response.data;

          this.hasLoadedImg = 0;

          var daysInMonth = new Date(
            this.curYear,
            this.curMonth,
            1
          ).daysInMonth();
          let newData = Array(daysInMonth).fill(0);
          this.labels = [];
          for (var i = 1; i <= daysInMonth; i++) {
            this.labels[i] = i.toString();
          }
          this.chartBarOptions = {
            ...this.chartBarOptions,
            ...{
              xaxis: {
                categories: this.labels,
              },
            },
          };

          this.eqDataWork.forEach((item) => {
            newData[new Date(item.days).getDate()] = ( //truncated(
              item.minute_count / 60
            ).toFixed(1);
          });
          this.seriesBar = [
            {
              data: newData,
            },
          ];

          setTimeout(() => {
            this.renderImage("chartBar", "imgBar");
          }, 3000);

          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.$alert(
            "Ошибка при получении данных об оборудовании: " + error,
            "",
            "error",
            { allowOutsideClick: false }
          );
          //alert ('Ошибка при получении данных об оборудовании: ' + error);
        });
    },
    renderImage: function (chartId, imgId) {
      var chart = document.getElementById(chartId);
      var $chart = $(chart);
      var img = document.getElementById(imgId);

      var canvas = $($chart.find(".apexcharts-canvas")[0]);

      $(img).width(canvas.width());

      html2canvas(chart, { onclone: (document) => {} }).then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");
        img.src = dataURL;
        this.hasLoadedImg++;
      });
    },
  },
  created: function () {
    this.curYear = new Date().getFullYear();
    this.curMonth = new Date().getMonth();
    this.monthName = forMonth(this.curMonth);
    this.fData.eqIdQ = this.eqId;

    window.html2canvas = html2canvas;
  },
};
</script>

<style lang="scss" scoped>
.chart {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}
.chartBar {
  margin-top: 0.5em;
  width: 1000px;
}

img {
  max-width: 100%;
  height: auto;
  width: auto\9; /* ie8 */
}
.img-hidden {
  display: none;
}
</style>