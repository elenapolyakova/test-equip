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
        <div>{{eqDataWork}}</div>
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
          eqDataWork: {}
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
              get('/rPlanFact/' + this.curIdEq)
              .then(response => 
              {
                this.eqDataWork = response.data;;
                console.log(this.eqDataWork);

                this.isLoading = false;
             })
              .catch(error => 
              {
                this.isLoading = false;
                this.$alert('Ошибка при получении данных об оборудовании: '+ error, '', 'error', {allowOutsideClick: false});
                  //alert ('Ошибка при получении данных об оборудовании: ' + error);
                  
              })

        }

    },
    created: function(){
       this.fData.eqIdQ = this.eqId;
    }
}
</script>

<style lang="scss" scoped>


</style>