<template>
	<view>
		<view-tabbar :current="6"></view-tabbar>
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
		<u-datetime-picker :show="show" v-model="value1" mode="date" @cancel="close" :closeOnClickOverlay="closed"
			@confirm="confirm"></u-datetime-picker>
		<u-datetime-picker :show="showend" v-model="value2" mode="date" @cancel="close" :closeOnClickOverlay="closed" @close="close"
			@confirm="confirmend"></u-datetime-picker>
		<!-- tab 栏 -->
		<view class="order-box">
			<view class="order-item">
				<view class="items" v-for="(item,index) in tablist" :key="index"
					:class="current == index ? 'active' : ''" @click="changeTab(index)">{{item.name}}</view>
			</view>
			<view class="item-right" @click="piliang" v-if="current == 0">
				<image style="width: 21.5rpx;height: 21.5rpx;margin-right: 10rpx;" src="/static/icon/piliang.png"
					mode=""></image>
				<text>批量取餐</text>
			</view>
			<view class="item-right" v-if="current == 0" @click="scanCode">
				<image style="width: 21.5rpx;height: 21.5rpx;margin-right: 10rpx;" src="/static/icon/code.png" mode="">
				</image>
				<text>扫码取餐</text>
			</view>

		</view>
		<u-empty mode="order" v-if="orderList == ''">
		</u-empty>
		<!-- 订单列表 -->



		<view class="" style="padding-bottom: 120rpx;">
			<view class="order-list" :style="{boxSizing:check ? '' : 'border-box'}" v-for="(item,index) in orderList"
				:key="index">
				<view class="" style="margin-right: 10rpx;" v-if="check && item.check == false" @click="inp(item.order_id)">
					<u-icon name="checkmark-circle-fill"></u-icon>
				</view>
			
				<view class="" style="margin-right: 10rpx;" v-if="check && item.check == true" @click="inp(item.order_id)">
					<u-icon name="checkmark-circle-fill" color="#D73334"></u-icon>
				</view>
			
				<view class="" style="width: 100%;">
					<view class="list-top">
			
			
						<view class="top-left">{{item.date_name}} {{item.meal_type_name}} {{item.take_date}}</view>
						<view class="top-right">{{item.order_status_name}}</view>
			
					</view>
					<view class="list-mid">
			
						<view class="mid-box">
							<view class="" style="width: 500rpx;">
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
						<view class="take_code">
							取餐码：{{item.take_code}}
						</view>
						<view class="red-btn" style="margin-left: 90rpx;" @click="orderDetail(item.order_id)">
							订单详情
						</view>
						<view class="red-btn" v-if="item.order_status == 2" @click="qucan(item.order_id)">
							确认取餐
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<!-- 底部批量 -->
		<view class="bottom-box" v-if="check">

			<view class="left" style="display: flex;" @tap="all">
				<u-icon name="checkmark-circle-fill" v-if="!flag"></u-icon>
				<u-icon name="checkmark-circle-fill" color="#D73334" v-if="flag"></u-icon><text>全选</text>
			</view>
			<view class="right" style="display: flex;">
				<view class="right-1">合计{{num}}份</view>
				<view class="red-btn" @click="qucans">确认取餐</view>
			</view>
		</view>
		<!-- 弹窗 -->
		<u-picker :show="show1" :columns="columns" keyName="name" @cancel="close" @confirm="confirm2" :closeOnClickOverlay="closed">
		</u-picker>
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
				show: false, // 日历显示隐藏
				show1: false, // 餐类型显示隐藏
				showend:false,
				value1: Number(new Date()),
				value2: Number(new Date().setDate(new Date().getDate()+3)),
				value: '全部',
				closed: true,
				tablist: [{
					name: '待送达'
				}, {
					name: '待交接'
				}, {
					name: '已完成'
				}],
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
				}], //横向图片
				columns: [
					
				],
				check: false,
				orderList: [],
				p: 1,
				orderIds: '',
				flag: false,
				num: 0,
				cat_id:0,
				timer:null,
				endday:''
			}
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
		onLoad(){
			
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
		},
		onReachBottom() {
			this.p++
			this.getOrderlist()
		},
		onHide(){
			clearTimeout(this.timer)
			this.timer = null
		},
		methods: {
			orderDetail(order_id) {
				uni.navigateTo({
					url: './orderDetail?order_id=' + order_id
				})
			},
			// 扫码取餐
			scanCode(){
				var that = this
				// 只允许通过相机扫码
				uni.scanCode({
					onlyFromCamera: true,
					success: function (res) {
						// console.log('条码内容：' + res.result);
						// https://stdemo.ydlweb.com/pages/user/user?industry_id=26
						
						// let str = res.result
						// let resultIndex = str.lastIndexOf("=")
						// let result =str.substring(resultIndex+1, str.length);
						console.log(res,"扫到的内容");
						// uni.navigateTo({
						// 	url: '/pages/TakeMeal/succTake?user_id='+ item.user_id + '&order_id=' + item. order_id + '&industry_id=' + result
						// })
						
						
						let data = {}
						data.order_sn = res.result
						that.$request('ApiConnect/getCodeOrder', data).then(ress => {
							console.log(ress,"获取的内容");
							if (ress.status == 1) {
								uni.showToast({
									title:ress.msg,
									duration:2000
								})
								
								that.timer = setTimeout(function(){
									that.getOrderlist()
								},1000)
								
						
							} 
							else {
								// this.page --
								console.log("status状态不是1");
								uni.showToast({
									title:ress.msg,
									duration:2000,
									icon:'error'
								})
							}
						}).catch(err => {
						
						})
						
					}
				});
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
						var data =[]
						data = res.data
						data.unshift({
							id:0,
							name:"全部"
						})
						this.columns.push(data)
					} else {
						uni.$u.toast(res.msg);
					}
					uni.hideLoading()
				}).catch(err => {
			
				})
			},
			// 批量操作
			piliang() {
				if (this.orderList != '') {
					this.check = !this.check
				}

			},
			// 全选
			all(index) { //全选
				this.flag = !this.flag;
				if (this.flag) {
					for (var i = 0; i < this.orderList.length; i++) {
						this.orderList[i].check = true;
					}
					this.num = this.orderList.length;

				} else {
					for (var i = 0; i < this.orderList.length; i++) {
						this.orderList[i].check = false;
					}
					this.num = 0;

				}

			},
			// 打开弹窗2
			open2() {
				this.show1 = !this.show1
			},
			// 打开弹窗1
			open() {
				this.show = !this.show
			},
			open1() {
				this.showend = !this.showend
			},
			// 关闭弹窗
			close() {
				this.show = false
				this.show1 = false
				this.showend = false
			},
			confirmend(e){
				this.showend = false
				var d = new Date(e.value);
				var month = this.$util.addZero(d.getMonth() + 1),
					day = this.$util.addZero(d.getDate());
				this.orderList = []
				this.endday = d.getFullYear() + '-' + month + '-' + day
				this.getOrderlist()
			},
			// 关闭弹窗
			confirm(e) {
				this.show = false
				
				var d = new Date(e.value);
				var month = this.$util.addZero(d.getMonth() + 1),
					day = this.$util.addZero(d.getDate());
				this.today = d.getFullYear() + '-' + month + '-' + day
				this.orderList = []
				this.getOrderlist()
			},
			confirm2(e) {
				this.show1 = false
				this.value = e.value[0].name
				this.cat_id = e.value[0].id
				this.orderList = []
				this.getOrderlist()
			},
			// 改变当前项
			changeTab(e) {
				this.current = e
				this.orderList = []
				this.p = 1
				this.getOrderlist()
			},
			// 获取订单列表
			getOrderlist(i) {

				
				let data = {}
				
				// data.page = 1 this.current * 1 + 2
				data.take_date = this.today
				data.end_take_date = this.endday
				data.status = this.current * 1 + 2
				data.page = this.p
				if(this.cat_id != 0){
					data.cat_id = this.cat_id
				}
				this.$request('ApiConnect/getComOrderList', data).then(res => {
					
					
					if (res.status == 1) {
						res.result.forEach((item => {
							this.$set(item, "check", false)
						}))
						if(this.p == 1){
							this.orderList = res.result
						}
						else{
							this.orderList = this.orderList.concat(res.result)
						}
					} else {
						this.p =1
						return uni.showToast({
							title: '暂无更多订单',
							icon: "none",
							duration: 2000
						});
					}
				}).catch(err => {

				})
			},

			// 取餐
			qucan(id) {
				uni.showModal({
					title: '是否确认',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '请求中',
								mask: true
							})
							let data = {}
							data.order_id = id
							this.$request('ApiConnect/takeAllOrder', data).then(res => {
								uni.hideLoading()
								if (res.status == 1) {
									this.getOrderlist()

								} else {
									uni.$u.toast(res.msg);
								}
							}).catch(err => {

							})
						}
					}
				})
			},

			inp(index) { //商品选择
				for (var i = 0; i < this.orderList.length; i++) {
					if (this.orderList[i].order_id == index) {
						this.orderList[i].check = !this.orderList[i].check;
						if (this.orderList[i].check == false) { //如果有条数据没选择，就取消全选
							this.flag = false;

							this.orderIds = this.orderIds.replace((this.orderList[i].order_id + ','), '')
							// this.orderList[i].check = true
							this.num -= 1;
							// this.money -= this.list[i].price * this.list[i].count;
							// this.$emit("refresh", this.list);
						} else {
							this.orderIds += this.orderList[i].order_id + ','

							this.num += 1;
							// this.money += this.list[i].price * this.list[i].count;
							if (this.num == this.orderList.length) { //如果全部选中了
								this.flag = true;
							}
							// this.$emit("refresh", this.list);
						}
					}
				}
			},
			// 批量取餐
			qucans() {
				uni.showModal({
					title: '是否确认',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '请求中',
								mask: true
							})
							let data = {}
							data.order_id = this.orderIds
							this.$request('ApiConnect/takeAllOrder', data).then(res => {
								uni.hideLoading()
								if (res.status == 1) {
									this.getOrderlist()

								} else {
									// this.page --
									uni.$u.toast(res.msg);
								}
							}).catch(err => {

							})
						}
					}
				})
			}


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
			content: ''; 
			position: absolute; 
			left: 50%;
			bottom: 0;
			transform: translate(-50%, 0); 
			border: 6rpx solid transparent; //小三角的大小
			border-top-color: #fff; //小三角朝下

		}
	}

	// tab栏
	.order-box {
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

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


		.item-right {
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 24rpx;
			line-height: 24rpx;
			color: #2e2e2e;
			display: flex;
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
		display: flex;
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
			}
		}

		.list-mid {
			margin-top: 25rpx;

			.mid-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%
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
			// flex-direction: row-reverse;
			justify-content: space-between;
			align-items: center;

			.take_code {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 24rpx;
				line-height: 24rpx;
				text-align: left;
				color: #111;
			}

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
			}
		}


	}

	// 底部批量
	.bottom-box {
		width: 750rpx;
		height: 130rpx;
		background: #fff;
		border: 1px solid #ccc;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 30rpx;
		box-sizing: border-box;

		.right {
			align-items: center;

			.right-1 {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				color: #111;
			}
		}

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
			margin-left: 20rpx;
		}
	}

	// 横向滑动样式
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


	.weixuanzhong {
		width: 16rpx;
		height: 16rpx;
		// border-radius: 15rpx;
		border-radius: 50%;
		background: #fff;
		border: 1rpx solid #111;
	}
</style>

<style>
	page {
		background-color: #F6F6F6;
	}
</style>
