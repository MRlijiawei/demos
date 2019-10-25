<template>
	<view class="home-box flex-center">
		<image src="/static/logo.png"></image>
		<view class="flex-center" style="height: 2000upx;">
			<text class="home-welcome">{{homeText}}</text>
			<text class="home-desc">{{descText}}</text>
		</view>
		<view class="common-footer" id="footer">
			@MrLjw
		</view>
	</view>
</template>

<script>
	import { lazyLoad, inview, ifiniteScroll } from '@/common/js/inview.js'
	export default {
		data() {
			return {
				homeText: 'hello ...',
				descText: 'mrLjw'
			}
		},
		onPageScroll: () => {
			console.log('scroll');
		},
		// onLoad: () => {
		mounted() {
			console.log('aaa')
			// const $ = uni.createSelectorQuery().in(this)
			// const dom = $.select('#footer').boundingClientRect()
			// const dom = $.select('#footer')
			/* dom.boundingClientRect(data => {
				console.log(data)
			}).exec() */
			inview('#footer', () => {
				uni.showModal({
					content: '111'
				})
			})
			ifiniteScroll('#footer', () => {
				console.log('1212')
			})
			// uni.scrollBehavior
			// lazyLoad('.home-box')
		}
	}
</script>

<style lang="scss">
	.home-box {
		/* display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center; */
		position: relative;
		image {
			width: 200upx;
			height: 200upx;
			margin: 50upx auto;
		}
		.home-welcome {
			color:$uni-color-success;
		}
		.home-desc {
			color: $uni-color-subtitle;
			font-size: $uni-font-size-paragraph;
		}
	}
</style>
