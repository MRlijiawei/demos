<template>
	<view>
		<progress :percent="nowPercent" :stroke-width="barWidth||6" :activeColor="nowColor" :backgroundColor="bkgColor||backgroundColor" active></progress>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				colorList: ['red', 'yello', 'pink', 'blue'],
				nowColor: '',
				backgroundColor: '#EBEBEB'
			}
		},
		props: ['nowPercent', 'barWidth', 'bkgColor'],
		watch: {
			nowPercent: {
				handler: function (newValue, oldValue) {
					console.log('progress');
					if (newValue) {
						// this.matchColor(newValue)
					} 
				},
				immediate: true
			}
		},
		mounted() {
			if (this.nowPercent && !isNaN(this.nowPercent)) {
				let _nowPercent = 0
				// 组件动画速度是20/s,1000/20=50。这里也可以使颜色变化快一些（每次+2），来使定时器间隔长一些以减少循环次数
				const _that = this
				const colorInterval = setInterval(function() {
					if (_nowPercent < _that.nowPercent) {
						_nowPercent++
						_that.matchColor(_nowPercent)
					} else {
						clearInterval(colorInterval)
					}
				}, 50)
			}
		},
		methods: {
			matchColor(percent) {
				// 蓝色暂时不知道该怎么调好。现象就是从红色变绿色
				this.nowColor = 'rgb(' + (255 - percent * 2.55) + ',' + (percent * 2.55) + ',' + percent + ')'
			}
		}
	}
</script>

<style>

</style>
