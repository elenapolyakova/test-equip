<template lang="html">
  <div class="filter">
    <table>
        <tr>
            <td><label class="filter-label">Подразделение</label>
                <dynamic-select 
                    :options="devisionList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.devision"
                    @input="devisionSelected" />
            </td>
            <td><label class="filter-label">Наименование</label>
                <dynamic-select 
                      :options="eqNameList"
                      option-value="id"
                      option-text="name"
                      placeholder=""
                      v-model="fData.eqName"
                       @input="eqNameSelected" 
                       :container="container"/>
            </td>
            <td><label class="filter-label">Инвентарный номер</label>
              <dynamic-select 
                        :options="invNumList"
                        option-value="id"
                        option-text="name"
                        placeholder=""
                        v-model="fData.invNum" 
                         @input="invNumSelected"/>
            </td>

        </tr>
    </table>
  </div>
</template>

<script>
  import DynamicSelect from 'vue-dynamic-select'
  import api from "../utils/api";
  import {getOrderTime, getOrderTimeHours} from '../utils/dictionary'
  

  export default {
    name:"filter-plan",
     props:  {
          fData: {type: Object, required: true},
          isLoading:{type: Boolean}
     },
    components: {
        DynamicSelect
    },
    data() {
      return {
        devisionList: [], //подразделения, в которых есть оборудования
        eqDevisionList: [], //полный справочник подразделений
        eqNameList: [],
        invNumList: [],
        filterData: [],
        hasLoadFilterData: false,
        container: $('main')
      }
    },
    methods: {
        devisionName: function (_id){

          let devisionItem = _.find(this.eqDevisionList, {id: _id});
          return devisionItem ? devisionItem.name : '';
        },
        devisionSelected()
        {
          this.$emit('loading', true);
          this.eqNameList = [];
          this.invNumList = [];
          this.fData.eqName = {};
          this.fData.invNum = {};

          let index = 0;
          _.uniqBy(_.filter(this.filterData, {devision: this.fData.devision.id}), 'eqName').forEach(eqName => {
              let eqNameItem = {
                              id: index++,
                              name: eqName.eqName
                         }
            this.eqNameList.push(eqNameItem);
          });
          if(!this.hasLoadFilterData){
            let selectedEq = null;
             if(this.fData.eqIdQ)
                selectedEq =_.find(this.filterData, {idEq: this.fData.eqIdQ});
             if(this.fData.invNumQ)
                selectedEq =_.find(this.filterData, {invNum: this.fData.invNumQ});
             if(selectedEq)
                this.fData.eqName = _.find(this.eqNameList, {name: selectedEq.eqName})
          }
          this.$emit('loading', false);
        },
        eqNameSelected(){
          this.invNumList = [];
          this.fData.invNum = {};
          if(!this.fData.eqName) return;

          this.$emit('loading', true);
            this.invNumList = [];
            this.fData.invNum = null;
          _.uniqBy(_.filter(this.filterData, {devision: this.fData.devision.id, eqName:  this.fData.eqName.name}), 'invNum').forEach(invNum => {
              let invNumItem = {
                              id: invNum.idEq,
                              name: invNum.invNum
                         }
            this.invNumList.push(invNumItem);
          });
            if(this.invNumList.length === 1)
            {
              this.fData.invNum =  this.invNumList[0];
            }

            if(!this.hasLoadFilterData){
            let selectedEq = null;
             if(this.fData.eqIdQ)
                selectedEq =_.find(this.filterData, {idEq: this.fData.eqIdQ});
             if(this.fData.invNumQ)
                selectedEq =_.find(this.filterData, {invNum: this.fData.invNumQ});
             if(selectedEq)
                this.fData.invNum = _.find(this.invNumList, {name: selectedEq.invNum})
             this.hasLoadFilterData = true;
          }
            
          this.$emit('loading', false);
        },
        invNumSelected(){
           if(!this.fData.invNum) this.$emit('filterData', {eqId: -1, orderTimeHours: 0, workingMode: 1});
           else {
              let selectedEq = _.find(this.filterData, {idEq: this.fData.invNum.id});
              let hours = getOrderTimeHours(selectedEq.orderTime, selectedEq.workingMode );
              this.$emit('filterData', {eqId: this.fData.invNum.id, orderTimeHours: hours, workingMode: selectedEq.workingMode ? selectedEq.workingMode : 1}); 
          }
        },
    
    },
    created: function() { 
      this.$emit('loading', true);

        api().
          get('/dictionary')
         .then(response => {
            let dict = response.data;
            this.eqDevisionList =  dict.divisionList;
            
             api().
               get('/equipment') //все оборудование с подразделением, инв номером и наименованием
               .then(response => {
                   let data = response.data;
                    data.forEach(item =>{
                    let filterItem = {
                      devision: item.id_dicdev_dicdevision,
                      invNum: item.inv_num ? item.inv_num.trim() : '',
                      eqName: item.eqname ? item.eqname.trim() : '',
                      idEq: item.id_eq,
                      orderTime: item.minworktime,
                      workingMode: 1//item.workingMode todo загружать из базы
                    }
                    this.filterData.push(filterItem);
                   });
                    _.uniqBy(this.filterData, 'devision').forEach(devision =>{
                         let devisionItem = {
                              id: devision.devision,
                              name: this.devisionName(devision.devision)
                         }
                         this.devisionList.push(devisionItem);
                     });
                    let selectedEq = null;
                    if(this.fData.eqIdQ)
                     selectedEq =_.find(this.filterData, {idEq: this.fData.eqIdQ});
                    if(this.fData.invNumQ)
                     selectedEq =_.find(this.filterData, {invNum: this.fData.invNumQ});
                    if(selectedEq)
                        this.fData.devision = {id:selectedEq.devision, name: this.devisionName(selectedEq.devision)};
                    this.$emit('loading', false);

          
            })
              .catch(error => 
              {
                this.$emit('loading', false);
                 alert ('Ошибка при получении данных об оборудовании: ' + error);
                  
              })
          })
          .catch(error => {
            this.$emit('loading', false);
            alert ('Ошибка при получении данных о подразделениях: ' + error);
          });
    },
    mounted: function(){
  
    }

  }
</script>

<style lang="scss" scoped>
   .filter{
    display: flex;
    padding-top:20px;
    top: 0;
    width: 100%;
    text-align: center;
    background: #ffffff;
    border-bottom: 3px solid #4285f4;
    font-size: 14px;
    color: #2c3e50;
  }
   .filter table
   {
     width: 90vw;
     table-layout: fixed;
    //border-spacing: 10px;
     border-collapse: separate;
    }
   td
  {
    text-align: center;
    padding-left: 1em;
    padding-right: 1em;
    width: 300px;
  }
    .filter-button:hover{
    color: #337ab7;
    border-color: #337ab7;
  }
  .filter-button{ 
      border: 1px solid #ced4da;
      position: relative;
      padding: .425em .5em;
      margin: .5em;
      -moz-border-radius: .25em;
      -webkit-border-radius:  .25em;
      border-radius:  .25em;
      cursor: pointer;
      width: 70%
  }
  
     

</style>