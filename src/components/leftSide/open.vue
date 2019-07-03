<template>
	<Sider
      hide-trigger
      width="auto"
      :collapsed-width="68">
      <Menu theme="dark" width="auto" :class="menuitemClasses">
        <template v-for="(item, index) in menus">
          <div v-if="!item.children" :key="index">
            <MenuItem :name="index" :to="item.to">
              <Icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </MenuItem>
          </div>
          <Submenu :name="index" :key="index" v-else>
            <template slot="title">
              <Icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <template>
              <MenuItem
                :name="`${index}-${childIndex}`"
                v-for="(childItem, childIndex) in item.children"
                :key="childIndex"
                :to="item.to">
                <Icon :type="childItem.icon" />
                <span>{{ childItem.title }}</span>
              </MenuItem>
            </template>
          </Submenu>
        </template>
      </Menu>
    </Sider>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    menus: {
      type: Array,
      default () {
        return []
      }
    }
  },

  computed: {
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  data () {
    return {

    }
  }
}
</script>
