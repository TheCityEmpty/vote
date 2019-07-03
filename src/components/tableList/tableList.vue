<template>
	<div class="tableList">
		<div class="table-content">
      <Loading v-if="isLoading"></Loading>
			<Table
        width="100%"
        :columns="tableColumns"
        :disabled-hover="disabledHover"
        :data="tableData"
        :tooltip-theme="tooltipTheme"
        v-bind="$attrs"
        v-on="$listeners"
      ></Table>
		</div>
		<div class="table-page" v-if="pageSize">
      <Page
        class="pages"
        prev-text="上一页"
        next-text="下一页"
        :total="pageParams.count"
        :page-size="pageParams.rows"
        :current.sync="currentPage"
        @on-change="pagesChange"
      ></Page>
      <div class="page-total">共 <span>{{ pageParams.count || 0 }}</span> 条</div>
      <div class="page-goto">
        跳至
        <input type="text" v-model="pages" class="page-input" />
        <button class="gotoBtn" @click="gotoPage">
          <Icon type="ios-send" />
        </button>
      </div>
		</div>
	</div>
</template>

<script>

import './tableList.scss'
import { clearArrNull } from '@/libs/tools.js'
export default {
  inheritAttrs: false,
  /**
   * @description props 属性参数, 不是props 中的属性或没定义的on 函数，会通过$attrs，$listeners传进来，
   * 直接在父组件中添加iview 中的api 就可以
   * @param {Array} tableData 表格数据，对列中对应属性为空 自动添加 为空需显示字符
   * @param {Array} tableColumns 表格列配置 自动添加 tooltip ,不需要请在父组件配置 tooltip:false
   * @description tableColumns 多了一个 status 属性 ，（对每一行进行 唯一控制）
   * status: {
            objKey: 'switchLoading', 属性名
            val: false 值
          },
   * @param {String} columnNoDataText 列为空需显示字符，默认为 '--'
   * @param {Object} pageParams 分页参数
   * @param {String} tooltipTheme tooltip 主题 ，默认白色
   * @param {Boolean} disabledHover 禁用hover 效果， 默认禁用
   */
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    tableColumns: {
      type: Array,
      default () {
        return []
      }
    },
    pageParams: {
      type: Object,
      default () {
        return {
          count: 0,
          rows: 0
        }
      }
    },
    'column-no-data-text': {
      type: String,
      default () {
        return '--'
      }
    },
    'tooltip-theme': {
      type: String,
      default () {
        return 'light'
      }
    },
    'disabled-hover': {
      type: Boolean,
      default () {
        return false
      }
    },
    appNames: {
      type: String,
      default () {
        return ''
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      currentKey: [],
      currentPage: 1,
      pages: null
    }
  },

  computed: {
    pageSize () {
      return Math.ceil(this.pageParams.count / this.pageParams.rows)
    },
    isNeedStatus () {
      let _arr = []
      this.tableColumns.forEach(item => {
        // 为需要唯一状态的 列加一个属性对加载
        if (item.hasOwnProperty('status')) {
          _arr.push(item.status)
        }
      })
      return _arr
    }
  },

  watch: {
    tableData: {
      handler (newVal) {
        if (newVal && newVal.length !== 0) {
          this.tableData.forEach(item => {
            if (this.isNeedStatus.length) {
              this.isNeedStatus.forEach(status => {
                item[status.objKey] = status.val
              })
            }
            for (let key in item) {
              // 对空值 附一个 默认值
              if (this.currentKey.indexOf(key) !== -1 && !item[key] && String(item[key]).trim() !== '0') {
                item[key] = this.columnNoDataText
              }
            }
          })
        }
      },
      immediate: true,
      deep: true
    },
    tableColumns: {
      handler (newVal) {
        this.currentKey = clearArrNull(newVal.map(item => item.key))
        // this.tableColumns.forEach(item => {
        //   // 统一加上 tooltip
        //   if (item.key && !item.hasOwnProperty('tooltip') && !item.hasOwnProperty('ellipsis')) {
        //     item.tooltip = true
        //   }
        // })
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    gotoPage () {
      if (this.pages < 1 || this.pages > this.pageSize || isNaN(this.pages)) {
        this.$Message.warning('请输入合理页码')
        this.pages = null
        return
      }
      this.currentPage = Number(this.pages)
      this.$emit('updatePage', this.currentPage)
    },
    pagesChange (page) {
      this.$emit('updatePage', page)
    }
  }
}
</script>
