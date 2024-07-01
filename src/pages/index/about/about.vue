<template>
	<view>
		<view class="bg"></view>
		<view-tabbar :current="6"></view-tabbar>
		<view class="content">
			<view class="main">
				<view class="top_img">
					<image :src="data.detail.thumb" mode=""></image>
				</view>
				<view class="title">
					{{data.detail.title}}
				</view>
				
				<view style="padding:30rpx 30rpx 0rpx 30rpx;">
					<rich-text :nodes="data.detail.content"></rich-text>
				</view>
				<view class="menu_remarks">
					<view class="menu_remarks_bun" @click="returns">
						<view>返回</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Tabbar from '@/components/tabbar.vue'
	export default{
		components: {
			'view-tabbar': Tabbar
		},
		data(){
			return{
				data:{}
			}
		},
		
		onLoad(option) {
			// 获取首页底部广告详情
			this.$request('ApiConnect/getProtocolDetail',{id:option.id}).then(res => {
				if(res.status == 1){
					this.data = res.data
				}
			})
		},
		methods:{
			// 返回
			returns(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
	.bg{
		height: 200rpx;
		background-color: #d73334;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: -1;
	}
	.content{
		padding: 30rpx;
		.main{
			background-color: #fff;
			border-radius: 20rpx;
			.top_img{
				image{
					width: 100%;
					height: 460rpx;
					border-radius: 12rpx;
				}
			}
			.title{
				font-weight: bold;
				font-size: 32rpx;
				color: #000;
				margin: 48rpx 69rpx 19rpx 69rpx;
				text-align: center;
			}
			.time{
				font-weight: normal;
				font-size: 24rpx;
				color: #747474;
				text-align: center;
			}
			.menu_remarks{
				padding: 30rpx 0rpx;
				margin: 0rpx 30rpx;
				.menu_remarks_bun{
					display: flex;
					justify-content: flex-end;
					margin-top: 20rpx;
					view{
						width: 166rpx;
						height: 66rpx;
						border-radius: 12rpx;
						background: #d73334;
						font-weight: normal;
						font-size: 26rpx;
						line-height: 66rpx;
						text-align: center;
						color: #fff;
					}
				}
			}
		}
	}
</style>
