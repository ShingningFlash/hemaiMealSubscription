<template>
	<view>
		<!-- 顶部背景颜色和用户头像信息 -->
		<view class="top_bg">
			<view class="av_id" :style="{paddingTop:statusBarHeight+titleBarHeight+10+'px'}" v-if="isstatus == 1" @tap="navTo('../index/setting')">
				<image class="av_img" :src="head_pic" mode=""></image>
				<view class="id_box">
					<view class="id">{{nickname}}</view>
					<view class="lv">普通用户</view>
				</view>
			</view>
			<view class="av_id" :style="{paddingTop:statusBarHeight+titleBarHeight+10+'px'}" v-if="isstatus == 0">
				<button type="default" plain="true" @click="getUser" v-if="islogin == 0">去登录</button>
				<button type="default" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="islogin == 1">获取手机号码</button>
			</view>
			
		</view>
		
		<!-- 我的订单 -->
		<view class="order_box">
			<view class="order_box_header">
				<view class="title">我的订单</view>
				<view class="link">查看全部订单</view>
			</view>
			<u-grid :border="false"  :col="4">
				<u-grid-item @click="jumpOrder(0)">
					<image class="grid_img1" src="/static/icon/payment.png"></image>
					<text class="grid-text">待付款</text>
				</u-grid-item>
				<u-grid-item @click="jumpOrder(1)">
					<image class="grid_img1" src="/static/icon/takefood.png"></image>
					<text class="grid-text">待取餐</text>
				</u-grid-item>
				<u-grid-item @click="jumpOrder(2)">
					<image class="grid_img1" src="/static/icon/completed.png"></image>
					<text class="grid-text">已完成</text>
				</u-grid-item>
				<u-grid-item @click="jumpOrder(3)">
					<image class="grid_img1" src="/static/icon/cancel.png"></image>
					<text class="grid-text">已取消</text>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 我的服务 -->
		<view class="order_box" style="margin-top: 20rpx;">
			<view class="order_box_header">
				<view class="title">我的服务</view>
			</view>
			<u-grid :border="false"  :col="4">
				<u-grid-item v-if="is_rider == 1" @click="jumpohter(0)">
					<image  class="grid_img1" src="/static/icon/carorder.png"></image>
					<text class="grid-text">配送订单</text>
				</u-grid-item>
				<u-grid-item v-if="is_conscientious == 1" @click="jumpohter(1)">
					<image  class="grid_img1" src="/static/icon/enorder.png"></image>
					<text class="grid-text">团长订单</text>
				</u-grid-item>
				<u-grid-item v-if="is_conscientious == 2" @click="jumpohter(1)">
					<image  class="grid_img1" src="/static/icon/enorder.png"></image>
					<text class="grid-text">企业订单</text>
				</u-grid-item>
				<u-grid-item style="position: relative;">
					<view class="" style="position: absolute;height: 100rpx;opacity: 0;" >
						<button style="height: 100%;" class="" type='default' open-type='contact'>联系客服</button>
					</view>
					<image class="grid_img1" src="/static/icon/customer.png"></image>
					
					<text class="grid-text">联系客服</text>
				</u-grid-item>
				<u-grid-item @click="jumpohter(2)">
					<image class="grid_img1" src="/static/icon/feedback.png"></image>
					<text class="grid-text">意见反馈</text>
				</u-grid-item>
				<u-grid-item @click="logout" v-if="isstatus != 0">
					<image class="grid_img1" src="/static/icon/feedback.png"></image>
					<text class="grid-text">退出登录</text>
				</u-grid-item>
			</u-grid>
		</view>
		<u-toast ref="uToast" />
		<view-tabbar :current="3"></view-tabbar>
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
				isstatus:0,//登录状态
				islogin:0,
				head_pic:'',//用户头像
				nickname:'',//用户昵称
				is_rider:'' ,// 是否为骑手
				is_conscientious:'' //0否、1团长、2企业
			}
		},
		
		onLoad() {
			uni.hideTabBar({
				animation: false
			})
			// 获取状态栏高度
			const SystemInfo = wx.getSystemInfoSync();
			this.statusBarHeight = SystemInfo.statusBarHeight;
		},
		
		onShow(){
			// 判断登录状态获取最新用户信息或者提示
			if(uni.getStorageSync('user_id')){
				// this.getUnReadTransfer()
				this.getuserinfo()
			}
			else{
				this.isstatus = 0
				this.islogin = 0
				uni.showToast({
					title: '请重新登录',
					icon:"none",
					duration: 2000
				});
			}
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
		onReady() {

			// 获得导航栏高度
			this.titleBarHeight =
				(uni.getMenuButtonBoundingClientRect().top - this.statusBarHeight) * 2 +
				uni.getMenuButtonBoundingClientRect().height;
		},
		
		methods: {
			// 订单
			jumpOrder(i){
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
					url:'./order/order?current='+i
				})
				
			},
			// 跳转其他的时候判断登录状态
			jumpohter(i){
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
				
				if(i == 0){
					uni.navigateTo({
						url:'./order/riderorder'
					})
					
				}
				if(i == 1){
					uni.navigateTo({
						url:'./order/enterprise'
					})
				}
				if(i == 2){
					uni.navigateTo({
						url:'../index/ComplaintsSuggestions?type=0'
					})
				}
				
				
			},
			
			// 跳转
			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			// 退出登录	清楚本地缓存再获取openid
			logout(){
				uni.clearStorage()
				this.isstatus = 0
				this.islogin = 0
				this.usertype = 1
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				uni.login({
				  provider: 'weixin',
				  success: function (res) {
					let code  = res.code
					uni.request({
					  	url: 'https://hemai.ydlweb.com/Mini/ApiConnect/getOpenid',
						data: {
							code
						},
						method:'POST',
						success: (res) => {
							uni.hideLoading()
							uni.setStorageSync('openid',res.data.result)
							uni.setStorageSync('token',res.data.token)
						}
					})
				  }
				});
				uni.showToast({
					title: '退出成功',
					icon:"none",
					duration: 2000
				});
			},
			// 获取用户头像
			getUser(){
				uni.getUserProfile({
				    desc:'Wexin', // 这个参数是必须的
				    success:(res)=>{
						if(res.errMsg =="getUserProfile:ok"){
							console.log(res);
							this.head_pic = res.userInfo.avatarUrl
							this.nickname = res.userInfo.nickName
							this.islogin = 1
							uni.showToast({
							    title: '请点击获取手机号码以完成注册',
								icon:"none",
							    duration: 2000
							});
						}
				    }
				})
			},
			// 获取用户信息
			getuserinfo(){
				this.isstatus = 1
				this.$request('ApiConnect/userInfo').then(item => {
					if(item.status == 1){
						if(item.data.mobile != uni.getStorageSync('mobile') || item.data.openid != uni.getStorageSync('openid')){
						
							this.isstatus = 0
							uni.clearStorage();
							uni.showToast({
								title: '请重新登录',
								icon:"none",
								duration: 2000
							});
						}else{
							uni.setStorageSync('com_id',item.data.com_id)
							if(item.data.address_id){
								uni.setStorageSync('address_id_id',item.data.address_id)
							}
							if(item.data.address){
								uni.setStorageSync('address',item.data.address)
							}
							uni.setStorageSync('is_rider',item.data.is_rider)
							uni.setStorageSync('is_conscientious',item.data.is_conscientious)
							uni.setStorageSync('user_money',item.data.user_money)
							this.head_pic = uni.getStorageSync('avatarUrl')
							this.nickname = uni.getStorageSync('nickName')
							this.mobile = uni.getStorageSync('mobile')
							this.usertype = uni.getStorageSync('user_type')
							this.user_money = uni.getStorageSync('user_money')
							this.is_rider =uni.getStorageSync('is_rider') 
							this.is_conscientious = uni.getStorageSync('is_conscientious')
							
						}
					}
					else{
						this.isstatus = 0
						uni.clearStorage();
						uni.showToast({
							title: '请重新登录',
							icon:"none",
							duration: 2000
						});
					}
				})
			},
			
			
			// 获取用户手机
			getPhoneNumber(e){
				var that = this
				uni.login({
				  provider: 'weixin',
				  success: function (res) {
					let code  = res.code
					uni.request({
					  	url: 'https://hmdemo.ydlweb.com/Mini/ApiConnect/getOpenid',
						data: {
							code
						},
						method:'POST',
						success: (res) => {
							uni.hideLoading()
							uni.setStorageSync('token',res.data.token)
							uni.setStorageSync('openid',res.data.result)
							if(e.detail.errMsg == "getPhoneNumber:ok"){
								uni.hideLoading()
								let data = {
									openid:uni.getStorageSync('openid'),
									iv:e.detail.iv,
									encryptedData:e.detail.encryptedData
								}
								that.$request('ApiConnect/getUserMobile',data).then(item => {
									
									if(item.status == 1){
										let data = JSON.parse(item.data)
										that.mobile = data.phoneNumber
										that.login()
									}else{
										uni.showToast({
										    title:item.msg,
											icon:"none",
										    duration: 2000
										});
									}
								})
							}
							else{
								uni.hideLoading()
							}
						}
					})
				  }
				});
				
				
			},
			// 登录
			login(){
				let data={
					openid:uni.getStorageSync('openid'),
					head_pic:this.head_pic,
					nickname:this.nickname,
					mobile:this.mobile
				}
				this.$request('ApiConnect/login',data).then(item => {
					if(item.status == 1){
						// if(item.data.user_type == 2){
						// 	return false
						// }
						uni.setStorageSync('avatarUrl',item.data.head_pic)
						uni.setStorageSync('nickName',item.data.nickname)
						uni.setStorageSync('mobile',item.data.mobile)
						uni.setStorageSync('user_id',item.data.user_id)
						uni.setStorageSync('user_type',item.data.user_type)
						uni.setStorageSync('user_money',item.data.user_money)
						
						this.head_pic = item.data.head_pic
						this.nickname = item.data.nickname
						this.mobile = item.data.mobile
						this.usertype = item.data.user_type
						this.user_money = item.data.user_money
						this.getuserinfo()
						console.log("走到这");
					}else{
						uni.showToast({
						    title:item.msg,
							icon:"none",
						    duration: 2000
						});
					}
				}).catch(err=>{
					uni.showToast({
					    title:'请求出错',
						icon:"none",
					    duration: 2000
					});
				})
			},
			
		}
	}
</script>

<style>
	page{
		background-color: #f6f6f6;
	}
</style>
<style lang="scss" scoped>
	// 顶部背景颜色和用户头像信息
	.top_bg {
		background-color: #D73334;
		height: 420rpx;

		.av_id {
			display: flex;
			align-items: center;
			padding: 0 50rpx;

			.av_img {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
			}

			.id_box {
				margin-left: 21.58rpx;

				.id {
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 32rpx;
					line-height: 37.38rpx;
					text-align: left;
					color: #fff;
				}

				.lv {
					font-family: "PingFang SC";
					font-weight: 400;
					font-size: 20rpx;
					line-height: 37.38rpx;
					text-align: left;
					color: #fff;
				}
			}
		}
	}

	// 我的订单
	.order_box {
		width: 650rpx;
		height: 160rpx;
		padding: 24rpx 20rpx;
		border-radius: 10rpx;
		background: #fff;
		margin: 0 auto;
		position: relative;
		top: -60rpx;

		.order_box_header {
			display: flex;
			justify-content: space-between;

			.title {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 28rpx;
				color: #1a1a1a;
			}

			.link {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;

				color: #999;
			}
		}

		.grid_img1 {
			width: 53rpx;
			height: 50rpx;
			margin-top: 30rpx;
		}

		.grid-text {
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 24rpx;
			color: #333;
			margin-top: 10rpx;
		}
	}
</style>
