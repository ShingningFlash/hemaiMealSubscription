<template>
	<view>
		<view-tabbar :current="6"></view-tabbar>
		<!-- 绑定企业 -->
		<view class="band-box">
			<view class="band-title">
				绑定企业
			</view>
			<view class="band-content">
				<view class="band-text">
					首次进行企业点餐需绑定企业才能进行点餐，
					请在下面输入框，输入企业认证编号
				</view>
				<view class="band-input">
					<input type="text" placeholder="请输入企业编号" v-model="com_code">
				</view>
				<view class="band-btn" @click="jump">
						确认
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
		data() {
			return {
				com_code:''
			}
		},
		methods: {
			// 跳转
			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			jump(){
				if(this.com_code == ''){
					uni.$u.toast('请输入企业码');
					
				}
				else{
					uni.navigateTo({
						url:'./PhoneVerification?com_code='+this.com_code
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">

.band-box{
	padding: 44rpx 30rpx;
	.band-title{
		font-family: "PingFang SC Bold";
		font-weight: bold;
		font-size: 58rpx;
	}
	.band-content{
		margin-top:15rpx;
		.band-text{
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 30rpx;
			color: #999;
		}
		.band-input{
			box-sizing: border-box;
			width: 680rpx;
			height: 120rpx;
			border-radius: 60rpx;
			background: #f4f4f4;
			margin: 0 auto;
			margin-top: 60rpx;
			padding: 0 50rpx;
			input{
				width: 100%;
				height: 100%;
			}
			
		}
		.band-btn{
			width: 680rpx;
			height: 90rpx;
			border-radius: 45rpx;
			background: #d73334;
			box-shadow: 0 6px 6px rgba(215, 51, 52, 0.32);
			margin: 0 auto;
			text-align: center;
			line-height: 90rpx;
			margin-top: 50rpx;
			font-family: "PingFang SC";
			font-weight: 400;
			font-size: 36rpx;
			color: #fff;
			&:active{
				box-shadow: 0 6px 6px rgba(215, 51, 52, 0.80);
			}
		}
	}
}
</style>
