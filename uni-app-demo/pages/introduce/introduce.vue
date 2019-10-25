<template>
	<view class="introduce-box">
		<view class="uni-product-list">
			<view class="uni-product" v-for="(product,index) in productList" :key="index">
				<view class="image-view">
					<image v-if="renderImage" class="uni-product-image" :src="product.image"></image>
				</view>
				<view class="uni-product-title">{{product.title}}</view>
				<view class="uni-product-price">
					<text class="uni-product-price-favour">￥{{product.originalPrice}}</text>
					<text class="uni-product-price-original">￥{{product.favourPrice}}</text>
					<text class="uni-product-tip">{{product.tip}}</text>
				</view>
			</view>
			<movable-area @click="goTop" class="go-top" v-if="scrollShow">
				<movable-view style="width: auto;">回到顶部</movable-view>
			</movable-area>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollShow: false,
				productList: [{
					image: '../../static/homebk1.jpg',
					title: '1221',
					originalPrice: 1,
					favourPrice: 2,
					tip: 'xxxxxx'
				},{
					image: '',
					title: '1221',
					originalPrice: 1,
					favourPrice: 2,
					tip: 'xxxxxx'
				},{
					image: '../../static/homebk2.jpg',
					title: '1221',
					originalPrice: 1,
					favourPrice: 2,
					tip: 'xxxxxx'
				},{
					image: '../../static/homebk3.jpg',
					title: '1221',
					originalPrice: 1,
					favourPrice: 2,
					tip: 'xxxxxx'
				},{
					image: '',
					title: '1221',
					originalPrice: 1,
					favourPrice: 2,
					tip: 'xxxxxx'
				},{
					image: '../../static/homebk4.jpg',
					title: '1221',
					originalPrice: 1,
					favourPrice: 2,
					tip: 'xxxxxx'
				}],
				renderImage: true
			}
		},
		onPageScroll(e) {
			console.log(e)
			this.scrollShow = e.scrollTop > 0
		},
		methods: {
			goTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			}
		}
	}
</script>

<style lang="scss">
	.go-top {
		height: 5.5em;
		width: 1.5em;
		text-align: center;
	}
	.uni-product-image {
		object-fit: contain;
	}
</style>
