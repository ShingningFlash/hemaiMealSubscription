<script>
	import Vue from 'vue';
	export default {
		methods: {

		},
		onLaunch: function() {
			console.log('App Launch')

		},
		onShow: function() {

			uni.login({
				provider: 'weixin',
				success: function(res) {
					let code = res.code
					
					uni.request({
						url: 'https://hmdemo.ydlweb.com/Mini/ApiConnect/getOpenid',
						method: 'POST',
						data: {
							code
						},
						success: (res) => {
							
							if(res.data.status == 1){
								uni.setStorageSync('openid', res.data.result)
								uni.setStorageSync('token',res.data.token)
							}
							else{
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
							}
							
						}
					})
				}
			});

			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	
</style>
