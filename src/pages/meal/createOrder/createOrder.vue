<template>
	<view>
		<view-tabbar :current="6"></view-tabbar>
		<!-- 背景颜色 -->
		<view class="top_bg">
		</view>
		<!-- 状态栏占位 -->
		<view class="nav_bg" :style="{height:statusBarHeight+'px'}">
		</view>
		<!-- 导航栏 -->
		<view class="nav_bg_g" :style="{height:titleBarHeight+'px'}"
			style="background: transparent;text-align: center;display: flex;align-items: center;">
			<u-icon name="arrow-left" color="#ffffff" size="25" @click="back">

			</u-icon>
			<view class="" style="color: #fff;text-align: center;margin-left: 10rpx;">
				创建订单
			</view>
		</view>



		<!-- 自提点地址 -->
		<view class="pointAddress">
			<view class="one">
				<view class="one-left">自提点</view>
				<view class="one-right">{{addresslist.name}}</view>
			</view>
			<view class="two">
				{{addresslist.address}}
			</view>
			<view class="thr">

				团长：{{addresslist.userLastname}} | 联系电话：{{addresslist.userMobile}}
			</view>
		</view>
		<!-- 点餐列表 -->

		<view class="cart-list" v-for="(item,index) in prolist" :key="index">
			<view class="date">
				<view class="day">{{item.plan_date}}{{item.week_type_name}}</view>
			</view>

			<view class="scroll">
				<view class="" v-for="(item2,index2) in item.data" :key="index2">
					<text style="font-size: 28rpx;">{{item2.name}}</text>
					<view class="food-item" v-for="(item3,index3) in item2.goods" :key="index3">
						<view class="left-food">
							<image class="img" :src="item3.original_img" mode=""></image>

							<view class="mid">
								<view class="title">{{item3.goods_name}}</view>
								<view class="price">￥{{item3.shop_price}}元</view>
							</view>
						</view>
						<view class="right-food">
							<view class="add-sub-box">
								<view class="num">X{{item3.goods_num}}</view>
							</view>
						</view>
					</view>
				</view>


			</view>
		</view>

		<!-- 结款 -->
		<view class="settle-accounts">
			<view class="sum">
				<view>商品总额</view>
				<view>￥{{total_price}}</view>
			</view>
			<view class="way">
				<view>结算方式</view>
				<view>{{is_junction ==0 ? '微信支付': '月结'}}</view>
			</view>
			<view class="line">

			</view>
			<view class="zong">
				总计：<text style="color: #ff2d2d;">￥{{total_price}}</text>
			</view>
		</view>

		<!-- 底部支付 -->
		<view class="pay-btn">
			<view class="left">
				<view class="shiji">
					实际支付：
				</view>
				<view class="money">
					￥{{total_price}}
				</view>
			</view>
			<view class="red-btn" @click="payment">
				立即支付
			</view>
		</view>

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
				statusBarHeight: "",
				titleBarHeight: '',
				scrollSize: 0,
				bgColor: 'transparent',
				open: 'false',
				prolist: [

				],
				time: '',
				addresslist: {},
				is_junction: 0 ,//0 现结，1月结
				total_price:0 ,//总价格
				total_num:0,//总数量
			}
		},

		onReady() {
			// 获得导航栏高度
			this.titleBarHeight =
				(uni.getMenuButtonBoundingClientRect().top - this.statusBarHeight) * 2 +
				uni.getMenuButtonBoundingClientRect().height;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			opens() {
				this.open = !this.open
			},
			// 下单
			payment() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.address_id = uni.getStorageSync('address_id')
				data.plan_date = this.time
				this.$request('ApiConnect/createManyGoodsOrder', data).then(res => {
					uni.hideLoading()
					console.log(res, "下单");
					if (res.status == 1) {
							// is_junction 为是否月结 1为月结 0为现付
						if (res.data.is_junction == 0) {
							this.$request('ApiConnect/MiniPayOrder', {
								order_id: res.data.order_id
							}).then(res => {
								console.log(res);
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.payinfo.timeStamp,
									nonceStr: res.payinfo.nonceStr,
									package: res.payinfo.package,
									signType: res.payinfo.signType,
									paySign: res.payinfo.paySign,
									success: (res) => {
										uni.showModal({
											title:'提示',
											content:'支付成功,是否前往订单列表自行筛选订单日期进行查看',
											success: (res) => {
												if(res.confirm){
													uni.navigateTo({
														url:'../../my/order/order?current=1'
														
													})
												}
												else{
													uni.switchTab({
														url: '../../index/index',
														success: (res) => {
															uni.$u.toast("支付成功");
														}
													})
												}
											}
										})
										
									},
									fail: (err) => {
										console.log(err, "支付失败");
										uni.$u.toast("支付失败");
										uni.switchTab({
											url: '../../index/index',
											success: (res) => {
												uni.$u.toast("支付失败");
											}
										})


									}
								})
							}).catch(err => {})
						} else {
							console.log("走到这");
							uni.showModal({
								title:'提示',
								content:'当前付款方式为月结,支付成功,是否前往订单列表自行筛选订单日期进行查看',
								success: (res) => {
									if(res.confirm){
										uni.navigateTo({
											url:'../../my/order/order?current=1'
											
										})
									}
									else{
										uni.switchTab({
											url: '../../index/index',
											success: (res) => {
												uni.$u.toast("支付成功");
											}
										})
									}
								}
							})
							uni.$u.toast(res.msg);
							

						}
					} else {
						uni.$u.toast(res.msg);
					}
				}).catch(err => {

				})
			},
			// 获取购物车数据
			getuserCart() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.address_id = uni.getStorageSync('address_id')
				data.plan_date = this.time
				this.$request('ApiConnect/getUserCart', data).then(res => {
					uni.hideLoading()

					if (res.status == 1) {
						if (res.data.cart != '') {
							this.prolist = res.data.cart
							this.addresslist = res.data.address_data
							this.is_junction = res.data.is_junction
							this.total_price = res.data.total_price
							this.total_num = res.data.total_num
							console.log(this.prolist, "数据");
						} else {
							this.prolist = []
							this.total_price = 0
							this.total_num = 0
						}

					}
				}).catch(err => {

				})
			},



		},
		onLoad(option) {
			this.time = option.time
			this.getuserCart()

			// 获取状态栏高度
			const SystemInfo = wx.getSystemInfoSync();
			this.statusBarHeight = SystemInfo.statusBarHeight;
		},
		// onPageScroll(e) {
		// 	this.scrollSize = e.scrollTop
		// 	console.log(e);
		// 	if (e.scrollTop > 15) {
		// 		this.bgColor = '#000'
		// 	} else {
		// 		this.bgColor = 'transparent'
		// 	}
		// }
	}
</script>

<style scoped lang="scss">
	// 背景样式
	.top_bg {
		width: 750rpx;
		height: 752rpx;
		background: linear-gradient(180.00deg, #d73334 0%, #f3f3f3 100%);
		position: absolute;
		z-index: -1;
	}

	.nav_bg_g {
		display: flex;
	}

	// page{
	// 	background: linear-gradient(180.00deg, #d73334 0%, #f3f3f3 100%);
	// }



	.cart-list {

		width: 690rpx;
		max-height: 460rpx;
		border-radius: 15rpx;
		background: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		box-sizing: border-box;
		padding: 30rpx;

		.scroll {
			overflow: scroll;
			max-height: 380rpx;
		}

		.date {
			display: flex;
			justify-content: space-between;

			.day {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 28rpx;
				line-height: 28.8rpx;
				text-align: left;
				color: #111;
			}
		}

		.thr {
			margin-top: 30rpx;

			.category2 {
				display: flex;
				align-items: center;

				.line {
					width: 8rpx;
					height: 33rpx;
					border-radius: 4rpx;
					background: #d73334;
					margin-right: 10rpx;
				}

				.category_name {
					font-family: "PingFang SC Bold";
					font-weight: bold;
					font-size: 24rpx;
					line-height: 28.8rpx;
					text-align: center;
					color: #111;
				}
			}


		}

		.food-item {
			justify-content: space-between;
			align-items: center;
			display: flex;
			margin-top: 20rpx;

			.left-food {
				display: flex;

				.img {
					width: 150rpx;
					height: 120rpx;
				}

				.mid {
					display: flex;
					flex-wrap: wrap;
					align-content: space-between;
					flex-direction: column;
					margin-left: 10rpx;

					.title {
						font-family: "PingFang SC Bold";
						font-weight: bold;
						font-size: 26rpx;
						line-height: 28.8rpx;
						color: #111;
						flex-grow: 1;
					}

					.price {
						font-family: "DIN";
						font-weight: 400;
						font-size: 20rpx;
						line-height: 28.8rpx;
						text-align: left;
						color: #ff8b0b;

					}
				}
			}

			.right-food {
				margin-top: 50rpx;

				.add-box {
					width: 41rpx;
					height: 41rpx;
					background: #393939;
					text-align: center;
					line-height: 35rpx;
					font-size: 48rpx;
					border-radius: 50%;
					color: #fff;
				}

				.add-sub-box {
					display: flex;
					align-items: center;

					.add {
						width: 41rpx;
						height: 41rpx;
						background: #f5f5f5;
						text-align: center;
						line-height: 35rpx;
						font-size: 48rpx;
						border-radius: 50%;
						color: #393939;

					}

					.sub {
						width: 41rpx;
						height: 41rpx;
						background: #D73334;
						text-align: center;
						line-height: 35rpx;
						font-size: 48rpx;
						border-radius: 50%;
						color: #fff;


					}

					.num {
						font-family: "DIN";
						font-weight: 400;
						font-size: 28rpx;
						line-height: 28.8rpx;
						color: #272c2f;
						margin-right: 10rpx;
						margin-left: 10rpx;
					}
				}
			}

		}
	}

	// 自提点地址样式
	.pointAddress {
		width: 690rpx;
		height: 192rpx;
		border-radius: 10rpx;
		background: #fff;
		border: 1rpx solid #707070;
		margin: 0 auto;
		// margin-top: 175rpx;
		box-sizing: border-box;
		padding: 30rpx;

		.one {
			display: flex;
			align-items: center;

			.one-left {
				width: 69.04rpx;
				height: 28rpx;
				background: #d73334;
				text-align: center;
				line-height: 28rpx;
				font-family: "PingFang-SC-Medium ";
				font-weight: 400;
				font-size: 17.99rpx;
				line-height: 21.59rpx;
				color: #fff;
				margin-right: 15rpx;
			}

			.one-right {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 23.99rpx;
				line-height: 28.79rpx;
				color: #1e1e1e;
			}
		}

		.two {
			font-family: "PingFang SC Bold";
			font-weight: bold;
			font-size: 35.98rpx;
			line-height: 43.18rpx;
			color: #1e1e1e;
			margin-top: 20rpx;
			overflow: hidden;
			/* 超出一行文字自动隐藏 */
			text-overflow: ellipsis;
			/*文字隐藏后添加省略号*/
			white-space: nowrap;
			/*强制不换行*/
		}

		.thr {
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 23.99rpx;
			line-height: 28.79rpx;
			color: #6e6e6e;
			margin-top: 20rpx;
		}

	}

	// 点餐列表
	.meal-box {
		width: 690rpx;
		// height: 372rpx;

		// overflow-y: scroll;
		background: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		border-radius: 12rpx;

		.meal-content {
			// width: 100%;
			max-height: 350rpx;

			background: #fff;
			margin: 0 auto;
			box-sizing: border-box;
			padding: 20rpx 30rpx;


			.title {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 26rpx;
				line-height: 28.8rpx;
				color: #111;
				border-bottom: 1rpx solid #CCCCCC;
				padding-bottom: 20rpx;
			}

			.scoll {
				max-height: 280rpx;
				overflow: scroll;

			}

			.tap {
				overflow: visible;
			}

			.food-item {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
				position: relative;

				.item-left {
					display: flex;

					.img {
						width: 150rpx;
						height: 120rpx;
					}

					.name {
						margin-left: 15rpx;
						font-family: "PingFang SC Bold";
						font-weight: bold;
						font-size: 26rpx;
						line-height: 28.8rpx;
						color: #111;
					}
				}

				.item-right {
					display: flex;
					flex-wrap: wrap;
					align-content: space-between;
					flex-direction: column;



				}

				.num {
					flex-grow: 1;
					text-align: right;
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 26rpx;
					line-height: 28.8rpx;
					color: #111;
				}

				.price {
					text-align: right;
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 20rpx;
					line-height: 28.8rpx;
					color: #111;
				}
			}

			.tapupfold {
				background-color: #fff;
				text-align: center;
				margin-top: 10rpx;
				border-top: 1rpx solid #ddd;
				position: absolute;
				bottom: 0;
				left: 2;
			}
		}
	}

	// 结款
	.settle-accounts {
		width: 690rpx;
		height: 251rpx;
		border-radius: 15rpx;
		background: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		box-sizing: border-box;
		padding: 30rpx;

		.sum {
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 28rpx;
			line-height: 74rpx;
			color: #111;
			display: flex;
			justify-content: space-between;
		}

		.way {
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 28rpx;
			line-height: 74rpx;
			color: #111;
			display: flex;
			justify-content: space-between;
		}

		.line {
			width: 630rpx;
			height: 1rpx;
			border-radius: 0.5rpx;
			background: #ddd;
			margin: 0 auto;
		}

		.zong {
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 24rpx;
			line-height: 74rpx;
			text-align: right;
			color: #1e1e1e;
		}
	}

	// 支付
	.pay-btn {
		width: 690rpx;
		height: 80rpx;
		padding: 30rpx 30rpx;
		// padding-top: 30rpx;
		background: #fff;
		position: fixed;
		bottom: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			display: flex;
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 32rpx;
			line-height: 38.4rpx;

			.shiji {
				color: #1E1E1E;
			}

			.money {
				color: #ff2d2d;
			}
		}

		.red-btn {
			width: 240rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			background: #d73334;
			border-radius: 40rpx;
			color: #fff;
		}
	}
</style>
<style>
	page {
		background-color: #F3F3F3;
	}
</style>
