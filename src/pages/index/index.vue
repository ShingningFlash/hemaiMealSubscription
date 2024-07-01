<template>
	<view>
		<!-- 自定义导航栏 -->
		<view-tabbar :current="0"></view-tabbar>

		<!-- 状态栏占位 -->
		<view class="nav_bg" :style="{height:statusBarHeight+'px'}">
		</view>
		<!-- 自定义导航栏 -->
		<view class="nav_bg_g" :style="{height:titleBarHeight+'px'}">
			首页
		</view>
		<!-- 轮播图 -->
		<view class="swiper_box">
			<u-swiper :list="SwiperList" :indicator="true" keyName="ad_code" :autoplay="true"
				indicatorInactiveColor="#333333" indicatorActiveColor="#D73334" height="300rpx" @click="chose">
			</u-swiper>
		</view>
		<!-- 问候语及设置 -->
		<view class="meal_box">
			<view class="meal_box_top">
				<view class="box_left">
					<view class="text_1">{{time}}，{{nickname}}</view>
					<view class="text_2">欢迎使用和麦自助点餐小程序</view>
				</view>
				<view class="box_right" @click="navTo('./setting')">
					<image class="box_right_icon" src="/static/icon/set.png"></image>
					<view class="box_right_text">
						设置
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="meal_btn">

			<view class="btn_1" @click="jumppoint">
				<image class="img1" src="/static/icon/personal.png"></image>
				<view class="box_text">
					<view class="btn_text_top">个人用户点餐</view>
					<view class="btn_text_bottom">Individual user orders</view>
				</view>
			</view>
			<view class="btn_1" style="margin-top: 30rpx;" @click="jumpen">
				<image class="img2" src="/static/icon/enterprise.png"></image>
				<view class="box_text">
					<view class="btn_text_top">企业用户点餐</view>
					<view class="btn_text_bottom">Individual user orders</view>
				</view>
			</view>
		</view>

		<!-- tag -->
		<view class="tag_nav">
			<view class="tag_top">
				<image :src="list.list[1].thumb" class="img1"
					@click="navTo('./about/about?id='+list.list[1].article_id)"></image>
				<image :src="list.list[0].thumb" class="img1"
					@click="navTo('./about/about?id='+list.list[0].article_id)"></image>
			</view>
			<view class="tag_bottom">
				<image :src="list.list[2].thumb" class="img3"
					@click="navTo('./about/about?id='+list.list[2].article_id)"></image>
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
				statusBarHeight: 0, //状态栏高度
				titleBarHeight: 0, //导航栏高度
				SwiperList: [], //轮播图
				stock: 10,
				value: 0,
				list: [],
				nickname: '尊敬的用户',
				time: ''

			}
		},
		onShow() {

			var time = parseInt(new Date().getHours()); //返回小时数
			if (7 < time && time < 11) {
				this.time = '早上好'

			} else if (11 <= time && time < 17) {
				this.time = '中午好'
			} else {
				this.time = '晚上好'
			}

			this.getSwiper()
			this.getList()
			if (uni.getStorageSync('nickName')) {
				this.nickname = uni.getStorageSync('nickName')
			}

		},
		onHide() {
			clearTimeout(this.timer)
			this.timer = null
		},
		onLoad() {
			uni.hideTabBar({
				animation: false
			})
			// 获取状态栏高度
			const SystemInfo = wx.getSystemInfoSync();
			this.statusBarHeight = SystemInfo.statusBarHeight;

		},
		onReady() {
			// 获得导航栏高度
			this.titleBarHeight =
				(uni.getMenuButtonBoundingClientRect().top - this.statusBarHeight) * 2 +
				uni.getMenuButtonBoundingClientRect().height;
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		        console.log(res.target)
		    }
		    return {
		        title: '和麦餐饮', //分享的名称
		        path: '/pages/my/my',
		        mpId:'wx4999bd2c4cd5aec1' //此处配置微信小程序的AppId
		    }
		},
		methods: {
			chose(e) {
				console.log(e);

				let arr = []
				
				for (let i = 0; i < this.SwiperList.length; i++) {
					arr.push(this.SwiperList[i].ad_code)
				}
				uni.previewImage({
					urls: arr,
					current: e,
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						uni.showToast({
							title: '图片错误',
							icon: 'error'
						})
						console.log(err);
					}
				})


			},
			// 跳转自提点判断登录状态
			jumppoint() {
				if (!uni.getStorageSync('user_id')) {
					uni.showModal({
						title: '提示',
						content: `是否前往登录以畅享更多功能服务`,
						success: (res) => {
							if (res.confirm) {
								uni.switchTab({
									url: '../my/my'
								})
							}
						}
					})

					return false
				}
				uni.navigateTo({
					url: './point/point'
				})

			},

			// 跳转
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 获取轮播图
			getSwiper() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.pid = 1
				this.$request('/ApiConnect/getAdList', data).then(res => {
					uni.hideLoading()
					this.SwiperList = res.result
				}).catch(err => {})
			},

			// 获取文章列表
			getList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$request('/ApiConnect/getProtocolList').then(res => {
					uni.hideLoading()
					this.list = res.data
				}).catch(err => {})
			},
			// 企业点餐判断
			jumpen() {
				if (!uni.getStorageSync('user_id')) {
					uni.showModal({
						title: '提示',
						content: `是否前往登录以畅享更多功能服务`,
						success: (res) => {
							if (res.confirm) {
								uni.switchTab({
									url: '../my/my'
								})
							}
						}
					})

					return false
				}
				// 如果没有绑定企业 就前往绑定企业页面
				if (uni.getStorageSync('com_id') == 0) {
					uni.navigateTo({
						url: './BindingEnterprises'
					})
				} else {
					// 如果绑定了企业，就存储企业id
					uni.setStorageSync('address_id', uni.getStorageSync('address_id_id'))
					// 存储标记跳转，以便到点餐页面进行判断
					uni.setStorageSync('flag', 2)
					uni.switchTab({
						url: '../meal/meal'

					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	// 导航栏样式
	.nav_bg_g {
		display: flex;
		justify-content: center;
		align-items: center;

		.nav_bg_g_img {
			width: 232rpx;
			height: 56rpx;
		}
	}

	// 轮播图样式
	.swiper_box {
		width: 710rpx;
		margin: 0 auto;
		margin-top: 20rpx;
	}

	// 问候语及设置样式
	.meal_box {
		width: 690rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		padding: 0 10rpx;

		.meal_box_top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.box_left {
				.text_1 {
					font-family: "PingFang SC Bold";
					font-weight: bold;
					font-size: 35rpx;
					letter-spacing: 0.01rpx;

					color: #333;
				}

				.text_2 {
					font-family: "PingFang SC Medium";
					font-weight: 500;
					font-size: 24rpx;
					letter-spacing: 0.01rpx;
					color: #999;
				}
			}

			.box_right {
				text-align: center;

				.box_right_icon {
					width: 31.59rpx;
					height: 29.28rpx;
				}

				.box_right_text {
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 24rpx;
					text-align: left;
					color: #999;

				}
			}
		}

	}

	// 点餐按钮样式
	.meal_btn {
		width: 710rpx;
		margin: 0 auto;
		margin-top: 28rpx;

		.btn_1 {
			height: 100rpx;
			border-radius: 49rpx;
			background: #d73334;
			box-shadow: 0 6rpx 6rpx rgba(215, 51, 52, 0.32);
			display: flex;
			justify-content: center;
			align-items: center;

			.img1 {
				width: 36.92rpx;
				height: 38.80rpx;
			}

			.img2 {
				width: 38.28rpx;
				height: 36.97rpx;
			}

			.box_text {
				margin-left: 10rpx;
				text-align: center;
			}

			.btn_text_top {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 32rpx;
				letter-spacing: 0.01rpx;
				line-height: 24rpx;
				text-align: left;
				color: #fff;
				text-align: center;
				letter-spacing: 8rpx
			}

			.btn_text_bottom {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 19rpx;
				letter-spacing: 0.01rpx;
				line-height: 24rpx;
				text-align: left;
				color: #fff;
				text-align: center;
				margin-top: 8rpx;
			}
		}

	}


	// tag_nav
	.tag_nav {
		width: 700rpx;
		margin: 0 auto;
		margin-top: 60rpx;

		.tag_top {
			display: flex;
			justify-content: space-between;

			.img1 {
				width: 340rpx;
				height: 200rpx;
			}

			.img2 {}
		}

		.tag_bottom {
			width: 100%;
			height: 282rpx;
			margin-top: 20rpx;

			.img3 {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
