<template>

	<view style="box-sizing: border-box; ">
		<view-tabbar :current="2"></view-tabbar>
		<!-- 背景颜色 -->
		<view class="top_bg"></view>
		<!-- 购物车顶部 -->
		<view class="top-title">
			<view class="top-left">
				<view class="top-name">
					购物车
				</view>
				<view class="top-num">
					共{{sum}}件商品，赶紧进行报餐吧
				</view>
			</view>
			<!-- <view class="top-right" @click="tab">
				{{cha == true ?'取消':'管理'}}
			</view> -->
			<!-- <view class="top-right" @click="flag = !flag">
				{{flag ? '闭合全部':'展开全部'}}
			</view> -->
		</view>
		<!-- 购物车列表 -->
		<view class="" style="background-color: #fff;box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.12);height: 600rpx;margin-top: 30rpx;border-radius: 18rpx;" v-if="prolist == ''">
			<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png" >
			</u-empty>
		</view>
		<view class="" style="padding-bottom: 241rpx;">
			<view class="cart-list" v-for="(item,index) in prolist" :key="index">
				<view class="date">
					<view class="day">{{item.plan_date}}{{item.week_type_name}}</view>
					<view @tap="yichu(item.plan_date)">
						<u-icon name="close"></u-icon>
					</view>
				</view>

				<view  :class="flag ? 'max' : 'scroll'">
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
								<view class="add-box" v-if="item3.goods_num == 0" @tap="add">
									+
								</view>
								<view class="add-sub-box" v-else>
									<view class="add"
										@tap="addCart(item3.goods_id,-1,item3.goods_num,item.plan_date,item3.cat_id)">-
									</view>
									<view class="num">{{item3.goods_num}}</view>
									<view class="sub"
										@tap="addCart(item3.goods_id,1,item3.goods_num,item.plan_date,item3.cat_id)">+
									</view>
								</view>
							</view>
						</view>
						
					</view>
					
					
				</view>
				<view class=""  style="text-align: center;">
					{{flag ? '':'......'}}
				</view>
			</view>
		</view>




		<!-- 底部按钮 -->

		<view class="cart-btn">
			<view class="cart-btn-left">
				<view class="heji">
					合计 ：<text style="color: #d73334;">￥{{total_price}}</text>
				</view>
				<view class="all">
					{{cha == true? '全选':''}}
				</view>
				<view class="del">
					{{cha == true? '删除':''}}
				</view>
			</view>
			<view class="cart-btn-right">

				<view class="red-btn" @tap="cartorder">
					去结算
				</view>
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
		computed: {
			msg: {
				get: function() {
					this.sum = 0
					for (let i = 0; i < this.prolist.length; i++) {
						for (let j = 0; j < this.prolist[i].data.length; j++) {
							for (let x = 0; x < this.prolist[i].data[j].goods.length; x++) {
								this.sum += this.prolist[i].data[j].goods[x].goods_num
							}
							
						}
						
					}

				}
			}
		},
		data() {
			return {
				sum:0,
				num: 0,
				cha: false,
				prolist: [],
				total_num: 0, //购物车商品数量
				total_price: 0 ,//购物车价格
				flag:true
			}
		},

		onShow() {
			uni.hideTabBar({
				animation: false
			})
			if (!uni.getStorageSync('user_id')) {
				// this.getUnReadTransfer()
				uni.switchTab({
					url: '../my/my'
				})
			}
			this.getuserCart()
			
			
		},
		methods: {
			
			// 移除购物车
			yichu(date) {
				uni.showModal({
					title: '提示',
					content: "是否移除餐品？",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							let data = {}

							data.address_id = uni.getStorageSync('address_id')
							data.plan_date = date


							this.$request('ApiConnect/delCart', data).then(res => {
								uni.hideLoading()
								this.getuserCart()


							}).catch(err => {

							})
						}

					}
				})
			},
			// 添加购物车
			addCart(goods_id, index, num, date, cat_id) {

				if (num == 1 && index == -1) {

					uni.showModal({
						title: '提示',
						content: "是否移除餐品？",
						success: (res) => {
							if (res.confirm) {
								uni.showLoading({
									title: '加载中',
									mask: true
								})
								let data = {}

								data.address_id = uni.getStorageSync('address_id')
								data.plan_date = date
								data.goods_id = goods_id

								this.$request('ApiConnect/delCart', data).then(res => {
									uni.hideLoading()
									this.getuserCart()


								}).catch(err => {

								})
							}

						}
					})

				} else {
					console.log(cat_id);
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					let data = {}
					data.address_id = uni.getStorageSync('address_id')
					data.plan_date = date
					data.goods_id = goods_id
					data.goods_num = index
					data.cat_id = cat_id
					this.$request('ApiConnect/addCart', data).then(res => {
						uni.hideLoading()
						this.getuserCart()
						if (index != -1) {
							uni.$u.toast(res.msg);
						}

					}).catch(err => {

					})
				}



			},
			tab() {
				this.cha = !this.cha
			},

			// 获取购物车
			getuserCart() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.address_id = uni.getStorageSync('address_id')
				this.$request('ApiConnect/getUserCart', data).then(res => {
					uni.hideLoading()

					if (res.status == 1) {
						if (res.data.cart != '') {
							this.prolist = res.data.cart
							this.total_price = res.data.total_price
							this.total_num = res.data.total_num
							// this.test()
						} else {
							this.prolist = []
							this.total_price = 0
							this.total_num = 0
						}

					}
				}).catch(err => {

				})
			},
			// 结算
			cartorder() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.address_id = uni.getStorageSync('address_id')
				// data.plan_date = this.time
				this.$request('ApiConnect/createGoodsOrderAll', data).then(res => {
					console.log(res, "下单");
					if (res.status == 1) {
						if (res.data.is_junction == 0) {
							this.$request('ApiConnect/MiniPayOrder', {
								order_id: res.data.order_id
							}).then(res => {
								uni.hideLoading()
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
											title: '提示',
											content: '支付成功,是否前往订单列表自行筛选订单日期进行查看',
											success: (res) => {
												if (res.confirm) {
													uni.navigateTo({
														url: '../my/order/order?current=1'

													})
												} else {
													this.getuserCart()
												}
											}
										})
									},
									fail: (err) => {
										console.log(err, "支付失败");
										uni.$u.toast("支付失败");
										this.getuserCart()


									}
								})
							}).catch(err => {})
						} else {
							uni.showModal({
								title: '提示',
								content: '当前付款方式为月结,支付成功,是否前往订单列表自行筛选订单日期进行查看',
								success: (res) => {
									if (res.confirm) {
										uni.navigateTo({
											url: '../my/order/order?current=1'

										})
									} else {
										this.getuserCart()
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
			}
		}
	}
</script>
<style>
	page{
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	// 背景样式
	.top_bg {
		width: 750rpx;
		height: 752rpx;
		background: linear-gradient(180.00deg, #d73334 0%, #ffffff 100%);
		position: absolute;
		z-index: -1;
		top: 0;
	}

	// 、购物车顶部
	.top-title {
		display: flex;
		justify-content: space-between;
		margin-top: 170rpx;
		box-sizing: border-box;
		padding: 0 30rpx;
		align-items: flex-end;

		.top-left {
			.top-name {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 36rpx;
				line-height: 28.8rpx;
				color: #fff;

			}

			.top-num {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				line-height: 28.8rpx;
				color: #fff;
				margin-top: 10rpx;
			}
		}

		.top-right {
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 24rpx;
			line-height: 28.8rpx;
			color: #fff;
		}
	}

	.cart-list {

		width: 690rpx;
		// max-height: 460rpx;
		border-radius: 15rpx;
		background: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		box-sizing: border-box;
		padding: 30rpx;

		.scroll {
			overflow: hidden;
			height: 380rpx;
		}
		.max{
			height: auto;
			overflow: visible;
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



	// 底部按钮
	.cart-btn {
		width: 750rpx;
		height: 121rpx;
		box-sizing: border-box;
		background: #fff;
		box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.12);
		position: fixed;
		bottom: 135rpx;
		padding: 15rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.cart-btn-left {
			display: flex;
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 28rpx;
			line-height: 33.6rpx;
			color: #6a6a6a;

			.del {
				margin-left: 20rpx;
			}
		}

		.cart-btn-right {
			align-items: center;
			display: flex;

			.heji {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				line-height: 28.8rpx;
				color: #6A6A6A;
				margin-right: 30rpx;

				text {
					color: #d73334;
				}
			}

			.red-btn {
				width: 240rpx;
				height: 80rpx;
				background: #d73334;
				border-radius: 42rpx;
				text-align: center;
				line-height: 80rpx;
				color: #fff;
			}

		}
	}
</style>


