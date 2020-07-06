<template lang="html">
<div>
   <div class='filter'>
         <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Номер карточки</label></div>
           <div class="filter-item">
              <input v-model="fData.cardNum" type="text"/>
            </div>
         </div>
         <div class='filter-item-container'>
            <div class="filter-item-label"><label class="mb-0">Наименование</label></div>
            <div class="filter-item">
               <dynamic-select 
                      :options="eqNameList"
                      option-value="id"
                      option-text="name"
                      placeholder=""
                      v-model="fData.eqName" />
              </div>
          </div>

              <div class="btns">
                  <button class="filter-button" @click="$emit('filterData', true)" title="Применить фильтр"><i class='fa fa-check' > </i> </button>
                  <button v-if='hasExtended' class="filter-button" @click="showExtendedFilter = !showExtendedFilter" title="Расширенный фильтр"><i class='fa fa-filter'> </i> </button>
                  <button  class="filter-button" @click="$emit('clearFilter')" title="Сбросить фильтр"><i class='fa fa-eraser'> </i> </button>
                </div>
 

       <table style="display:none">

         <tr>
            <td><label>Номер карточки</label><input v-model="fData.cardNum" type="text"/> </td>
            <td v-if="false"><label>Инвентарный номер</label><input v-model="fData.invNum" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/></td>
            <td><label>Наименование</label> <dynamic-select 
                    :options="eqNameList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqName" /></td>
            <td v-if="false"><label>Подразделение</label> <dynamic-select 
                    :options="eqDevisionList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.devision" />
                    </td> 
            <td>
              <div class="btns">
                <button class="filter-button" @click="$emit('filterData', true)" title="Применить фильтр"><i class='fa fa-check' > </i> </button>
                <button v-if='hasExtended' class="filter-button" @click="showExtendedFilter = !showExtendedFilter" title="Расширенный фильтр"><i class='fa fa-filter'> </i> </button>
                <button  class="filter-button" @click="$emit('clearFilter')" title="Сбросить фильтр"><i class='fa fa-eraser'> </i> </button>
              </div>
            </td>
         </tr>
       </table>
    </div> 
    <transition name="fade"> 
        <div v-if="showExtendedFilter" class='extented-filter'>

        <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Вид/категория</label></div>
           <div class="filter-item">
              <dynamic-select 
                    :options="eqTypeList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqType" />
            </div>
         </div>
         <div class='filter-item-container'>
            <div class="filter-item-label"><label class="mb-0">Производитель</label></div>
            <div class="filter-item">
              <dynamic-select 
                    :options="eqProducerList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqProducer" />
              </div>
          </div>
          <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Заводской номер</label></div>
           <div class="filter-item">
              <input v-model="fData.factNum" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/>
            </div>
         </div>
          <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Дата выпуска</label></div>
           <div class="filter-item">
             <date-picker v-model="fData.factDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' ></date-picker>
            </div>
         </div>
         <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Дата ввода в эксплуатацию</label></div>
           <div class="filter-item">
             <date-picker v-model="fData.comDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' ></date-picker>
            </div>
         </div>
         <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Год последней модернизации</label></div>
           <div class="filter-item">
             <input v-model="fData.repDate" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/>
            </div>
         </div>
         <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Ответственный</label></div>
           <div class="filter-item">
             <dynamic-select 
                    :options="responsibleList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.responsible" />
            </div>
         </div>
         <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Тех. состояние</label></div>
           <div class="filter-item">
             <dynamic-select 
                    :options="eqReadinessList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqReadiness" />
            </div>
         </div>


      </div></transition> 
    </div>
</template>

<script>
  import DynamicSelect from 'vue-dynamic-select'
  import DatePicker from 'vue2-datepicker'
  export default {
    name:"filter-equipment",
    props:  {
                fData: {type: Object, required: true}, 
                eqNameList: {type: Array}, 
                eqDevisionList: {type: Array}, 
                eqTypeList: {type: Array}, 
                eqProducerList: {type: Array},
                eqReadinessList: {type: Array},
                responsibleList: {type: Array},
                lang: {type: Object},
                hasExtended: {type:Boolean}
    },
    data() { 
            return { 
                showExtendedFilter: false
                }
    },
    components: {
        DynamicSelect,
        DatePicker
    }
  }
</script>

<style lang="scss" scoped>
    .filter, 
    .extented-filter 
    {
  
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-bottom: 3px solid #4285f4;
   
  }
   .filter-item-container{
     width: 25%;//calc(50% - 1px);
     min-width: 360px;
     text-align: center;
   }
   .filter-item{
      display: block;
      width: 100%;
      min-width: 300px;
      padding-left: 15px;
      padding-right: 15px;
      padding-bottom: .25em;
  }

.filter-item-label {
    display: inline-block;
    min-width: 300px;
    width: 100%;
    text-align: center;
    font-style: italic;
    color:#337ab7;
    font-size: 12pt;
  }

   .filter table,
   .extented-filter table
   {
     width: 100%;
     table-layout: fixed;
    //border-spacing: 10px;
     border-collapse: separate;
    }
   td
  {
    text-align: center;
    padding-left: 1em;
    padding-right: 1em;
    max-width: 300px;
  }

    .filter-button:hover{
    color: #337ab7;
    border-color: #337ab7;
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
  .filter input,
  .extented-filter input
  {
    border: 1px solid #ced4da;
    position: relative;
    padding: .425em .5em;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius:  .25em;
    cursor: text;
    width: 100%;
    height: 35px;
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
      width: 50px;
  }
  .btns{
    display : flex;
    flex-wrap: nowrap;
  }
 

.mx-datepicker {
    width: 100%;
}
</style>