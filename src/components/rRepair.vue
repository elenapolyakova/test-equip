<template lang="html">
  <div>
      <div class="action-panel-end">
           <div class="export-button"><i class="fa fa-file-excel" title="Экспорт в excel" @click="exportExcel"></i></div>
           <div class="export-button"><i class="fa fa-file-pdf" title="Экспорт в pdf" @click="exportPDF"></i></div>
      </div>
      <div class="report-content">
        <div class='title'>{{report_name}}</div>
      </div>
  </div>
</template>

<script>
  /* import html2canvas from 'html2canvas'
   import canvg from 'canvg';
   
   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'

   export default {
    name: "rReapir",
     props: ['id'],

    data() {
       return {
         report_name: 'Журнал технического обслуживания и ремонта (ТОиР)',
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