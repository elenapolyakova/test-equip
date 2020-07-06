<template lang="html">
   <div class="vld-parent">
    <loading :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        color='#337ab7'>
    </loading>
      <div class="action-panel">
           <button class="export-button" @click="exportExcel"><i class="fa fa-file-excel" title="Экспорт в excel"></i></button>
            <button class="export-button" @click="exportPDF"><i class="fa fa-file-pdf" title="Экспорт в pdf"></i></button>
      </div>
      
        <div class='title'>О работе лабораторного испытательного оборудования научных подразделений за
         <date-picker v-model="calMonth"  type="month"  format="MMMM YYYY года" :editable="false" popup-class='calPopup' name="Month"></date-picker></div>
        
         <table class="table table-bordered table-hover table-striped table-center table-eq-work" id="table-eq-work">
            <thead>
              <tr>
                <th style="width: 50px">№ п/п</th>
                <th style="width: 400px; min-width: 300px">Наименование единицы лаб. исп. оборудования</th>
                <th>Инвентарный номер</th>
                <th>Общая прод-ть работы оборудования, ч</th>
                <th>Общий расход ТЭР (эл. энергия, кВт.ч; горюче-смазочные материалы, л.)</th>
                <th>Общее время (ч) вынужденного простоя</th>
                <th>Основание (договор/наряд-заказ-приказ или распоряжение)</th>
                <th>Ответственное лицо (ФИО)</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>

         
  </div>
</template>

<script>
   import html2canvas from 'html2canvas'
   import canvg from 'canvg';

   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
   import Loading from 'vue-loading-overlay';
   import DatePicker from 'vue2-datepicker'
   import 'vue2-datepicker/index.css'
   import 'vue2-datepicker/locale/ru'
   import {getDevFullName, getEqReadiness} from '../utils/dictionary'
   import { truncated, forMonth } from "../utils/commonJS";
   import pdfMake from 'pdfmake/build/pdfmake'
   import pdfFonts from 'pdfmake/build/vfs_fonts'


   //import {arialNormal} from '../js/arial'

   // pdfFonts.pdfMake.vfs["arial-normal.ttf"]= arialNormal;
   pdfMake.vfs = pdfFonts.pdfMake.vfs

   //pdfMake.fonts = {
   //arial: {
   //  normal: 'arial-normal.ttf',
   //  bold: 'arial-normal.ttf',
   //  italics: 'arial-normal.ttf',
   //  bolditalics: 'arial-normal.ttf'
   //}
  // }
   

   export default {
    name: "rEqWork",
    components: {
       Loading,
       DatePicker
     },

    data() {
       return {
         devFullNameList: [],
         responsibleList: [],
         eqReadinessList: [],
         eqDevisionList: [],
         report_name: 'О работе лабораторного ИО',
         calMonth: new Date(),
         isLoading: false,
         rows: [],
         total: {},
         totalCount: 0,
         totalReference: 0,
         workCount: 0,
       }
    },
    methods: {
        exportExcel: function(){
             let wb = new ExcelJS.Workbook();
            let workbookName = `${this.report_name}.xlsx`;
            let worksheetName = this.report_name;
            let ws = wb.addWorksheet(worksheetName, {
                  pageSetup:{paperSize: 9, orientation:'landscape'}
            });


            let title = `О работе лабораторного испытательного оборудования научных подразделений за ${forMonth(this.calMonth.getMonth())} ${this.calMonth.getFullYear()} года`;

            ws.getColumn(1).width = 5;
            ws.getColumn(2).width = 28;
            ws.getColumn(3).width = 10;
            ws.getColumn(3).width = 15;
            ws.getColumn(4).width = 15;
            ws.getColumn(5).width = 15;
            ws.getColumn(6).width = 15;
            ws.getColumn(7).width = 15;
            ws.getColumn(8).width = 18;

           // ws.pageSetup.printTitlesRow = '1:3';

            let rowIndex = 1;
            let colCount = $("#table-eq-work").find('th').length;

            ws.mergeCells(rowIndex,1, rowIndex, colCount);
            var cell  = ws.getRow(rowIndex).getCell(1);
              cell.value = title;
              cell.style = {alignment: {
                            horizontal: 'center', 
                            wrapText: true
                          } };

             ws.views = [{ state: "frozen", ySplit: 2}];
            let colIndex = 1;
            rowIndex++;
            $("#table-eq-work").find('th').each((i, th) => {
                cell = ws.getRow(rowIndex).getCell(colIndex);
                cell.value = $(th).text()
                cell.style = {alignment: {
                                 horizontal:'center',
                                 vertical:"middle", 
                                 wrapText: true
                          } };
                 cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: "9cc2e5" }
                    };
                 colIndex++;
               
            })

          let index = 1;

          this.eqDevisionList.forEach((devision, devIndex) => {
            rowIndex++;
            colIndex = 1;

            let devisionUnit = _.filter(this.rows, {'idDev': devision.id});
            let countUnit = devisionUnit.length;
            let devisionName = this.devFullName(devision.id) != '' ? 
                  `${this.devFullName(devision.id)} (${devision.name})` : `${devision.name}`;
            
           
             ws.mergeCells(rowIndex,1, rowIndex, colCount);
             var cell = ws.getRow(rowIndex).getCell(1);
              cell.value = `${devIndex+1}.0 ${devisionName} - ${countUnit} ед.`;
              cell.style = {alignment: {
                              horizontal: 'left', 
                              wrapText: true
                            },
                             font: { 
                               bold: true
                               }
                            };
               cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: "c5e0b3" }
                    };
            
            var totalWorkTime = 0, totalExpense = 0;
            devisionUnit.forEach((unit) =>{
                rowIndex++;
                colIndex = 1;

                totalWorkTime += unit.workTime;
                totalExpense += unit.expense;

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = index++;
              cell.style = {alignment: { horizontal: 'center',  vertical: 'middle' }};

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = unit.eqName
              cell.style = {alignment: { horizontal: 'left', vertical: 'top', wrapText: true }};

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = unit.invNum;
              cell.style = {alignment: { horizontal: 'center', vertical:"middle", wrapText: true  }};

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = unit.workTime;
              cell.style = {alignment: { horizontal: 'center', vertical:"middle" }};

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = unit.expense.toString().replace('.',',');
              cell.style = {alignment: { horizontal: 'center', vertical:"middle" }};

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = unit.outage;
              cell.style = {alignment: { horizontal: 'center', vertical:"middle" }};

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = unit.contract;
              cell.style = {alignment: { horizontal: 'center', vertical:"middle", wrapText: true }};

              cell = ws.getRow(rowIndex).getCell(colIndex++);
              cell.value = unit.responsibleName;
              cell.style = {alignment: { horizontal: 'center', vertical:"middle", wrapText: true }};
            })
            
            rowIndex++;
            colIndex = 1;
            ws.mergeCells(rowIndex,colIndex, rowIndex, colIndex+2);
            cell = ws.getRow(rowIndex).getCell(colIndex);
            cell.value = `Итого по ${devision.name}:`;
            cell.style = {alignment: {
                              horizontal: 'left'
                            },
                             font: { 
                               bold: true,
                               color: {argb:"ffffff"}
                               }
                            };
               cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: "000000" }
                    };
             colIndex +=3;

            cell = ws.getRow(rowIndex).getCell(colIndex++);
            cell.value = `${totalWorkTime}`;
            cell.style = {alignment: {
                              horizontal: 'center'
                            },
                             font: { 
                               bold: true,
                               color: {argb:"ffffff"}
                               }
                            };
               cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: "000000" }
                    };

            cell = ws.getRow(rowIndex).getCell(colIndex++);
            cell.value = `${totalExpense.toString().replace('.',',')} кВт.ч`;
            cell.style = {alignment: {
                              horizontal: 'center'
                            },
                             font: { 
                               bold: true,
                               color: {argb:"ffffff"}
                               }
                            };
               cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: "000000" }
                    };

            ws.mergeCells(rowIndex,colIndex, rowIndex, colIndex+2);
            cell = ws.getRow(rowIndex).getCell(colIndex);
            cell.value = '';
            cell.style = {font: { color: {argb:"ffffff"}}};
            cell.fill = { type: "pattern",pattern: "solid", fgColor: { argb: "000000" }};

          })

        

              ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
              if (rowNumber > 1)
              {
                    row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                     
                       cell.border = { top: {style: 'thin'}, 
                          left: {style: 'thin'}, 
                          bottom: {style: 'thin'}, 
                          right: {style: 'thin'}
                        };
                   
                  });
              }
            });

            wb.xlsx.writeBuffer()
            .then(function(buffer) {
              saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                workbookName
              );
            })
        },
        exportPDF: function(){
          var headers = [];
          $("#table-eq-work").find('th').each((i, th) => {
              headers.push({ text: $(th).text(), style: 'tableHeader' })
          })
          var body = [];
          body.push (headers);

          let index = 1;
          var row = [];
          this.eqDevisionList.forEach((devision, devIndex) => {
             row = [];
            let devisionUnit = _.filter(this.rows, {'idDev': devision.id});
            let countUnit = devisionUnit.length;
            let devisionName = this.devFullName(devision.id) != '' ? 
                  `${this.devFullName(devision.id)} (${devision.name})` : `${devision.name}`;
            
            let colCount =  $("#table-eq-work").find('th').length;
           
             row.push({colSpan: colCount, text: `${devIndex+1}.0 ${devisionName} - ${countUnit} ед.`, style: 'titleRow'});
             for(let i = 0; i< colCount-1; i++)
              row.push(''); 

             body.push(row)
            
            var totalWorkTime = 0, totalExpense =0;

            devisionUnit.forEach((unit) =>{
                row = [];
                totalWorkTime += unit.workTime;
                totalExpense += unit.expense;
                row.push({text: index++, style: 'defaultStyle'});
                row.push({text: unit.eqName, alignment: 'left', style: 'defaultStyle'});
                row.push({text: unit.invNum, style: 'defaultStyle'});
                row.push({text: unit.workTime, style: 'defaultStyle'});
                row.push({text: unit.expense.toString().replace('.',','), style: 'defaultStyle'});
                row.push({text: unit.outage, style: 'defaultStyle'});
                row.push({text: unit.contract, style: 'defaultStyle'});
                row.push({text: unit.responsibleName, style: 'defaultStyle'});
                body.push(row)
            })
            row = [];
            row.push({colSpan: 3, text: `Итого по ${devision.name}:`, alignment: 'left', style: 'totalRow'});
            row.push('');
            row.push('');

            row.push({text:`${totalWorkTime}`, style: 'totalRow'});
            row.push({text:`${totalExpense.toString().replace('.',',')} кВт.ч`, style: 'totalRow'});
            row.push({colSpan: 3, text: ``, style: 'totalRow'});
            row.push('');
            row.push('');
            body.push(row)

          })

          var docDefenition = {
            content: [
                {text:`О работе лабораторного испытательного оборудования научных подразделений за ${forMonth(this.calMonth.getMonth())} ${this.calMonth.getFullYear()} года`, style: 'header'},
                {table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 20, 220, 60, 80, 80, 80, 80, 80],

              body: body
                }
              }],
        
            styles: {
              header: {fontSize: 11, alignment: 'center' },
              tableHeader: {alignment: 'center', verticalAlign: 'center', fontSize: 9, fillColor:"#9cc2e5" },
              titleRow: {alignment: 'left', fontSize: 9, color: '#000000',  background: '#c5e0b3', fillColor: '#c5e0b3', bold: true},
              totalRow: {alignment: 'center', fontSize: 9, color: '#ffffff',  background: '#000000', fillColor: '#000000', bold: true },
              defaultStyle: {fontSize: 9, alignment: 'center', color: '#000000', background:'#ffffff' }

            },
            pageOrientation: 'landscape'
            
          }
        pdfMake.createPdf(docDefenition).download(this.report_name + ".pdf");

        },
        initData: function(){
           
 
         api().
          get('/dictionary')
          .then(response => {
            let dict = response.data;
            this.eqDevisionList =  dict.divisionList;
            this.responsibleList = dict.userList;
            
            this.responsibleList.forEach(item => {
              //  let userDevision = this.eqDevisionName(item.id_dicdev_dicdevision)
                item.name =`${item.us_surname} ${item.us_name} ${item.us_patname}`///${userDevision}`
              });

            this.devFullNameList = getDevFullName();
            this.eqReadinessList = getEqReadiness();

            let date = this.calMonth;
            api().
              get('/rEqWork/' + date)
              .then(response => 
              {
                let data = response.data;
                 data.forEach(item => {
                    let row = {};
                    row.idDev = item.id_dicdev;
                    row.idEq = item.id_eq;
                    row.eqName = item.eqname;
                    row.invNum = item.inv_num;
                    row.eqReadiness = item.is_ready;
                    row.eqReadinessName = this.eqReadinessName(row.eqReadiness);
                    row.responsible = item.id_respose_man;
                    row.responsibleName = this.responsibleName(item.id_respose_man);
                    row.workTime = item.workTime ? parseFloat(item.workTime) : 0;
                    row.expense = item.expense  ? parseFloat(item.expense) : 0;
                    row.outage = item.outage ?  parseFloat(item.outage) : 0;
                    row.contract = item.contract ? item.contract : '-';
                    this.rows.push(row);

                 })
                 this.fillTableData();
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
        fillTableData: function(){
          let index = 1;
          this.eqDevisionList.forEach((devision, devIndex) => {
            
            let devisionUnit = _.filter(this.rows, {'idDev': devision.id});
            let countUnit = devisionUnit.length;
            let devisionName = this.devFullName(devision.id) != '' ? 
                  `${this.devFullName(devision.id)} (${devision.name})` : `${devision.name}`;
            
                $("#table-eq-work").find('tbody')
                    .append($('<tr>')
                      .append($('<td>')
                          .attr("colspan",  8)
                          .css("background-color", "#c5e0b3")
                          .css("vertical-align", "middle")
                          .css("text-align", "left")
                          .append($('<div>')
                              .append($('<span>')
                                .html(`<b> ${devIndex+1}.0 ${devisionName} - ${countUnit} ед.</b>`)
                              ))))
          let totalWorkTime = 0, totalExpense =0;
          devisionUnit.forEach((row) =>{
              totalWorkTime += row.workTime;
              totalExpense += row.expense;
               $("#table-eq-work").find('tbody')
                    .append($('<tr>')
                      .append($('<td>')
                        .css("vertical-align", "middle")
                        .css("text-align", "center")
                        .append($('<div>')
                          .append($('<span>')
                              .text(index++)
                            )))
                      .append($('<td>')
                          .append($('<div>')
                              .css("vertical-align", "middle")
                              .append($('<span>')
                                .text(row.eqName)
                              )))
                      .append($('<td>')
                          .css("vertical-align", "middle")
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .text(row.invNum)
                              )))
                      .append($('<td>')
                           .css("vertical-align", "middle")
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .text(row.workTime)
                              )))
                      .append($('<td>')
                          .css("vertical-align", "middle")
                          .css("text-align", "center")
                          .append($('<div>')
                              
                              .append($('<span>')
                                .text(row.expense.toString().replace('.',','))
                              )))
                      .append($('<td>')
                          .css("vertical-align", "middle")
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .text(row.outage)
                              )))
                      .append($('<td>')
                          .css("vertical-align", "middle")
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .text(row.contract)
                              )))
                      .append($('<td>')
                          .css("vertical-align", "middle")
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .text(row.responsibleName)
                              )))
                    )
               })
          
                 $("#table-eq-work").find('tbody')
                    .append($('<tr>')
                      .css("background-color", "#000000")
                      .css("color", "#ffffff")
                      .append($('<td>')
                          .attr("colspan",  3)
                          .css("text-align", "left")
                          .append($('<div>')
                              .append($('<span>')
                                .html(`<b>Итого по ${devision.name}:</b>`)
                              )))
                      .append($('<td>')
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .html(`<b>${totalWorkTime}</b>`)
                              )))

                      .append($('<td>')
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .html(`<b>${totalExpense.toString().replace('.',',')} кВт.ч</b>`)
                              )))
                        .append($('<td>')
                          .attr("colspan",  3))
                      )
          })
           this.$emit('resizeHeader');
        },
      devFullName: function (_id){
        let devFullNameItem= _.find(this.devFullNameList, {id: _id});
        return devFullNameItem ? devFullNameItem.name: '';
      },
       eqReadinessName: function (_id){
        let eqReadinessItem = _.find(this.eqReadinessList, {id: _id});
        return eqReadinessItem ? eqReadinessItem.name: '';
      },
       responsibleName: function (_id){
        let responsibleItem = _.find(this.responsibleList, {id: _id});
        return responsibleItem ? responsibleItem.name: '';
      },
    },
    created: function(){
        this.initData();
    }
}

</script>

<style lang="scss" scoped>
.action-panel{
    display: flex;
    justify-content: flex-end;
    margin-right: .5em;
}
.export-button  {
     border: 1px solid #ced4da;
    position: relative;
    padding: .425em .5em;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius: .25em;
    cursor: pointer;
    margin: 10px;
    width: 50px;
    height: 3em;
}
.export-button i{
    color: #337ab7;
    font-size: 20pt;
}
.export-button i:hover {
    cursor: pointer;
    color: #ed9b19;
}

.title{
    width:100%;
    font-size: 18px;
    text-align: center;
    padding-bottom: 1em
  }

.table-eq-work th {
  text-align: center !important;
  vertical-align: middle !important;
  color:#337ab7;
}
.table-eq-work td {
  vertical-align: middle !important;
}
 img {
    max-width: 100%;
    height: auto;
    width: auto\9; /* ie8 */
 }
 .img-hidden{
   display: none;
 }

@media screen and (max-width:1200px) {
 
    .action-panel {
      justify-content: flex-start;
    }

}


</style>