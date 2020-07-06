<template>
    <div>
        <div class="header">
            <div class="header-item month">
                <label for="Month">Месяц</label><date-picker v-model="Month"  type="month"  format="MMMM YYYY" :editable="false" popup-class='calPopup' @change="monthChange" name="Month"></date-picker>
				<label v-if="!hasEquip()" class="equip-error">Необходимо выбрать оборудование</label>
            </div>
        </div>
        <div class="schedule" :style="styleShedule">
            <div class="time-ground">
                <ul @click="addClick" class="mb-0"> 
                    <li v-for="time in pageTimeGround">
                        <span>{{time}}</span>
                        <p :style="timeListSty"></p>
                    </li>
                </ul>
            </div>
            <div class="query-ground">
                <ul>
                    <li v-for="(day, index) in dayGround" class="query-list" >
                        <div :style="queryListSty">{{day}}</div>
                        
                    </li>
                </ul>
				<ul >
					<li class="query-list-item" v-for="query in queryList" :style="query.styleObj"  @mouseover="invertColor(query.queryId)" @mouseout="normalizeColor(query.queryId)" @click="editClick(query)">
							<div class='query-item' :name="'queryId_' + query.queryId">
								<p>{{query.timeStart}} - {{query.timeEnd}} <br/>
								{{query.title}}</p>
								<p v-if="isFit(query)"><button class="history-item" @click.stop="showHistory(query)"><i class="fa fa-history"></i> История изменений</button></p>
								<p>{{query.dayOf}} <i class="fa fa-history" @click.stop="showHistory(query)" v-if="!isFit(query)" title="История изменений" style="font-size: 12pt"></i></p>
							</div>
					</li>
					<li class="query-list-item add-item hidden-item" :style="styleObjAdd" @click="addItemClick">
						<div>
							<p><i class="fa fa-plus"></i> {{addTime}}<br/>
								Добавить заявку</p>
						</div>
					</li>
					<li class="query-list-disabled up-disabled-item hidden-item" :style="styleObjUpDis">
						<div>
						</div>
					</li>
					<li class="query-list-disabled down-disabled-item hidden-item" :style="styleObjDownDis">
						<div>
						</div>
					</li>
				</ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
	li{
        list-style-type: none;
	}
	.schedule{

		margin: 0 auto;
        position: relative;
	}
	.time-ground{
		display: block;
		position: absolute;
        top: 0;
        left: 0;
		width: 100%;
	}
	.time-ground ul li{
		margin-top: 35px;
        height: 35px
	}
	.time-ground ul li:last-child{
		margin-top: 34px;
        height: 1px
	}

	.time-ground ul li span{
		position: absolute;
		left: 0px;
		transform: translateY(-50%);
	}
	.time-ground ul li p{
		position:absolute;
		left: 57px;
		height: 1px;
		background-color: #EAEAEA;
	}
	.query-ground{
        width: 100%;
        padding-left: 1rem;
	}
	.query-list{
		float: left;
		text-align: center;
        width: 100px;
        padding: 5px; 
		box-sizing:border-box;
		border:1px solid  #EAEAEA;;
	}
	.query-list p{
		text-align: center;
		font-size: 1rem;
	}
	.query-list-item{
		position: absolute;
        background-color: #577F92;
        left: 0;
		width: 100px;
        height:70px;
		-moz-border-radius: .5em;
      	-webkit-border-radius:  .5em;
		  border-radius:  .5em;
		  z-index: 2; 
	}
	.query-list-disabled{
		position: absolute;
        background-color: rgba(169, 182, 189, 0.5);
        left: 0;
		width: 100px;
		height:70px;
		z-index: 1;
		/* -moz-border-radius: .5em;
      	-webkit-border-radius:  .5em;
     	 border-radius:  .5em; */
	}
	.hidden-item{
		display: none;
	}
	.query-list-item:hover{
		cursor: pointer;
	}
	.add-item:hover{
	background-color: #ed9b19;
	}
	.query-list-item p{
		text-align: center;
		padding: 0;
		/* font-size: 0.8rem; */
		color: #EDF2F6;
	}
	.query-list-item h5{
		color: #E0E7E9;
		
    }
    .header
    {
        display: flex;
    }
    .header-item
    {
        padding-left: 2rem;
    }
    .header-item label
    {
         padding: .5rem;
	}
	.equip-error
	{
		color: red;
		display: inline-block;
		font-size: small;
	}
	.history-item{
		-moz-border-radius: .25em;
      	-webkit-border-radius:  .25em;
		border-radius:  .25em;
		border: 1px solid #ced4da;
		color: #000000;
		font-size: 9pt;
		margin: 0 .5em !important;
	
	}
	.history-item:hover{
		border:#337ab7;
		color: #337ab7;
	}

	.blink {
	  -webkit-animation: blinker 2s 3;
      -moz-animation: blinker 2s 3;
      -o-animation: blinker 2s 3;
      animation: blinker 2s 3;

}
.small-history{
	padding: 0 !important;
}
 
   @keyframes blinker {
    0% { opacity: 1; }
    50% { opacity: .5; }
    100% { opacity: 1; }
   }
 
@-webkit-keyframes blinker {
    0% { opacity: 1; }
    50% { opacity: .5; }
    100% { opacity: 1; }
}
@-moz-keyframes blinker {
    0% { opacity: 1; }
    50% { opacity: .5; }
    100% { opacity: 1; }
}

 


</style>

<script>

import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'
import {getFunRight, hasRight}  from "../utils/right";
  import api from "../utils/api";

 import {getQueryType, getWorkingPeriod} from '../utils/dictionary'
 import {DateDiff} from '../utils/date'
    
export default {
    name: 'Schedule',
    components: {
		DatePicker
    },
	props: {
		eqId: {type: Number, required: false},
		workingMode: {type: Number, required: false},
		showQueryId: {type: Number, required: false},
		updatedQueryData: {type:Object, required:false},
		dateStartQuery: {type: Date}
	},
	
	watch: {
		// timeGround(value) {
		// 		this.pageTimeGround = this.initTimeGroud(value);
		// 		this.queryListSty.height = (this.pageTimeGround.length - .5)*this.queryHeight - 12 + 'px';
		// },
        dayGround(value)
        {
            this.styleShedule.width =  (this.dayGround.length ) * this.queryWidth + 57 + 'px';
            this.timeListSty.width = this.dayGround.length * this.queryWidth + 'px';
		},
		eqId(value) {
			$(".add-item").addClass("hidden-item");
			$(".up-disabled-item").addClass("hidden-item");
			$(".down-disabled-item").addClass("hidden-item");
			if (value && value > -1){
				this.$emit('loading', true);
				api().
					get('/equipment/workingMode/' + value,
					).then(response => 
					{
						let data =  1;// response.data.workingMode; //todo получать из базы
						if (data && data > -1){
							this.eqWorkingMode = data;
							this.equipTime = getWorkingPeriod(data);
							this.timeGround = this.equipTime;

							this.pageTimeGround = this.initTimeGroud(this.timeGround);
							this.queryListSty.height = (this.pageTimeGround.length - .5)*this.queryHeight - 12 + 'px';
						}
						
						this.loadData();
						this.$emit('loading', false);
					})
					.catch(error => 
					{
						this.$emit('loading', false);
						alert ('Ошибка при получении данных об оборудовании: ' + error);
						
					})
			}
			else{
				this.initQueryData = [];
				this.queryList = [];
			}

			
		},
		
		updatedQueryData(value)
		{
			
			this.loadData();
		}
	},
	data() {
		return {
			rights: {},
			funShortName: 'q',
			pageTimeGround: [],
			showModal: false,
			queryListSty: {height: '900px'},
			timeListSty: {width: '100%'},
			styleShedule:{},
			styleObjUpDis: {},
			styleObjDownDis: {},
			timeGround: ['09:00', '18:00'], //отображаемое время, может быть больше equipTime, если есть прошлые зявки, которые выходят за рамки equipTime
			equipTime: ['09:00', '18:00'], // время работы оборудования в соответсвии с его режимом (посменная или с 9 до 18)
            dayGround: [],
			Month: null,
			queryTypeList: [],
			initQueryData: [],
			queryList: [],
			isLoading: false,
			queryWidth: 100,
			queryHeight: 70,
			offsetTime: {},
		    color:  [
					{color: "#2B2E4A", invertColor: "#2F3775"},
					{color: "#521262", invertColor: "#6D247F"},
					{color: "#903749", invertColor: "#AD344D"},
					{color: "#53354A", invertColor: "#712D5B"},
					{color: "#40514E", invertColor: "#36635A"},
					{color: "#537780", invertColor: "#417481"},
				],
			styleObjAdd: {},
			itemInfo: {},
			addTime: "",
			showQuery: true,
			eqWorkingMode: 1,
			hasQueryOut: false

        }
	},
	created() {
		this.eqWorkingMode = this.workingMode;
		if (this.eqWorkingMode && this.eqWorkingMode > -1){
				this.equipTime = getWorkingPeriod(this.eqWorkingMode);
				this.timeGround = this.equipTime;
			}
		this.pageTimeGround = this.initTimeGroud(this.timeGround);
		this.queryListSty.height = (this.pageTimeGround.length - .5)*this.queryHeight - 12 + 'px';

		if(this.dateStartQuery)
			this.Month = new Date(this.dateStartQuery.getFullYear(), this.dateStartQuery.getMonth(), 1);
		else {
			let now = new Date();
			this.Month = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0); 
		}
		this.dayGround = [];
		for (let i= 1; i <= this.Month.daysInMonth(); i++){
			this.dayGround.push(i);
		}
		
		this.rights = getFunRight(this.funShortName);
		this.queryTypeList = getQueryType();
	},
	mounted(){
		this.offsetTime = {left: 57, top:$('.time-ground li:first').offset().top -  $('.schedule').offset().top };
		this.loadData();
	},

	methods: {
		isFit: function(query){
			let startMin = query.timeStart.split(':')[0] * 60 + query.timeStart.split(':')[1] * 1;
			let endMin = query.timeEnd.split(':')[0] * 60 + query.timeEnd.split(':')[1] * 1;
			let difMin = endMin - startMin;

			if (difMin > 120){
				query.styleObj.fontSize = "10pt";
				return true;
			}
			query.styleObj.fontSize = "7pt";	
			return false;
		},
		loadData:  function(){
			this.initQueryData = [];
			this.queryList = [];
			 this.hasQueryOut = false;
			if(this.hasEquip()){
				this.$emit('loading', true);
				let monthStart = this.Month;
				let monthEnd = new Date (new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1, 0, 0, 0, 0).getTime() - 1); 

				let maxTime = this.equipTime[this.equipTime.length - 1];
				let minTime = this.equipTime[0];
				let maxMin = maxTime.split(':')[0] * 60 + maxTime.split(':')[1] * 1;
				let minMin = minTime.split(':')[0] * 60 + minTime.split(':')[1] * 1;
             api().
			   get('/query',
					{
						params: {
							idEq: this.eqId,
							dateFrom: monthStart,
							dateTo: monthEnd
						}
					}
			   ).then(response => 
               {
                 let data = response.data;

                 data.forEach(item =>{
                    let queryItem = {
                      queryId: item.id_eqquery,
					  eqId: this.eqId,
                      dateStart: item.date_start ? new Date(item.date_start) : null,
                      dateEnd: item.date_end ? new Date(item.date_end) : null,
                      Q_type: item.q_type,
					  conId: item.id_cont_contract,
					  userId: item.id_user_users
					  
                    }
					 
					 let queryTimeStart = queryItem.dateStart.getHours()*60 + queryItem.dateStart.getMinutes()*1;
					 let queryTimeEnd = queryItem.dateEnd.getHours()*60 + queryItem.dateEnd.getMinutes()*1;

					 if (queryTimeStart < minMin || queryTimeStart > maxMin || // время начала заявки выходит за рамки доступного по оборудованию (например при смене режима работы оборудования)
						 queryTimeEnd < minMin || queryTimeEnd > maxMin){ // время окончания --//--
							 this.hasQueryOut = true;
							 queryItem.queryOut = true;
						 }
					else queryItem.queryOut = false;

					this.initQueryData.push(queryItem);
				 });


				 if (this.hasQueryOut) {
					 this.timeGround = ['00:00', '24:00'];
					 this.pageTimeGround = this.initTimeGroud(this.timeGround);
					 this.queryListSty.height = (this.pageTimeGround.length - .5)*this.queryHeight - 12 + 'px';
					 if ( minMin > 0) {
						 		this.styleObjUpDis = {
									left:  this.offsetTime.left + 'px',
									height: this.queryHeight * minMin / 60 + 'px',
									width: this.queryWidth * this.Month.daysInMonth() + 'px',
									top: this.offsetTime.top + 'px'
						}
						$(".up-disabled-item").removeClass("hidden-item");
					};
					 if (maxMin < 24*60) {
						 this.styleObjDownDis = {
									left:  this.offsetTime.left + 'px',
									height: this.queryHeight * (24*60 - maxMin) / 60 + 'px',
									width: this.queryWidth * this.Month.daysInMonth() + 'px',
									top: this.offsetTime.top + (maxMin/60 * this.queryHeight) + 'px'
						}
						$(".down-disabled-item").removeClass("hidden-item");
					 };
				 }
				this.makeQueryList();
				
               //  this.$emit('loading', false);
               })
               .catch(error => 
               {
                   this.$emit('loading', false);
                   alert ('Ошибка при получении данных о заявках: ' + error);
                  
               })
			 }
		},
		makeQueryList(){

		//	this.$emit('loading', true);
			let maxTime = this.equipTime[1];
			let minTime = this.equipTime[0];
			let minDateMonth = new Date(this.Month.getFullYear(), this.Month.getMonth(), 1, 0, 0, 0); 
			let maxDateMonth = new Date(this.Month.getFullYear(), this.Month.getMonth(), this.Month.daysInMonth(), 23, 59, 59);
			let minDateMonthQuery = new Date(this.Month.getFullYear(), this.Month.getMonth(), 1, minTime.split(':')[0], minTime.split(':')[1], 0, 0);
			let maxDateMonthQuery = new Date(this.Month.getFullYear(), this.Month.getMonth(), this.Month.daysInMonth(), maxTime.split(':')[0], maxTime.split(':')[1], 0, 0);
			
			let queryData =  _.orderBy(this.initQueryData,  'dateStart', 'asc');

			this.queryList = [];
			queryData.forEach(query => {
				if(query.dateStart <= maxDateMonth && query.dateEnd >= minDateMonth){ //заявка попадает в выбранный месяц
					let dayStartOriginal = new Date(query.dateStart.getFullYear(), query.dateStart.getMonth(), query.dateStart.getDate()) ;
					let dayEndOriginal = new Date(query.dateEnd.getFullYear(), query.dateEnd.getMonth(), query.dateEnd.getDate()) ;
					let totalDays = DateDiff(dayEndOriginal, dayStartOriginal) + 1;

					query.dateStartOriginal = query.dateStart;
					query.dateEndOriginal = query.dateEnd;

					if (query.dateStart < minDateMonthQuery){ //если заявка началась до 1 числа выбранного месяца
						if (query.queryOut) 
							query.dateStart = minDateMonth;
						else 
							query.dateStart = minDateMonthQuery;

					 }
					if (query.dateEnd > maxDateMonthQuery) { //если заявка закончится позже конца выбранного месяца
						if (query.queryOut) 
							query.dateEnd = maxDateMonth;
						else 
							query.dateEnd = maxDateMonthQuery;
					}

					let dayStart = query.dateStart.getDate();
					let timeStart = `${query.dateStart.getHours()}:${query.dateStart.getMinutes() < 10? ('0'+ query.dateStart.getMinutes().toString()): query.dateStart.getMinutes()}`;
					let dayEnd = query.dateEnd.getDate(); 
					let timeEnd = `${query.dateEnd.getHours()}:${query.dateEnd.getMinutes() < 10? ('0'+ query.dateEnd.getMinutes().toString()): query.dateEnd.getMinutes()}`;
					for(var i = dayStart; i <= dayEnd; i++)
					{
						let curDay = new Date(this.Month.getFullYear(), this.Month.getMonth(), i, 0, 0, 0, 0);
						let dayOf = DateDiff(curDay, dayStartOriginal) + 1;
						this.queryList.push({
							queryId: query.queryId,
							day: i,
							timeStart: i > dayStart ? 
								(query.queryOut ? '00:00' : minTime) : timeStart,
							timeEnd: i < dayEnd ? 
								(query.queryOut ? '24:00' : maxTime) : timeEnd,
							title: this.queryName(query.Q_type),
							dayOf : totalDays > 1 ? (`${dayOf}/${totalDays}`) : '',
						})
					}
				}
			});
			this.renderQueryList();
			//this.$emit('loading', false);
		},
		hasEquip: function(){
			return (this.eqId && this.eqId > -1);
		},
		editClick: function (query){
			if (this.rights.edit || this.rights.delete){
				$(".add-item").addClass("hidden-item");
				if (query.queryId === this.showQueryId)
					$('[name=queryId_' + this.showQueryId).parent().removeClass('blink')
				if(this.hasEquip()) {
					let queryData = _.find(this.initQueryData, {queryId: query.queryId})
					this.$emit('editQuery', queryData)
				}
			}
		},
		showHistory: function (query){
			this.$emit('showHistory', query.queryId)
		},
		addClick(){
			if (this.rights.add){
				if(this.hasEquip()) {
					if (event) {
						let dateTime = this.calcDayTime({x: event.clientX, y: event.clientY});
						this.itemInfo = dateTime;
						this.styleObjAdd = {
								left: (dateTime.day-1)*this.queryWidth + this.offsetTime.left + 'px',
								height: this.queryHeight + 'px',
								top: (dateTime.time* this.queryHeight) + this.offsetTime.top + 'px',
								backgroundColor: '#4285f4'
						}
						this.addTime = ('0' + (dateTime.time + this.pageTimeGround[0].split(":")[0]*1)).slice(-2) + ':00';
						$(".add-item").removeClass("hidden-item");
					}
				}
			}
		},
		addItemClick(){
			
			if(this.hasEquip()) 
			{
				let query = {queryId: -1, eqId: this.eqId, conId: '', Q_type: '', userId: this.$store.getters.id_user};
				if (this.itemInfo){
					query.dateStart = new Date (this.Month.getFullYear(), this.Month.getMonth(), this.itemInfo.day, this.itemInfo.time + this.pageTimeGround[0].split(":")[0]*1)
					query.dateEnd = new Date (this.Month.getFullYear(), this.Month.getMonth(), this.itemInfo.day, this.itemInfo.time + this.pageTimeGround[0].split(":")[0]*1 + 1)
				}
				this.$emit('addQuery', query)
				$(".add-item").addClass("hidden-item");
			}
		},
		calcDayTime(point)
		{
			let offsetShedule = $('.schedule').offset();

			let time = parseInt((point.y - offsetShedule.top - this.offsetTime.top) / this.queryHeight);
			let day = parseInt((point.x - offsetShedule.left - this.offsetTime.left) / this.queryWidth) + 1;
			return {time: time, day: day}
		},
		invertColor(queryId){
			$('[name=queryId_' + queryId+ ']').parent().css("backgroundColor", this.color[queryId % this.color.length].invertColor);
		
		},
		normalizeColor(queryId){
			$('[name=queryId_' + queryId + ']').parent().css("backgroundColor", this.color[queryId % this.color.length].color);
		},
		initTimeGroud(value){
			if(value && value.length == 2){
					let startTime = value[0].split(":")[0] * 1;
					let endTime = value[1].split(":")[0] * 1;
					value = [];
					for(let i = startTime; i <= endTime; i++){
						let hour = i < 10 ? "0" + i : "" + i;
						value.push(hour + ":00");
					}
				}
				return value;
		},
		renderQueryList(){
		//	this.$emit('loading', true);

			let curQueryId =  -1;
			let i = 0;
			this.queryList.forEach(query => {
					if (curQueryId != query.queryId){
						curQueryId = query.queryId;

					}
					let startMin = query.timeStart.split(':')[0] * 60 + query.timeStart.split(':')[1] * 1;
					let endMin = query.timeEnd.split(':')[0] * 60 + query.timeEnd.split(':')[1] * 1;
					let difMin = endMin - startMin;
					query.styleObj = {
						left: (query.day-1)*this.queryWidth + this.offsetTime.left + 'px',
						height: difMin * this.queryHeight / 60 + 'px',
						top: ((startMin - (this.pageTimeGround[0].split(":")[0] * 60 + this.pageTimeGround[0].split(":")[1] * 1)) * this.queryHeight / 60) + this.offsetTime.top + 'px',
						backgroundColor: this.color[query.queryId % this.color.length].color///this.color[colorId],//this.color[~~(Math.random() * this.color.length)],
					}
			})
			if (this.queryList.length > 0 && this.showQueryId && this.showQuery){
				this.showQuery = false;
				if(this.dateStartQuery){
					setTimeout(() => {
						$('main').scrollLeft((this.dateStartQuery.getDate()) *this.queryWidth - $(document).width()/2 + this.offsetTime.left);
						$('main').scrollTop((this.dateStartQuery.getHours() -  this.pageTimeGround[0].split(":")[0]*1) * this.queryHeight +  $('.schedule').position().top  - $(document).height()/3);
						$('[name=queryId_' + this.showQueryId).parent().addClass('blink');
					}, 100);
				}
			}
			this.$emit('loading', false);

		},
        monthChange(value){
			$(".add-item").addClass("hidden-item");
		 	$(".up-disabled-item").addClass("hidden-item");
			$(".down-disabled-item").addClass("hidden-item");
			 
           this.dayGround = [];
           for (var i= 1; i <= value.daysInMonth(); i++)
			   this.dayGround.push(i);

			this.timeGround = this.equipTime;
			this.pageTimeGround = this.initTimeGroud(this.timeGround);
			this.queryListSty.height = (this.pageTimeGround.length - .5)*this.queryHeight - 12 + 'px';

			this.loadData();
		},
		queryName (_id){
			let queryItem = _.find(this.queryTypeList, {id: _id});
			return queryItem ? queryItem.name : '';
		}
	}
}
</script>