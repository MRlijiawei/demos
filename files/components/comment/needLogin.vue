<template>
  <div>
    <el-dialog
      title="登录提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <p class="dialog">您必须要登录之后才可以进行评论相关操作<span class="go-login" @click="gologin">去登陆</span></p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    loginRouteName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    gologin () {
      this.$router.push({ name: this.loginRouteName })
    },
    handleClose (done) {
      done()
    }
  }
}
</script>

<style scoped lang="scss">
.dialog {
  min-height: 50px;
}
.go-login {
  color: red;
  cursor: pointer;
  margin-left: 10px;
}
</style>
