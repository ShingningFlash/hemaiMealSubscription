<template>
	<view>
		
		<view class="" style="padding: 30rpx;">
			{{prolist.order_status_name}}
		</view>
		<!-- 餐内容 -->
		<view class="meal-box">
			<view class="meal-content" v-for="(item,index) in prolist.order_goods" :key="index">
				<view class="title">
					{{item.goods_add_time | formatDeta}}
				</view>
				<view class="scoll">
					<view class="food-item">
						<view class="item-left">
							<image class="img" :src="item.original_img" mode=""></image>
							<view class="name">
								{{item.goods_name}}
							</view>
						</view>
					
						<view class="item-right">
							<view class="num">x{{item.goods_num}}</view>
							<view class="price">
								<text>￥</text>
								<text style="font-size: 28rpx;">{{item.goods_price}}</text>
							</view>
						</view>
					</view>
					<!-- <view class="tapupfold" @tap="opens" v-if="index2>1">
						点击展开
					</view> -->
				</view>
			</view>
		</view>
		
		<!-- 核销二维码 -->
		<view class="code-box" v-if="prolist.order_status == 2">
			<view class="">
				<image :src="prolist.get_code" mode=""></image>
				<view class="text">
					核销二维码
				</view>
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="order-title">
				订单信息
			</view>
			<view class="flex" style="margin-top: 20rpx;">
				<view>订单编号</view>
				<view>{{prolist.order_sn}}</view>
			</view>
			<view class="flex">
				<view>下单时间</view>
				<view>{{prolist.add_time}}</view>
			</view>
			<view class="flex">
				<view>支付时间</view>
				<view>{{prolist.pay_time}}</view>
			</view>
			<view class="flex">
				<view>取餐码</view>
				<view>{{prolist.take_code}}</view>
			</view>
			<view class="flex">
				<view>用户姓名</view>
				<view>{{prolist.nickname}}</view>
			</view>
			<view class="flex">
				<view>配送地点</view>
				<view>{{prolist.address_data.province_name}}{{prolist.address_data.city_name}}{{prolist.address_data.district_name}}{{prolist.address_data.adderss}}</view>
			</view>
			<view class="flex">
				<view>取餐联系人</view>
				<view>{{prolist.address_data.name}}</view>
			</view>
			<view class="flex">
				<view>取餐联系方式</view>
				<view>{{prolist.address_data.mobile}}</view>
			</view>
			<view class="flex">
				<view>结算方式</view>
				<view>{{prolist.pay_name}}</view>
			</view>
		</view>
		<view class="" style="height: 160rpx;width: 100rpx;">
			
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
				prolist:[
					
				]
			}
		},
		filters:{
			formatDeta:function(value){
				var date = new Date(value*1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "." + month + "." + sdate + " " + hour + ":" + minute //+ ":" + second;
				// 返回
				return result;
			}
		},
		onLoad(option){
			
			this.getorderDetail(option.order_id)
		},
		methods: {
			getorderDetail(id){
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let data = {}
				
				data.id = id
				
				this.$request('ApiConnect/sendOrderDetail',data).then(res => {
					uni.hideLoading()
					if (res.status == 1) {
						console.log(res);
						this.prolist = res.data
					}
				}).catch(err => {
							
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	// 餐列表
.meal-box {
		width: 690rpx;
		// height: 372rpx;

		// overflow-y: scroll;
		background: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		border-radius: 12rpx;
		padding-bottom: 20rpx;

		.meal-content {
			// width: 100%;
			max-height: 350rpx;
			border-radius: 12rpx;
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
				padding-bottom: 10rpx;
			}
			.scoll{
				max-height: 280rpx;
				overflow: scroll;
			}
			.tap{
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
			
			.tapupfold{
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
	
	
	// 核销二维码样式
	.code-box{
		width: 690rpx;
		height: 315rpx;
		border-radius: 10rpx;
		background: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 220rpx;
			height: 220rpx;
		}
		.text{
			font-family: "PingFang SC Bold";
			font-weight: bold;
			font-size: 32rpx;
			line-height: 28.8rpx;
			color: #111;
			text-align: center;
			
		}
	}
	// 订单信息
	.order-info{
		width: 690rpx;
		height: 600rpx;
		border-radius: 10rpx;
		background: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		padding: 20rpx;
		
		font-family: "PingFang SC";
		font-weight: 400;
		font-size: 26.34rpx;
		// line-height: 46.09rpx;
		color: #666;
		box-sizing: border-box;
		
		.order-title{
			font-family: "PingFang SC Bold";
			font-weight: bold;
			font-size: 32rpx;
			line-height: 49.99rpx;
			text-align: left;
			color: #333;
		}
	}
	.flex{
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
	}
</style>


<style>
	page{
		background-color: #F5F5F5;
	}
</style>
