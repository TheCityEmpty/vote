<template>
  <div class="signUp-box">
    <BreadcrumbBox title="报名管理"></BreadcrumbBox>
    <div class="box_wrap btns" style="margin-bottom: 20px;">
      <Button type="primary" :to="{ path: '/addSignUp' }">自定义添加报名人</Button>
      <Button type="primary">批量删除</Button>
      <Button type="primary">批量上传</Button>
      <Button type="primary">导出</Button>
      <Upload
        multiple
        action="/app/zipUpLoad">
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
      </Upload>
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
  </div>
</template>

<script>
import './signUp.scss'
import TableList from '@_com/tableList'
import { getSignUpUse, deleteSignUpUser, updateSignUpUser } from '@/api'
import { Button, InputNumber } from 'iview'
import { timeStampToDate } from '@/libs/tools.js'
export default {
  name: 'signUp',
  components: {
    TableList
  },
  data () {
    return {
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
          minWidth: 50
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
              <Button size="small">链接</Button>
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
      virtualTicket: ''
    }
  },

  created () {
    this.getSignUpUse(this.cpage)
  },

  methods: {

    radioChange (status, row) {
      let params = {
        activityId: row.activityId,
        name: row.name,
        phone: row.phone,
        virtualTicket: row.virtualTicket,
        address: row.address,
        content: row.content,
        img: JSON.parse(row.img),
        checkStatus: status
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
        activityId: row.activityId,
        name: row.name,
        phone: row.phone,
        virtualTicket: this.virtualTicket,
        address: row.address,
        content: row.content,
        img: JSON.parse(row.img)
      }
      updateSignUpUser({
        ...params,
        id: row.id
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
        query: { id: id }
      })
    },
    updatePage (cpage) {
      this.getSignUpUse(cpage)
    },
    getSignUpUse (cpage, p) {
      getSignUpUse({
        length: 10,
        page: cpage,
        ...p
      }).then(res => {
        this.tableData = (res.list || []).map(item => {
          return {
            ...item,
            ...item.signUpUser
          }
        })
        this.pageParams = {
          count: res.totalRows,
          rows: 10
        }
      })
    }
  }
}
</script>
