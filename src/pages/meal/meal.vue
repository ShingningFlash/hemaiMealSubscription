<template>
	<view>
		<view-tabbar :current="1"></view-tabbar>
		<!-- 状态栏占位 -->
		<view class="nav_bg" :style="{height:statusBarHeight+'px'}">
		</view>
		<!-- 自定义导航栏 -->
		<view class="nav_bg_g" :style="{height:titleBarHeight+'px'}">
			<view class="nav_input">
				<u--input style="width:100%;height: 63rpx;" shape="circle" border="none" placeholder="请输入餐品名称"
					prefixIcon="search" prefixIconStyle="font-size: 46rpx;color: #7E7E7E;">
				</u--input>
			</view>
		</view>
		<!-- 日历 -->
		<view class="date-choose shrink">
			<!-- <view class="data-month">{{ dateMonth }}</view> -->
			<swiper class="date-choose-swiper" :indicator-dots="false" :current="swiperCurrent"
				@change="dateSwiperChange($event)">
				<block v-for="(date,index) in dateList" :key="index">
					<swiper-item class="swiper-item">
						<view class="weekday">
							<block v-for="(weekday,ind) in dateListArray" :key="index">
								<text class="week">{{ weekday }}</text>
							</block>
						</view>
						<view class="dateday">
							<block v-for="day in date.days" :key="day.id">
								<text class="day" :id="day.id" @tap="chooseDate($event)"
									:style="{color: day.id < today ? '#ccc' :''}">
									<text :class="dateCurrentStr==day.id?'active':''">{{ day.day }}</text>
								</text>
							</block>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>


		<!-- 主题内容 -->
		<view class="meal-content" :style="{height:screenHeight- statusBarHeight- titleBarHeight- 150 +'px'}">
			<view class="left-box">
				<view class="item" v-for="(item,index) in mealList" :key="index"
					:class="currentTab == index? 'active' :''" @tap="changeMeal(index,item.id)">
					<image class="img" :src="item.image" mode=""></image>
					<view class="text">
						{{item.name}}
					</view>
				</view>

			</view>
			<view class="right-box">
				<view class="first">
					<view style="display: flex;align-items: center;">
						<text class="text_1" v-if="com==false"
							@click="navTo('../index/point/point')">{{point != '' ? point : '请选择自提点'}}</text>
						<text class="text_1" v-else>尊敬的企业用户</text>
						<view class="xiabiao">

						</view>
					</view>
					<view style="display: flex;text-align: right;" @tap="jumpmap">
						<text class="text_2" v-if="com==false">到店取餐 | 导航</text>
						<text class="text_2" v-else>{{address}}</text>
						<view class="navto">

						</view>
					</view>
				</view>
				<view class="sec">
					<image :src="mealList[current].mobile_image" mode=""></image>
				</view>
				<!-- 商品-->
				<view class="thr" v-for="(item,index) in goodslist" :key="index">
					<view class="category2">
						<view class="line"></view>
						<view class="category_name">{{item.name}}</view>
					</view>
					<view class="food-item" v-for="(items,indexs) in item.goods" :key="indexs">
						<view class="left-food">
							<image class="img" :src="items.original_img" mode=""></image>

							<view class="mid">
								<view class="title">{{items.goods_name}}</view>
								<view class="price">￥{{items.shop_price}}元</view>
							</view>
						</view>
						<view class="right-food">
							<view class="add-box" v-if="items.cart_num==0"
								@tap="addCart(items.goods_id,1,item.cart_num,items.cat_id)">
								+
							</view>
							<view class="add-sub-box" v-else>
								<view class="add" @tap="addCart(items.goods_id,-1,items.cart_num,items.cat_id)">-</view>
								<view class="num">{{items.cart_num}}</view>
								<view class="sub" @tap="addCart(items.goods_id,1,items.cart_num,items.cat_id)">+</view>
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>




		<!-- 底部总结栏 -->
		<view class="bottom-box">
			<view class="left-red" @tap="open">

				<view class="" style="position: relative;">
					<image class="img" src="/static/icon/cartdaizi.png" mode=""></image>
					<view class="bdg">
						{{total_num}}
					</view>
				</view>
				<view class="sum">

					总计 ￥<text>{{total_price}}</text>
				</view>
			</view>
			<view class="right-black" @click="jumpCreate">
				结算点餐
			</view>
		</view>

		<!-- 购物弹出层 -->
		<u-popup :show="show1" mode="bottom" @close="close" bgColor="#fff" round="20rpx">
			<view class="al-cart" v-if="cartlist != ''" v-for="(item,index) in cartlist" :key="index">
				<view class="cart-top">
					<view class="cart-top-left">
						{{item.plan_date}} {{item.week_type_name}}
					</view>
					<view class="cart-top-right" @click="clearCart">
						清除购物车
					</view>
				</view>
				<view class="food" v-for="(items,indexs) in item.data" :key="indexs">
					<view class="food-item" v-for="(itemss,indexss) in items.goods" :key="indexss">
						<view class="left-food">
							<image class="img" :src="itemss.original_img" mode=""></image>

							<view class="mid">
								<view class="title">{{itemss.goods_name}}</view>
								<view class="price">￥{{itemss.shop_price}}元</view>
							</view>
						</view>
						<view class="right-food">
							<view class="add-box" v-if="itemss.goods_num == 0" @tap="add">
								+
							</view>
							<view class="add-sub-box" v-else>
								<view class="add" @tap="addCart(itemss.goods_id,-1,itemss.goods_num,itemss.cat_id)">-
								</view>
								<view class="num">{{itemss.goods_num}}</view>
								<view class="sub" @tap="addCart(itemss.goods_id,1,itemss.goods_num,itemss.cat_id)">+
								</view>
							</view>
						</view>

					</view>


				</view>
			</view>
			<view class="" v-else>

			</view>
		</u-popup>





		<!-- 弹窗 -->
		<u-popup :show="show" mode="center" @close="close" bgColor="#fff" round="20rpx">
			<view class="al-content">
				<view class="al-text">
					请选择点餐方式
				</view>
				<view class="btn_1" style="margin-top: 50rpx;" @click="jump(1)">
					<image class="img1" src="/static/icon/personal.png"></image>
					<view class="box_text">
						<view class="btn_text_top">个人用户点餐</view>
						<view class="btn_text_bottom">Individual user orders</view>
					</view>
				</view>
				<view class="btn_1" style="margin-top: 30rpx;" @click="jump(2)">
					<image class="img2" src="/static/icon/enterprise.png"></image>
					<view class="box_text">
						<view class="btn_text_top">企业用户点餐</view>
						<view class="btn_text_bottom">Individual user orders</view>
					</view>
				</view>
			</view>
		</u-popup>


	</view>
</template>

<script>
	import {
		getWeekDate
	} from '../../js/date.js'
	import Tabbar from '@/components/tabbar.vue'
	export default {
		components: {
			'view-tabbar': Tabbar
		},
		data() {
			return {
				statusBarHeight: 0, //状态栏高度
				titleBarHeight: 0, //导航栏高度
				screenHeight: 0, //屏幕高度
				weekList: [], //日期
				current: 0, //当前下标【日历】
				show: false, // 弹出框
				today: '', //今日
				show1: false, //购物弹出层
				dateList: [], // 日历数据数组
				swiperCurrent: 0, // 日历轮播正处在哪个索引位置
				dateCurrent: new Date(), // 正选择的当前日期
				dateCurrentStr: '', // 正选择日期的 id
				dateMonth: '1月', // 正显示的月份
				dateListArray: ['日', '一', '二', '三', '四', '五', '六'],
				currentTab: 0, // 餐类下标
				mealList: [], //分类列表及图标
				num: 0,
				cat_id: 0, //分类id
				point: '', //自提点名称
				goodslist: [], //产品列表
				cartlist: [], //购物车列表
				total_num: 0, //购物车数量
				total_price: 0, //购物车总价格
				com: false,
				address: '',
				timer: null




			}
		},
		onLoad(option) {
			// 获取状态栏高度
			const SystemInfo = wx.getSystemInfoSync();
			this.screenHeight = SystemInfo.screenHeight
			this.statusBarHeight = SystemInfo.statusBarHeight;
			this.getcate()
			uni.hideTabBar({
				animation: false
			})

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
		onShow() {

			this.point = uni.getStorageSync('point')
			if (!uni.getStorageSync('user_id')) {
				// this.getUnReadTransfer()
				uni.switchTab({
					url: '../my/my'
				})
			}
			// 执行获取分类

			// this.show = true
			if (uni.getStorageSync('com_id') == 0) {
				this.com = false
				this.show = true

			}

			if (uni.getStorageSync('flag')) {
				if (uni.getStorageSync('flag') == 1) {
					this.com = false
					this.show = false
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					let data = {}
					data.address_id = uni.getStorageSync('address_id')
					this.$request('ApiConnect/getGoodsCate', data).then(res => {
						if (res.status == 1) {
							this.mealList = res.data
							this.getGoodsforId()
						} else {
							uni.$u.toast(res.msg);
						}
						uni.hideLoading()
					}).catch(err => {

					})
					console.log("走false");
				} else {
					this.com = true
					console.log("走这里true");
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					let data = {}
					data.address_id = uni.getStorageSync('address_id')
					this.$request('ApiConnect/getGoodsCate', data).then(res => {
						if (res.status == 1) {
							this.mealList = res.data
							this.getGoodsforId()
						} else {
							uni.$u.toast(res.msg);
						}
						uni.hideLoading()
					}).catch(err => {

					})
					this.address = uni.getStorageSync('address')
				}
			} else {

			}


			// 获取购物车信息
			// this.getuserCart()
			this.getTime()
			this.initDate()


			// this.getGoodsforId()
			// this.addCart()
		},
		onReady() {
			// 获得导航栏高度
			this.titleBarHeight =
				(uni.getMenuButtonBoundingClientRect().top - this.statusBarHeight) * 2 +
				uni.getMenuButtonBoundingClientRect().height;
		},
		methods: {
			jumpCreate() {
				if (this.cartlist.length > 0) {
					uni.navigateTo({
						url: './createOrder/createOrder?time=' + this.dateCurrentStr
					})
				} else {
					uni.showToast({
						title: '请先选择餐品',
						icon: 'none',
						duration: 2000
					})
				}

			},
			// 跳转地图
			jumpmap() {
				// 打开地图导航

				uni.showLoading({
					title: '加载中',
					mask: true
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

							uni.openLocation({
								// 传入你要去的纬度
								latitude: uni.getStorageSync('w') * 1,
								// 传入你要去的经度
								longitude: uni.getStorageSync('j') * 1,
								// 传入你要去的地址信息 不填则为空
								address: uni.getStorageSync('address'),
								// 缩放大小
								scale: 18,
								success: function() {
									console.log('成功的回调success');
								},
								fail: (err) => {
									console.log(err, "失败");
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
			// 清除购物车
			clearCart() {
				uni.showModal({
					title: '提示',
					content: "是否清空当前日期购物车？",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							let data = {}

							data.plan_date = this.dateCurrentStr
							this.$request('ApiConnect/delCart', data).then(res => {
								uni.hideLoading()
								this.getuserCart()
								this.show1 = false

							}).catch(err => {

							})
						}

					}
				})
			},
			jump(e) {
				// 个人点餐
				// this.show = false
				if (e == 1) {
					this.com = false
					uni.navigateTo({
						url: '../index/point/point'
					})
					// this.show = false
				}
				// 企业点餐
				else {

					this.address = uni.getStorageSync('address')
					uni.setStorageSync('flag', 2)
					if (uni.getStorageSync('com_id') == 0) {
						uni.navigateTo({
							url: '../index/BindingEnterprises'
						})

					} else {
						this.show = false

						this.com = true
						uni.setStorageSync('address_id', uni.getStorageSync('address_id_id'))
						this.getcate()
					}
				}
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
						this.mealList = res.data
						this.cat_id = res.data[0].id
						this.getGoodsforId()
					} else {
						uni.$u.toast(res.msg);
					}
					uni.hideLoading()
				}).catch(err => {

				})
			},

			// 根据id获取商品
			getGoodsforId() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				this.goodslist = []
				data.address_id = uni.getStorageSync('address_id')
				data.cat_id = this.cat_id
				data.plan_date = this.dateCurrentStr
				this.$request('ApiConnect/getCateGoods', data).then(res => {
					if (res.status == 1) {
						this.goodslist = res.data



					} else {
						uni.$u.toast(res.msg);
					}
					uni.hideLoading()
				}).catch(err => {

				})

			},
			// 添加购物车
			addCart(goods_id, index, num, cat_id) {
				// 如果是数量为1，传-1值得时候 移除商品
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

								data.plan_date = this.dateCurrentStr
								data.goods_id = goods_id

								this.$request('ApiConnect/delCart', data).then(res => {
									uni.hideLoading()

									this.getuserCart()
									this.getGoodsforId()
									this.show1 = false

								}).catch(err => {

								})
							}

						}
					})
				} else {
					// 添加购物车 或者数量+1
					let data = {}
					data.address_id = uni.getStorageSync('address_id')
					data.plan_date = this.dateCurrentStr
					data.goods_id = goods_id
					data.goods_num = index
					data.cat_id = cat_id
					this.$request('ApiConnect/addCart', data).then(res => {
						if (res.status == 1) {
							if (index != -1) {
								uni.$u.toast(res.msg);
								// this.timer = setTimeout(()=>{
								this.getuserCart()
								this.getGoodsforId()
								// },500)

							} else {
								uni.$u.toast(res.msg);
								// this.timer = setTimeout(()=>{
								this.getuserCart()
								this.getGoodsforId()
								// },500)
							}
						} else {
							uni.$u.toast(res.msg);

						}

					}).catch(err => {

					})
				}



			},
			// 获取购物车信息
			getuserCart() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				data.address_id = uni.getStorageSync('address_id')
				data.plan_date = this.dateCurrentStr
				this.$request('ApiConnect/getUserCart', data).then(res => {
					uni.hideLoading()
					if (res.status == 1) {
						if (res.data.cart != '') {
							this.cartlist = res.data.cart
							this.total_price = res.data.total_price
							this.total_num = res.data.total_num
						} else {
							this.cartlist = []
							this.total_price = 0
							this.total_num = 0
						}

					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					})
				})
			},


			// 跳转
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 增加
			add() {
				this.num += 1

			},
			// 减少
			sub() {
				if (this.num > 0) {
					this.num -= 1
				}
			},
			// 关闭弹出
			close() {
				this.show = false
				this.show1 = false
				// console.log('close');
			},

			// 日历部分
			// ----------------------------
			initDate() {
				// console.log(this.$util)
				var d = new Date();
				var month = this.$util.addZero(d.getMonth() + 1),
					day = this.$util.addZero(d.getDate());
				for (var i = 0; i <= 2; i++) {
					this.updateDate(this.$util.DateAddDay(d, i * 7)); //多少天之后的
				}
				this.swiperCurrent = 0;
				// if(this.weekList[5].today == true){
				// 	console.log("成立");
				// 	this.swiperCurrent = 0
				// }
				this.dateCurrent = d;
				this.dateCurrentStr = d.getFullYear() + '-' + month + '-' + day;
				this.today = d.getFullYear() + '-' + month + '-' + day
				// .getFullYear() + '-' + month + '-' + day
				this.dateMonth = month + '月'
				this.getuserCart()
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
						// .getFullYear() + '-' + month + '-' + day
					});
				}

				// console.log(d);
				return d;
			},
			// 更新日期数组数据
			updateDate(_date, atBefore) {
				var week = this.calculateDate(_date);
				if (atBefore) {
					this.dateList = [week].concat(this.dateList);
				} else {
					this.dateList = this.dateList.concat(week);
				}

			},
			// 日历组件轮播切换
			dateSwiperChange(e) {
				var index = e.detail.current;
				var d = this.dateList[index];
				this.swiperCurrent = index;
				this.dateMonth = this.$util.addZero(d.month) + '月';
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
				if (e.currentTarget.id < this.today) {} else {
					this.dateCurrentStr = str;
					this.getGoodsforId()
					this.getuserCart()
				}


			},
			// 改变餐类
			changeMeal(e, id) {
				this.currentTab = e
				this.cat_id = id
				this.getGoodsforId()
			},


			// 选中日期
			changeCurrent(index) {
				this.current = index

			},
			// 调用日期
			getTime() {
				this.weekList = getWeekDate({
					baselineDate: new Date()
				})
				console.log(this.weekList);

			},
			open() {
				if (this.cartlist != '') {
					this.show1 = !this.show1
				}

			}


		}
	}
</script>

<style scoped lang="scss">
	// 状态栏和自定义导航栏样式
	.nav_bg_g {
		display: flex;
		align-items: center;
		background-color: #F6F6F6;

		.nav_input {
			width: 462rpx;
			// height: 63rpx;
			border-radius: 31.5rpx;
			margin-left: 68rpx;
			background-color: #fff;
		}
	}

	// 横向日历样式
	.week-content {
		display: flex;
		width: 100%;
		background-color: #F6F6F6;
		justify-content: space-between;
		padding: 0 50rpx;
		align-items: center;

		.week-item {
			.week-item-week {
				text-align: center;
			}

			.week-item-day {
				text-align: center;
			}

			.active {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background: #d73334;
				line-height: 64rpx;
				color: #FFFFFF;

			}
		}
	}



	// 日期选中样式
	.date-choose {
		background: #F6F6F6;
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
		height: 130rpx;

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
		// flex-grow: 1;
		margin-top: 0rpx;

	}

	.dateday {
		margin-top: 30rpx;
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
		// color: #009bff;
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
		background: #d73334;
		z-index: -1;
	}

	.active {
		color: #fff;
	}



	// 底部总结
	.bottom-box {
		width: 680rpx;
		height: 100rpx;
		border-radius: 50rpx;
		background: #d73334;
		box-shadow: 0 6rpx 6rpx rgba(215, 51, 52, 0.32);
		position: fixed;
		bottom: 115rpx;
		left: 50%;
		display: flex;
		box-sizing: border-box;
		transform: translate(-50%, -50%);
		z-index: 10076;

		.left-red {
			width: 439rpx;
			height: 100rpx;
			border-radius: 50rpx 0 0 50rpx;
			background: #D73334;
			display: flex;
			align-items: center;
			padding-left: 30rpx;
			box-sizing: border-box;

			.img {
				width: 62rpx;
				height: 70rpx;
				margin-right: 30rpx;
			}

			.bdg {
				right: 30rpx;
				top: 0;
				position: absolute;
				width: 28rpx;
				height: 28rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 28rpx;
				background-color: #333;
				font-size: 20rpx;
				color: #fff;
			}

			.sum {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 24rpx;
				line-height: 28.8rpx;
				color: #fff;

				text {
					font-family: "DIN";
					font-weight: 400;
					font-size: 42rpx;
					letter-spacing: -0.05rpx;
					line-height: 37rpx;
					color: #fff;
				}
			}
		}

		.right-black {
			width: 241rpx;
			height: 100rpx;
			border-radius: 0 50rpx 50rpx 0;
			background: #333;
			text-align: center;
			line-height: 100rpx;
			font-family: "PingFang SC Bold";
			font-weight: bold;
			font-size: 32rpx;
			color: #fff;

		}
	}

	// 点餐主体
	.meal-content {
		display: flex;

		.left-box {
			width: 160rpx;
			// height: 1176px;
			border-radius: 0 20rpx 0 0;
			background: #F6F6F6;

			.item {
				box-sizing: border-box;
				text-align: center;
				padding: 30rpx 55rpx;

				.img {
					width: 61rpx;
					height: 43rpx;
					margin: 0 auto;
				}

				.text {
					font-family: "PingFang SC Bold";
					font-weight: bold;
					font-size: 24rpx;
					line-height: 28.8rpx;
					text-align: center;
					color: #111;
				}
			}

			.active {
				background-color: #fff;
			}


		}

		.right-box {
			width: 100%;
			padding-right: 30rpx;
			box-sizing: border-box;
			padding-left: 30rpx;
			padding-top: 20rpx;

			.first {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.xiabiao {
					width: 22rpx;
					height: 22rpx;
					background: #fff;
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
						border-top-color: #000; //小三角朝下

					}
				}

				.text_1 {
					font-family: "PingFang SC Bold";
					font-weight: bold;
					font-size: 32rpx;
					line-height: 28.8rpx;
					color: #111;
				}

				.text_2 {
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 20rpx;
					line-height: 28.8rpx;
					color: #999;
					width: 200rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}

				.navto {
					width: 26rpx;
					height: 26rpx;
					background: url('/static/icon/navto.png') no-repeat center/cover;
					margin-left: 10rpx;
				}
			}


			.sec {
				width: 100%;
				height: 240rpx;
				border-radius: 15rpx;
				margin-top: 20rpx;

				image {
					width: 100%;
					height: 100%;
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

	// 弹出层
	.al-content {
		width: 690rpx;
		height: 430rpx;
		border-radius: 20rpx;

		text-align: center;
		padding-top: 30rpx;
		box-sizing: border-box;

		.btn_1 {
			width: 620rpx;
			height: 100rpx;

			border-radius: 49rpx;
			background: #d73334;
			box-shadow: 0 6rpx 6rpx rgba(215, 51, 52, 0.32);
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 auto;

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
				line-height: 30rpx;
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
				line-height: 30rpx;
				text-align: left;
				color: #fff;
				text-align: center;
				margin-top: 8rpx;
			}
		}
	}

	// 购物弹出层
	.al-cart {
		box-sizing: border-box;
		padding: 30rpx 30rpx;
		padding-bottom: 140rpx;
		margin-bottom: 130rpx;

		.food {
			max-height: 550rpx;
			overflow-y: scroll;
			margin-top: 20rpx;
		}

		.cart-top {
			display: flex;
			justify-content: space-between;

			.cart-top-left {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 28rpx;
				line-height: 28.8rpx;
				color: #111;
			}

			.cart-top-right {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				line-height: 28.8rpx;
				color: #999;
			}
		}
	}
</style>
