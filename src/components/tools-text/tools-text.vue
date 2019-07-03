<template>
<div class="tool-content" :style="toolStyle">
	<div class="tools-text" :style="toolTestStyle">
		<slot name="text"></slot>
	</div>
	<p class="tools" v-if="isShow">
		<slot name="tools-text"></slot>
	</p>
</div>
</template>
<script>
export default {
  props: {
    inline: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 200
    },
    text: {
      type: String,
      default: ''
    }
  },
  watch: {
    text () {
      this.computedIsHidden()
    }
  },
  computed: {
    toolTestStyle () {
      return `width:${this.width}px;`
    },
    toolStyle () {
      return (this.inline ? 'display: inline-block;' : '') + `vertical-align: bottom;	position: relative;`
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  mounted () {
    this.computedIsHidden()
  },
  methods: {
    computedIsHidden () {
      if (this.width !== 200) {
        this.isShow = this.text.length > 34
      } else {
        this.isShow = this.text.length > 13
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.tool-content {
	.tools-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.tools {
		width: 100%;
		position: absolute;
		color: #666;
		display: none;
		padding: 8px 16px;
		background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
		will-change: top, left;
    bottom: 30px;
		z-index: 998;
		&:after {
			content: '';
			position: absolute;
			z-index: 1;
			width: 0;
			height: 0;
			border-left: 10px solid transparent;
			border-right: 10px solid transparent;
			display: block;
			border-top: 10px solid #fff;
			bottom: -9px;
		}
		&:before {
			content: '';
			position: absolute;
			z-index: 1;
			width: 0;
			height: 0;
			border-left: 10px solid transparent;
			border-right: 10px solid transparent;
			display: block;
			border-top: 10px solid #ddd;
			bottom: -10px;
		}
	}
	&:hover .tools {
		display: block!important;
	}
}
</style>
