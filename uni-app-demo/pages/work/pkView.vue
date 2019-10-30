<template>
	<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange" :style="indicatorStyle">
		<picker-view-column>
			<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
		</picker-view-column>
		<picker-view-column>
			<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
		</picker-view-column>
		<picker-view-column>
			<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
		</picker-view-column>
	</picker-view>
</template>

<script>
	export default {
		methods: {
			bindChange(e) {
				console.log(e);
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]
			}
		},
		data() {
			const date = new Date()
			const years = []
			const months = []
			const days = []
			const year = date.getFullYear()
			const month = date.getMonth() + 1
			const day = date.getDate()
			for (let i=1990;i<=year;i++) {
				years.push(i)
			}
			for (let j=1;j<=12;j++) {
				months.push(j)
			}
			for (let m=1;m<=30;m++) {
				days.push(m)
			}
			return {
				years,
				months,
				days,
				year,
				month,
				day,
				value: [999, month-1, day-1],
				// indicatorStyle: `height: ${Math.round(uni.GetSystemInfoSync().screenWidth/7.5)}px`
				indicatorStyle: `height: 50px`
			}
		}
	}
</script>

<style>
</style>
