<template>
  <div>
    <div class="addComment clearfix">
      <div class="headPic">
        <img :src="avatar || defaultHeadPic" alt="headPic" @error="headPicError">
      </div>
      <div class="text">
        <el-input v-model="addCommentText" maxlength="300" @focus="arrColor = true" @blur="arrColor = false" placeholder="期待您的评论" type="textarea" :autosize="{ minRows: 3}" resize="none"></el-input>
        <div class="btn">
          <span class="wordLength">{{addCommentText.trim().length}}/300</span>
          <el-button type="primary" size="mini" @click="addComment">发表评论</el-button>
        </div>
        <div class="arr">
          <span :class="{arrline: true, arrColor: arrColor}">◆</span>
          <span class="arrclr">◆</span>
        </div>
      </div>
    </div>
    <!--  -->
    <need-login ref="nlog" :loginRouteName='loginRouteName'></need-login>
  </div>
</template>

<script>
import { insertComment } from '@/api/comment'
import { insertCommentTool } from '@/api/tools'
import { JSONToFormData } from '@/utils/filters'
const defaultHeadPic = '../../../static/image/defaultHeadPic.jpg'
export default {
  components: {
    needLogin: () => import('./needLogin.vue')
  },
  props: {
    categoryId: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      default: ''
    },
    categoryUrl: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    userId: {
      type: String
    },
    avatar: { // 头像
      type: String,
      default: defaultHeadPic
    },
    needLogin: { // 需要登录才可以发表评论和回复
      type: Boolean,
      default: false
    },
    loginRouteName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      addCommentText: '',
      arrColor: false,
      defaultHeadPic
    }
  },
  methods: {
    addComment () {
      if (this.needLogin && !this.userId) {
        this.$refs.nlog.dialogVisible = true
        return
      }
      if (!this.addCommentText.trim()) {
        this.$message.warning('请输入评论')
        return
      }
      const params = {
        /* category: this.category,
        categoryId: this.categoryId,
        categoryName: this.categoryName,
        categoryUrl: this.categoryUrl,
        content: this.addCommentText,
        recommend: 0,
        userId: this.userId,
        verify: 0 */
        content: this.addCommentText,
        rid: this.categoryId,
        // 工具用
        appid: this.categoryId,
        uid: this.userId
      }
      this.insertComment(JSONToFormData(params)).then(res => {
        if (res.data.code === 200) {
          this.$message.success('评论成功')
          this.addCommentText = ''
          this.$emit('commentSuccess', true)
        } else {
          this.$message.warning('评论失败')
          this.$emit('commentSuccess', false)
        }
      })
    },
    insertComment (params) { // 发表评论或者回复
      if (this.category === 'tool') {
        return new Promise((resolve, reject) => {
          insertCommentTool(params).then(res => {
            resolve(res)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          insertComment(params).then(res => {
            resolve(res)
          })
        })
      }
    },
    headPicError (e) {
      e.target.src = this.defaultHeadPic
    }
  }
}
</script>

<style scoped lang="scss">
.addComment {
  .headPic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .text {
    position: relative;
    float: left;
    margin-left: 20px;
    width: calc(100% - 70px);
    .btn {
      text-align: right;
      margin-top: 5px;
      .wordLength {
        font-size: 14px;
        vertical-align: text-top;
      }
    }
    .arr {
      position: absolute;
      left: -7px;
      top: 10px;
      span {
        display: block;
        font-family: "SimSun";
        font-size: 15px;
        font-style: normal;
        font-weight: normal;
        height: 10px;
        line-height: normal;
      }
      .arrline {
        color: #dcdfe6;
        transition: color .2s cubic-bezier(.645,.045,.355,1);
      }
      .arrclr {
        margin: -10px 0 0 2px;
        color: #fff;
      }
    }
  }
}
.clearfix::after, .clearfix::before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    visibility: hidden;
    clear: both;
  }
  .arrColor {
    color: #409EFF!important;
  }
</style>
