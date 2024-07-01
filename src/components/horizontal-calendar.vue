<template>
	<view>
		<view class="date-choose shrink">
			<view class="data-month">{{ dateMonth }}</view>
			<swiper class="date-choose-swiper" :indicator-dots="false" :current="swiperCurrent" @change="dateSwiperChange($event)">
				<block v-for="(date,index) in dateList">
					<swiper-item class="swiper-item">
						<view class="weekday">
							<block v-for="(weekday,ind) in dateListArray">
								<text class="week">{{ weekday }}</text>
							</block>
						</view>
						<view class="dateday">
							<block v-for="day in date.days" :key="day.id">
								<text class="day" :id="day.id" @tap="chooseDate($event)">
									<text :class="dateCurrentStr==day.id?'active':''">{{ day.day }}</text>
								</text>
							</block>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			dateList: [], // 日历数据数组
			swiperCurrent: 0, // 日历轮播正处在哪个索引位置
			dateCurrent: new Date(), // 正选择的当前日期
			dateCurrentStr: '', // 正选择日期的 id
			dateMonth: '1月', // 正显示的月份
			dateListArray: ['日', '一', '二', '三', '四', '五', '六']
		};
	},
	onLoad() {
		var that = this;
		this.initDate(); // 日历组件程序
	},
	methods: {
		// 日历部分
		// ----------------------------
		initDate() {
			// console.log(this.$util)
			var d = new Date();
			var month = this.$util.addZero(d.getMonth() + 1),
				day = this.$util.addZero(d.getDate());
			for (var i = -5; i <= 5; i++) {
				this.updateDate(this.$util.DateAddDay(d, i * 7)); //多少天之后的
			}
			this.swiperCurrent= 5;
			this.dateCurrent= d;
			this.dateCurrentStr= d.getFullYear() + '-' + month + '-' + day;
			this.dateMonth= month + '月'
		},
		// 获取这周从周日到周六的日期
		calculateDate(_date) {
			var first = this.$util.FirstDayInThisWeek(_date);
			var d = {
				month: first.getMonth() + 1,
				days: []
			};
			for (var i = 0; i < 7; i++) {
				var dd = this.$util.DateAddDay(first, i);
				var day = this.$util.addZero(dd.getDate()),
					month = this.$util.addZero(dd.getMonth() + 1);
				d.days.push({
					day: day,
					id: dd.getFullYear() + '-' + month + '-' + day
				});
			}
			return d;
		},
		// 更新日期数组数据
		updateDate(_date, atBefore) {
			var week = this.calculateDate(_date);
			if (atBefore) {
				this.dateList=[week].concat(this.dateList);
			} else {
				this.dateList=this.dateList.concat(week);
			}
		},
		// 日历组件轮播切换
		dateSwiperChange(e) {
			var index = e.detail.current;
			var d = this.dateList[index];
			this.swiperCurrent=index;
			this.dateMonth= this.$util.addZero(d.month) + '月';
		},
		// 获得日期字符串
		getDateStr: function(arg) {
			if (this.$util.type(arg) == 'array') {
				return arr[0] + '-' + arr[1] + '-' + arr[2] + ' 00:00:00';
			} else if (this.$util.type(arg) == 'date') {
				return arg.getFullYear() + '-' + (arg.getMonth() + 1) + '-' + arg.getDate() + ' 00:00:00';
			} else if (this.$util.type(arg) == 'object') {
				return arg.year + '-' + arg.month + '-' + arg.day + ' 00:00:00';
			}
		},
		// 点击日历某日
		chooseDate(e) {
			var str = e.currentTarget.id;
			console.log(e);
			this.dateCurrentStr= str;
		}
		// ----------------------------
	}
};
</script>

<style lang="scss">
.date-choose {
	background: #fff;
	overflow: hidden;
	box-shadow: 0px 1px 1px 0px rgba(198, 198, 198, 0.5);
	
}
.data-month {
	width: 100%;
	align-items: center;
	padding: 10rpx 5%;
	
	text-align: left;
	/* box-shadow: 2px 0 5px rgba(0,0,0,.4); */
	color: #333;
	font-size: 36rpx;
}
.date-choose-swiper {
	flex-grow: 1;
	height: 4em;
	
}
.swiper-item {
	display: flex;
	flex-direction: column;
}
.weekday,
.dateday {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	flex-grow: 1;
	
}
.week,
.day {
	width: 14.286%;
	flex-basis: 14.286%;
}
.week {
	color: #999;
	font-size: 24rpx;
}
.day text {
	position: relative;
	color: #009bff;
}
.day .active:before {
	/* 圈圈 */
	content: '';
	position: absolute;
	width: 76rpx;
	height: 76rpx;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	/* border: 2px solid #000; */
	border-radius: 100%;
	background: #e0f3ff;
	z-index: -1;
}
</style>

