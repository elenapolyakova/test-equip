<template lang="html">
  <div class="vld-parent">
      <loading :active.sync="isLoading"
          :can-cancel="false"
          :is-full-page="true"
          color='#e21a1a'>
      </loading>
    <filter-plan
              @filterData="filterData"
             :fData="fData" 
             @loading="loading"
    ></filter-plan>
   	<Schedule :eqId="curEqId"
              :showQueryId="showQueryId"
              :dateStartQuery="dateStartQuery"
              @editQuery="editQuery"
              @showHistory="showHistory"
              @addQuery="addQuery"
              :updatedQueryData="updatedQueryData"
              @loading="loadingSchedule"
     ></Schedule>
    <card-query 
                :queryData="queryData"
                :showQueryCard="showQueryCard"
                @save="saveCardQuery"
                @delete="deleteCardQuery"
                @close="closeCardQuery"
                @loading="loading"
    ></card-query>
    <history-query
                :queryId="historyQueryId"
                :showHistoryQuery="showHistoryQuery"
                @close="closeHistoryQuery"
                @loading="loading"
    ></history-query>


  </div>
</template>

<script>
   import Schedule from './Schedule'
   import CardQuery from './CardQuery'
   import FilterPlan from './FilterPlan'
   import HistoryQuery from './HistoryQuery'
   import Loading from 'vue-loading-overlay'

  export default {
    name: "plan",
    components:  {
      Schedule,
      CardQuery,
      HistoryQuery,
      FilterPlan,
      Loading
    },
    props: {
      queryId: {type: Number},
      eqId: {type: Number},
      invNum: {type: String},
      action: {type: String},
      dateStart: {type: Date},
    },
    data() {
      return {
        showQueryCard: false,
        showQueryId: null,
        updatedQueryData: {},
        dateStartQuery: null,
        curEqId: -1,
        orderTimeHours: 0,
        workingMode: 1,
        fData: {},
        isLoading: false,
        isLoadingSchedule:false,
        isLoadingData: false,
        queryData: {},
        showHistoryQuery: false,
        historyQueryId: -1
      }
    },
    methods: {
      editQuery(params){
        this.queryData = params;
        this.queryData.orderTimeHours = this.orderTimeHours;
        this.queryData.workingMode = this.workingMode;
        this.showQueryCard = true;

      },
      
      addQuery(params){
          this.queryData = params;
          this.queryData.orderTimeHours = this.orderTimeHours;
          this.queryData.workingMode = this.workingMode;
          this.showQueryCard = true;
      },
      saveCardQuery(updatedQueryData){
        this.updatedQueryData=updatedQueryData;
        this.showQueryCard = false;
      },
      deleteCardQuery(updatedQueryData)
      {
        this.updatedQueryData=updatedQueryData;
        this.showQueryCard = false;
      },
      closeCardQuery(){
        this.showQueryCard = false;
      },
      showHistory(queryId){
          this.historyQueryId = queryId;
          this.showHistoryQuery = true;
      },
      closeHistoryQuery(){
         this.showHistoryQuery = false;
      },
      filterData(eqData){
          this.curEqId = eqData.eqId;
          this.orderTimeHours = eqData.orderTimeHours;
          this.workingMode = eqData.workingMode;
      },
      loading(isLoading)
      {
        this.isLoadingData = isLoading;
        this.isLoading = isLoading || this.isLoadingSchedule;
      },
      loadingSchedule(isLoading)
      {
         this.isLoadingSchedule = isLoading;
         this.isLoading = isLoading || this.isLoadingData;

      }
    },
    created: function(){
        if(this.action)
          if (this.action === "edit"){
              this.fData.eqIdQ = this.eqId;
              this.showQueryId = this.queryId;
              this.dateStartQuery = this.dateStart;
          }
          if(this.action === "add") { //добавление заявки
            this.fData.invNumQ = this.invNum;
          }
        
    }

  }
</script>

<style lang="scss" scoped>

  
</style>