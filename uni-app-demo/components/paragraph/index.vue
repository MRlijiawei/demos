<template>
	<text :style="style1">{{text1}}</text>
</template>

<script>
	export default {
		data() {
			return {
				style1: '',
				defaultSize: 12,
				defaultWeight: 400,
				text1: ''
			}
		},
		mounted() {
			console.log('font')
			this.style1 = 'font-size:' + this.size + 'upx;font-weight:' + this.weight + ';'
			if (this.newLine) {
				this.text1 = '\n' + this.text + '\n'
			} else {
				this.text1 = this.text
			}
		},
		// 暂时就加这几个
		props: ['text', 'size', 'weight', 'newLine', 'italic']
	}
</script>

<style>
</style>
