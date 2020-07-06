<template lang="html">
  <div>
    <filter-plan
            @filterData="filterData"
             :fData="fData" 
             @loading="loading"
    ></filter-plan>
   	<rEquipmentCard :eqId="curEqId"
     ></rEquipmentCard>


  </div>
</template>

<script>
   import rEquipmentCard from './rEquipmentCard'
   import FilterPlan from './FilterPlan'

  export default {
    name: "rEqCardF",
     props: {
      eqId: {type: Number},
    },
    components:  {
      rEquipmentCard,
      FilterPlan,
    },
    data() {
      return {
      
        curEqId: -1,
        fData: {},
        
      }
    },
    methods: {
      loading(isLoading)
      {

      },
      filterData(eqData){
          this.curEqId = eqData.eqId;
      },
    
    },
    created: function(){
       this.fData.eqIdQ = this.eqId;
    }

  }
</script>

<style lang="scss" scoped>

  
</style>