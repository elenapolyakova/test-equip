<template lang="html">
  <div>
      <div class="action-panel">
           <div class="export-button"><i class="fa fa-file-excel" title="Экспорт в excel" @click="exportExcel"></i></div>
           <div class="export-button"><i class="fa fa-file-pdf" title="Экспорт в pdf" @click="exportPDF"></i></div>
      </div>
        <div class='title'>Возраст оборудования</div>
  </div>
</template>

<script>
 /*  import html2canvas from 'html2canvas'
   import canvg from 'canvg';
   import '../js/arial-normal.js'
   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
  //import jsPDF from 'jspdf'; 

   export default {
    name: "rEqAge",
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
}*/

</script>

<style lang="scss" scoped>
.action-panel{
    display: flex;
    justify-content: flex-end;
    margin-right: 50px;
}
.export-button i{
    padding-left: 1.5em;
    padding-top:.5em;
    color: #337ab7;
    font-size: 30px;
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

</style>