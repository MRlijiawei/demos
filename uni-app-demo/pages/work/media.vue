<template>
	<view class="">
		<paragraph :text="'Media'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<paragraph :text="'Audio'" :size="'32'" :weight="'500'" :newLine="true"></paragraph>
		<audio src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3"
		poster="https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg" name="献给爱丽丝" author="Me" :action="audioAction" controls loop></audio>
		<paragraph :text="'Video'" :size="'32'" :weight="'500'" :newLine="true"></paragraph>
		<view class="uni-padding-wrap uni-common-mt">
			<view>
				<video id="myVideo"
				src="https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
					@error="videoErrorCallback" :danmu-list="danmuList" enable-danmu danmu-btn controls></video>
			</view>
			<view class="uni-list uni-common-mt">
				<view class="uni-list-cell">
					<view>
						<view class="uni-label">弹幕内容</view>
					</view>
					<view class="uni-list-cell-db">
						<input v-model="danmuValue" class="uni-input" type="text" placeholder="在此处输入弹幕内容" />
					</view>
				</view>
			</view>
			<view class="uni-btn-v">
				<button @click="sendDanmu" class="page-body-button">发送弹幕</button>
			</view>
		</view>
		<paragraph :text="'Camera'" :size="'32'" :weight="'500'" :newLine="true"></paragraph>
		<!-- #ifdef MP-WEIXIN -->
		<camera device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera>
		<button type="primary" @click="takePhoto">拍照</button>
		<view>预览</view>
		<image mode="widthFix" :src="src"></image>
		<!-- #endif -->
		<paragraph :text="'Live...'" :size="'32'" :weight="'500'" :newLine="true"></paragraph>
		<paragraph :text="'Map...'" :size="'32'" :weight="'500'" :newLine="true"></paragraph>
		<map></map>
	</view>
</template>

<script>
	import paragraph from '@/components/paragraph'
	export default {
		components: {
			paragraph
		},
		data() {
			return {
				audioAction: {
					method: 'pause'
				},
				danmuList: [{
						text: '666',
						color: '#ff0000',
						time: 1
					},
					{
						text: '2666(第三秒)',
						color: '#ff00ff',
						time: 3
					}
				],
				danmuValue: '',
				src: ''
			}
		},
		created: function(res) {
		// h5端组件中（非页面的vue文件）onready不会触发，需要统一用created
		// onReady: function(res) {
			console.log('videocontent');
			this.videoContext = uni.createVideoContext('myVideo')
		},
		methods: {
			takePhoto() {
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: (res) => {
						this.src = res.tempImagePath
					}
				});
			},
			error(e) {
				console.log(e.detail);
			},
			sendDanmu: function() {
				this.videoContext.sendDanmu({
					text: this.danmuValue,
					color: this.getRandomColor()
				});
				this.danmuValue = '';
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			getRandomColor: function() {
				const rgb = []
				for (let i = 0; i < 3; ++i) {
					let color = Math.floor(Math.random() * 256).toString(16)
					color = color.length == 1 ? '0' + color : color
					rgb.push(color)
				}
				return '#' + rgb.join('')
			}
		}
	}
</script>

<style>
</style>
