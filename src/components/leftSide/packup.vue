<template>
	<ul class="packup">
		<li v-for="(item, index) in menus" :key="index" class="menu-list">
			<div class="menu-icon" @click="gotoPage(item)">
				<Icon type="ios-water" class="more" v-if="'children' in item" />
				<Icon :type="item.icon" />
				<span class="small-title">{{ item.smallTitle }}</span>
			</div>
			<div class="menu-children-box">
				<ul class="menu-children" v-if="'children' in item">
					<li v-for="(citem, cindex) in item.children" :key="cindex" @click="gotoPage(citem)">
						<Icon :type="citem.icon" />
						<span>{{ citem.title }}</span>
					</li>
				</ul>
			</div>
		</li>
	</ul>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default () {
        return []
      }
    }
  },

  methods: {
    gotoPage (params) {
      if ('children' in params) return
      alert('aa')
    }
  }
}
</script>
