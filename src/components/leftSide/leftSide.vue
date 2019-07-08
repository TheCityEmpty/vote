<template>
  <div :class="sideClasses" :style="isCollapsed ? '' : 'overflow: hidden;'">
    <slot></slot>
    <div class="leftSide-scroll" v-show="!isCollapsed">
      <Open :menus="menus"></Open>
    </div>
    <div :class="triggerClasses" v-if="hasCustomTrigger" @click="toggle">
      <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 18 18" style="vertical-align: middle;">
        <g>
          <path
            :transform="isCollapsed ? 'matrix(-1 0 0 1 18 0)' : 'matrix(1 0 0 1 0 0)'"
            d="m4.79707031 9 4.66523438-5.96074219c.07207031-.09140625.00703125-.22675781-.11074219-.22675781h-1.35878906c-.08613282 0-.16875.04042969-.22148438.10722656l-4.48769531 5.73398438c-.15996094.20390625-.15996094.49042969 0 .69433593l4.48769531 5.73222653c.05273438.0685547.13535156.1072266.22148438.1072266h1.35878906c.11777344 0 .1828125-.1353516.11074219-.2267578zm5.34374999 0 4.6652344-5.96074219c.0720703-.09140625.0070312-.22675781-.1107422-.22675781h-1.3587891c-.0861328 0-.16875.04042969-.2214843.10722656l-4.48769535 5.73398438c-.15996094.20390625-.15996094.49042969 0 .69433593l4.48769535 5.73222653c.0527343.0685547.1353515.1072266.2214843.1072266h1.3587891c.1177734 0 .1828125-.1353516.1107422-.2267578z">
          </path>
        </g>
      </svg>
      <span class="text">收起</span>
    </div>
  </div>
</template>

<script>
import './leftSide.scss'

import Open from './open.vue'
import Packup from './packup.vue'
import mixin from './mixin'

export default {
  name: 'left-side',
  mixins: [mixin],
  components: {
    Open,
    Packup
  },
  props: {
    'has-custom-trigger': {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      menus: [
        {
          title: '概况',
          icon: 'ios-stats',
          to: '/chart'
        },
        {
          title: '活动管理',
          icon: 'md-beer',
          to: '/activity'
        },
        {
          title: '自主报名管理',
          icon: 'ios-people',
          to: '/signUp'
        },
        {
          title: '投票管理',
          icon: 'md-thumbs-up',
          to: '/vote'
        },
        {
          title: '订单管理',
          icon: 'md-paper',
          to: '/pay'
        }
      ]
    }
  },

  computed: {
    sideClasses () {
      return [
        'left-side',
        this.isCollapsed ? 'collapsed-side' : ''
      ]
    },
    triggerClasses () {
      return [
        'custom-trigger',
        this.isCollapsed ? 'collapsed-trigger' : ''
      ]
    }
  },

  methods: {
    toggle () {
      this.setSideStatus(!this.isCollapsed)
    }
  }
}
</script>
