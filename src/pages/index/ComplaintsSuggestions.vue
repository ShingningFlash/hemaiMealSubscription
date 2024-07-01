<template>
	<view>
		<view-tabbar :current="6"></view-tabbar>
		<view class="sug-top">
			<view class="sug-title">
				反馈类型:
			</view>
			<view class="sug-radio" v-for="(item,index) in list" :key="index">
				<view :class="current == index ? 'radio_xuanzhong': 'radio_weixuan'" @tap="change(index)">
					<view :class="current == index ? 'yuanxin': ''">

					</view>
				</view>
				<view class="sug-text" style="margin-left: 10rpx;">
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="sug-content">
			<view class="sug-se">
				<view class="sug-title">
					反馈主题:
				</view>
				<view class="sug-input">
					<input type="text" placeholder="请输入主题" placeholder-style="font-size: 32rpx;color: #999;"
						v-model="zhuti">
				</view>

			</view>
		</view>
		<!-- 文本域，上传图片 -->
		<view class="sug-textarea">
			<u--textarea border="none" v-model="content" placeholder="请输入反馈内容..." count></u--textarea>
			<view class="back" @tap="selectImgFunction">
				<view class="dash" v-if="pre == ''">
					<u-icon name="photo" size="50"></u-icon>
				</view>
				<image style="width:120rpx;height:120rpx" v-else :src="pre" mode=""></image>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="sug-btn" @click="submit" >
			提交
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
				list: [{
						title: '建议'
					},
					{
						title: '投诉'
					}
				],
				// 当前选择
				current: 0,
				zhuti: '', // 主题
				content: '', //内容
				pre: [],
				
				img:[]

			}
		},
		onLoad(o){
			this.current = o.type
		},
		methods: {
			// 改变选项
			change(e) {
				this.current = e
			},
			// 选择图片
			selectImgFunction(){
				let that = this
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album','camera'], //从相册选择
				    success: function (res) {
				        let tempFilePaths
						res.tempFilePaths.forEach(item => {
							if(tempFilePaths==''||tempFilePaths==undefined){
								tempFilePaths=item
							}else{
								tempFilePaths+=','+item
							}
						});
						that.uploading(tempFilePaths);
				    }
				});
			},
			// 上传图片
			uploading(tempFilePaths){
				let that = this
				 uni.uploadFile({
				    url:'https://hemai.ydlweb.com/Mini/ApiConnect/uploadRefundpic',
				    filePath: tempFilePaths,
				    name: 'uploadImg',
				    formData: {
				    	'user_id':wx.getStorageSync('user_id'),
				    	'image':tempFilePaths[0]
				    },
					success(res) {
						if(JSON.parse(res.data).status == 1){
							that.pre = that.pre.concat(JSON.parse(res.data).result)
						}else{
							uni.showToast({
								title: JSON.parse(res.data).msg,
								icon:"none",
								duration: 2000
							});
						}
					}
				});
			},
			
			// 提交
			submit(){
				let data = {}
				data.title = this.zhuti 
				data.content = this.content
				if(this.current == 0){
					data.type = 1 //建议
				}
				else{
					data.type = 2 //投诉
				}
				data.images= this.pre
				this.$request('ApiConnect/suggestApply',data).then(res => {
					if(res.status == 1){
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						this.zhuti = ''
						this.content = ''
						this.pre = []
					}
					else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	// 顶部样式
	.sug-top {
		width: 100%;
		height: 102.5rpx;
		box-sizing: border-box;
		background-color: #fff;
		border-top: 1rpx solid #f5f5f5;
		display: flex;
		align-items: center;
		padding: 0 30rpx;

		.sug-title {
			font-family: "PingFang SC Bold";
			font-weight: bold;
			font-size: 32rpx;
			line-height: 28.8rpx;
			color: #111;
		}

		.sug-radio {
			display: flex;
			align-items: center;
			margin-left: 20rpx;

			.radio_weixuan {
				width: 26rpx;
				height: 26rpx;
				background: #fff;
				border: 1rpx solid #707070;
				border-radius: 50%;
			}

			.radio_xuanzhong {
				width: 26rpx;
				height: 26rpx;
				background: #fff;
				border: 1rpx solid #d73334;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				.yuanxin {
					width: 16rpx;
					height: 16rpx;
					background: #d73334;
					border-radius: 50%;
				}
			}

			.sug-text {
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 32rpx;
				line-height: 28.8rpx;
				color: #111;
			}
		}

	}

	// 主题样式
	.sug-content {
		margin-top: 20rpx;

		.sug-title {
			font-family: "PingFang SC Bold";
			font-weight: bold;
			font-size: 32rpx;
			line-height: 28.8rpx;
			color: #111;
		}

		.sug-input {
			margin-left: 20rpx;
		}

		.sug-se {
			width: 100%;
			height: 102.5rpx;
			box-sizing: border-box;
			background-color: #fff;
			border-bottom: 1rpx solid #f5f5f5;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
		}
	}
	
	.back{
		background-color: #fff;
		padding: 30rpx;
		.dash{
			width: 120rpx;
			height: 120rpx;
			background: #fff;
			border: 1rpx dashed #707070;
		}
		
	}
	.sug-btn{
		width: 690rpx;
		height: 80rpx;
		border-radius: 40rpx;
		background: #d73334;
		text-align: center;
		line-height: 80rpx;
		margin: 0 auto;
		margin-top: 30rpx;
		color: #fff;
		&:active{
			box-shadow: 0 6px 6px rgba(173, 173, 173, 0.3);
		}
	}
</style>
<style>
	page {
		background-color: #f5f5f5;
	}
</style>
