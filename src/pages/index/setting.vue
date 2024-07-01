<template>
	<view>
		<view-tabbar :current="6"></view-tabbar>
		<u-cell-group>
			<u-cell title="用户姓名" :isLink="true" :value="info.lastname" @click="navTo('./changeuserinfo/changeuserinfo?lastname='+info.lastname+'&gender='+info.sex)"></u-cell>
			<u-cell title="性别"  :isLink="true" :value="gender" @click="navTo('./changeuserinfo/changeuserinfo?lastname='+info.lastname+'&gender='+info.sex)">
				<view slot="value" class="u-slot-value">
					<text class="u-cell-text" >{{info.sex == 0 ? '男' : '女'}}</text>
				</view>
			</u-cell>
			<u-cell title="手机号码"  :value="info.mobile"></u-cell>
			<u-cell title="绑定企业" :value="enterprise" @click="bang">
				<view slot="value" class="u-slot-value">
					<text class="u-cell-text" v-if="info.com_id==1">{{info.com_name}} <text style="color: #FF1C1C;margin-left: 10rpx;">解绑</text></text>
					<text class="u-cell-text" v-if="info.com_id==0">去绑定</text>
				</view>
			</u-cell>
			<u-cell title="投诉建议" arrow-direction="right" :isLink="true" @tap="navTo('./ComplaintsSuggestions?type=1')"></u-cell>
			<u-cell title="关于我们" arrow-direction="right" :isLink="true" @tap="navTo('./aboutUs')"></u-cell>
		</u-cell-group>
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
				username: '闪光万岁',
				gender: '男',
				userphone: '15034689520',
				enterprise: '广东锋火信息科技有限公司',
				info:''
			}
		},
		onShow(){
			this.getPersonalInfo()
		},
		methods: {
			// 跳转
			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			// 解绑企业
			cancel(){
				uni.navigateTo({
					url:'./PhoneVerification?type='+2
				})
			},
			// 判断是否已经绑定
			bang(){
				// 已经绑定前往解绑
				if(this.info.com_id == 1){
					this.cancel()
				}
				else{
					// 未绑定前往绑定
					uni.navigateTo({
						url:'./BindingEnterprises'
					})
				}
				
			},
			// 获取个人信息
			getPersonalInfo(){
				uni.showLoading({
					title: '请求中',
					mask:true
				})
				
				this.$request('ApiConnect/personalInfo').then(res=>{
					uni.hideLoading();
					if(res.status == 1){
						this.info = res.data
					}
					else{
						uni.$u.toast(res.msg);
					}
				})
			}
			
		}
	}
</script>

<style>

</style>
