<template>
  <div class="carousel-box el-carousel el-carousel--horizontal">
    <!-- <el-carousel class="carousel-style">
      <el-carousel-item v-for="(item, index) in resInfo.pictures.split(',')" :key="index">
        <img style="height:300px" :src="item">
        <img style="height:300px" :src="item">
      </el-carousel-item>
    </el-carousel> -->
    <div class="el-carousel__container">
      <button type="button" :class="'el-carousel__arrow el-carousel__arrow--left '+(showingIndex==0?'go-disabled':'')" @click="goPrevPic">
        <i :class="'el-icon-arrow-left '+(showingIndex==0?'go-disabled':'')"></i>
      </button>
      <div class="carousel-style">
        <div class="album-box">
          <div class="album-container" :style="getBoxStyle">
            <div v-for="(item, index) in pictures" :key="index" :style="getPicStyle(index)" class="slide-pic" @click="changeShow(index)"></div>
          </div>
        </div>
      </div>
      <button type="button" :class="'el-carousel__arrow el-carousel__arrow--right '+(showingIndex==pictures.length-1?'go-disabled':'')" @click="goNextPic">
        <i :class="'el-icon-arrow-right '+(showingIndex==pictures.length-1?'go-disabled':'')"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showingIndex: undefined,
      // 暂定index最高是100
      // topIndex: 100,
      getBoxStyle: 'transform: translate3d(0px, 0px, 0px);'
    }
  },
  props: ['pictures', 'boxW'],
  watch: {
    showingIndex: {
      deep: true,
      immediate: true,
      handler (val) {
        // this.getBoxStyle = 'transform: translate3d(' + ((this.pictures.length / 2 - val) * 330 - 120 * this.pictures.length) + 'px, 0px, 0px);'
        this.getBoxStyle = 'transform: translate3d(' + (val * -320 * 1200 / this.boxW + 350 * (this.pictures.length - val) / this.pictures.length) * this.boxW / 1200 + 'px, 0px, 0px);'
      }
    },
    pictures: {
      deep: true,
      immediate: true,
      handler (val) {
        document.querySelector('.album-box').style.perspective = this.boxW + 'px'
        // this.showingIndex = Math.floor(this.pictures.length / 2)默认第一张
        this.showingIndex = 0
      }
    }
  },
  methods: {
    goPrevPic () {
      if (this.showingIndex !== 0) this.showingIndex--
    },
    goNextPic () {
      if (this.showingIndex !== this.pictures.length - 1) this.showingIndex++
    },
    getPicStyle (index) {
      return 'background-image:url(' + this.pictures[index] + ');transition-duration: 300ms;z-index:' +
      (100 / (Math.abs(this.showingIndex - index) + 1)) + ';transform:translate3d(' +
      // ((this.showingIndex - index) * 100) + 'px,0px,' + (-600 * Math.abs(this.showingIndex - index)) + 'px) rotateX(0deg) rotateY(' +
      (this.showingIndex > index ? Math.pow(0.6, Math.ceil(this.showingIndex - index)) * 100
        : (this.showingIndex === index ? '0' : -Math.pow(0.6, Math.ceil(index - this.showingIndex))) * 100) + '%,0px,' +
      (-400 * Math.abs(this.showingIndex - index)) + 'px) rotateX(0deg) rotateY(' +
      // (50 * (this.showingIndex - index)) + 'deg)'
      (20 * (this.showingIndex - index)) + 'deg);' +
      (this.showingIndex === index ? 'border: 1px solid #7b16ff;' : '')
    },
    changeShow (index) {
      /* if (index > this.pictures.length / 2) {
        const slidPic = []
        for (var i = 0; i < (index > this.pictures.length / 2); i++) {
          slidPic.push(this.pictures[i])
        }
        this.pictures = this.pictures.slice((index > this.pictures.length / 2)).concat(slidPic)
      } else {
        const slidPic = []
        for (var j = this.pictures.length; j > (this.pictures.length / 2 + index); j--) {
          slidPic.push(this.pictures[j])
        }
        this.pictures = this.pictures.slice((index > this.pictures.length / 2)).concat(slidPic)
      }
      this.showingIndex = Math.floor(this.pictures.length / 2) */
      console.log(index)
      console.log(this.pictures.length)
      this.showingIndex = index
      // this.getBoxStyle = 'transform: translate3d(' + ((this.pictures.length / 2 - this.showingIndex - 2) * 360) + 'px, 0px, 0px);'
    }
  },
  mounted () {
    // 默认显示中间的
  }
}
</script>
<style lang='scss' scoped>
$perspectiveW: ();
.carousel-box {
  height: 450px;
  padding: 15px 20px;
  border-top: 1px solid #d6d6d6;
  border-bottom: 1px solid #d6d6d6;
  background-color: #fff;
  .carousel-style {
    background-color: #fff;
  }
}
.album-box {
  /* cursor: grab; */
  width: 100%;
  perspective: 1200px;
  position: relative;
      margin-left: auto;
    margin-right: auto;
  .album-container {
    transition-duration: 300ms;
        transform-style: preserve-3d;
            /* transform: translate3d(0,0,0); */
                position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
        display: flex;
        transition-property: transform;
            box-sizing: content-box;
  }
}
.slide-pic {
  background-position: center;
  /* background-size: cover; */
      background-size: contain;
    background-repeat: no-repeat;
  width: 400px;
  height: 400px;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
}
.go-disabled {
  cursor: not-allowed !important;
}
</style>
