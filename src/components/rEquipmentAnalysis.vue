<template lang="html">
 <div class="vld-parent">
    <loading :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        color='#e21a1a'>
    </loading>
      <div class="action-panel-end">
        <div class="action-panel-btn">
            <button class="export-button" @click="getDiagram" title= 'Построить диаграммы'><i class='fa fa-chart-pie'> </i> </button></td>
            <button class="export-button" @click="exportExcel"><i class="fa fa-file-excel" title="Экспорт в excel"></i></button>
            <button class="export-button" @click="exportPDF"><i class="fa fa-file-pdf" title="Экспорт в pdf"></i></button>

        </div>
      </div>
        <div class='title'>Анализ работы оборудования по данным за 
          <date-picker v-model="calMonth"  type="month"  format="MMMM YYYY года" :editable="false" popup-class='calPopup' name="Month"></date-picker>
        </div>
        <div class="row-item">
              <div class="cell" style="width:35%; min-width: 280px"><span class="bold"> Всего </span> <span>подлежащего учёту лабораторного испытательного оборудования:</span></div>
              <div class="cell-unit red"><input v-model="total" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span>ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:25%; min-width: 200px"></div>
              <div class="cell fix" style="width:5%; min-width: 70px"><span>из них:</span></div>
        </div>
         <div class="row-item">
              <div class="cell" style="width:70%; min-width: 560px"><span>1) </span> <span class="bold"> Учтённое</span> <span>(по форме, утверждённой Приказом АО «ВНИИЖТ» от 25.10.2017 г. № УД-00-02/162)</span> <span class="bold"> и задействованное в работе оборудование в {{month}} {{year}} года – </span></div>
              <div class="cell-unit red"><input v-model="account" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span>ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:70%; min-width: 420px"></div>
              <div class="cell" style="width:20%; min-width: 180px"><span>из них искажена отчётность на </span></div>
              <div class="cell-unit red"><input v-model="distored"  onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span> ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:25%; min-width: 200px"><span> 2) </span> <span class="bold">Учтённое оборудование по своей форме – </span> </div>
              <div class="cell-unit red"><input v-model="ring" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span> ед. </span></div>
              <div class="cell" style="width:30%; min-width: 240px">
                <!-- <span>(только в НЦ «РСТМ» на Экспериментальном кольце п. 85 – 91) </span> -->
                </div> 
              <div class="cell" style="width:10%; min-width: 80px"></div>
              <!-- <div class="cell-unit red"><input v-model="vka" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span>ед.</span></div>
               <div class="cell" style="width:15%; min-width: 120px"><span>  только в ВКА п. 15, 20, 21</span> </div> -->
        </div>
        <div class="row-item">
              <div class="cell" style="width:15%; min-width: 120px"><span>3) </span> <span class="bold">Не ведётся учёт на </span></div>
              <div class="cell-unit red"><input v-model="notAccount" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span>ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
              <div class="cell fix" style="width:210pt;"><span class="bold">- по техническим причинам на </span></div>

              <div class="cell-unit red"><input v-model="techReason" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span>ед.:</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
              <div class="cell fix" style="width: 100pt"><span> на списание  – </span></div> 
              <div class="cell-unit"><input v-model="deccommission" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title fix" style="width: 110pt"><span> ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
               <div class="cell fix" style="width: 100pt"><span> консервация  – </span></div> 
              <div class="cell-unit"><input v-model="conservation" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title fix" style="width: 210pt" ><span> ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
               <div class="cell fix" style="width: 210pt"><span>разукомплектованное состояние  – </span></div> 
              <div class="cell-unit"><input v-model="unpacked" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title fix" style="width: 90pt"><span> ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
               <div class="cell fix" style="width: 210pt"><span> неработоспособное состояние  – </span></div> 
              <div class="cell-unit"><input v-model="inoperable" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title fix" style="width: 90pt"><span> ед.</span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
              <div class="cell fix" style="width:200pt;"><span class="bold">  - по причине модернизации  – </span></div>
              <div class="cell-unit red"><input v-model="modern" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span> ед.</span></div>
              <!-- <div class="cell" style="width:25%; min-width: 200px"><span>(только в НЦ «РСТМ» на Экспериментальном кольце п. 66)</span></div> -->
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
              <div class="cell fix" style="width:320pt;"><span class="bold">- по причине отсутствия приходных договоров – </span></div>
              <div class="cell-unit red"><input v-model="lackOfContr" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span> ед. </span></div>
        </div>
        <div class="row-item">
              <div class="cell" style="width:20%; min-width: 160px"></div>
              <div class="cell fix" style="width:380pt;"><span class="bold">- по причине отсутствия ответственной штатной единицы – </span></div>
              <div class="cell-unit red"><input v-model="lackOfPost" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"></input></div>
              <div class="cell-unit title red"><span> ед.</span></div>
        </div>
          <div style="display: none">{{techReasonSum}}</div>  
          <div style="display: none">{{notAccountSum}}</div>  
         <div id ="chart" class="chart">
         
          <div id="chartPie1" class="chartPie">
            <apexchart type="pie" width="450" :options="chartPieOptions1" :series="seriesPie1"></apexchart>
          </div>

          <div id="chartPie2" class="chartPie">
            <apexchart type="pie" width="450" :options="chartPieOptions2" :series="seriesPie2"></apexchart>
          </div>

          <img id="imgPie1" class="img-hidden"></img>
          <img id="imgPie2" class="img-hidden"></img>
      </div>
  </div>
</template>

<script>
   import VueApexCharts from 'vue-apexcharts'
  import html2canvas from 'html2canvas'
  import Loading from 'vue-loading-overlay';
  //window.jsPDF = require('jspdf');
  //import jsPDF from 'jspdf'; 
  // import '../js/arial-normal.js'
  // import '../js/arial-bold.js'
  import api from "../utils/api";
  import { inMonth } from "../utils/commonJS";
  import { saveAs } from 'file-saver';
  import ExcelJS from 'exceljs'; 
  import 'jspdf-autotable';
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'

   export default {
    name: "rEqAnal",
    components: {
       Loading,
       DatePicker
     },
    data() {
       return {
         report_name: 'Анализ работы оборудования',
         report_title: '',
         calMonth: new Date(),
         month: inMonth(new Date().getMonth()),
         year: new Date().getFullYear(),
         total: '',
         account: '',
         distored: '',
         ring: '',
       
         notAccount: '',
         techReason: '',
         deccommission: '',
         conservation: '',
         unpacked: '',
         inoperable: '',
         modern: '',
         lackOfContr: '',
         lackOfPost: '',
         isLoading: false,
         hasLoadedImg: 0,
         
           seriesPie1: [],
          chartPieOptions1: {
              chart: {
                width: 450,
                type: 'pie',
             },
              labels: ['Ведётся учёт', 'Ведётся учёт по своей форме','Не ведётся учёт'],
              colors: ['#e53232', '#e59232', '#e8e235', '#4de835', '#2a8f28', '#35e8e8', '#357de8','#6e35e8','#d935e8'],
              responsive: [{
                breakpoint: 500,
                options: {
                  chart: {
                    width: 200
                  }
                  /*,
                  legend: {
                    position: 'bottom'
                  }*/
                }
              }],
               tooltip: {
                   y: {
                     formatter: function (val) {
                       return  val + ' ед.'
                     }
                   }
               },
               title: {
                 text: "Учёт работы оборудования"
               },
              legend: {
                show: false
              },
              dataLabels: {
                  formatter(val, opts) {
                    var maxLength = 15;
                    var name = opts.w.globals.labels[opts.seriesIndex] 
                    const unit = opts.w.globals.series[opts.seriesIndex]  
                    if (name.length > maxLength)
                    {
                      let index = name.indexOf(' ', maxLength);
                      return [name.substring(0, index), name.substring(index + 1, name.length), 
                      ' - ' + unit +' ед.', '(' + val.toFixed(1) + '%)']
                    }
                   
                    return [name, ' - ' + unit +' ед.', '(' + val.toFixed(1) + '%)']
                  }
               },
            },
           

          seriesPie2: [],
         chartPieOptions2: {
             chart: {
               width: 450,
               type: 'pie',
             },
             labels: ["по техническим причинам", "На модернизации", "Отсутствие приходных договоров", "Отсутствие ответственной штатной единицы"],
             colors: ['#e53232', '#e59232', '#e8e235', '#4de835', '#2a8f28', '#35e8e8', '#357de8','#6e35e8','#d935e8'],
             responsive: [{
               breakpoint: 480,
               options: {
                 chart: {
                   width: 200
                 },
                 legend: {
                   position: 'bottom'
                 }
               }
             }],
              tooltip: {
                  y: {
                    formatter: function (val) {
                      return  val + ' ед.'
                    }
                  }
              },
              title: {
                text: "Причины отсутствия учёта работы оборудования"
              },
              legend: {
                show: false
              },
              dataLabels: {
                  formatter(val, opts) {
                    var maxLength = 15;
                    var name = opts.w.globals.labels[opts.seriesIndex] 
                    const unit = opts.w.globals.series[opts.seriesIndex]  
                    if (name.length > maxLength)
                    {
                      let index = name.indexOf(' ', maxLength);
                      return [name.substring(0, index), name.substring(index + 1, name.length), 
                      ' - ' + unit +' ед.', '(' + val.toFixed(1) + '%)']
                    }
                   
                    return [name, ' - ' + unit +' ед.', '(' + val.toFixed(1) + '%)']
                  }
               },
           }
       }
    },
    computed: {
        techReasonSum: function(){
          let sum = (parseInt(this.deccommission) ? parseInt(this.deccommission) : 0)
             + (parseInt(this.conservation) ? parseInt(this.conservation) : 0)
             + (parseInt(this.unpacked) ? parseInt(this.unpacked) : 0)
             + (parseInt(this.inoperable) ? parseInt(this.inoperable) : 0);
             this.techReason = sum == 0 ? '' : sum;
             return sum;
          },
            notAccountSum: function(){
            let sum = (parseInt(this.techReason) ? parseInt(this.techReason) : 0)
               + (parseInt(this.modern) ? parseInt(this.modern) : 0)
               + (parseInt(this.lackOfContr) ? parseInt(this.lackOfContr) : 0)
               + (parseInt(this.lackOfPost) ? parseInt(this.lackOfPost) : 0);
               this.notAccount = sum == 0 ? '' : sum;
               return sum;
          }
    },
    watch: {
      calMonth: function(value){
         this.month = inMonth(value.getMonth());
        this.year = value.getFullYear();
        let monthName = value.toLocaleString('ru', { month: 'long'  });
        this.report_title = `По данным за ${monthName} ${this.year} года`;
      }
    },
    methods: {
        initData: function(){
          this.isLoading = true;
              this.total = 109;
              this.ring = 7;
              this.deccommission = 2;
              this.conservation = 7;
              this.unpacked = 1;
              this.inoperable = 1;
              this.techReason = 15;

              let monthName = (new Date()).toLocaleString('ru', { month: 'long'  });
              this.report_title = `По данным за ${monthName} ${this.year} года`;
              this.getDiagram();
              this.$emit('resizeHeader');

          this.isLoading = true;
        },
         getDiagram:function(){
           this.isLoading = true;
          this.hasLoadedImg = 0;
          let newData1 = [parseInt(this.account) ? parseInt(this.account) : 0,
             (parseInt(this.ring) ? parseInt(this.ring) : 0)
            // + (parseInt(this.vka) ? parseInt(this.vka) : 0)
            ,
             parseInt(this.notAccount) ? parseInt(this.notAccount) : 0]
            
          let newData2 = [parseInt(this.techReason) ? parseInt(this.techReason) : 0,
             (parseInt(this.modern) ? parseInt(this.modern) : 0),
             (parseInt(this.lackOfContr) ? parseInt(this.lackOfContr) : 0),
             parseInt(this.lackOfPost) ? parseInt(this.lackOfPost) : 0]

         
          this.seriesPie1 =  newData1;
          this.seriesPie2 =  newData2;
         
          setTimeout(() => {
              this.renderImage('chartPie1', 'imgPie1');
              this.renderImage('chartPie2', 'imgPie2');
          }, 1000);
          
        },
        exportExcel: function(){
          let wb = new ExcelJS.Workbook();
          let workbookName = `${this.report_name}.xlsx`;
          let worksheetName = this.report_name;
          let ws = wb.addWorksheet(worksheetName);
          let wsChart = wb.addWorksheet('Диаграммы');

          let rowIndex = 2;
          let colIndex = 4;
         
            
          ws.mergeCells(rowIndex,6, rowIndex, 8);
          var slot  = ws.getRow(rowIndex).getCell(6);
            slot.value = this.report_title;
            slot.style = {alignment: {
                          horizontal: 'center', 
                        } };
           rowIndex +=2;
           var rows = $(".row-item")
            rows.each(i => {
                   colIndex = 4;
                  $(rows[i]).find("div").each((j, cell) => {
                    let $cell = $(cell);
                    let cellWidth =  $cell.width();
                    let documentWidth = $(".row-item").width();  
                    let colCount = Math.round(cellWidth/(documentWidth*0.05));
                    if ($cell.hasClass('fix')) colCount = Math.round(cellWidth/70);
                    if ($cell.hasClass('cell')){
                        let value =  [];
                        if ($cell.find('span').length > 0){
                            
                             $cell.find('span').each((k, span) => {
                               let val = span.innerText;
                              value.push ( {'font': {size: 10, 'bold': $(span).hasClass('bold')},'text': val})
                             
                               //   doc.text(value, curX, curY, {align: "left"});

                             })

                            slot = ws.getRow(rowIndex).getCell(colIndex);
                            slot.value = {'richText': value};
                            
                          slot.style = {
                            font: { size: 10}
                          }

                         }
                    }
                    else if ($cell.hasClass('cell-unit'))
                    {
                      
                     // if ($cell.hasClass('red'))
                    //      doc.setTextColor('red');
                        let value =  cell.innerText;
                        if ($cell.find('input').length > 0){
                            value = $cell.find('input')[0].value;
                            if (value == "") value = '0';
                        }
                        slot = ws.getRow(rowIndex).getCell(colIndex);
                        slot.value = value;

                       
                          slot.style = {
                            font: { color: {argb: $cell.hasClass('red') ? "ff0000" : '000000'}, size: 10},
                            alignment: { horizontal: $cell.hasClass('title') ? 'left' : 'center'} 
                          }
                    }
                    colIndex += colCount;
                  })
                  rowIndex++;
            })





          var imgPie1 = document.getElementById('imgPie1');
          var imgPie2 = document.getElementById('imgPie2');

         const imagePie1 = wb.addImage({
           base64: imgPie1.src,
           extension: 'png',
         });
         wsChart.addImage(imagePie1,  {
            tl: { col: 0, row: 0 },
            ext: { width: $(imgPie1).width(), height: $(imgPie1).height() }
          });

         const imagePie2 = wb.addImage({
           base64: imgPie2.src,
           extension: 'png',
         });
         wsChart.addImage(imagePie2,  {
            tl: { col: 0, row: 20 },
            ext: { width: $(imgPie2).width(), height: $(imgPie2).height() }
          });



    wb.xlsx.writeBuffer()
      .then(function(buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          workbookName
        );
    });
          
        },
        exportPDF: function(){
           
          const doc = new jsPDF('l', 'pt', 'a4'); 
          doc.setFont("arial", "normal");
          var fontSize = 11;
          doc.setFontSize(fontSize);

          var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
          var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
          let finalY = 32;
          var lineHeight = 18;
          var lineStart = 30;

          doc.text(this.report_name, pageWidth/2, finalY, {align: "center"});
          finalY+=lineHeight
          doc.text(this.report_title, pageWidth/2, finalY, {align: "center"});//, maxWidth});

          var maxRow = 1;

            var rows = $(".row-item")
            rows.each(i => {
                var finalX = lineStart;
                var unitWidth = doc.getStringUnitWidth('1')
                finalY += (lineHeight*maxRow);
                maxRow = 1;
                $(rows[i]).find("div").each((j, cell) => {
                  doc.setFont("arial", "normal"); 
                  doc.setTextColor('black');
                  let $cell = $(cell);
                  let cellWidth =  $cell.width();
                  let documentWidth = $(".row-item").width();  
                  let width = cellWidth/documentWidth * pageWidth*0.95;
                  if ($cell.hasClass('fix')) width = cellWidth * 0.7;
                  let curMaxRow = 1;
                    if ($cell.hasClass('cell'))
                    {
                        if ($cell.find('span').length > 0){
                            let startX = finalX;
                            let curX = finalX, curY = finalY;
                             $cell.find('span').each((k, span) => {
                                doc.setFont("arial", "normal"); 
                                if ($(span).hasClass('bold'))
                                    doc.setFont("arial", "bold"); 
                                let value = span.innerText + ' ';
                                if (!$cell.hasClass('fix') && (curX - startX + value.length*unitWidth*fontSize) > width){
                                  let maxLength = Math.floor((width - curX + startX) /(fontSize*unitWidth));
                                  let lastIndex = value.substring(0, maxLength).lastIndexOf(' ');
                                  doc.text(value.substring(0, lastIndex), curX, curY, {align: "left"});
                                  curX = startX;
                                  curY += lineHeight;
                                  doc.text(value.substring(lastIndex+1), curX, curY, {align: "left"});
                                  curX += ((value.length - lastIndex -1)*unitWidth*fontSize);
                                  curMaxRow++;
                                }
                                else  
                                {
                                  doc.text(value, curX, curY, {align: "left"});
                                  curX+= (value.length*unitWidth*fontSize);
                                }
                             })
                             finalX += width;
                         }
                         else  finalX += width;
                         if (curMaxRow > maxRow) maxRow = curMaxRow;
                    }
                    else if ($cell.hasClass('cell-unit'))
                    {
                      //.title
                      //.red
                      if ($cell.hasClass('red'))
                          doc.setTextColor('red');
                        let value =  cell.innerText;
                        if ($cell.find('input').length > 0){
                            value =  $cell.find('input')[0].value;
                            if (value == "") value = '0';
                        }
                        doc.text(value, finalX, finalY, {align: "left"});
                        finalX += width;
                    }
                })
            })
            doc.addPage('p', 'pt', 'a4');
            pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            var imgPie1 = document.getElementById('imgPie1');
            var imgPie2 = document.getElementById('imgPie2');

            finalY = 32;
            let imgScale = 0.8;
            doc.addImage(imgPie1.src, 'PNG', (pageWidth - $(imgPie1).width()*imgScale)/2, finalY, $(imgPie2).width()*imgScale, $(imgPie2).height()*imgScale);

            finalY += $(imgPie1).height() + 10;
            doc.addImage(imgPie2.src, 'JPEG',  (pageWidth - $(imgPie2).width()*imgScale)/2, finalY, $(imgPie2).width()*imgScale, $(imgPie2).height()*imgScale);
        
          doc.save(this.report_name + '.pdf');
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
                 this.hasLoadedImg++;
                 if(this.hasLoadedImg == 2) this.isLoading = false;
          })


        }
    },
     mounted: function()
      {
        window.html2canvas = html2canvas;

        this.initData();
      
      }
}

</script>

<style lang="scss" scoped>


.title{
    width:100%;
    font-size: 18px;
    text-align: center;
}
.row-item{
  display: flex;
  width: 100%;
  min-width: 800px;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding-top:.5em;
}
.cell{
  text-align: left;

}
.cell-unit{
  width: 5%;
  min-width: 40px;
  text-align: center;
  padding: 0;
}
.cell-unit .title{
  text-align: left;
}
.cell-unit input{
  width: 100%;
  text-align: center;
  border: 1px solid #ced4da;
  -moz-border-radius: .25em;
  -webkit-border-radius:  .25em;
  border-radius:  .25em;
}
.red, 
.red input{
   color:red;
}
span {
  font-size: 12pt;
}
.chart{
   display: flex;
   flex-wrap: nowrap;
  justify-content:center;
}
.chartPie{
  margin-top: .5em;
  width: 450px;
}
 img {
    max-width: 100%;
    height: auto;
    width: auto\9; /* ie8 */
 }
 .img-hidden{
   display: none;
 }
 .bold{
   font-weight: 600;
 }
@media screen and (max-width: 900px) {
 
    .action-panel{
        justify-content: flex-start;
    }
    .chart{
      flex-wrap: wrap;
    }
  }


</style>