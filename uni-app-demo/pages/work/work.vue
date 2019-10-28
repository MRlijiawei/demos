<template>
	<view>
		<text>组件学习</text>
		<paragraph :text="'icons'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<view class="dm-icons flex-center">
			<view class="item" v-for="icon in iconTypes" :key="icon">
				<icon :type="icon" :size="commonSize"/>
				<text>{{icon}}</text>
			</view>
		</view>
		<paragraph :text="'rich-text'" :size="'28'" :weight="'400'"></paragraph>
		<rich-text :nodes="richNodes"></rich-text>
		<paragraph :text="'progress'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<aniProgress :barWidth="10" :nowPercent="88"></aniProgress>
		<view class="">
			
		</view>
	</view>
</template>

<script>
	import paragraph from '@/components/paragraph'
	import aniProgress from '@/components/aniProgress'
	export default {
		components: {
			paragraph,
			aniProgress
		},
		data() {
			return {
				commonSize: 28,
				iconTypes: [],
				richNodes: [{
					name: 'div',
					attrs: {
						class: 'div-class',
						style: 'line-height: 60px; color: red; text-align:center;'
					},
					children: [{
						type: 'text',
						text: 'Hello&nbsp;uni-app!'
					}]
				}]
			}
		},
		onLoad() {
			// #ifdef APP-PLUS || APP-PLUS-NVUE || H5 || MP-WEIXIN
			this.iconTypes = ['success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear']
			// #endif
		}
	}
</script>

<style lang="scss">
.dm-icons {
	flex-flow: row wrap;
	justify-content: flex-start;
	.item {
		width: 375upx;
		border: 1px solid #cccccc;
		box-sizing: border-box;
		line-height: 2em;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	/* .item+.item {
		border-left: none;
	} */
}
</style>
