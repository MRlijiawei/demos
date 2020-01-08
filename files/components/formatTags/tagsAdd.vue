<template>
<div>
  <el-tag
    v-for="item in tags"
    :key="item"
    type="primary"
    effect="plain"
    style="margin-right:10px"
    closable
    :disable-transitions="false"
    @close="handleClose(item)">{{ item }}</el-tag>
  <el-input
    class="input-new-tag"
    v-if="inputVisible"
    v-model="inputValue"
    ref="saveTagInput1"
    size="small"
    @keyup.enter.native="handleInputConfirm"
    @blur="handleInputConfirm">
  </el-input>
  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
</div>
</template>

<script>
export default {
  data () {
    return {
      tags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  props: {
  // 已存在标签，判重用
    exitTags: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleClose (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput1.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      // 可优化：禁止输入特殊符号
      let inputValue = this.inputValue
      if (inputValue) {
        // 判重
        if (this.tags.indexOf(inputValue) > -1 || this.exitTags.indexOf(inputValue) > -1) {
          this.$message({
            type: 'error',
            message: '该标签已存在'
          })
          return false
        } else {
          if (inputValue.indexOf(',') > -1) {
            this.$message({
              type: 'error',
              message: '标签不能包含“,”'
            })
            return false
          }
          this.tags.push(inputValue)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  },
  mounted () {

  }
}
</script>
<style lang='scss' scoped>
.input-new-tag {
  width: 100px;
}
</style>
