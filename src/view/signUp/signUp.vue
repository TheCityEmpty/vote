<template>
  <div class="signUp-box">
    <BreadcrumbBox title="报名管理" :breadcrumbItem="breadcrumbItem"></BreadcrumbBox>
    <Alert v-show="aname">{{ aname }}</Alert>
    <div class="box_wrap btns" style="margin-bottom: 20px;">
      <Button type="primary" :to="{ path: '/addSignUp' }">自定义添加报名人</Button>
      <Button type="primary">批量删除</Button>
      <Button type="primary" @click="exportVote">导出所有</Button>
      <Button type="primary" icon="ios-cloud-upload-outline" @click="openModal">导入数据</Button>
      <div class="searchBox" style="width: 400px;display: inline-block;vertical-align: top;">
        <Input v-model="searchVal" search enter-button="搜索" placeholder="输入关键字" @on-search="search">
          <Select v-model="selectType" slot="prepend" style="width: 80px">
            <Option value="编号">编号</Option>
            <Option value="商家名">商家名</Option>
            <Option value="电话">电话</Option>
        </Select>
        </Input>
      </div>
    </div>
    <div class="box_wrap">
      <div class="tables">
        <TableList
        :isLoading="isLoading"
        :tableColumns="tableColumns"
        :tableData="tableData"
        :pageParams="pageParams"
        @updatePage="updatePage"
        >
        </TableList>
      </div>
    </div>

    <div class="fixed-loading" v-if="uploadinng">
      数据导入中， 请稍等...
    </div>
    <Modal
        title="导入数据"
        footer-hide
        v-model="modalShow"
        :mask-closable="false">
        <div class="modalContent">
          <Alert type="warning" show-icon>
            <p>1.请先选择针对哪个活动导入数据 </p>
            <p>2.图片压缩包必须导入.zip格式 </p>
            <p>3.Excel文本必须导入.xlsx、.xls格式，</p>
            <p>4.可导入多个图片压缩包，但，只能导入一个且仅可导入一个Excel文件</p>
            <p>5.点击导入数据后， 最后点击提交导入数据才可成功导入数据</p>
          </Alert>
          <Select v-model="activityId" style="width:400px;margin: 30px 0;">
              <Option v-for="item in activitys" :label="item.name" :value="item.id" :key="item.id">
                <div>
                  <img class="img-avtor" :src="item.img" />
                  <span class="active-name" :title="item.name">{{ item.name }}</span>
                </div>
              </Option>
          </Select>
          <Upload
            v-show="activityId"
            style="display: inline-block;"
            :before-upload="beforeUpload"
            multiple
            action="/app/zipUpLoad">
            <Button type="primary" icon="ios-cloud-upload-outline">导入数据</Button>
          </Upload>
          <p style="display: block;margin: 20px 0;" v-for="(item, index) in files" :key="index">{{ item.name }}</p>
          <Button v-show="activityId" type="primary" style="display: block;margin: 20px 0;" @click="upload">提交导入数据</Button>
        </div>
    </Modal>

    <!-- Modal -->
    <Modal
        title="链接"
        v-model="modalVal"
        :mask-closable="false">
        <div class="modalContent">
           <Alert type="success">
              “{{ modalName }}” 的访问链接和二维码（微信扫描进入）
              <template slot="desc">
                <p style="color:#ed4014;font-size: 16px;font-weight: 600;padding-left: 20px;">
                  {{ link }}
                </p>
              </template>
          </Alert>
          <div style="width: 200px;height: 200px;">
            <div id="qrcode" ref="qrcode"></div>
          </div>
        </div>
    </Modal>
  </div>
</template>

<script>
import './signUp.scss'
import axios from 'axios'
import TableList from '@_com/tableList'
import { getAllActivity, getSignUpUse, deleteSignUpUser, updateSignUpUser, getActivitySignUp } from '@/api'
import { Button, InputNumber } from 'iview'
import { timeStampToDate } from '@/libs/tools.js'
import QRCode from 'qrcodejs2'
export default {
  name: 'signUp',
  components: {
    TableList
  },
  data () {
    return {
      modalName: '',
      link: '',
      modalVal: false,
      activityId: '',
      activitys: [],
      uploadinng: false,
      breadcrumbItem: [],
      selectType: '编号',
      tableColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '投票号',
          key: 'num',
          minWidth: 80
        },
        {
          title: '图片',
          key: 'img',
          minWidth: 100,
          render: (h, param) => {
            let imgs = JSON.parse(param.row.img)
            return (<div style="padding: 5px;">
              <img src={ imgs[0] } style="width: 100px;height: 100px;" />
            </div>)
          }
        },
        {
          title: '报名人',
          key: 'userName',
          minWidth: 100
        },
        {
          title: '票数',
          key: 'virtualTicket',
          minWidth: 170,
          render: (h, param) => {
            return (<div>
              <p>{ param.row.virtualTicket }</p>
              <InputNumber
                active-change={ false }
                value= { null }
                min={ param.row.virtualTicket }
                onOn-change={ (val) => { this.virtualTicketValChange(val) } }
                size="small"
                style="width: 70px;"></InputNumber>
              <Button
                onClick={ () => { this.virtualTicketChange(param.row) } }
                size="small"
                type="primary"
                style="margin-left: 3px;">改</Button>
              <p style="font-size: 12px;color:rgb(230, 71, 55);">修改票数只能小于当前票数</p>
            </div>)
          }
        },
        {
          title: '实票数',
          key: 'realTicket',
          minWidth: 100
        },
        {
          title: '审核状态',
          key: 'checkStatus',
          minWidth: 100,
          render: (h, param) => {
            // 0 未审核 1 拒绝  2 已审核
            let status = Number(param.row.checkStatus)
            let statusDOM = (<RadioGroup
              class="oneRadio"
              value={ status }
              onOn-change={ (status) => { this.radioChange(status, param.row) } }>
              <Radio label={ 0 }>已审核</Radio>
              <Radio label={ 1 }>拒绝</Radio>
              <Radio label={ 2 }>未审核</Radio>
            </RadioGroup>)
            return (<div>{ statusDOM }</div>)
          }
        },
        {
          title: '报名时间',
          key: 'createTime',
          minWidth: 150,
          render: (h, param) => {
            return (<span>{ timeStampToDate(param.row.createTime) }</span>)
          }
        },
        {
          title: '操作',
          width: 150,
          fixed: 'right',
          render: (h, param) => {
            return (<div class="btns">
              <Button size="small" onClick={ () => { this.editSignUp(param.row.id) } }>编辑</Button>
              <Button size="small" onClick={ () => { this.deleteSignUp(param.row.id) } }>删除</Button>
              <Button size="small" onClick={ () => { this.mackqrcode(param.row) } }>链接</Button>
            </div>)
          }
        }
      ],
      tableData: [],
      pageParams: {},
      isLoading: false,
      // buttonSize: 'default',
      // searchVal: '',
      cpage: 1,
      searchVal: '',
      virtualTicket: '',
      aname: '',
      modalShow: false,
      files: [],
      qrcode: null
    }
  },

  beforeRouteUpdate (to, from, next) {
    let id = to.query.id
    this.aname = to.query.name
    this.routerInit(id)
    next()
  },

  created () {
    let id = this.$route.query.id
    this.aname = this.$route.query.name
    this.routerInit(id)
  },
  mounted () {
    this.initqrcode()
  },

  methods: {

    initqrcode () {
      this.qrcode = new QRCode('qrcode', {
        width: 132,
        height: 132,
        text: '', // 需要二维码跳转的地址
        colorDark: '#000000', // 前景色
        colorLight: '#ffffff' // 背景色
      })
    },

    mackqrcode (row) {
      // http://www.luoxuehui.com/m1Index?id=1145697717582823424
      this.modalVal = true
      this.modalName = row.name
      this.qrcode.makeCode(`http://www.luoxuehui.com/info1?id=${row.activity}&uid=${row.id}`)
      this.link = `http://www.luoxuehui.com/info1?id=${row.activity}&uid=${row.id}`
    },

    exportVote () {
      let formData = new FormData()
      let token = localStorage.getItem('token')
      formData.append('token', token)
      axios.post('http://www.luoxuehui.com/app/exportSignUpUser', formData, {
        timeout: 10000,
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (Number(res.data.code) === 2) {
          this.$Message.error('导出数据失败，请重新导出数据！')
        } else {
          const content = res.data
          const blob = new Blob([content])
          const fileName = '导出数据.xlsx'
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        }
      })
    },

    beforeUpload (files) {
      this.files.push(files)
      return false
    },

    upload () {
      let formData = new FormData()
      for (let i = 0, len = this.files.length; i < len; i++) {
        formData.append(`file${i}`, this.files[i])
      }
      formData.append('id', this.activityId)
      this.uploadinng = true
      axios.post('http://www.luoxuehui.com/app/zipUpLoad', formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (Number(res.data.code) === 2) {
          this.uploadinng = false
          this.files = []
          this.$Message.error('导入数据失败，请按提示上传正确文件！')
        } else {
          this.$Message.info('导入数据成功！')
          this.uploadinng = false
          let id = this.$route.query.id
          this.aname = this.$route.query.name
          this.routerInit(id)
          this.modalShow = false
        }
      })
    },

    openModal () {
      this.modalShow = true
      this.getAllActivityName()
    },

    getAllActivityName () {
      getAllActivity({
        length: 100,
        page: 1
      }).then(res => {
        let tableData = (res.data.list || []).map(item => {
          return {
            ...item,
            ...item.activity
          }
        })
        this.activitys = tableData.map(item => {
          return {
            img: JSON.parse(item.img)[0],
            name: item.name,
            id: item.id
          }
        })
      })
    },

    routerInit (id) {
      if (id && this.aname) {
        this.activityId = id
        this.breadcrumbItem = [
          {
            title: '活动管理',
            to: '/activity'
          },
          {
            title: '该活动下的报名人'
          }
        ]
        this.getActivitySignUp(this.cpage, id)
      } else {
        this.activityId = id
        this.breadcrumbItem = []
        this.getSignUpUse(this.cpage)
      }
    },

    getActivitySignUp (cpage, id) {
      // 导入 数据
      getActivitySignUp({
        length: 10,
        page: cpage,
        status: 0,
        activityId: id,
        signType: 1
      }).then(res => {
        this.tableData = (res.data.list || []).map(item => {
          return {
            ...item,
            ...item.signUpUser
          }
        })
        this.pageParams = {
          count: res.data.totalRows,
          rows: 10
        }
      })
    },

    radioChange (status, row) {
      let params = {
        activityId: row.activity,
        name: row.userName,
        phone: row.phone,
        virtualTicket: row.virtualTicket,
        address: row.address,
        content: row.content,
        img: JSON.parse(row.img),
        checkStatus: status,
        signType: this.aname ? 1 : 0

      }
      updateSignUpUser({
        ...params,
        id: row.id
      }).then(res => {
        this.$Message.info(`修改审核状态成功`)
        this.getSignUpUse(this.cpage)
      })
    },

    virtualTicketValChange (val) {
      this.virtualTicket = val
    },

    virtualTicketChange (row) {
      let params = {
        activityId: row.activity,
        name: row.userName,
        phone: row.phone,
        virtualTicket: this.virtualTicket,
        address: row.address,
        content: row.content,
        img: JSON.parse(row.img)
      }
      updateSignUpUser({
        ...params,
        id: row.id,
        signType: this.aname ? 1 : 0
      }).then(res => {
        this.$Message.info(`修改票数成功`)
        this.getSignUpUse(this.cpage)
      })
    },

    search () {
      let p = ''
      switch (this.selectType) {
        case '编号':
          p = { num: this.searchVal }
          break
        case '商家名':
          p = { name: this.searchVal }
          break
        case '电话':
          p = { phone: this.searchVal }
          break
      }
      this.getSignUpUse(this.cpage, p)
    },

    deleteSignUp (id) {
      this.$Modal.confirm({
        content: '是否删除该报名人， 删除后无法恢复，请谨慎操作？',
        onOk: () => {
          deleteSignUpUser({ id: id }).then(res => {
            this.$Message.info('删除报名人成功！')
            this.getSignUpUse(this.cpage)
          })
        }
      })
    },
    editSignUp (id) {
      this.$router.push({
        path: '/addSignUp',
        query: { id: id, signType: this.aname ? 1 : 0 }
      })
    },
    updatePage (cpage) {
      this.getSignUpUse(cpage)
    },
    getSignUpUse (cpage, p) {
      // 自主报名
      getSignUpUse({
        length: 10,
        page: cpage,
        ...p
      }).then(res => {
        this.tableData = (res.data.list || []).map(item => {
          return {
            ...item,
            ...item.signUpUser
          }
        })
        this.pageParams = {
          count: res.data.totalRows,
          rows: 10
        }
      })
    }
  }
}
</script>
