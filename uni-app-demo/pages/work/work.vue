<template>
	<view>
		<text>组件学习</text>
		<paragraph :text="'Icons'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<view class="dm-icons flex-center">
			<view class="item" v-for="icon in iconTypes" :key="icon">
				<icon :type="icon" :size="commonSize"/>
				<text>{{icon}}</text>
			</view>
		</view>
		<paragraph :text="'Rich-text'" :size="'38'" :weight="'600'"></paragraph>
		<rich-text :nodes="richNodes"></rich-text>
		<paragraph :text="'Progress'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<aniProgress :barWidth="10" :nowPercent="88"></aniProgress>
		<paragraph :text="'Form'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<view class="dm-icons flex-center">
			<view class="item" v-for="btn in btnTypes" :key="btn">
				<button type="primary" size="default" :open-type="btn" :app-parameter="{}" @getphonenumber="getphonenumber" @getuserinfo="getuserinfo"><text>{{btn}}</text></button>
			</view>
		</view>
		<view class="uni-list">
			<checkbox-group @change="ckChange">
				<label class="uni-list-cell uni-list-cell-pd">
					<checkbox value="aa" checked="true" color="#007AFF" style="transform:scale(0.7)"/><text>AA</text>
				</label>
				<label class="uni-list-cell uni-list-cell-pd">
					<checkbox value="bb" color="#4CD964"/><text>BB</text>
				</label>
			</checkbox-group>
		</view>
		<!-- #ifdef APP-PLUS || MP-WEIXIN -->
		<view class="container">
			<editor id="ueditor" placeholder="placeholder" @ready="editorReady" show-img-size="true" show-img-toolbar="true" show-img-resize="true"></editor>
			<button type="warn" @tap="clearEditor">清空</button>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<textarea auto-height placeholder-style="color:#F76260" placeholder="textarea"/>
		<!-- #endif -->
		<input type="text" value="" />
		<view class="uni-form-item uni-column">
			<view class="title">label用for标识表单组件</view>
			<radio-group class="uni-list" @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in radioItems" :key="index">
					<view>
						<radio :id="item.name" :value="item.name" :checked="item.checked"></radio>
					</view>
					<view>
						<label class="label-2-text" :for="item.name">
							<text>{{item.value}}</text>
						</label>
					</view>
				</label>
			</radio-group>
		</view>
		<picker mode="time" value="time" start="00:00" end="18:00" @change="bindTimeChange">
			<view>{{time}}</view>
		</picker>
		<picker @change="bindPickerChange" :value="index" :range="btnTypes">
			<view class="uni-input">{{btnTypes[index]}}</view>
		</picker>
		<pkView></pkView>
		<paragraph :text="'Slider'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<slider @change="sliderChange" @changing="sliderChanging" :value="slideVal"/>
		<paragraph :text="'Switch'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<switch checked="true" type="switch" @change="switchChange" />
		<switch checked="false" type="checkbox" @change="switchChange" />
		<paragraph :text="'Navigator'" :size="'38'" :weight="'600'" :newLine="true"></paragraph>
		<navigator url="/pages/home/home" animation-type="fade-in" animation-duration="800">Home</navigator>
		<navigator url="/pages/home/home">Home2</navigator>
		<navigator open-type="navigateBack" animation-type="zoom-out">后退</navigator>
		<navigator open-type="navigateBack" :delta="1" animation-type="zoom-fade-out">后退</navigator>
		<navigator open-type="navigateBack" :delta="2" animation-type="slide-in-top">后退2</navigator>
		<media></media>
	</view>
</template>

<script>
	import paragraph from '@/components/paragraph'
	import aniProgress from '@/components/aniProgress'
	import pkView from './pkView.vue'
	import media from './media.vue'
	export default {
		components: {
			paragraph,
			aniProgress,
			pkView,
			media
		},
		data() {
			return {
				commonSize: 28,
				iconTypes: [],
				btnTypes: ['feedback', 'share', 'getUserInfo', 'contact', 'getPhoneNumber', 'launchApp', 'openSetting'],
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
				}],
				radioItems: [{
						name: 'USA',
						value: '美国'
					},
					{
						name: 'CHN',
						value: '中国',
						checked: 'true'
					}
				],
				time: '10:21',
				index: 0,
				slideVal: 9
			}
		},
		methods: {
			getphonenumber(a, b) {
				console.log('phone', a, b);
			},
			getuserinfo(a, b) {
				console.log('userinfo', a, b);
			},
			ckChange(val) {
				console.log('checkbox', val);
			},
			editorReady() {
				// 闭包？
				const _that = this
				uni.createSelectorQuery().select('#ueditor').context(function(res){
					_that.editorCtx = res.context
				}).exec()
			},
			clearEditor() {
				this.editorCtx.undo()
			},
			radioChange(e) {
				console.log(e);
			},
			bindTimeChange: function(e) {
				this.time = e.target.value
				// 没有双向绑定
			},
			bindPickerChange(e) {
				this.index = e.target.value
			},
			sliderChange(e) {
				this.slideVal = e.detail.value
			},
			sliderChanging(e) {
				this.slideVal = e.detail.value
			},
			switchChange(e) {
				console.log(e);
			}
		},
		onLoad() {
			// #ifdef APP-PLUS || APP-PLUS-NVUE || H5 || MP-WEIXIN
			this.iconTypes = ['success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear']
			// #endif
			console.log('work');
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
