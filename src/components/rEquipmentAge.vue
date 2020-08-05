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
              <div class="action-panel-filter-item">
                <div class="action-panel-filter-button">
                    <button class="filter-button" @click="getReport" title="Применить фильтр"><i class='fa fa-check'> </i> </button>
                    <button class="filter-button" @click="clearFilter" title='Сбросить фильтр'><i class='fa fa-eraser'> </i> </button>
                    <button class="export-button" @click="exportExcel"><i class="fa fa-file-excel" title="Экспорт в excel"></i></button>
                    <button class="export-button" @click="exportPDF"><i class="fa fa-file-pdf" title="Экспорт в pdf"></i></button>
                </div>
               </div>
          </div>
        
      </div>
      <div id ="chart" class="chart">
          <div id="chartBar" class="chartBar">
              <apexchart width="500" type="bar" :options="chartBarOptions" :series="seriesBar"></apexchart>
              
          </div>
          <div id="chartPie" class="chartPie">
            <apexchart type="pie" width="380" :options="chartPieOptions" :series="seriesPie"></apexchart>
            <div class='total-title'><span>Всего {{totalCount}} ед.</span></div>
          </div>
      </div>
      <div class="report-content">
        <img id="imgBar" class="img-hidden"></img>
        <img id="imgPie" class="img-hidden"></img>
         <div class='title'>{{report_name}}</div>
          <div>
              <DataTable
                  :header-fields="headerFields"
                  :data="eqData || []"
                  :css="datatableCss"
                  @on-update="dtUpdateSort"> 
              </DataTable>
          </div>
      </div>
  </div>
</template>

<script>
   import VueApexCharts from 'vue-apexcharts'
   import html2canvas from 'html2canvas'
   import canvg from 'canvg';
 
   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
   import Loading from 'vue-loading-overlay';


  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
   import DynamicSelect from 'vue-dynamic-select'
   import {getEqReadiness} from '../utils/dictionary'
   import {toCost} from '../utils/commonJS'
   import { DataTable } from 'v-datatable-light'

   export default {
    name: "rEqList",
    components: {
        DataTable,
        DynamicSelect,
        Loading,
    },
    data() {
       return {
         report_name: 'Возраст оборудования',
         eqInitialList: [],
         eqData: [],
         devisionList: [],
         readinessList: [],
         locationList: [],
         totalCount: 0,
         fData: {
            devision: null,
            location: null
          },
         sort: 'asc',
         labels: ['0-10 лет', '11-20 лет', '21-30 лет', '31-40 лет', '41-50 лет', '51-60 лет', '61-70 лет', '71-80 лет', '81-90 лет'],
        isLoading: false,
        hasLoadedImg: 0,
         headerFields: [
             { name: "cardNum", label: "Карточка №",  sortable: true },
            { name: "devisionName", label: "Подразделение",  sortable: true },
            { name: "name", label: "Название оборудования",  sortable: true} ,
            { name: "invNum", label: "Инвентарный номер",  sortable: true },
            { name: "factDateYear", label: "Год выпуска",  sortable: true },
            { name: "age", label: `Возраст в ${(new Date).getFullYear()}`,  sortable: true },
        ],
       datatableCss: {
        table: 'table table-hover table-center eqAge-table',
        theadTh: 'header-item',
        tbodyTd: 'body-item',
        tbodyTr: 'body-row'
       },
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
              title: {text: 'Возраст ИО (лет)' }
           },
            tooltip: {
              enabled: false,
              y: {
                formatter: function (val) {
                  return  val + ' ед.'
                }
              }
           }
         },
         seriesBar: [{ name: 'Количество оборуд.', data: [] }],

          seriesPie: [],
         chartPieOptions: {
             chart: {
               width: 380,
               type: 'pie',
             },
             labels: [],
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
                text: "Возраст оборудования"
              },
              // dataLabels: {
              //   formatter(val, opts) {
              //     console.log(opts);
              //     const name = opts.w.globals.labels[opts.seriesIndex]
              //     return [name, val.toFixed(1) + '%']
              //   }
              // },
           }
       }
    },
    methods: {
        exportExcel: function(){
        this.isLoading = true;
        if(this.hasLoadedImg == 2){
            this.isLoading = false;
              let wb = new ExcelJS.Workbook();
              let workbookName = `${this.report_name}.xlsx`;
              let worksheetName = this.report_name;
              let ws = wb.addWorksheet(worksheetName);
              let wsChart = wb.addWorksheet('Диаграммы');

      

        ws.columns = [
          { 
            key: "cardNum", 
            header: "№", 
            width: 10
          },
          {
            key: "devisionName",
            header: "Подразделение",
            width: 20
          },
          {
            key: "name",
            header: "Название оборудования",
            width: 50
          },
          {
            key: "invNum",
            header: "Инвентарный номер",
            width: 15
          },
          {
            key: "factDateYear",
            header: "Год выпуска",
            width: 10
          },
          {
            key: "age",
            header: `Возраст в ${(new Date).getFullYear()}`,
            width: 15
          }
          
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

          let ageCol = ws.getColumn("F");
          let curYear = (new Date).getFullYear();
          ageCol.eachCell(function(ageCell, rowNumber) {
              if (rowNumber !== 1) {
                let ageFormula = `${curYear}-E${rowNumber}`;
                ageCell.value =  { formula: ageFormula };
              }
          });


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


          for(let i = 0; i < 9; i++)
          {
            let cellLabel =  ws.getCell('H'+(i+3));
            let bAge = i !== 0 ? i * 10 + 1 : 0;
            let eAge = (i + 1) * 10;
            cellLabel.value =`${bAge}-${eAge} лет`;

            let cellCount = ws.getCell('I'+(i+3));
            let range = `F2:F${this.eqData.length + 1}`;
            let bCriteria = `>=${bAge}`;
            let eCriteria = `<=${eAge}`;
            let countFormula = `COUNTIFS(${range}, "${bCriteria}", ${range}, "${eCriteria}")`;

            cellCount.value = { formula: countFormula };

            cellLabel.border = { top: {style: 'thin'}, 
                            left: {style: 'thin'}, 
                            bottom: {style: 'thin'}, 
                            right: {style: 'thin'}
                          };

            cellCount.border = { top: {style: 'thin'}, 
                            left: {style: 'thin'}, 
                            bottom: {style: 'thin'}, 
                            right: {style: 'thin'}
                          };
          }
          ws.getCell('H13').value = 'Итого';
          ws.getCell('H13').border = { top: {style: 'thin'}, 
                        left: {style: 'thin'}, 
                        bottom: {style: 'thin'}, 
                        right: {style: 'thin'}
                      };
          let range = `I3:I11`;
          let sumFormula = `SUM(${range})`;
          ws.getCell('I13').value = { formula: sumFormula };
          ws.getCell('I13').border = { top: {style: 'thin'}, 
                        left: {style: 'thin'}, 
                        bottom: {style: 'thin'}, 
                        right: {style: 'thin'}
                      };


        //-------------------------------------
            var imgBar = document.getElementById('imgBar');
            var imgPie = document.getElementById('imgPie');

              const imageBar = wb.addImage({
                base64: imgBar.src,
                extension: 'png',
              });
              wsChart.addImage(imageBar,  {
                  tl: { col: 0, row: 0 },
                  ext: { width: $(imgBar).width(), height: $(imgBar).height() }
                });

                const imagePie = wb.addImage({
                base64: imgPie.src,
                extension: 'png',
              });
              wsChart.addImage(imagePie,  {
                  tl: { col: 0, row: 20 },
                  ext: { width: $(imgPie).width(), height: $(imgPie).height() }
                });


          wb.xlsx.writeBuffer()
            .then(function(buffer) {
              saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                workbookName
              );
          });
        }
        else{
           setTimeout(()=>{
              this.exportExcel();
           },1000)
           
         }
  
        },
        exportPDF: function(){
          this.isLoading = true;
          if(this.hasLoadedImg == 2){
            this.isLoading = false;

            var imgBar = document.getElementById('imgBar');
            var imgPie = document.getElementById('imgPie');
        
            var headers = [];
          

          this.headerFields.forEach((hField) => {
                      headers.push({ text: hField.label, style: 'tableHeader' })
                });

            var body = [];
            body.push (headers);
      
            this.eqData.forEach((dItem) =>{
                    let dataItem = [];
                      this.headerFields.forEach((hField) => {
                              dataItem.push({ text: dItem[hField.name], style: 'defaultStyle' });
                      })
                  body.push(dataItem);
                })


            var docDefenition = {
              content: [
                  {columns:[
                    {image: imgBar.src, width:400, alignment: 'center' },
                    {image: imgPie.src,  width:300, alignment: 'center'}
                  ],
                  pageBreak: 'after'},
                  {text:`${this.report_name}`, style: 'header'},
                  {
                    table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: [ 80,80,280,80,80,80],
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
         }
         else{
           setTimeout(()=>{
              this.exportPDF();
           },1000)
           
         }
    
        },
        clearFilter: function(){
          this.fData = {
            devision: null,
            location: null
          };
          this.getReport();
        },
        getReport: function(){
            this.isLoading = true;
             this.eqData = this.eqInitialList;
            if (this.fData.devision) 
                this.eqData = _.filter(this.eqData, {'devision': this.fData.devision.id})

            if (this.fData.location) 
                this.eqData = _.filter(this.eqData, {'location': this.fData.location.name})

            this.countAge();
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
      
        initData: function(){
            this.isLoading = true;

            api().
            get('/dictionary')
            .then(response => {
                let dict = response.data;
                this.devisionList =  dict.divisionList;
                
                api().
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
                        eqItem.comDateYear = item.eq_comdate ? eqItem.comDate.getFullYear() : '';
                        eqItem.factDate =  item.fact_date ? new Date(item.fact_date) : '';
                        eqItem.factDateYear = item.fact_date ? eqItem.factDate.getFullYear() : '';
                        // eqItem.age =  ((new Date).getFullYear() - eqItem.factDateYear);
                        eqItem.age = eqItem.factDate ? ((new Date).getFullYear() - eqItem.factDateYear) : 0;
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
        },
        countAge: function()
        {
          this.hasLoadedImg = 0;
          let newData = Array(this.labels.length).fill(0);
          this.eqData.forEach(eq => newData[parseInt((eq.age-1)/10)]++ ) //считаем количество

          this.seriesBar = [{
              data: newData
          }]
          this.seriesPie =  newData;
          this.totalCount = this.eqData.length;

          // this.chartPieOptions = {...this.chartPieOptions, ...{
          //   title: {text: `Возраст Оборудования`},
          // }}
           this.isLoading = false;
          setTimeout(() => {
              
              this.renderImage('chartBar', 'imgBar');
              this.renderImage('chartPie', 'imgPie');}, 3000);

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
                 if(this.hasLoadedImg == 2)
                 {
                    
                    this.$emit('resizeHeader');
                 }
          })


        }
    },
     mounted: function()
      {
        
        this.chartBarOptions = {...this.chartBarOptions, ...{
        xaxis: {
            categories: this.labels
          }
      }}
      this.chartPieOptions = {...this.chartPieOptions, ...{
          labels: this.labels
      }}
      
       window.html2canvas = html2canvas;

        this.initData();
      
      }
    
}
</script>

<style lang="scss">

.chart{
   display: flex;
   flex-wrap: nowrap;
  justify-content:center;
}
.chartBar{
  margin-top: .5em;
  width: 500px;
}
.chartPie{
  margin-top: .5em;
  width: 380px;
}

 img {
    max-width: 100%;
    height: auto;
    width: auto\9; /* ie8 */
 }
 .img-hidden{
   display: none;
 }

.total-title{
  text-align: center;
  width:100%;
}
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