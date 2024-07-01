<template>
    <cover-view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
        <cover-view class="tabbar-item"
            v-for="(item, index) in list" 
            :key="index" 
            @click="tabbarChange(item.path)"
        >
            <cover-image class="item-img" :src="item.icon_a" v-if="current == index"></cover-image>
            <cover-image class="item-img" :src="item.icon" v-else></cover-image>
            <cover-view class="item-name" :class="{'tabbarActive': current == index}" v-if="item.text">{{item.text}}</cover-view>
        </cover-view>
    </cover-view>
</template>

<script>
	
export default {
     props: {
        current: String
    },
    data() {
        return {
            paddingBottomHeight: 0,  //苹果X以上手机底部适配高度
            list: [{
                    text: '首页',  
                    icon: '/static/icon/index.png',  //未选中图标
                    icon_a: '/static/icon/index_selected.png',  //选中图片
                    path: "/pages/index/index",  //页面路径
                },{
                    text: '点餐',
                    icon: '/static/icon/meal.png',
                    icon_a: '/static/icon/meal_selected.png',
                    path: "/pages/meal/meal",
                }
                ,{
                    text: '订单',
                    icon: '/static/icon/cart.png',
                    icon_a: '/static/icon/cart_selected.png',
                    path: '/pages/cart/cart',
                },{
                    text: '我的',
                    icon: '/static/icon/my.png',
                    icon_a: '/static/icon/my_selected.png',
                    path: "/pages/my/my",
                },
            ]
        };
    },
    created() {
		
        let that = this;
        uni.getSystemInfo({
            success: function (res) {
                let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
                model.forEach(item => {
                    //适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
                    if(res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
                        that.paddingBottomHeight = 40;
                    }
                })
            }
        });
    },
    methods: {
        tabbarChange(path) {
            uni.switchTab({
                url: path
            })
        }
    }
};

</script>

<style lang="scss" scoped>
    .tabbarActive{
        color: #ff0000 !important;
    }
    .tabbar{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100rpx;
                background-color: #ffffff;
				box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.12);
        .tabbar-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100rpx;
            .item-img{
                margin-bottom: 4rpx;
                width: 46rpx;
                height: 46rpx;
            }
            .item-name{
                font-size: 26rpx;
                color: #A3A3A3;
            }
        }
    }
</style>