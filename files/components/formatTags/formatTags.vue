<template>
<div class="tags-f-box">
  <el-tag v-for="item in tagsShow" :key="item.label" type="primary" effect="plain" style="margin-right:10px" @click="clickTag(item)"
  :closable="item.type!=='more'&&userId!=''" @close="handleClose(item.label)">{{ item.label }}</el-tag>
  <el-dialog :visible.sync="moreShow" width="600px">
    <div class="tags-box"><el-tag v-for="item in tags" :key="item" type="primary" effect="plain" style="margin-right:10px"
    :closable="userId!=''" @close="handleClose(item)">{{ item }}</el-tag></div>
  </el-dialog>
</div>
</template>

<script>
// import mapGetters from 'vuex'
import { JSONToFormData } from '@/utils/filters'
import { deleteTags } from '@/api/resource'
export default {
  data () {
    return {
      tagsShow: [],
      moreShow: false
    }
  },
  watch: {
    emitLength: {
      handler (val) {
        if (val) {
          this.formatTags()
        }
      }
    },
    tags: {
      immediate: true,
      handler (val) {
        if (val && val.length) {
          this.formatTags()
        }
      }
    }
  },
  // props: ['emitLength', 'tags'],
  /* computed: {
    ...mapGetters(['userID'])
  }, */
  props: {
    emitLength: {
      type: Number,
      default: 500
    },
    tags: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* tags: {
      type: String,
      default: ''
    }, */
    fontSize: {
      type: Number,
      default: 12
    },
    userId: {
      type: String,
      default: ''
    },
    rid: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose (tag) {
      this.$confirm('是否确认删除标签：“' + tag + '”？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$emit('deleteTag', tag.label)
        deleteTags(this.rid, JSONToFormData({
          tag: tag
        })).then(res => {
          this.dataLoading = false
          if (res.data.code === 200) {
            this.$message.success('标签删除成功')
            this.tags.splice(this.tags.indexOf(tag), 1)
            this.formatTags()
            this.$emit('nowTag', this.tags.concat(','), this.rid)
            /* this.tagsShow.splice(this.tagsShow.indexOf({
              label: tag,
              type: 'tag'
            }), 1) */
          } else {
            this.$message.error(res.data.msg || '标签删除失败')
          }
        })
      })
    },
    clickTag (tag) {
      if (tag.type === 'more') {
        this.moreShow = true
      }
    },
    formatTags () {
      // const val1 = val.split(',')
      this.tagsShow = []
      let totalLen = 0
      // 计算像素
      this.tags.forEach((v, i) => {
        // 长度 X 字数 + margin + tags组件的padding（20）
        totalLen += (((v + '').length + (this.userId ? 2 : 0)) * this.fontSize + 30)
        // 减去更多占用的长度
        if (totalLen < this.emitLength - 20 - 2 * this.fontSize) {
          this.tagsShow.push({
            label: v,
            type: 'tag'
          })
        }
      })
      if (this.tagsShow.length !== this.tags.length) {
        this.tagsShow.push({
          label: '更多',
          type: 'more'
        })
      }
      console.log(this.tagsShow)
    }
  },
  mounted () {
    console.log('tag', this.emitLength)
  }
}
</script>
<style lang='scss' scoped>
.tags-f-box {
  display: inline;
}
.tags-box {
  white-space: normal;
}
</style>
