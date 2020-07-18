<template lang="html">
   <div class="vld-parent">
    <loading :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        color='#e21a1a'>
    </loading>
      <div class="action-panel-end">
           <button class="export-button" @click="exportExcel"><i class="fa fa-file-excel" title="Экспорт в excel"></i></button>
           <button class="export-button" @click="exportPDF"><i class="fa fa-file-pdf" title="Экспорт в pdf"></i></button>
      </div>
        <div class="report-content">
          <div class='title'>Сводные данные </br> по работе учтённого лабораторного испытательного оборудования научных подразделений за 
          <date-picker v-model="calMonth"  type="month"  format="MMMM YYYY года" :editable="false" popup-class='calPopup' name="Month"></date-picker></div>
          <table class="table  table-hover  table-center table-summary" id="table-summary">
              <thead>
                <tr>
                  <th style="width: 50px">№ п/п</th>
                  <th style="width: 400px; min-width: 300px">Научное подразделение</th>
                  <th>Общее количество ИО подлежащего учёту, ед.</th>
                  <th>Количество учтённого и задействованного в работе ИО, ед.</th>
                  <th>Общая продолжительность работы ИО, часы</th>
                  <th>Общий расход ТЭР (эл. энергия, кВт.ч; горюче-смазочные материалы, л.)</th>
                  <th>Общее время (ч) вынужденного простоя</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
        </div>
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
    name: "rEqSummary",
    components: {
       Loading,
       DatePicker
     },

    data() {
       return {
         devFullNameList: [],
         eqReadinessList: [],
         report_name: 'Сводные данные по работе ИО',
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


            let title = `Сводные данные\n по работе учтённого лабораторного испытатеьного оборудования научных подразделений за ${forMonth(this.calMonth.getMonth())} ${this.calMonth.getFullYear()} года`;

            ws.getColumn(1).width = 3;
            ws.getColumn(2).width = 45;
            ws.getColumn(3).width = 16;
            ws.getColumn(4).width = 16;
            ws.getColumn(5).width = 16;
            ws.getColumn(6).width = 16;
            ws.getColumn(7).width = 16;

           // ws.pageSetup.printTitlesRow = '1:3';

            let rowIndex = 1;
            ws.mergeCells(rowIndex,1, rowIndex +1, 7);
            var cell  = ws.getRow(rowIndex).getCell(1);
              cell.value = title;
              cell.style = {alignment: {
                            horizontal: 'center', 
                            wrapText: true
                          } };
            let colIndex = 1;
            rowIndex+=2
            $("#table-summary").find('th').each((i, th) => {
                cell = ws.getRow(rowIndex).getCell(colIndex);
                cell.value = $(th).text()
                cell.style = {alignment: {
                                 horizontal:'center',
                                 vertical:"middle", 
                                 wrapText: true
                          } };
                 colIndex++;
               
            })
             rowIndex++;

               this.rows.forEach((data, index) =>{
                 colIndex = 1; 
                  cell = ws.getRow(rowIndex).getCell(colIndex++); 
                  cell.value = index+1;
                  cell.style = {
                            alignment: {
                                horizontal:'center',
                                vertical:"middle"
                          }
                  }
                 let devisionName = [];
                  if (data.fullName !== ''){
                      devisionName.push({'text': data.fullName});
                      devisionName.push({'text': `(${data.sname})`, 'font': {bold: true}});
                  }
                  else {
                      devisionName.push({'text': data.sname,  'font': {bold: true}});
                  }
                  devisionName.push({'text': ` - ${data.count} ед.`, 'font': { bold: true}});
                  if (data.count > 0)
                  {
                    devisionName.push({'text': 'из них:', 'font': {bold: true}});
                    data.ts_items.forEach(ts => {
                        devisionName.push({'text': `\n${ts.count} ед. ${ts.name}`,  'font': {bold: true, color: {argb:"ff0000"}}});
                    })
                  } 
                  cell = ws.getRow(rowIndex).getCell(colIndex++);   
                  cell.value = {'richText': devisionName}
                  cell.style = {alignment: {
                                 horizontal:'left',
                                 wrapText: true
                          }
                  }

                   if (index == 0) {
                       ws.mergeCells(rowIndex,colIndex, rowIndex+this.rows.length-1, colIndex);
                       cell  = ws.getRow(rowIndex).getCell(colIndex);
                       cell.value = {'richText': [{'text': this.total.count, 'font': {bold: true}}]};
                       cell.style = {alignment: { horizontal:'center', vertical:"middle",wrapText: true }}

                   }
                   colIndex++

                    cell = ws.getRow(rowIndex).getCell(colIndex++);   
                    cell.value =  `${data.reference} (${data.refPercent}%)`;
                    cell.style = {alignment: {
                                    horizontal:'center',
                                    vertical:"middle"
                                },
                                font: { color: {argb: data.reference > 0 ? "ff0000" : '000000'} } }

                    cell = ws.getRow(rowIndex).getCell(colIndex++);   
                    cell.value = data.workTime;
                    cell.style = {alignment: {
                                    horizontal:'center',
                                    vertical:"middle"
                                } }

                    cell = ws.getRow(rowIndex).getCell(colIndex++);   
                    cell.value =  data.expense;
                    cell.style = {alignment: {
                                    horizontal:'center',
                                    vertical:"middle"
                                } }

                    cell = ws.getRow(rowIndex).getCell(colIndex++);   
                    cell.value =  data.outage;
                    cell.style = {alignment: {
                                    horizontal:'center',
                                    vertical:"middle"
                                } }

                  rowIndex++;
               })
              colIndex = 1;
               ws.mergeCells(rowIndex,colIndex, rowIndex, colIndex+2);
               cell  = ws.getRow(rowIndex).getCell(colIndex);
               cell.value = 'Итого:';
               cell.style = {alignment: { horizontal:'right'},
                               font: {bold: true} };
              colIndex += 3;
              cell = ws.getRow(rowIndex).getCell(colIndex++);   
              cell.value =  `${this.total.reference} (${this.total.referencePercent}%)`;
              cell.style = {alignment: {
                              horizontal:'center',
                              vertical:"middle"
                            },
                          font: { color: {argb: this.total.reference > 0 ? "ff0000" : '000000'} } }

              cell = ws.getRow(rowIndex).getCell(colIndex++);   
              cell.value =  this.total.workTime;
              cell.style = {alignment: {
                              horizontal:'center',
                              vertical:"middle"
                            },
                          font: { color: {argb: this.total.workTime > 0 ? "ff0000" : '000000'} } }

              cell = ws.getRow(rowIndex).getCell(colIndex++);   
              cell.value =  this.total.expense;
              cell.style = {alignment: {
                              horizontal:'center',
                              vertical:"middle"
                            },
                          font: { color: {argb: this.total.expense > 0 ? "ff0000" : '000000'} } }
              
              cell = ws.getRow(rowIndex).getCell(colIndex++);   
              cell.value =  this.total.outage;
              cell.style = {alignment: {
                              horizontal:'center',
                              vertical:"middle"
                            },
                          font: { color: {argb: this.total.outage > 0 ? "ff0000" : '000000'} } }
              ws.eachRow({ includeEmpty: false }, function(row, rowNumber) {
              if (rowNumber > 2)
              {
                    row.eachCell({ includeEmpty: false }, function(cell, colNumber) {
                     
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
          $("#table-summary").find('th').each((i, th) => {
              headers.push({ text: $(th).text(), style: 'tableHeader' })
          })
          var body = [];
          body.push (headers);

           this.rows.forEach((data, index) =>{
             let row = [];
             let devisionName = {text: [], style: 'defaultStyle', alignment: 'left'};
             if (data.fullName !== ''){
                devisionName.text.push(data.fullName);
                devisionName.text.push({text: `(${data.sname})`, bold: true});
             }
             else {
                devisionName.text.push({text: data.sname,  bold: true});
             }
            devisionName.text.push({text: ` - ${data.count} ед.`,  bold: true});
            if (data.count > 0)
            {
               devisionName.text.push({text: 'из них:',  bold: true});
               data.ts_items.forEach(ts => {
                  devisionName.text.push({text: `\n${ts.count} ед. ${ts.name}`,  bold: true, color: 'red'});
               })
            } 
             row.push({text: index+1, alignment: 'center', style: 'defaultStyle'});
             row.push(devisionName);
             if (index == 0) 
              row.push({rowSpan: this.rows.length, text: this.total.count, alignment: 'center', margin: [50, 100]});
             else row.push('');
             row.push({text: `${data.reference} (${data.refPercent}%)`, style: 'defaultStyle', color: data.reference > 0 ? "red" : "black"});
             row.push({text: data.workTime, style: 'defaultStyle'});
             row.push({text: data.expense, style: 'defaultStyle'});
             row.push({text: data.outage, style: 'defaultStyle'});
             body.push(row)
           })
          let totalRow = [];
          totalRow.push({text: 'Итого', alignment: 'right', colSpan: 3, bold: true, fontSize: 10});
          totalRow.push('');
          totalRow.push('');
          totalRow.push({text: `${this.total.reference} (${this.total.referencePercent}%)`, style: 'defaultStyle', bold: true, color: this.total.reference > 0 ? "red" : "black"});
          totalRow.push({text: this.total.workTime, style: 'defaultStyle', bold: true, color: this.total.workTime > 0 ? "red" : "black"});
          totalRow.push({text: this.total.expense, style: 'defaultStyle', bold: true, color: this.total.expense > 0 ? "red" : "black"});
          totalRow.push({text: this.total.outage, style: 'defaultStyle', bold: true, color: this.total.outage > 0 ? "red" : "black"});
           body.push(totalRow)

          var docDefenition = {
            content: [
                {text:'Сводные данные', style: 'header'},
                {text:`по работе учтённого лабораторного испытатеьного оборудования научных подразделений за ${forMonth(this.calMonth.getMonth())} ${this.calMonth.getFullYear()} года`, style: 'header'},
                {table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 20, 250, 90, 90, 90, 90, 90],

              body: body
                }
              }],
        
            styles: {
              header: {fontSize: 11, alignment: 'center' },
              tableHeader: {alignment: 'center', verticalAlign: 'center', fontSize: 9 },
              defaultStyle: {fontSize: 9, alignment: 'center'}

            },
            pageOrientation: 'landscape'
            
          }
        pdfMake.createPdf(docDefenition).download(this.report_name + ".pdf");

        },
        initData: function(){
           
 
            this.isLoading = true;
            this.devFullNameList = getDevFullName();
            this.eqReadinessList = getEqReadiness();
            api().
              get('/rSummary')
              .then(response => 
              {
                let data = response.data;
                this.total.count = 0;
                 data.forEach(item => {
                    let row = {};
                    row.id = item.id;
                    row.sname = item.devision_name;
                    row.fullName = this.devFullName(item.id);
                    row.devisionName = row.fullName != '' ? `${row.fullName} <b>(${row.sname})</b>` : `<b>${row.sname}</b>`;
                    row.count = item.count || 0;
                    this.total.count += parseInt(row.count);
                    row.ts_items = [];
                        var parser = new DOMParser();
                        var doc = parser.parseFromString( item.techstate , "text/xml");
                        doc.getElementsByTagName("techstate_item").forEach(tsItem => {
                            let is_ready = parseInt(tsItem.getAttribute("is_ready"));
                            let count = parseInt(tsItem.getAttribute("count"));
                            count = count || 0;
         
                            row.ts_items.push({id: is_ready, count: count, name: this.eqReadinessName(is_ready)});
                        })
                      row.reference = item.reference ? parseInt(item.reference) : 0;
                      row.refPercent = parseInt(row.count)*parseInt(row.reference) > 0 ? 
                                              truncated((parseInt(row.reference)*100)/parseInt(row.count)) : 0;
                      row.workTime = item.workTime ? parseFloat(item.workTime) : 0;
                      row.expense = item.expense  ? parseFloat(item.expense) : 0;
                      row.outage = item.outage ?  parseFloat(item.outage) : 0;
                    this.rows.push(row);

                 })
                 this.fillTableData();
                this.isLoading = false;
             })
              .catch(error => 
              {
                this.isLoading = false;
                	this.$alert('Ошибка при получении данных об оборудовании: '+ error, '', 'error', {allowOutsideClick: false});
                  //alert ('Ошибка при получении данных об оборудовании: ' + error);
                  
              })
          
        },
        fillTableData: function(){
          this.rows.forEach((row, index) =>{
              let divDevision = $(document.createElement('div'));

              divDevision
              .append($('<span>')
                  .html(row.devisionName)
                  )
             .append($('<span>')
                  .html(row.count != 0 ? `<b> - ${row.count} ед. из них: </b>` : `<b> - ${row.count} ед. </b>`)
              )

              row.ts_items.forEach(ts => {
                    divDevision
                    .append($('<div>')
                            .css('color', 'red')
                            .html(`<b>${ts.count} ед. ${ts.name}</b>`)
                        )
              })

                         

              $("#table-summary").find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                      .css("text-align", "center")
                      .append($('<div>')
                        .text(++index)
                      )
                    )
                    .append($('<td>')
                      .append(divDevision)
                    )
                );
                if (index == 1)
                    $("#table-summary").find('tbody tr:last')
                      .append($('<td>')
                          .attr("rowspan",  this.rows.length)
                          .css("background-color", "white")
                          .css("vertical-align", "middle")
                          .css("text-align", "center")
                          .append($('<div>')
                              .append($('<span>')
                                .text(this.total.count)
                              )
                          )
                      )

                 $("#table-summary").find('tbody tr:last')     
                    .append($('<td>')
                      .css("text-align", "center")
                      .css("vertical-align", "middle")
                      .append($('<div>')
                              .append($('<span>')
                                .css("color", row.reference > 0 ? "red" : "black")
                                .text(`${row.reference} (${row.refPercent}%)`)
                              )
                          )
                    )
                    .append($('<td>')
                      .css("text-align", "center")
                      .css("vertical-align", "middle")
                      .append($('<div>')
                              .append($('<span>')
                                .text(row.workTime)
                              )
                          )
                    )
                    .append($('<td>')
                      .css("text-align", "center")
                      .css("vertical-align", "middle")
                      .append($('<div>')
                              .append($('<span>')
                                .text(row.expense)
                              )
                          )
                    )
                    .append($('<td>')
                      .css("text-align", "center")
                      .css("vertical-align", "middle")
                      .append($('<div>')
                              .append($('<span>')
                                .text(row.outage)
                              )
                          )
                    )
          })
            this.total.reference = _.sumBy(this.rows, function(row) { return row.reference; })
            this.total.workTime = truncated(_.sumBy(this.rows, function(row) { return row.workTime; }));
            this.total.expense = truncated(_.sumBy(this.rows, function(row) { return row.expense; }));
            this.total.outage = truncated(_.sumBy(this.rows, function(row) { return row.outage; }));
            this.total.referencePercent = parseInt(this.total.count)*parseInt(this.total.reference) > 0 ? 
                                                truncated((parseInt(this.total.reference)*100)/parseInt( this.total.count)) : 0;
                
            $("#table-summary").find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                       .attr("colspan",  3)
                       .css("text-align", "right")
                        .append($('<span>')
                                .html(`<b>Итого:</b>`)
                              )
                    )
                     .append($('<td>')
                        .css("text-align", "center")
                        .append($('<span>')
                              .css("color", this.total.reference > 0 ? "red" : "black")
                                .html(`<b>${this.total.reference} (${this.total.referencePercent}%)</b>`)
                              )
                    )
                     .append($('<td>')
                        .css("text-align", "center")
                        .append($('<span>')
                              .css("color", this.total.workTime > 0 ? "red" : "black")
                                .html(`<b>${this.total.workTime}</b>`)
                              )
                     )
                     .append($('<td>')
                      .css("text-align", "center")
                        .append($('<span>')
                              .css("color", this.total.expense > 0 ? "red" : "black")
                                .html(`<b>${this.total.expense}</b>`)
                              )
                      )
                     .append($('<td>')
                       .css("text-align", "center")
                        .append($('<span>')
                              .css("color", this.total.outage > 0 ? "red" : "black")
                                .html(`<b>${this.total.outage}</b>`)
                              )
                     )
                  );

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
    },
    created: function(){
        this.initData();
    }
}

</script>

<style lang="scss" scoped>

.title{
    width:100%;
    font-size: 18px;
    text-align: center;
    padding-bottom: 1em
  }

.table-summary th {
  text-align: center !important;
  vertical-align: middle !important;

}
.table-summary td {
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