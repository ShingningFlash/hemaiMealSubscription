<template>
	<view>
		<view class="date">
			<view class="content" @tap="open">{{value1 | formatDeta}}
				<view class="xiabiao">
				</view>
			</view>
			<view class="">
				-
			</view>
			<view class="content" @tap="open1">{{value2 | formatDeta}}
				<view class="xiabiao">
				</view>
			</view>
			<view class="content" @tap="open2">{{value}}
				<view class="xiabiao">
				</view>
			</view>
		</view>
		<!-- 日期选择 -->
		<u-datetime-picker :show="show" v-model="value1" mode="date" @cancel="close" :closeOnClickOverlay="closed" @close="close"
			@confirm="confirm"></u-datetime-picker>
		<u-datetime-picker :show="show1" v-model="value2" mode="date" @cancel="close" :closeOnClickOverlay="closed" @close="close"
			@confirm="confirmend"></u-datetime-picker>


		<!-- 时间段选择 -->
		<u-picker :show="showtime" @cancel="close" :columns="columns" keyName="name" @confirm="confirm2" @close="close"
			:closeOnClickOverlay="closed"></u-picker>
		<!-- tab 栏 -->
		<view class="order-box">
			<view class="order-item">
				<view class="items" v-for="(item,index) in tablist" :key="index"
					:class="current == index ? 'active' : ''" @click="changeTab(index)">{{item.name}}</view>
			</view>

		</view>
		<u-empty mode="order" v-if="orderList == ''">
		</u-empty>
		<!-- 订单列表 -->
		<view class="" style="padding-bottom: 120rpx;">
			<view class="order-list" v-for="(item,index) in orderList" :key="index">
				<view class="list-top">
					<view class="top-left">{{item.date_name}} {{item.meal_type_name}} {{item.take_date}}</view>
					
					<view class="top-right" >{{item.order_status_name}} 
					<view class="" v-if="item.order_status !=6" style="margin-left: 10rpx;">
						退款状态:
						<text style="color: #ff0000;" v-if="item.is_refund==0">
							可申请
						</text>
						 <text style="color: #ff0000;" v-if="item.is_refund==1">
						 	申请中
						 </text> 
						 <text style="color: #ff0000;" v-if="item.is_refund==2">
						 	已退款
						 </text> 
						 <text style="color: #ff0000;" v-if="item.is_refund==3">
						 	已拒绝
						 </text> 
					</view>
					</view>
					
				</view>
				<view class="list-mid">
					<view class="mid-box">
						<view class="" style="width: 530rpx;">
							<u-scroll-list :indicator="false">
								<view v-for="(items, indexs) in item.goodsInfo" :key="indexs">
									<image style="width: 150rpx;height: 120rpx;margin-right: 10rpx;"
										:src="items.original_img">
									</image>
								</view>
							</u-scroll-list>
						</view>
						<view class="mid-right">
							<view class="price">￥{{item.order_amount}}</view>
							<view class="num">
								共{{item.order_num}}件
							</view>
						</view>
					</view>

				</view>
				<view class="list-bottom">
					
					<view class="red-btn" v-if="item.order_status == 2 || item.order_status == 1"
						@click="cancelorder(item.order_id)">
						取消订单
					</view>
					<view class="red-btn" v-if="item.order_status == 7 && item.is_refund == 0"
						@click="tuikuan(item.order_id)">
						申请退款
					</view>
					<view class="red-btn" v-if="item.order_status == 3" @click="querenqucan(item.order_id)">
						确认取餐
					</view>
					<view class="red-btn" v-if="item.order_status == 1" @click="payment(item.order_id)">
						去付款
					</view>
					<view class="red-btn" @click="orderDetail(item.order_id)">
						订单详情
					</view>

				</view>
			</view>
		</view>

		<view-tabbar :current="6"></view-tabbar>
	</view>
</template>

<script>
	import Tabbar from '@/components/tabbar.vue'
	export default {
		components: {
			'view-tabbar': Tabbar
		},
		data() {
			return {
				// 订单状态 0-全部、1待付款，2待取餐，3取餐中，4已完成，5已退餐，6已取消
				show: false, // 日历显示隐藏
				show1:false,
				showtime: false,
				value1: Number(new Date()), //日期
				value2: Number(new Date().setDate(new Date().getDate()+3)),
				value: '全部', // 时间段
				closed: true,
				tablist: [{
					name: '待付款'
				}, {
					name: '待取餐'
				}, {
					name: '已完成'
				}, {
					name: '已取消'
				},
				 {
				 	name: '已过期'
				 },],
				current: 0, //当前选项
				list: [{
					thumb: "https://cdn.uviewui.com/uview/goods/1.jpg"
				}, {
					thumb: "https://cdn.uviewui.com/uview/goods/2.jpg"
				}, {
					thumb: "https://cdn.uviewui.com/uview/goods/3.jpg"
				}, {
					thumb: "https://cdn.uviewui.com/uview/goods/4.jpg"
				}, {
					thumb: "https://cdn.uviewui.com/uview/goods/5.jpg"
				}],
				columns: [
					// ['全部', '早餐', '午餐', '晚餐', '下午茶', '夜宵']
				],
				orderList: [], //订单数据
				today: '', //今天
				p: 1,
				cat_id: 0, //分类id
				timer: null,
				endday:''

			}
		},
		onReachBottom() {
			this.p++
			this.getOrderlist()
		},
		onHide() {
			clearTimeout(this.timer)
			this.timer = null
		},
		filters: {
			formatDeta: function(time) {
				const date = new Date(time)
				const Y = date.getFullYear()
				const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
				const D = date.getDate()
				return `${Y}-${M}-${D}`
			}
		},
		onShow() {

		},


		methods: {
			
			tuikuan(id){
				let that = this
				console.log(id);
				uni.showModal({
					title: '提示?',
					content: "是否确认取消订单",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							let data = {}
							data.order_id = id
							this.$request('ApiConnect/setOrderRefund', data).then(res => {
								uni.hideLoading()
								if (res.status == 1) {
									uni.$u.toast(res.msg)
									that.timer = setTimeout(function() {
										that.getOrderlist()
									}, 1000)
								} else {
				
									uni.$u.toast(res.msg)
								}
							}).catch(err => {
				
							})
						}
					}
				
				})
			},
			gofukuan(dateCurrentStr) {
				uni.navigateTo({
					url: './createOrder/createOrder?time=' + dateCurrentStr
				})
			},
			// 跳转
			
			// 下单
			payment(order_id) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})

				this.$request('ApiConnect/MiniPayOrder', {
					order_id: order_id
				}).then(res => {
					uni.hideLoading()
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.payinfo.timeStamp,
						nonceStr: res.payinfo.nonceStr,
						package: res.payinfo.package,
						signType: res.payinfo.signType,
						paySign: res.payinfo.paySign,
						success: (res) => {
							uni.$u.toast("支付成功");
							this.getOrderlist()
							console.log(res, "支付成功");


						},
						fail: (err) => {
							console.log(err, "支付失败");



						}
					})
				}).catch(err => {})
			},
			// 获取分类
			getcate() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.address_id = uni.getStorageSync('address_id')
				this.$request('ApiConnect/getGoodsCate', data).then(res => {
					if (res.status == 1) {
						console.log(res);
						var data = []
						data = res.data
						data.unshift({
							id: 0,
							name: "全部"
						})
						this.columns.push(data)
					} else {
						uni.$u.toast(res.msg);
					}
					uni.hideLoading()
				}).catch(err => {

				})
			},
			// 取消订单
			cancelorder(id) {
				uni.showModal({
					title: '提示?',
					content: "是否确认取消订单",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							let data = {}
							data.order_id = id
							this.$request('ApiConnect/AllOrderOut', data).then(res => {
								uni.hideLoading()
								if (res.status == 1) {
									uni.$u.toast(res.msg)
									this.getOrderlist()
								} else {

									uni.$u.toast(res.msg)
								}
							}).catch(err => {

							})
						}
					}

				})
			},
			// 确认取餐
			querenqucan(id) {
				var that = this
				uni.showModal({
					title: '提示?',
					content: "是否确认取餐",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							let data = {}
							data.order_id = id
							this.$request('ApiConnect/takeMeal', data).then(res => {
								uni.hideLoading()
								if (res.status == 1) {
									uni.$u.toast(res.msg)
									that.timer = setTimeout(function() {
										that.getOrderlist()
									}, 1000)

								} else {
									uni.$u.toast(res.msg)
								}
							}).catch(err => {

							})
						}
					}

				})
			},
			open() {
				this.show = !this.show
			},
			open1() {
				this.show1 = !this.show1
			},
			open2() {
				this.showtime = !this.showtime
			},
			close() {
				this.show = false
				this.showtime = false
				this.show1 = false
			},
			confirm(e) {
				this.show = false
				var d = new Date(e.value);
				var month = this.$util.addZero(d.getMonth() + 1),
					day = this.$util.addZero(d.getDate());
				this.orderList = []
				this.today = d.getFullYear() + '-' + month + '-' + day
				this.getOrderlist()


			},
			confirmend(e){
				this.show1 = false
				var d = new Date(e.value);
				var month = this.$util.addZero(d.getMonth() + 1),
					day = this.$util.addZero(d.getDate());
				this.orderList = []
				this.endday = d.getFullYear() + '-' + month + '-' + day
				this.getOrderlist()
			},
			changeTab(e) {
				this.current = e
				
				this.orderList = []
				this.p = 1
				this.getOrderlist()
			},
			confirm2(e) {
				this.orderList = []
				this.showtime = false
				this.value = e.value[0].name
				this.cat_id = e.value[0].id
				this.getOrderlist()
			},

			// 获取订单列表
			getOrderlist() {

				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}

				// data.page = 1
				data.take_date = this.today
				data.end_take_date = this.endday
				if(this.current == 4){
					data.status = 7
				}
				else{
					data.status = this.current * 1 + 1
				}
				data.page = this.p
				if (this.cat_id != 0) {
					data.cat_id = this.cat_id
				}
				if (this.current == 2) {
					data.status = 4
				}
				if (this.current == 3) {
					data.status = 6
				}

				this.$request('ApiConnect/GetUserOrderList', data).then(res => {
					uni.hideLoading()
					if (res.status == 1) {
						console.log(res);
						if (this.p == 1) {
							this.orderList = res.result
						} else {
							this.orderList = this.orderList.concat(res.result)
						}

					} else {
						this.p = 1
						return uni.showToast({
							title: '暂无更多订单',
							icon: "none",
							duration: 2000
						});
					}
				}).catch(err => {

				})
			},
			// 订单详情
			orderDetail(order_id) {
				uni.navigateTo({
					url: './orderDetail?order_id=' + order_id
				})
			}

		},
		onLoad(option) {
			this.current = option.current
			var d = new Date();
			var month = this.$util.addZero(d.getMonth() + 1),
				day = this.$util.addZero(d.getDate());
			this.today = d.getFullYear() + '-' + month + '-' + day
			var dd = new Date(this.value2);
			var month = this.$util.addZero(dd.getMonth() + 1),
				day = this.$util.addZero(dd.getDate());
			
			this.endday = dd.getFullYear() + '-' + month + '-' + day
			this.getOrderlist()
			this.getcate()
		}
	}
</script>

<style scoped lang="scss">
	.date {
		background-color: #D73334;
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		color: #fff;
	}

	.content {
		display: flex;
		align-items: center;
		font-family: "PingFang SC";
		font-weight: 400;
		font-size: 32rpx;
		line-height: 28.8rpx;
		color: #fff;
	}

	.xiabiao {
		width: 22rpx;
		height: 22rpx;
		// background: #fff;
		border-radius: 50%;
		border: 1rpx solid #fff;
		box-sizing: border-box;
		position: relative;
		margin-left: 10rpx;

		&::after {

			content: ''; //一定要有它，否则效果出不来
			position: absolute; //给高亮元素定位，在这之前要给statusItem元素设置position:relative定位
			left: 50%;
			bottom: 0;
			transform: translate(-50%, 0); //居中显示
			border: 6rpx solid transparent; //小三角的大小
			border-top-color: #fff; //小三角朝下

		}
	}

	// tab栏
	.order-box {
		padding: 20rpx 30rpx;

		.order-item {
			display: flex;

			.items {
				width: 100rpx;
				height: 48rpx;
				border-radius: 24rpx;
				background: #dedede;
				text-align: center;
				line-height: 48rpx;
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				color: #2e2e2e;
				margin-right: 30rpx;
			}

			.active {
				background: #d73334;
				color: #fff;
			}
		}
	}


	// 订单列表
	.order-list {
		width: 690rpx;
		height: 297rpx;
		border-radius: 10rpx;
		margin: 0 auto;
		background: #fff;
		margin-top: 10rpx;
		padding: 20rpx;
		box-sizing: border-box;

		.list-top {
			display: flex;
			justify-content: space-between;

			.top-left {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				line-height: 24rpx;
				color: #2e2e2e;
			}

			.top-right {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				line-height: 24rpx;
				color: #2e2e2e;
				display: flex;
			}
		}

		.list-mid {
			margin-top: 15rpx;

			.mid-box {
				display: flex;
				align-items: center;
				justify-content: space-between
			}

			.mid-right {
				text-align: right;

				.price {
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 32rpx;
					line-height: 24rpx;
					color: #2e2e2e;
				}

				.num {
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 24rpx;
					line-height: 24rpx;
					color: #777;
					margin-top: 10rpx;
				}
			}
		}

		.list-bottom {
			display: flex;
			flex-direction: row-reverse;

			.red-btn {
				width: 160rpx;
				height: 60rpx;
				border-radius: 10rpx;
				background: #d73334;
				text-align: center;
				line-height: 60rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #fff;
				margin-right: 10rpx
			}
		}


	}


	.scroll-list {
		@include flex(column);

		&__goods-item {
			margin-right: 20px;

			&__image {
				width: 60px;
				height: 60px;
				border-radius: 4px;
			}

			&__text {
				color: #f56c6c;
				text-align: center;
				font-size: 12px;
				margin-top: 5px;
			}
		}

		&__show-more {
			background-color: #fff0f0;
			border-radius: 3px;
			padding: 3px 6px;
			@include flex(column);
			align-items: center;

			&__text {
				font-size: 12px;
				width: 12px;
				color: #f56c6c;
				line-height: 16px;
			}
		}
	}
</style>

<style>
	page {
		background-color: #F6F6F6;
	}
</style>
