<template>
	<view class="u-content">
		<view-tabbar :current="6"></view-tabbar>
		<view class="content">
			<view class="main">
				<view class="top_img">
					<image :src="data.thumb" mode=""></image>
				</view>
				<view class="title">
					{{data.title}}
				</view>
				<view class="time">{{data.add_time | formatDeta}}</view>
				<view style="padding:30rpx 30rpx 0rpx 30rpx;">
					<u-parse :content="data.content"></u-parse>
					<!-- <rich-text :nodes="data.content"></rich-text> -->
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
	export default {
		components: {
			'view-tabbar': Tabbar
		},
		data() {
			return {
				data:{}
			}
		},
		filters: {
			formatDeta: function(value) {
				var date = new Date(value * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
		onLoad() {
			uni.showLoading({
				title:'加载中',
				mask:true
			})
			// 加载首页底部广告详情
			this.$request('ApiConnect/getProtocol', {
				type: 2
			}).then(res => {
				uni.hideLoading()
				if (res.status == 1) {
					this.data = res.data
				}
			})
		},
		methods: {
			returns() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-content {
		padding: 24rpx;
	}


	.bg {
		height: 200rpx;
		background-color: #1AAA7B;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: -1;
	}

	.content {
		padding: 30rpx;

		.main {
			background-color: #fff;
			border-radius: 20rpx;

			.top_img {
				image {
					width: 100%;
					height: 460rpx;
					border-radius: 12rpx;
				}
			}

			.title {
				font-weight: bold;
				font-size: 32rpx;
				color: #000;
				margin: 48rpx 69rpx 19rpx 69rpx;
				text-align: center;
			}

			.time {
				font-weight: normal;
				font-size: 24rpx;
				color: #747474;
				text-align: center;
			}

			.menu_remarks {
				padding: 30rpx 0rpx;
				margin: 0rpx 30rpx;

				.menu_remarks_bun {
					display: flex;
					justify-content: flex-end;
					margin-top: 20rpx;

					view {
						width: 166rpx;
						height: 66rpx;
						border-radius: 12rpx;
						background: #1aaa7b;
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
