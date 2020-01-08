<template>
  <div class="comment">
    <div class="comment-header">
      <div class="title">
        <h3>评论</h3>
        <span class="total">共{{total}}条评论</span>
      </div>
      <!-- 评论 -> 文章 -->
      <add-comment @commentSuccess='commentSuccess' :avatar='avatar' :needLogin='needLogin' :loginRouteName='loginRouteName' :categoryId='categoryId' :category='category' :userId='userId' :categoryUrl='categoryUrl' :categoryName='categoryName'></add-comment>
    </div>
    <!-- 评论列表 -->
    <div class="comment-body">
      <div class="title">
        <span :class="allCommentClass" @click="allComment">评论列表</span> / <span :class="myCommentClass" @click="myComment">我的评论</span>
      </div>
      <div class="content">
        <!-- 一个评论单元 -->
        <div class="cell" v-if="commentList.length" v-for="(item, index) in commentList" :key="index">
          <div class="left1">
            <div class="left"><img :src="item.icon || defaultHeadPic" alt="headPic" @error="headPicError"></div>
            <p class="comment-author">{{item.uname | userNameFilter}}</p>
          </div>
          <div class="right">
            <!-- <p class="comment-author">{{item.userName | userNameFilter}}</p> -->
            <p class="comment-detail">{{item.content}}</p>
            <!-- 这条评论对应的回复 -->
            <div class="comment-reply" v-if="item.child && item.child.length && canApply">
              <div class="reply-cell" v-for="(v, i) in item.child" :key="i">
                <span class="reply-author">{{v.userName | userNameFilter}}<span v-if="v.replyUserId || v.replyUserId == ''"> 回复 {{v.replyUserId == '' ? '游客' : v.replyUserName}}</span>：</span>
                <span>{{v.content}}</span>
                <p class="reply-time">
                  <span class="time">{{v.updateTime | timeFilte}}</span>
                  <span class="delete" v-if="v.userId == userId" @click="del(v.id, 'Inner')">删除</span>
                  <span class="zan" @click="supportReply(v)">赞<svg-icon :iconClass="'zan'"></svg-icon> ({{v.ups}})</span>
                  <span class="reply" @click="openReplyToReply(v, i)">回复<svg-icon :iconClass="'reply'"></svg-icon></span>
                </p>
                <!-- 回复 -> 回复 -->
                <div class="replyToReply" v-if="v.replyToReplyShow">
                  <el-input v-model="addReplyText" placeholder="" type="textarea" maxlength="300" :autosize="{ minRows: 3}" resize="none"></el-input>
                  <div class="btn">
                    <span class="wordLength">{{addReplyText.trim().length}}/300</span>
                    <el-button type="primary" size="mini" @click="replyToReply(v)">回复</el-button>
                    <el-button size="mini" @click="() => { v.replyToReplyShow = false }">取消</el-button>
                  </div>
                </div>
              </div>
              <div class="arr">
                <span class="arrline">◆</span>
                <span class="arrclr">◆</span>
              </div>
              <div class="loadmore-reply">
                <p v-if="loadingReply"><i class="el-icon-loading"></i><span> 加载中...</span></p>
                <el-button type="text" v-if="!loadingReply && item.reply > item.child.length" @click="loadmoreReply(item, index)">加载更多<i class="el-icon-arrow-down"></i></el-button>
              </div>
            </div>
            <p class="comment-footer">
              <span class="time">{{item.createAt | timeFilte}}</span>
              <span class="delete" v-if="item.uid == userId" @click="del(item.id, '')">删除</span>
              <span class="zan" @click="supportComment(item)" v-if="canApply">赞<svg-icon :iconClass="'zan'"></svg-icon> ({{item.ups}})</span>
              <span class="reply" @click="openReplyInput(item)" v-if="canApply">回复<svg-icon :iconClass="'reply'"></svg-icon></span>
            </p>
            <!-- 回复 -> 评论 -->
            <div class="reply-content" v-if="item.replyInputShow && canApply">
              <el-input v-model="addReplyText" maxlength="300" placeholder="" type="textarea" :autosize="{ minRows: 3}" resize="none"></el-input>
              <div class="btn">
                <span class="wordLength">{{addReplyText.trim().length}}/300</span>
                <el-button type="primary" size="mini" @click="replyToComment(item)">回复</el-button>
                <el-button size="mini" @click="() => { item.replyInputShow = false }">取消</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="noComment" v-if="!commentList.length">暂无评论</div>
      </div>
      <div class="loadmore" v-if="commentList.length && loadMode == 'more'">
        <p v-if="loading"><i class="el-icon-loading"></i><span> 加载中...</span></p>
        <el-button type="text" v-if="!loading && commentList.length < total" @click="loadmore">加载更多<i class="el-icon-arrow-down"></i></el-button>
        <p v-if="commentList.length == total">已经到底了</p>
      </div>
      <div class="loadmore" v-if="commentList.length && loadMode == 'page'">
        <el-pagination
          small
          layout="prev, pager, next"
          @current-change="searchResource"
          :current-page="pageParams.pageCurrent"
          :page-size="10"
          :total="total"
          style="display: inline;"
        ></el-pagination>
      </div>
    </div>
    <!--  -->
    <need-login ref="nlog" :loginRouteName='loginRouteName'></need-login>
  </div>
</template>

<script>
/**
 * 此组件为评论组件, 可评论, 也可回复, 可对回复进行回复, 数据结构依然是两层, 但是处理的时候会有三层
 * 评论 - 文章      回复 - 评论      回复 - 回复
 * 样式仿照网易云音乐
 * commenthandle 事件是行为记录
 */
import { fetchCommentPage, likes, insertComment, deleteComment } from '@/api/comment'
import { deleteToolComment, fetchToolCommentPage } from '@/api/tools'
const defaultHeadPic = '../../../static/image/defaultHeadPic.jpg'
export default {
  props: {
    categoryId: { // 评论对象ID，例如文档ID
      type: String,
      required: true
    },
    category: { // 评论对象类别，例如视频(video)、文档（doc）
      type: String,
      required: true,
      default: ''
    },
    categoryUrl: { // 评论对象URL，例如文档URL
      type: String,
      required: true
    },
    categoryName: { // 评论对象名称，例如文档名称
      type: String,
      required: true
    },
    userId: { // 用户id
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
    loginRouteName: { // 项目登录页面的路由name
      type: String,
      required: true
    }
  },
  components: {
    addComment: () => import('./addComment.vue'),
    needLogin: () => import('./needLogin.vue'),
    svgIcon: () => import('@/components/SvgIcon')
  },
  data () {
    return {
      loadMode: 'page', // 'more'加载模式，分页或更多
      canApply: false, // 是否可以对评论进行评论回复或点赞
      arrColor: false, // 文本框获得焦点的时候小三角的样式
      addCommentText: '',
      addReplyText: '',
      commentList: [],
      total: 0,
      defaultHeadPic: defaultHeadPic,
      loading: false,
      loadingReply: false,
      allCommentClass: ['allComment', 'active'],
      myCommentClass: ['myComment'],
      initReplyNmuber: 5,
      pageParams: {
        categoryId: this.categoryId,
        category: this.category,
        pageCurrent: 1,
        pageSize: 5,
        userId: ''
      }
    }
  },
  mounted () {
    this.getComment()
  },
  methods: {
    allComment () {
      this.allCommentClass = ['allComment', 'active']
      this.myCommentClass = ['myComment']
      this.pageParams.userId = ''
      this.getComment()
    },
    myComment () {
      this.myCommentClass = ['myComment', 'active']
      this.allCommentClass = ['allComment']
      this.pageParams.userId = this.userId
      this.getComment()
    },
    getComment () {
      // this.pageParams
      return this.fetchCommentPage({rid: this.categoryId,
        appid: this.categoryId,
        pageNum: this.pageParams.pageCurrent}).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          const result = res.data.result || {
            total: 0,
            appraises: []
          }
          result.appraises.forEach(el => {
            el.replyInputShow = false
            el.initReplyNmuber = 5
            if (el.child && el.child.length > 0) {
              el.child.forEach(ele => {
                ele.replyToReplyShow = false
              })
            }
          })
          this.commentList = result.appraises
          this.total = result.total
          this.$emit('commenthandle', { type: 'initNum', status: 'success', totalNum: result.total })
        }
      })
    },
    openReplyInput (item) {
      if (!this.loginIntercept()) {
        return
      }
      this.commentList.forEach(el => {
        el.replyInputShow = false
        if (el.child && el.child.length > 0) {
          el.child.forEach(ele => {
            ele.replyToReplyShow = false
          })
        }
      })
      item.replyInputShow = !item.replyInputShow
    },
    replyToComment (item) { // 回复评论
      if (!this.addReplyText.trim()) {
        this.$message.warning('请输入回复内容')
        return
      }
      const params = {
        category: this.category,
        categoryId: this.categoryId,
        categoryName: this.categoryName,
        categoryUrl: this.categoryUrl,
        content: this.addReplyText,
        parentId: item.id,
        recommend: 0,
        userId: this.userId,
        verify: 0
      }
      this.addReply(params).then(() => {
        this.getComment()
        this.addReplyText = ''
        item.replyInputShow = false
      })
    },
    openReplyToReply (v) {
      if (!this.loginIntercept()) {
        return
      }
      this.commentList.forEach(el => {
        el.replyInputShow = false
        if (el.child && el.child.length > 0) {
          el.child.forEach(ele => {
            ele.replyToReplyShow = false
          })
        }
      })
      v.replyToReplyShow = true
    },
    replyToReply (v, i) { // 回复回复
      console.log(v)
      if (!this.addReplyText.trim()) {
        this.$message.warning('请输入回复内容')
        return
      }
      const params = {
        /* category: this.category,
        categoryId: this.categoryId,
        categoryName: this.categoryName,
        categoryUrl: this.categoryUrl,
        content: this.addReplyText,
        parentId: v.parentId,
        replyUserId: v.userId,
        recommend: 0,
        userId: this.userId,
        verify: 0 */
        content: this.addReplyText,
        rid: this.categoryId,
        uid: this.userId
      }
      this.addReply(params).then(() => {
        this.getComment()
        this.addReplyText = ''
        v.replyInputShow = false
      })
    },
    commentSuccess (value) {
      if (value) {
        this.getComment()
        this.$emit('commenthandle', { type: 'comment', status: 'success' })
        return
      }
      this.$emit('commenthandle', { type: 'comment', status: 'fail' })
    },
    addReply (params) {
      return this.insertComment(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success('回复成功')
          this.$emit('commenthandle', { type: 'reply', status: 'success' })
        } else {
          this.$message.warning('回复失败')
          this.$emit('commenthandle', { type: 'reply', status: 'fail' })
        }
      })
    },
    supportComment (item) {
      if (!this.loginIntercept()) {
        return
      }
      this.likes({ commentId: item.id, userId: this.userId }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          item.ups++ // 这里我就不刷新列表了
          this.$emit('commenthandle', { type: 'likes', status: 'success' })
        } else {
          this.$message.warning(res.data.msg)
          this.$emit('commenthandle', { type: 'likes', status: 'fail' })
        }
      })
    },
    supportReply (v) {
      if (!this.loginIntercept()) {
        return
      }
      this.likes({ commentId: v.id, userId: this.userId }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          v.ups++ // 这里我就不刷新列表了
          this.$emit('commenthandle', { type: 'likes', status: 'success' })
        } else {
          this.$message.warning(res.data.msg)
          this.$emit('commenthandle', { type: 'likes', status: 'fail' })
        }
      })
    },
    del (id, lev) { // 删除评论或者回复
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteComment(id).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            this.getComment()
            this.$emit('commenthandle', { type: 'delete' + lev, status: 'success' })
          } else {
            this.$message.warning('删除失败')
            this.$emit('commenthandle', { type: 'delete' + lev, status: 'fail' })
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    loginIntercept () { // 拦截
      if (this.needLogin && !this.userId) {
        this.$refs.nlog.dialogVisible = true
        return false
      }
      return true
    },
    searchResource (page) {
      this.pageParams.pageCurrent = page
      this.getComment()
    },
    loadmore () {
      this.loading = true
      this.pageParams.pageSize += 5
      this.getComment().then(() => {
        this.loading = false
      })
    },
    loadmoreReply (item, index) {
      this.loadingReply = true
      console.log(item)
      item.initReplyNmuber += 5
      const params = {
        /* categoryId: this.categoryId,
        category: this.category,
        pageCurrent: 1,
        pageSize: item.initReplyNmuber,
        parentId: item.id */
        rid: this.categoryId,
        appid: this.categoryId,
        pageNum: 1
      }
      this.fetchCommentPage(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.commentList[index].child = res.data.result.list
          this.loadingReply = false
        }
      })
    },
    hide () {

    },
    headPicError (e) {
      e.target.src = this.defaultHeadPic
    },
    /* axios---------- */
    fetchCommentPage (params) {
      return new Promise((resolve, reject) => {
        if (this.category === 'tool') {
          fetchToolCommentPage(params).then(res => {
            resolve(res)
          })
        } else {
          fetchCommentPage(params).then(res => {
            resolve(res)
          })
        }
      })
    },
    likes (params) { // 点赞
      return new Promise((resolve, reject) => {
        likes(params).then(res => {
          resolve(res)
        })
      })
    },
    insertComment (params) { // 发表评论或者回复
      return new Promise((resolve, reject) => {
        insertComment(params).then(res => {
          resolve(res)
        })
      })
    },
    deleteComment (params) { // 删除评论或者回复
      if (this.category === 'tool') {
        return new Promise((resolve, reject) => {
          deleteToolComment(params).then(res => {
            resolve(res)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          deleteComment(params).then(res => {
            resolve(res)
          })
        })
      }
    }
  },
  filters: {
    userNameFilter (value) {
      return value || '游客'
    },
    timeFilte (time) {
      // time = +time * 1000
      const d = new Date(time)
      const now = Date.now()

      const diff = (now - d) / 1000

      if (diff < 30) {
        return '刚刚'
      } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
      } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
      } else if (diff < 3600 * 24 * 2) {
        return '1天前'
      }
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
  }
}
</script>

<style scoped lang="scss">
p, h3 { margin: 0; }
.comment {
  /* max-width: 960px; */
  margin: 0 auto;
  line-height: normal;
  .comment-header {
    .title {
      height: 40px;
      line-height: 40px;
      margin-bottom: 20px;
      border-bottom: 2px solid #c20c0c;
      h3 { float: left; }
      .total {
        /* padding: 0 0 0 20px; */
        float: right;
        font-size: 14px;
        color: #999;
      }
    }
    .addComment {
      .headPic {
        width: 50px;
        height: 50px;
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
  }
  .comment-body {
    .title {
      border-bottom: 1px solid #ccc;
      font-size: 14px;
      .allComment {
        cursor: pointer;
      }
      .myComment {
        cursor: pointer;
      }
      .active {
        color: red;
        font-size: 16px;
      }
    }
    .content {
      .noComment {
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        margin-top: 40px;
        color: darkgray;
      }
      .cell {
        position: relative;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
        &:hover .right .comment-footer .delete{ // 这里的匹配规则是必须要写全所有的层级关系的
          display: inline-block;
        }
        display: inline-flex;
        width: 100%;
        .left1 {
          padding: 5px;
          background: #fcfcfc;
          .left {
            width: 50px;
            height: 50px;
            /* position: absolute;
            left: 0;top: 15px; */
            border-radius: 50%;
            overflow: hidden;
            img {
              width: 100%;
              /* 加上height的话上传的不是正方形会变形，可优化 */
              height: 100%;
            }
          }
          .comment-author {
            color: #0c73c2;
            width: 50px;
            font-size: 12px;
            display: inline-block;
          }
        }
        .right {
          margin-left: 10px;
          width: 100%;
          .comment-author {
            color: #0c73c2;
          }
          .comment-detail {
            font-size: 14px;
            color: #333;
            word-break: break-all;
            text-align: left;
            min-height: 45px;
          }
          .comment-reply {
            border: 1px solid #ccc;
            background-color: #f5f5f5;
            padding: 8px 19px;
            margin-top: 10px;
            font-size: 14px;
            position: relative;
            &:hover .reply-cell .reply-time .delete{
              display: inline-block;
            }
            .reply-cell {
              padding-bottom: 10px;
              .reply-author {
                color: #0c73c2;
              }
              .replyToReply {
                .btn {
                  text-align: right;
                  margin-top: 10px;
                }
              }
              .reply-time {
                text-align: right;
                font-size: 12px;
                margin-top: 3px;
                .delete {
                  cursor: pointer;
                  display: none;
                  &:hover {
                    color: #c20c0c;
                  }
                }
                .time {
                  /* float: left; */
                  color: #999;
                }
                .zan {
                  margin: 0 10px;
                  &:hover {
                    color: #0c73c2;
                    cursor: pointer;
                  }
                }
                .reply {
                  cursor: pointer;
                }
              }
            }
            .arr {
              position: absolute;
              left: 17px;
              top: -9px;
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
                color: #cdcdcd;
              }
              .arrclr {
                margin: -9px 0 0 0px;
                color: #f5f5f5;
              }
            }
          }
          .comment-footer {
            text-align: right;
            margin-top: 10px;
            font-size: 14px;
            .delete {
              cursor: pointer;
              display: none;
              &:hover {
                color: #c20c0c;
              }
            }
            .time {
              float: left;
              color: #999;
              font-size: 12px;
            }
            .zan {
              margin-left: 10px;
              &:hover {
                color: #0c73c2;
                cursor: pointer;
              }
            }
            .reply {
              margin-left: 10px;
              &:hover {
                color: #0c73c2;
                cursor: pointer;
              }
            }
          }
          .reply-content {
            margin-top: 10px;
            .btn {
              text-align: right;
              margin-top: 5px;
              .wordLength {
                font-size: 14px;
                vertical-align: text-top;
              }
            }
          }
        }
      }
    }
  }
  .loadmore {
    text-align: center;
    /* line-height: 40px; */
    font-size: 14px;
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
}
</style>
