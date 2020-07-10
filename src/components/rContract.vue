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
                          <div class="action-panel-filter-item-label">
                              <label class="mb-0">Номер учетной карточки ИО:</label>
                          </div>
                          <div class="action-panel-filter-item-select">
                                <dynamic-select 
                                        :options="eqData"
                                        option-value="id"
                                        option-text="name"
                                        v-model="fData.cardNum"
                                        placeholder=''/>
                            </div>
                      </div>

                      <div class="btns">
                          <button class="filter-button" @click="getReport" title='Применить фильтр'><i class='fa fa-check'> </i> </button>
                          <button class="filter-button" @click="clearFilter" title='Сбросить фильтр'><i class='fa fa-eraser'> </i> </button>
                      </div>

                  </div>

 


          <div class="action-panel-btn">
            <button class="export-button" @click="exportExcel"><i class="fa fa-file-excel" title="Экспорт в excel"></i></button>
            <button class="export-button" @click="exportPDF"><i class="fa fa-file-pdf" title="Экспорт в pdf"></i></button>
         </div>
      </div>
        <div class='title'>{{report_name}}</div>
        
         <table class="table table-bordered table-hover table-striped table-center table-eq-cont" id="table-eq-cont">
            <thead>
              <tr>
                <th style="width: 20%">Договор</th>
                <th style="width: 20%">Номер учетной карточки ИО</th>
                <th style="width: 20%">Стоимость нормо-часа</th>
                <th style="width: 20%">Время работы, ч</th>
                <th style="width: 20%">Стоимость работы</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
  </div>
</template>

<script>
  import Loading from 'vue-loading-overlay';
    //import jsPDF from 'jspdf'; 

  import api from "../utils/api";
  import { saveAs } from 'file-saver';
  import ExcelJS from 'exceljs'; 

  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import DynamicSelect from 'vue-dynamic-select'
  import {formatDate} from '../utils/date'
  import {toCost} from '../utils/commonJS'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'

   export default {
    name: "rContract",
    components: {
       Loading,
       DatePicker,
       DynamicSelect,
     },
    data() {
       return {
         report_name: 'Стоимость работы по договорам',
         fData: {

         },
         datePeriod: [new Date(), new Date()],
         devisionList: [],
         eqInitialList: [],
         eqData: [],
         contData: [],
         format:'DD.MM.YYYY',
         isLoading: false,
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


            let title = `Стоимость работы по договорам за период с ${formatDate(this.datePeriod[0])} по с ${formatDate(this.datePeriod[1])}`;

            ws.getColumn(1).width = 50;
            ws.getColumn(2).width = 20;
            ws.getColumn(3).width = 20;
            ws.getColumn(4).width = 20;
            ws.getColumn(5).width = 20;

           // ws.pageSetup.printTitlesRow = '1:3';

            let rowIndex = 1;
            let colIndex = 1;
            let colCount = $("#table-eq-cont").find('th').length;

            ws.mergeCells(rowIndex,colIndex, rowIndex, colIndex + colCount-1);
            var cell  = ws.getRow(rowIndex).getCell(colIndex);
              cell.value = title;
              cell.style = {alignment: {
                            horizontal: 'center', 
                            wrapText: true
                          } };

             ws.views = [{ state: "frozen", ySplit: 2}];
            
            rowIndex++;
            colIndex = 1;
            $("#table-eq-cont").find('th').each((i, th) => {
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

            let contIdPrev = -1;
            let totalWorkTime = 0;
            let totalCost = 0;
            let countRow = 1;
            var cell = null;
            this.contData.forEach (contract => {
                let idCont = contract.idCont;
                colIndex = 1;
                rowIndex++;
                if (contIdPrev != idCont){
                   
                    contIdPrev = idCont;
                    totalWorkTime = 0;
                    totalCost = 0;
                    countRow = 0;
                    let contractRows = _.filter(this.contData, {idCont: idCont});

                    ws.mergeCells(rowIndex, colIndex, rowIndex + contractRows.length - 1, colIndex);
                    cell = ws.getRow(rowIndex).getCell(colIndex);
                    cell.value =  `№${contract.conNum} от ${contract.conDate} ${contract.conPurpose}`;
                    cell.style = {alignment: {
                                    horizontal: 'center', 
                                    vertical: 'middle',
                                    wrapText: true
                                },
                                  font: {  bold: true }
                             };

                }
                colIndex++;
                cell  = ws.getRow(rowIndex).getCell(colIndex++);
                cell.value =  contract.cardNum;
                cell.style = {alignment: {
                                    horizontal: 'center', 
                                    vertical: 'middle',
                                    wrapText: true
                                }
                             };


                cell  = ws.getRow(rowIndex).getCell(colIndex++);
                cell.value =  contract.hourPrice;
                cell.style = {alignment: {
                                    horizontal: 'center', 
                                    vertical: 'middle',
                                    wrapText: true
                                }
                             };

                cell  = ws.getRow(rowIndex).getCell(colIndex++);
                cell.value =  contract.workTime;
                cell.style = {alignment: {
                                    horizontal: 'center', 
                                    vertical: 'middle',
                                    wrapText: true
                                }
                             };

                cell  = ws.getRow(rowIndex).getCell(colIndex++);
                cell.value =  contract.costStr;
                cell.style = {alignment: {
                                    horizontal: 'right', 
                                    vertical: 'right',
                                    wrapText: true
                                },
                                 numFmt: "0.0 ₽"
                             };

                totalWorkTime += contract.workTime;
                totalCost += contract.cost;
                countRow++;
                  
                if(countRow ==  _.filter(this.contData, {idCont: idCont}).length)
                {
                    colIndex = 1;
                    rowIndex++;
                    ws.mergeCells(rowIndex, colIndex, rowIndex, colIndex+3);
                    cell = ws.getRow(rowIndex).getCell(colIndex);
                    cell.value = `Итого по Договору:`;
                    cell.style = {alignment: {
                                    horizontal: 'right'},
                                    font: { 
                                        bold: true
                                    }
                                };
                    cell.fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: { argb: "c3c3c3" }
                            };

                    colIndex += 4,
                    cell = ws.getRow(rowIndex).getCell(colIndex);
                    cell.value = `${toCost(totalCost)}`;
                    cell.style = {alignment: {
                                    horizontal: 'right'},
                                    font: { 
                                        bold: true
                                    }
                                };
                    cell.fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: { argb: "c3c3c3" }
                            };
                    
                }
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
          $("#table-eq-cont").find('th').each((i, th) => {
              headers.push({ text: $(th).text(), style: 'tableHeader' })
          })
          var body = [];
          body.push (headers);

    
            let contIdPrev = -1;
            let totalWorkTime = 0;
            let totalCost = 0;
            let countRow = 1;
            this.contData.forEach (contract => {
                let idCont = contract.idCont;
                var row = [];
                if (contIdPrev != idCont){
                   
                    contIdPrev = idCont;
                    totalWorkTime = 0;
                    totalCost = 0;
                    countRow = 0;
                    let contractRows = _.filter(this.contData, {idCont: idCont});

                    row.push({rowSpan: contractRows.length, text: `№${contract.conNum} от ${contract.conDate} ${contract.conPurpose}`, style: 'defaultStyle', bold: true});     
                 
                }
                else row.push('');
                 row.push({text: contract.cardNum, style: 'defaultStyle'});    
                 row.push({text: contract.hourPrice, style: 'defaultStyle'});
                 row.push({text: contract.workTime, style: 'defaultStyle'});
                 row.push({text: contract.costStr, style: 'defaultStyle', alignment: 'right'});
                totalWorkTime += contract.workTime;
                totalCost += contract.cost;
                countRow++;
                body.push (row);
                  
                if(countRow ==  _.filter(this.contData, {idCont: idCont}).length)
                {
                    row = [];
                    row.push({colSpan: 4, text: `Итого по Договору:`, style: 'totalRow'}); 
                    row.push(''); row.push(''); row.push('');  
                    row.push({text: `${toCost(totalCost)}`, style: 'totalRow'});
                    body.push (row);
                    
                }
            })


          var docDefenition = {
            content: [
                {text:`Стоимость работы по договорам за период с ${formatDate(this.datePeriod[0])} по с ${formatDate(this.datePeriod[1])}`, style: 'header'},
                {table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 220, 120, 120, 120, 120],

              body: body
                }
              }],
        
            styles: {
              header: {fontSize: 11, alignment: 'center' },
              tableHeader: {alignment: 'center', verticalAlign: 'center', fontSize: 9, fillColor:"#9cc2e5", bold: true },
              totalRow: {alignment: 'right', fontSize: 9, color: '#000000',  background: '#E3E3E3', fillColor: '#E3E3E3', bold: true },
              defaultStyle: {fontSize: 9, alignment: 'center', color: '#000000', background:'#ffffff' }

            },
            pageOrientation: 'landscape'
            
          }
        pdfMake.createPdf(docDefenition).download(this.report_name + ".pdf");

        },
        clearFilter: function(){
              this.fData = {
                    devision: null, 
                    cardNum: null
            }
            this.getReport();
        },
        getReport: function(){
            this.isLoading = true;
            let dateStart = this.datePeriod[0];
            let dateEnd = this.datePeriod[1];
            api().
                get('/rContract', {params: {
                            idDev: this.fData.devision ? this.fData.devision.id : -1,
                            dateStart: dateStart,
                            dateEnd: dateEnd,
                            idEq: this.fData.cardNum ? this.fData.cardNum.id : -1
                  }
                })
                .then(response => {
                     let data = response.data;
                     this.contData = [];
                     data.forEach(contRow => {
                        let contItem = {};
                        contItem.idCont = contRow.id_cont;
                        contItem.conNum = contRow.con_num;
                        contItem.conDate = contRow.con_date ? formatDate(contRow.con_date) : '';
                        contItem.cardNum = contRow.card_num;
                        contItem.idEq = contRow.id_eq;
                        contItem.conPurpose = contRow.con_purpose ? `(${contRow.con_purpose})` : '';
                        contItem.hourPrice = contRow.hourprice ? toCost(contRow.hourprice) : '';
                        contItem.workTime = contRow.work_time ? contRow.work_time + 'ч' : 1;
                        contItem.cost =  contItem.workTime*contRow.hourprice ? contItem.workTime*contRow.hourprice : 0;
                        contItem.costStr =  toCost(contItem.cost) ? toCost(contItem.cost) : '0 ₽';
                        this.contData.push(contItem);
                     })
                    this.fillTable();
                 })
                .catch(error => {
                    this.isLoading = false;
                    alert ('Ошибка при получении данных о договорах: ' + error);
                    
                });
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
               // let allDevision = {id: -1, name: 'АО «ВНИИЖТ»'}
              //  this.devisionList.push(allDevision);
              //  this.fData.devision = allDevision;
                dict.divisionList.forEach(devision => {this.devisionList.push(devision)});
                api().
                get('/equipment')
                .then(response => 
                {
                    let data = response.data;
                    data.forEach(item =>
                    {
                    let eqItem = {};
                        eqItem.id = item.id_eq,
                        eqItem.name = item.card_num ? item.card_num.trim() : '';
                        eqItem.devision = item.id_dicdev_dicdevision;
                      //  eqItem.invNum = item.inv_num ? item.inv_num.trim() : '';
                        this.eqInitialList.push(eqItem);
                    });

                    this.eqData = this.eqInitialList;
                  /*  if (this.eqData.length > 0){
                        let allEq = {id: -1, name: 'Всё оборудование'}
                        this.eqData.unshift(allEq);
                        this.fData.cardNum = allEq;
                    }*/
                    this.isLoading = false;
                    this.getReport();
                    

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
        fillTable: function(){
            $("#table-eq-cont").find('tbody tr').remove();
            let contIdPrev = -1;
            let totalWorkTime = 0;
            let totalCost = 0;
            let countRow = 1;
            this.contData.forEach (contract => {
                let idCont = contract.idCont;
               


                if (contIdPrev != idCont){
                   
                    contIdPrev = idCont;
                    totalWorkTime = 0;
                    totalCost = 0;
                    countRow = 0;
                    let contractRows = _.filter(this.contData, {idCont: idCont});
                    $("#table-eq-cont").find('tbody')
                        .append($('<tr>')
                            .append($('<td>')
                                .css("vertical-align", "middle")
                                .css("text-align", "center")
                                .attr("rowspan",  contractRows.length)
                                .append('<span>')
                                .html(`<b>№${contract.conNum} от ${contract.conDate} ${contract.conPurpose}</b>`)
                            )
                        ); 
                }
                else $("#table-eq-cont").find('tbody').append($('<tr>'));

                $("#table-eq-cont").find('tbody tr:last')
                            .append($('<td>')
                                .css("vertical-align", "middle")
                                .css("text-align", "center")
                                .append('<span>')
                                    .text(contract.cardNum)
                            )
                            .append($('<td>')
                                .css("vertical-align", "middle")
                                .css("text-align", "center")
                                .append('<span>')
                                    .text(contract.hourPrice)
                            )
                            .append($('<td>')
                                .css("vertical-align", "middle")
                                .css("text-align", "center")
                                .append('<span>')
                                    .text(contract.workTime)
                            )
                            .append($('<td>')
                                .css("vertical-align", "middle")
                                .css("text-align", "right")
                                .append('<span>')
                                    .text(contract.costStr)
                            ); 

                totalWorkTime += contract.workTime;
                totalCost += contract.cost;
                countRow++;
                if(countRow ==  _.filter(this.contData, {idCont: idCont}).length)
                {
                      $("#table-eq-cont").find('tbody')
                        .append($('<tr>')
                            .append($('<td>')
                                .css("vertical-align", "middle")
                                .css("text-align", "right")
                                .attr("colspan",  4)
                                .append('<span>')
                                    .html(`<b>Итого по Договору:</b>`)
                            )
                            .append($('<td>')
                                .css("vertical-align", "middle")
                                .css("text-align", "right")
                                .append('<span>')
                                    .html(`<b>${toCost(totalCost)}</b>`)
                            )
                        ); 

                    }

                
            })
             this.isLoading = false;
        },
        devisionSelected: function()
        {
            this.isLoading = true;
            let devisionId = -1;
            if (this.fData.devision)
                devisionId = this.fData.devision.id;
            this.eqData = this.eqInitialList;
         
            if (devisionId > 0)
                this.eqData = _.filter(this.eqData, {devision: devisionId});
            else 
                this.eqData = _.filter(this.eqInitialList, o => true);

            this.isLoading = false;
        }

    },
     mounted: function()
      {
      
        this.initData();
      
      }
}

</script>

<style lang="scss" scoped>
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
    width: 400px;
    min-width: 320px;
    padding: 0 1.5em; 
}
.action-panel-filter-calendar-item{
    display: block;
    width: 100%;
}
.action-panel-filter-button{
    display: inline-block;
    padding-left: 1.5em;
    text-align: center;
    vertical-align: bottom;
}
.action-panel-filter-item-label{
    display: inline-block;
    min-width: 120px;
    width: 100%;
    text-align: center;
    font-style: italic;
    color:#337ab7;
    font-size: 12pt;
    padding-top: .5em;
}
.filter-button,
.export-button {
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
    
    color: #337ab7;
    font-size: 20pt;
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
}

.mx-datepicker-range{
    width: 100% !important;
}

.table-eq-cont th {
  text-align: center !important;
  vertical-align: middle !important;
  color:#337ab7;
}
.table-eq-cont td {
  vertical-align: middle !important;
}
  .btns{
    display : flex;
    flex-wrap: nowrap;
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

    }
    .action-panel-filter-item{
        text-align: center;
         width: 100%;
    }
  .action-panel-btn{
        padding: 0;
        margin: 0;
        width: 100%;
        justify-content:center;
    }

    .action-panel
   {
        display: block;
         text-align: center;
   }
    
}

</style>