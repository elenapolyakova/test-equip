<template lang="html">
  <div>
      <div class="action-panel-end">
           <div class="export-button"><i class="fa fa-file-excel" title="Экспорт в excel" @click="exportExcel"></i></div>
           <div class="export-button"><i class="fa fa-file-pdf" title="Экспорт в pdf" @click="exportPDF"></i></div>
      </div>
      <div class="report-content">
        <div class='title'>Журнал технического обслуживания и ремонта (ТОиР)</div>
      </div>
  </div>
</template>

<script>
  /* import html2canvas from 'html2canvas'
   import canvg from 'canvg';
   import '../js/arial-normal.js'
   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
  //import jsPDF from 'jspdf'; 

   export default {
    name: "rReapir",
     props: ['id'],

    data() {
       return {
         report_name: '',
       }
    },
    methods: {
        exportExcel: function(){},
        exportPDF: function(){}
    }
}
*/
</script>

<style lang="scss" scoped>


</style>