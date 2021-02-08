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
          <div class='filter-item-container'>
           <div class="filter-item-label"><label class="mb-0">Подразделение</label></div>
           <div class="filter-item">
             <dynamic-select 
                    :options="eqDevisionList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.devision" />
            </div>
         </div>

              <div class="btns">
                 <button v-if="hasAddButton" class="filter-button add-button" @click="$emit('actionAddClick')">Добавить оборудование</button>
                 <button v-if="hasAddQueryButton" class="filter-button add-button" @click="$emit('actionAddQueryClick')">Добавить заявку</button>
                  <button class="filter-button" @click="$emit('filterData', true)" title="Применить фильтр"><i class='fa fa-check' > </i> </button>
                  <button v-if='hasExtended' class="filter-button" @click="showExtendedFilter = !showExtendedFilter" title="Расширенный фильтр"><i class='fa fa-filter'> </i> </button>
                  <button  class="filter-button" @click="$emit('clearFilter')" title="Сбросить фильтр"><i class='fa fa-eraser'> </i> </button>
                </div>
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
            <div class="filter-item-label"><label class="mb-0">Местоположение</label></div>
            <div class="filter-item">
              <dynamic-select 
                    :options="placeTypeList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.placeType" />
              </div>
          </div>
         
            <div class='filter-item-small-container'>
            <div class="filter-item-small-label"><label class="mb-0">Год выпуска</label></div>
            <div class="filter-item-small">
              <date-picker v-model="fData.factDate" :lang="lang" format='YYYY' type="year" popup-class='calPopup' ></date-picker>
              </div>
          </div>
          <div class='filter-item-small-container'>
            <div class="filter-item-small-label"><label class="mb-0">Год ввода в эксплуатацию</label></div>
            <div class="filter-item-small">
              <date-picker v-model="fData.comDate" :lang="lang" format='YYYY' type="year" popup-class='calPopup' ></date-picker>
              </div>
          </div>
          <div class='filter-item-small-container'>
            <div class="filter-item-small-label"><label class="mb-0">Год последней модерниз.</label></div>
            <div class="filter-item-small">
              <!-- <input v-model="fData.repDate" type="text" onkeyup="this.value = this.value.replace (/[^0-9]/g, '')"/> -->
                <date-picker v-model="fData.repDate" :lang="lang" format='YYYY' type="year" popup-class='calPopup' ></date-picker>
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
import DynamicSelect from "vue-dynamic-select";
import DatePicker from "vue2-datepicker";
export default {
  name: "filter-equipment",
  props: {
    fData: { type: Object, required: true },
    eqNameList: { type: Array },
    eqDevisionList: { type: Array },
    eqTypeList: { type: Array },
    eqProducerList: { type: Array },
    eqReadinessList: { type: Array },
    responsibleList: { type: Array },
    lang: { type: Object },
    hasExtended: { type: Boolean },
    hasAddButton: { type: Boolean },
    hasAddQueryButton: { type: Boolean },
    placeTypeList: {type: Array}
  },
  data() {
    return {
      showExtendedFilter: false,
    };
  },
  components: {
    DynamicSelect,
    DatePicker,
  },
};
</script>

<style lang="scss" scoped>
.filter,
.extented-filter {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  padding-bottom: 5px;
}
.filter-item-container {
  width: 350px;
  text-align: center;
}
.filter-item-small-container {
  width: 233px;
  text-align: center;
}
.filter-item,
.filter-item-small {
  display: block;
  width: 100%;
  min-width: 300px;
  padding-left: 15px;
  padding-right: 15px;
}

.filter-item-label,
.filter-item-small-label {
  display: inline-block;
  min-width: 300px;
  width: 100%;
  text-align: left;
  color: #000000;
  font-size: 12pt;
  padding-left: 15px;
}
.filter-item-small-label,
.filter-item-small{
  min-width: 200px;
}

.filter table,
.extented-filter table {
  width: 100%;
  table-layout: fixed;
  //border-spacing: 10px;
  border-collapse: separate;
}
td {
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  max-width: 300px;
}

.filter-button:hover {
  color: #000000;
  border: 1px solid #e21a1a;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.filter input,
.extented-filter input {
  position: relative;
  padding: 0.425em 0.5em;
  cursor: text;
  width: 100%;
  height: 39px;
}

.filter-button {
  border: 1px solid #e21a1a;
  position: relative;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-bottom: 0;
  text-align: center;
  -moz-border-radius: 0.25em;
  -webkit-border-radius: 0.25em;
  border-radius: 0.25em;
  cursor: pointer;
  background-color: #e21a1a;
  color: #ffffff;
  width: 39px;
  height: 39px;
}
.add-button {
  width: 200px;
}

.btns {
  display: flex;
  flex-wrap: nowrap;
}

.mx-datepicker {
  width: 100%;
}
.mx-input {
  height: 39px !important;
}

@media screen and (max-width:800px) {
  html {
    -webkit-text-size-adjust: none;
  }
  .filter-item-small-container {
  width: 350px;
}

}
</style>