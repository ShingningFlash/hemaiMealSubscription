<template>
	<view>
		<view-tabbar :current="6"></view-tabbar>
		<!-- 手机验证 -->
		<view class="band-box">
			<view class="band-title">
				手机验证
			</view>
			<view class="band-content">
				<view class="band-text">
					为了确保是您本人操作，请验证当前
					<text class="phone">{{userPhone}}</text>手机号
				</view>
				<view class="band-input">
					<u-input  placeholder="请输入验证码" border="none" type="number" v-model="verify_code">
						<template slot="suffix">
							<u-code ref="uCode" @change="codeChange" seconds="30" changeText="X秒重新获取"></u-code>
							<view class="band-tips"  @tap="getCode">
								{{tips}}
							</view>
						</template>
					</u-input>
				</view>
				<view class="band-btn" @click="binden">
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
				userPhone: '150*****123',
				tips: '',
				value: '',
				com_code:'', //企业吗
				verify_code:'' ,//短信验证码
				type:0 //验证类型
			}
		},
		
		onLoad(option){
			this.com_code = option.com_code
			this.userPhone = uni.getStorageSync('mobile')
			if(option.type == 2){
				this.type = 2
			}
			else{
				this.type = 1
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			// 获取验证码
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码',
						mask:true
					})
					let data = {}
					data.mobile = this.userPhone
					this.$request('ApiConnect/sendVerifyComCode',data).then(res=>{
						uni.hideLoading();
						if(res.status == 1){
							uni.$u.toast('验证码已发送');
							this.$refs.uCode.start();
						}
						else{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
						}
						
						
						
					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			change(e) {
				console.log('change', e);
			},
			
			binden(){
				if(this.verify_code == ''){
					uni.$u.toast('请输入短信验证码');
				}
				else{
					if(this.type == 1){
						uni.showLoading({
							title: '请求中',
							mask:true
						})
						let data = {}
						data.mobile = this.userPhone
						data.verify_code = this.verify_code
						data.com_code = this.com_code
						this.$request('ApiConnect/setBindingCom',data).then(res=>{
							if(res.status == 1){
								setTimeout(() => {
									uni.hideLoading();
									// 这里此提示会被this.start()方法中的提示覆盖
									uni.$u.toast(res.msg)
									// 通知验证码组件内部开始倒计时
									uni.switchTab({
										url:'../my/my'
									})
								}, 2000);
								
							}
							else{
								uni.$u.toast(res.msg);
							}
						})
					}
					else{
						uni.showLoading({
							title: '请求中',
							mask:true
						})
						let data = {}
						data.mobile = this.userPhone
						data.verify_code = this.verify_code
						this.$request('ApiConnect/setUnbindingCom',data).then(res=>{
							uni.hideLoading();
							uni.$u.toast(res.msg)
							if(res.status == 1){
								setTimeout(() => {
									uni.switchTab({
										url:'../my/my'
									})
								}, 2000);
								
							}
							else{
								uni.$u.toast(res.msg);
							}
						})
					}
					
				}
			}
			
			
		}
	}
</script>

<style scoped lang="scss">
	.band-box {
		padding: 44rpx 30rpx;

		.band-title {
			font-family: "PingFang SC Bold";
			font-weight: bold;
			font-size: 58rpx;
		}

		.band-content {
			margin-top: 15rpx;

			.band-text {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 30rpx;
				color: #999;

				.phone {
					color: #D73334;
				}
			}

			.band-input {
				box-sizing: border-box;
				width: 680rpx;
				height: 120rpx;
				border-radius: 60rpx;
				background: #f4f4f4;
				margin: 0 auto;
				margin-top: 60rpx;
				padding: 0 50rpx;
				display: flex;justify-content: center;align-items: center;
				.band-tips{
					color: #D73334;
				}

			}

			.band-btn {
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

				&:active {
					box-shadow: 0 6px 6px rgba(215, 51, 52, 0.80);
				}
			}
		}
	}
</style>
