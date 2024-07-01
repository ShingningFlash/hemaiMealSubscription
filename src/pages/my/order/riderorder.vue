<template>
	<view>
		<view class="date">
			<view class="content" @tap="open">{{value1 | formatDeta}}
				<view class="xiabiao">
				</view>
			</view>
			<view class="content" @tap="open2">{{value}}
				<view class="xiabiao">
				</view>
			</view>
		</view>
		<!-- 日期选择 -->
		<u-datetime-picker :show="show" v-model="value1" mode="date" @cancel="close" :closeOnClickOverlay="closed"
			@confirm="confirm"></u-datetime-picker>


		<!-- 时间段选择 -->
		<u-picker :show="showtime" :columns="columns" keyName="name" @confirm="confirm2" @cancel="close" :closeOnClickOverlay="closed"></u-picker>
		
		<u-picker :show="showpoint" :columns="col" keyName="note" @confirm="confirm3" @cancel="close" :closeOnClickOverlay="closed"></u-picker>
		<!-- tab 栏 -->
		<view class="order-box">
			
			<view style="display: flex;align-items: center;margin-bottom:10rpx;" @click="showpoint = true">
				<text class="text_1" >{{point != '' ? point : '请选择自提点'	}}</text>
				<view class="xiabiaos">
			
				</view>
			</view>
			<view class="" style="color: #999;font-size: 20rpx;font-weight: 400;margin-bottom:10rpx;">
				联系人： {{lianxiren}}
			</view>
			
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
					<view class="top-right">{{item.order_status_name}}</view>
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
					<view class="take_code">
			
						<view>取餐码：{{item.take_code}}</view>
						<view style="margin-top: 10rpx;">配送点：{{item.addtess_name}}</view>
					</view>
					<view class="" style="display: flex;">
						<view class="red-btn" @click="call(item.mobile)" style="margin-right: 10rpx;">
							<image src="/static/icon/phone.png" style="width: 26rpx;height: 26rpx;margin-right: 10rpx;"
								mode="">
								联系
						</view>
						<view class="red-btn" @click="handleMapLocation(item.latitude,item.longitude,item.addtess_name)">
							<image src="/static/icon/nav2.png" style="width: 26rpx;height: 26rpx;margin-right: 10rpx;"
								mode=""></image>导航
						</view>
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
				showtime: false,
				showpoint:false,
				value1: Number(new Date()), //日期
				value: '全部', // 时间段
				closed: true,
				tablist: [{
					name: '待配送'
				}, {
					name: '已送达'
				},  ],
				current: 0, //当前选项
				list: [{
					thumb: "https://cdn.uviewui.com/uview/goods/1.jpg"
				}],	 
				columns: [
					
				],
				col:[],
				orderList: [], //订单数据
				today: '', //今天
				p: 1,
				cat_id:0  ,//分类id
				point:'',
				longitude:0,
				latitude:0,
				address_id:0,
				lianxiren:'未知'

			}
		},
		onReachBottom() {
			this.p++
			this.getOrderlist()
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

			this.getAddressList()
			
		},
		


		methods: {
			//获取自提点
			// 获取附近的自提点  
			getAddressList() {
				
				let data = {}
				
				this.col = []
				
				this.$request('/ApiConnect/getRiderAddressList', data).then(res => {
					uni.hideLoading()
					if(res.status == 1){
						var datas =[]
						datas = res.data
						this.col.push(datas)
						if(res.data != ''){
							this.point = res.data[0].note
							this.lianxiren = res.data[0].lastname
							this.address_id = res.data[0].id
							this.getOrderlist()
							this.getcate()
						}
						else{
							this.point = '暂无自提点'
						}
					}
					console.log(res);
				}).catch(err => {})
			},
			// 获取分类
			getcate() {
				this.columns = []
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.address_id = this.address_id
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
			open() {
				this.show = !this.show
			},
			open2() {
				this.showtime = !this.showtime
			},
			close() {
				this.show = false
				this.showtime = false
				this.showpoint = false
			},
			// 时间确定
			confirm(e) {
				this.orderList = []
				this.show = false
				var d = new Date(e.value);
				var month = this.$util.addZero(d.getMonth() + 1),
					day = this.$util.addZero(d.getDate());
				this.today = d.getFullYear() + '-' + month + '-' + day
				this.getOrderlist()


			},
			changeTab(e) {
				this.current = e
				this.orderList = []
				this.p = 1
				this.getOrderlist()
			},
			// 分类确定
			confirm2(e) {
				this.showtime = false
				this.value = e.value[0].name
				this.cat_id = e.value[0].id
				this.orderList = []
				this.getOrderlist()
			},
			// 定位确定  
			confirm3(e) {
				
				console.log(e);
				this.showpoint = false
				this.point = e.value[0].note
				this.address_id = e.value[0].id
				this.lianxiren = e.value[0].lastname
				this.value = '全部'
				this.cat_id = 0
				this.orderList = []
				
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.take_date = this.today
				if(this.cat_id != 0 ){
					data.cat_id = this.cat_id
				}
					
				
				if(this.current == 0){
					data.status = 2
				}
				else if(this.current == 1){
					data.status = 4
				}
				data.address_id = this.address_id
				console.log(data,"sss");
				data.page = this.p
				
				
				this.$request('ApiConnect/getRiderOrderList', data).then(res => {
					uni.hideLoading()
					if (res.status == 1) {
						this.orderList = this.orderList.concat(res.result)
						this.getcate()
					} else {     
						this.p = 1
						this.getcate()
						return uni.showToast({
							title: '暂无更多订单',
							icon: "none",
							duration: 2000
						});
					}
				}).catch(err => {
				
				})
			},

			// 获取订单列表
			getOrderlist() {

				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.take_date = this.today
				if(this.cat_id != 0){
					data.cat_id = this.cat_id
				}
				if(this.current == 0){
					data.status = 2
				}
				else if(this.current == 1){
					data.status = 4
				}
				data.address_id = this.address_id
				data.page = this.p
				

				this.$request('ApiConnect/getRiderOrderList', data).then(res => {
					uni.hideLoading()
					if (res.status == 1) {
						console.log(res);
						this.orderList = this.orderList.concat(res.result)
						this.getcate()
					} else {
						this.p = 1
						this.getcate()
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
			},
			// 点好
			call(val) {
				uni.makePhoneCall({
					// 手机号
					phoneNumber: val,
					// 成功回调
					success: (res) => {
					},
					// 失败回调
					fail: (res) => {
					}
				});
			},
			// 打开地图导航
			handleMapLocation(latitude,longitude,addtess_name) {
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				console.log('进入导航')
				//  经纬度暂时写死，后面介入数据
				
				
				// 获取定位信息
				uni.getLocation({
					type: 'wgs84', //返回可以用于uni.openLocation的经纬度
					// 用户允许获取定位
					success: function(res) {
						console.log(res, '经纬度===>')
						if (res.errMsg == "getLocation:ok") {
							console.log(latitude,"纬度")
							console.log(longitude ,"经度")
							uni.openLocation({
								// 传入你要去的纬度
								latitude: latitude*1,
								// 传入你要去的经度
								longitude: longitude*1,  
								// 传入你要去的地址信息 不填则为空
								address: addtess_name,
								// 缩放大小
								scale: 18,
								success: function() {
									console.log('成功的回调success');
								},
								fail: (err) => {
									console.log(err,"失败");
								},
								complete: () => {
									uni.hideLoading()
								}
							});
						}
					},
					// 用户拒绝获取定位后 再次点击触发
					fail: function(res) {
						console.log(res)
						if (res.errMsg == "getLocation:fail auth deny") {
							uni.showModal({
								content: '检测到您没打开获取信息功能权限，是否去设置打开？',
								confirmText: "确认",
								cancelText: '取消',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success: (res) => {
												console.log('确定');
											}
										})
									} else {
										console.log('取消');
										return false;
									}
								}
							})
						}
					},
					complete: () => {
						uni.hideLoading()
					}
				});
			},

		},
		onLoad(option) {
			// this.current = option.current
			var d = new Date();
			var month = this.$util.addZero(d.getMonth() + 1),
				day = this.$util.addZero(d.getDate());
			this.today = d.getFullYear() + '-' + month + '-' + day
			// this.getOrderlist()
			// this.getcate()
			
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
	.xiabiaos {
		width: 22rpx;
		height: 22rpx;
		// background: #fff;
		border-radius: 50%;
		border: 1rpx solid #111;
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
			border-top-color: #111; //小三角朝下
	
		}
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
			// flex-direction: row-reverse;
			justify-content: space-between;
			align-items: center;

			.take_code {
				font-family: "PingFang SC";
				font-weight: 400;
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
				display: flex;
				align-items: center;
				justify-content: center;
				// line-height: 60rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #fff;
				
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
