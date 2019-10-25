<template>
	<view class="home-box flex-center">
		<view class="home-item flex-center">
			<navigator url="../introduce/introduce">
				<image src="../../static/homebk1.jpg"></image>
			</navigator>
				<text class="content-title" @click="gotoIntroduce">简介</text>
		</view>
		<view class="home-item flex-center" @click="gotoWork">
			<image src="../../static/homebk2.jpg"></image>
			<text class="content-title">工作</text>
		</view>
		<view class="home-item flex-center">
			<image src="../../static/homebk3.jpg"></image>
			<text class="content-title">生活</text>
		</view>
		<view class="home-item flex-center">
			<image src="../../static/homebk4.jpg"></image>
			<text class="content-title">联系</text>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			gotoIntroduce() {
				uni.navigateTo({
					url: '../introduce/introduce'
				})
			},
			gotoWork() {
				uni.navigateTo({
					url: '../work/work'
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-box {
		
	}
	.home-item {
		width: 100%;
		height: auto;
	}
	.home-item image {
		opacity: 0.8;
	}
	.home-item .content-title {
		position: absolute;
		/* transform: translate(-25%, -50%); */
		color: white;
		font-size: 3em;
		font-weight: 700;
	}
	uni-navigator {
		position: relative;
	}
</style>
