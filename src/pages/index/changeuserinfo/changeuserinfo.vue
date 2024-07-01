<template>
	<view style="padding: 20rpx;">
		<view-tabbar :current="6"></view-tabbar>
		<u-cell title="用户姓名">
			<view slot="value" class="u-slot-value">
				<u--input placeholder="请输入用户名" border="surround" v-model="lastname"></u--input>
			</view>
		</u-cell>
		<u-cell title="用户姓名" @click="show = true">
			<view slot="value" class="u-slot-value">
				<u--input placeholder="请输入性别" border="surround" v-model="gender"></u--input>
			</view>
		</u-cell>
		

		<view class="btn" @tap="save">
			保存
		</view>
		<u-picker :show="show" ref="uPicker" :columns="columns" @confirm="changeHandler" @cancel="show = false" :closeOnClickOverlay="true"></u-picker>
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
				show: false,
				
				columns: [
					['男', '女']
				],
				lastname: '', //用户姓名
				gender: '' ,//性别
				timer:null
			}
		},
		onHide(){
			clearTimeout(this.timer)
			this.timer = null
		},
		methods: {
			changeHandler(e){
				console.log(e);
				this.gender = e.value[0]
					// this.gender = 1
				this.show = false
				
			},
			// 保存修改信息
			save() {
				uni.showLoading({
					title: '请求中',
					mask: true
				})
				let data = {}
				data.lastname = this.lastname
				if(this.gender== '男'){
					data.sex = 1
				}
				else{
					data.sex = 2
				}
				data.mobile = uni.getStorageSync('mobile')
				data.sex = this.gender
				this.$request('ApiConnect/savePersonalInfo',data).then(res => {
					uni.hideLoading();
					if (res.status == 1) {
						uni.$u.toast(res.msg);
						this.timer = setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					} else {
						uni.$u.toast(res.msg);
					}
				})
			}
		},
		onLoad(option) {
			this.lastname = option.lastname
			if(option.gender == 0){
				this.gender = '男'
			}
			else{
				this.gender = '女'
			}
			
			console.log(option);
		}
	}
</script>

<style scoped lang="scss">
	.btn {
		height: 100rpx;
		border-radius: 49rpx;
		background: #d73334;
		box-shadow: 0 6rpx 6rpx rgba(215, 51, 52, 0.32);
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		margin-top: 10rpx;
	}
</style>
