<template>
  <div class="home">
    <Header>
      <Icon type="md-pulse" class="logo-icon" />
      <span class="text">投票管理系统 Vote System</span>
    </Header>
    <LeftSide :has-custom-trigger="false">
      <div :class="logoClasses">
        <div class="user-logo">
          <img src="@_img/default-avatar.png" />
          <div class="btns">
            <Button class="button" type="success" size="small" @click="logoout">退出系统</Button>
            <Button class="button" type="success" size="small" @click="modalVal = true">修改密码</Button>
          </div>
        </div>
        <p class="user-name">Admin</p>
      </div>
    </LeftSide>
    <div class="content">
      <Loading v-if="$store.state.globalLoading"></Loading>
      <router-view class="container" :style="{ paddingLeft: isCollapsed ? '80px': '200px'}" />
    </div>
    <Modal
        title="修改密码"
        v-model="modalVal"
        @on-ok="updatePWD"
        :mask-closable="false">
        <div class="modalContent">
          <span>用户名:</span>
          <Input :value="username" disabled style="width: 200px;display: block;margin: 10px" />
          <span>老密码:</span>
          <Input v-model="oldPassword" placeholder="输入你之前的密码..." style="width: 200px;display: block;margin: 10px" />
          <span>新密码:</span>
          <Input v-model="newPassword" placeholder="输入你要修改的密码..." style="width: 200px;display: block;margin: 10px" />
        </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LeftSide from '@_com/leftSide/leftSide.vue'
import Header from '@_com/header/header.vue'
import { logout, updatePwd } from '@/api'

export default {
  name: 'App',
  components: {
    LeftSide,
    Header
  },
  data () {
    return {
      username: '',
      oldPassword: '',
      newPassword: '',
      modalVal: false
    }
  },
  computed: {
    ...mapState({
      isCollapsed: state => state.sideStatus
    }),
    logoClasses () {
      return [
        'user-box',
        this.isCollapsed ? 'collapsed-logo' : ''
      ]
    }
  },

  created () {
    this.username = window.localStorage.getItem('username')
  },

  methods: {
    logoout () {
      let token = localStorage.getItem('token')
      this.$Message.loading({
        content: '退出登陆中!',
        duration: 0
      })
      logout({
        token: token
      }).then(res => {
        this.$Message.destroy()
        this.$router.push({
          path: '/login'
        })
      })
    },
    updatePWD () {
      let token = localStorage.getItem('token')
      updatePwd({
        newPassword: this.newPassword,
        oldPassword: this.oldPassword,
        token: token
      })
    }
  }
}
</script>
<style scoped lang='scss'>
  .home {
    height: 100%;
    .container {
      transition: padding-left ease 0.4s;
      padding-left: 200px;
      padding-top: 85px;
      padding-bottom: 25px;
      padding-right: 10px;
    }
    .content {
      position: relative;
    }
  }
</style>
