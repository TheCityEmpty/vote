<template>
  <div class="login">
    <Form :model="AccountForm" :rules="rules" ref="loginFrom" class="fromStyle">
      <div class="from-title">
        <span class="logo-text" >投票管理系统</span>
      </div>
      <FormItem prop="employeeId" class="inputBox">
        <span class="label"><Icon type="md-person" style="font-size: 25px;" /></span>
        <Input type="text" size="large" v-model="AccountForm.userName" placeholder="员工号"></Input>
      </FormItem >
      <FormItem  prop="password" class="inputBox">
        <span class="label"><Icon type="md-lock" style="font-size: 25px;" /></span>
        <Input type="password" size="large" v-model="AccountForm.password" placeholder="密码"></Input>
      </FormItem >
      <FormItem class="btn-box-login">
				<Icon type="ios-loading" class="btn-login-icon" v-if="logining" />
        <Button type="primary" @click="submitForm('loginFrom')" class="btn" :disabled="logining">登录</Button>
      </FormItem >
    </Form >
  </div>
</template>

<script>
import { login } from '@/api'
import './login.scss'
import md5 from 'js-md5'
export default {
  data () {
    return {
      logining: false,
      AccountForm: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      }
    }
  },

  methods: {
    submitForm (formName) {
      if (this.logining) {
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let self = this
          this.logining = true
          let md5PWD = md5(this.AccountForm.password)
          login({
            userName: this.AccountForm.userName,
            password: md5PWD
          }).then(res => {
            let token = res.data.user.token
            localStorage.setItem('token', token)
            localStorage.setItem('username', this.AccountForm.userName)
            this.$Message.success({
              content: '登录成功',
              onClose () {
                self.$router.push({
                  path: '/activity'
                })
                this.logining = false
              }
            })
          }).catch((e) => {
            this.logining = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
