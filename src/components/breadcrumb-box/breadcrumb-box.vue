<template>
	<div class="breadcrumb-box">
		<p class="lxh-title">
			{{ title }}
		</p>
     <Breadcrumb style="display: inline-block;">
        <BreadcrumbItem v-for="(item, index) in breadcrumbItem" :key="index" :to="item.to">{{ item.title }}</BreadcrumbItem>
    </Breadcrumb>
	</div>
</template>
<script>
import './breadcrumb-box.scss'
export default {
  props: {
    title: {
      type: String,
      default () {
        return '某某管理'
      }
    },
    breadcrumbItem: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
