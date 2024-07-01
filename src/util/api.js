/**
 * 请求封装
 */
const baseUrl = 'https://hmdemo.ydlweb.com/Mini/'   
const request = (url, data, isGet) => {
	let user_id = uni.getStorageSync('user_id');
	let $data = {
		user_id: user_id || ''
	};
	let token = uni.getStorageSync('token')
	let header = {
		token:token || ''
	}
	Object.assign($data, data);
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
			data: $data,
			method: isGet ? 'get' : 'post',
            dataType: 'json', 
			header:header
        }).then((response) => {
            let [error, res] = response;
			
			resolve(res.data)
			if(res.data.status == 41001){
				uni.switchTab({
					url:'/pages/my/my'
				})
				uni.clearStorage();
				uni.showToast({
					title:res.data.msg,
					icon:'error'
				})
			}
			
        }).catch(error => {
            let [err, res] = error;
            reject(err)
        })
    });
}
export default request