<template lang="html">
<div>
   <div class='filter'>
       <table>
          <tr>
           <td><span>Номер карточки</span></td>
           <td><span>Инвентарный номер</span></td>
           <td><span>Наименование</span></td>
           <td><span>Подразделение</span></td>
           <td> <button class="filter-button" @click="$emit('filterData', true)"><i class='fa fa-check' > </i> Применить фильтр</button></td>
         </tr>
         <tr>
            <td><input v-model="fData.cardNum" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/> </td>
            <td><input v-model="fData.invNum" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/></td>
            <td><dynamic-select 
                    :options="eqNameList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqName" /></td>
            <td> <dynamic-select 
                    :options="eqDevisionList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.devision" />
                    </td> 
            <td><button class="filter-button" @click="showExtendedFilter = !showExtendedFilter"><i class='fa fa-filter'> </i> Расширенный фильтр</button></td>
         </tr>
       </table>
    </div> 
    <transition name="fade"> 
        <div v-if="showExtendedFilter" class='extented-filter'>
          <table>
            <tr>
              <td><span>Вид/категория</span></td>
              <td><span>Производитель</span></td>
              <td><span>Заводской номер</span></td>
              <td><span>Дата выпуска</span></td>
                            <td></td>
            </tr>
            <tr>
              <td><dynamic-select 
                    :options="eqTypeList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqType" /></td>
              <td><dynamic-select 
                    :options="eqProducerList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqProducer" /></td>
              <td><input v-model="fData.factNum" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/> </td>
              <td><date-picker v-model="fData.factDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' ></date-picker></td>
              
            </tr>
            <tr style="height:10px"><td colspan = '5'></td></tr>
            <tr>
              <td><span>Дата ввода в эксплуатацию</span></td>
              <td><span>Год последней модернизации</span></td>
              <td><span>Ответственный</span></td>
              <td><span>Готовность</span></td>
              <td></td>

            </tr>
            <tr>
              <td><date-picker v-model="fData.comDate" :lang="lang" format='DD.MM.YYYY' popup-class='calPopup' ></date-picker></td>
              <td><input v-model="fData.repDate" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/></td>
              <td><dynamic-select 
                    :options="responsibleList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.responsible" /></td>
               <td><dynamic-select 
                    :options="eqReadinessList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.eqReadiness" /></td>
              <td></td>

            </tr>
          </table>
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
                lang: {type: Object}
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
    padding-top:20px;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background: #ffffff;
    border-bottom: 3px solid #4285f4;
    font-size: 14px;
    color: #2c3e50;
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
  }
    .filter-button:hover{
    color: #337ab7;
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
    border-radius: .25em;
    cursor: text;
    width: 100%;  
  }
  
   .filter-button{ 
      border: 1px solid #ced4da;
      position: relative;
      padding: .425em .5em;
      border-radius: .25em;
      cursor: pointer;
      width: 70%
  }
  
.mx-datepicker {
    width: 100%;
}
</style>