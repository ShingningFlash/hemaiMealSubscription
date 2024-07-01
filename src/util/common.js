// 防止处理多次点击
function noMultipleClicks(methods, info) {
    // methods是点击后需要执行的函数， info是函数需要传的参数
    let that = this;
    if (that.noClick) {
        // 第一次点击
        that.noClick= false;
        if((info && info !== '') || info ==0) {
            // info是执行函数需要传的参数
            methods(info);
        } else {
            methods();
        }
        setTimeout(()=> {
            that.noClick= true;
        }, 2000)
    } else {
        uni.showToast({
        	title: '请勿重复点击',
        	icon:"none",
        	duration: 2000
        });
    }
}
//导出
export default {
    noMultipleClicks,      // 禁止多次点击
}