<template>
	<view>
		<view-tabbar :current="6"></view-tabbar>
		<!-- 搜索框 -->
		<view class="search">
			<u-icon name="search" color="#808080" size="20"></u-icon>
			<input type="text" placeholder="请输入自提点名称" placeholder-style="font-size: 28rpx;color: #ccc;">
		</view>

		<view class="title">
			附近自提点
		</view>
		<!-- 自提点列表 -->
		<view class="point-list" v-for="(item,index) in list" :key="index" :class="current == index ? 'acitive' : ''"
			@tap="changeTab(index,item.id,item.note,item.latitude,item.longitude)" v-if="list != ''">
			<view class="left-item">
				<view class="address-1">{{item.note}}</view>
				<view class="address-2">
					{{item.address}}
				</view>
			</view>
			<view class="right-item" style="">
				<image class="nav" src="/static/icon/nav.png"></image>
				<view class="mi">{{item.distance}}m</view>
			</view>
		</view>
		<view class="point-list" v-if="list==''" style="text-align: center;">
			当前地段没有自提点
		</view>

		<!-- 按钮 -->
		<view class="point-btn" @click="gomeal">
			<image class="img" src="/static/icon/chi.png" mode=""></image>
			<view class="">
				去点餐
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
				list: [
				], //列表数据
				current: -1, // 当前选中
				longitude: 0, //经度
				latitude: 0 ,//纬度
				address_id:0 ,// 自提点id
				page:1

			}
		},
		onReachBottom() {
			this.page++
			this.getAddressList()
		},
		
		onShow() {
			var that = this
			uni.showLoading({
				title: '获取定位中',
				mask: true
			})
			uni.getLocation({
				type: 'gcj02',
				timeout:'5',
				isHighAccuracy:true,
				highAccuracyExpireTime:2000,
				accuracy:'best',
				success: function(res) {
					console.log(res)
					// uni.setStorageSync('mobile',item.data.mobile)
					that.longitude = res.longitude 
					that.latitude = res.latitude
					
					that.getAddressList()
					// that.addrDel = res;
				},
				fail: function(err) {
					console.log(err);
					uni.showToast({
						title: '获取地址失败，将导致部分功能不可用',
						icon: 'none'
					});
				}
			});
			
		},
		
		methods: {
			// 更改自提点 e为下标，f为自提点id a为自提点名称，w为纬度，j为经度
			changeTab(e,f,a,w,j) {
				this.current = e
				this.address_id = f
				uni.setStorageSync('point',a)
				uni.setStorageSync('w',w)
				uni.setStorageSync('j',j)
			},

			// 获取附近的自提点
			getAddressList() {
				let data = {}
				data.page = this.page
				data.longitude =   this.longitude
				data.latitude =   this.latitude
				this.$request('/ApiConnect/getAddressList', data).then(res => {
					uni.hideLoading()
					if(res.status == 1){
						if(this.page == 1){
							this.list = res.data
						}
						else{
							this.page = this.page.concat(res.data)
						}
					}
					else{
						this.page = 1
						return uni.showToast({
							title:'没有更多了',
							icon:'none',
							duration:2000
						})
					}
					
				}).catch(err => {})
			},
			// 去取餐
			gomeal(){
				// 存入自提点id
				uni.setStorageSync('address_id',this.address_id)
				if(this.current == -1){
					uni.$u.toast('请先选择一个自提点');
				}
				else{
					// 标识跳转到点餐页面后的判断
					uni.setStorageSync('flag',1)
					uni.switchTab({
						url:'../../meal/meal',
						success: (res) => {
							
						}
					})
				}
			}
			
		}
	}
</script>

<style scoped lang="scss">
	// 搜索框
	.search {
		width: 680rpx;
		height: 63rpx;
		border-radius: 31.5rpx;
		background: #f5f5f5;
		margin: 0 auto;
		margin-top: 15rpx;
		display: flex;
		align-items: center;
		padding: 2rpx 20rpx;
		font-size: 28rpx;
	}

	.title {
		font-family: "PingFang SC Bold";
		font-weight: bold;
		font-size: 32rpx;
		line-height: 28.8rpx;
		color: #0d0d0d;
		padding: 0 30rpx;
		margin-top: 20rpx;
		position: relative;

		&::after {
			content: '';
			width: 160rpx;
			height: 12rpx;
			border-radius: 10rpx 0;
			background: #d73334;
			display: block;
			position: absolute;
			z-index: -1;
			bottom: -8rpx;
		}
	}

	// 激活样式
	.acitive {
		background: linear-gradient(90.00deg, rgba(255, 230, 230, 0.0) 0%, #fdecec 100%);
	}

	// 自提点列表
	.point-list {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10rpx;

		.left-item {
			.address-1 {
				font-family: "PingFang SC Bold";
				font-weight: bold;
				font-size: 32rpx;
				line-height: 28.8rpx;
				color: #0d0d0d;
			}

			.address-2 {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				line-height: 28.8rpx;
				color: #999;
				margin-top: 10rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				width: 480rpx;
				height: 30rpx;
			}
		}

		.right-item {
			display: flex;
			align-items: center;

			.nav {
				width: 23rpx;
				height: 26rpx;
				margin-right: 8rpx;
			}

			.mi {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				line-height: 28.8rpx;
				color: #111;
			}
		}
	}

	// 按钮
	.point-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 680rpx;
		height: 90rpx;
		border-radius: 45rpx;
		background: #d73334;
		box-shadow: 0 6px 6px rgba(215, 51, 52, 0.32);
		position: fixed;
		bottom: 120rpx;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		color: #fff;

		&:active {
			box-shadow: 0 6px 6px rgba(173, 173, 173, 0.3);
		}

		.img {
			width: 28rpx;
			height: 34rpx;
			margin-right: 10rpx;
			margin-top: 8rpx;
		}

	}
</style>
