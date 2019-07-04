<template>
  <div class="article-box">
    <BreadcrumbBox title="活动管理"></BreadcrumbBox>
    <div class="box_wrap" style="margin-bottom: 20px;">
      <Button type="primary" :to="{ path: '/release' }">发布活动</Button>
      <RadioGroup v-model="activityStatus" @on-change="radioGroupChange" type="button" style="margin: 0 20px;">
        <Radio label="">所有</Radio>
        <Radio :label="0">未开始</Radio>
        <Radio :label="1">进行中</Radio>
        <Radio :label="2">已结束</Radio>
      </RadioGroup>
      <div class="searchBox" style="width: 400px;display: inline-block;vertical-align: top;">
        <Input v-model="name" search enter-button="搜索" placeholder="输入关键字" @on-search="search">
          <span slot="prepend">标题</span>
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
                  http://www.luoxuehui.com
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
import './activity.scss'
import TableList from '@_com/tableList'
import { Button, Input, Tooltip } from 'iview'
import { getAllActivity, deleteActivity, updateActivity } from '@/api'
import { timeStampToDate } from '@/libs/tools.js'
import QRCode from 'qrcodejs2'
export default {
  name: 'activity',
  components: {
    TableList
  },
  data () {
    return {
      modalVal: false,
      tableColumns: [
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
          title: '标题',
          key: 'name',
          minWidth: 300,
          render: (h, param) => {
            // true 为 开启   false 为 关闭
            let status = Number(param.row.activityType) === 1
            let statusDOM = status
              ? (<Button size="small" type="success" onClick={ () => { this.statusChange(status, param.row) } }>开启</Button>)
              : (<Button size="small" type="error" onClick={ () => { this.statusChange(status, param.row) } }>关闭</Button>)
            return (<div>
              <p>{ param.row.name }</p>
              <div>
                <span style="font-size: 12px;">报名人数： { param.row.signUpSum }</span>
                <span style="margin-left: 10px;font-size: 12px;">状态：
                  <Tooltip max-width={ 200 } content="此状态代表是否可以在微信页面展示！并不代表报名状态和送礼物状态！">
                    { statusDOM }
                  </Tooltip>
                </span>
              </div>
            </div>)
          }
        },
        {
          title: '报名数量',
          key: 'voteSum',
          minWidth: 100
        },
        {
          title: '活动时间',
          key: 'activityTime',
          minWidth: 210,
          render: (h, param) => {
            return (<div style={ param.row.activityType === 1 ? 'background:#A3E4D7;padding: 3px;' : 'background:#F5B7B1;padding: 3px;' }>
              <p>开始:{ timeStampToDate(param.row.activityStartTime) }</p>
              <p>结束:{ timeStampToDate(param.row.activityEndTime) }</p>
            </div>)
          }
        },
        {
          title: '投票时间',
          key: 'voteTime',
          minWidth: 210,
          render: (h, param) => {
            return (<div>
              <p>开始:{ timeStampToDate(param.row.voteStartTime) }</p>
              <p>结束:{ timeStampToDate(param.row.voteEndTime) }</p>
            </div>)
          }
        },
        {
          title: '钻石数',
          key: 'diamonds',
          minWidth: 100
        },
        {
          title: '实票数',
          key: 'realTicket',
          minWidth: 100
        },
        {
          title: '备注',
          key: 'note',
          minWidth: 150,
          render: (h, param) => {
            return (<div>
              <Input
                onOn-change={ (event) => { this.remarkValChange(event) } }
                size="small"
                style="width: 70px;"
                value = { param.row.note }></Input>
              <Button
                onClick={ () => { this.remarkChange(param.row) } }
                size="small"
                type="primary"
                style="margin-left: 3px;">改</Button>
            </div>)
          }
        },
        {
          title: '操作',
          width: 250,
          fixed: 'right',
          render: (h, param) => {
            return (<div class="btns">
              <Button size="small" onClick={ () => { this.editActivity(param.row.id) } }>编辑</Button>
              <Button size="small" onClick={ () => { this.deleteActivity(param.row.id) } }>删除</Button>
              <Button size="small" onClick={ () => { this.mackqrcode(param.row.name) } }>链接</Button>
              <Button size="small" onClick={ () => { this.cloneActivity(param.row.id) } }>复制</Button>
              <Button size="small" onClick={ () => { this.gotoSignUp(param.row) } }>报名</Button>
              <Button size="small">投票</Button>
            </div>)
          }
        }
      ],
      tableData: [],
      pageParams: {},
      isLoading: false,
      activityStatus: '',
      name: '',
      cpage: 1,
      qrcode: '',
      modalName: ''
    }
  },

  mounted () {
    this.getActivity(this.cpage)
    this.initqrcode()
  },

  methods: {

    gotoSignUp (row) {
      this.$router.push({
        path: '/signUp',
        query: { id: row.id, name: row.name }
      })
    },

    initqrcode () {
      this.qrcode = new QRCode('qrcode', {
        width: 132,
        height: 132,
        text: '', // 需要二维码跳转的地址
        colorDark: '#000000', // 前景色
        colorLight: '#ffffff' // 背景色
      })
    },

    mackqrcode (name) {
      this.modalVal = true
      this.modalName = name
      this.qrcode.makeCode('http://www.luoxuehui.com/vote')
    },

    search () {
      this.getActivity(this.cpage)
    },

    radioGroupChange () {
      this.getActivity(this.cpage)
    },

    statusChange (status, row) {
      let params = {
        id: row.id,
        activityType: status ? 0 : 1,
        giftStatus: row.giftStatus,
        signUpStatus: row.signUpStatus,
        name: row.name,
        note: row.note,
        content: row.content,
        imgs: JSON.parse(row.img),
        notice: row.notice,
        activityStartTime: row.activityStartTime,
        activityEndTime: row.activityEndTime,
        voteStartTime: row.voteStartTime,
        voteEndTime: row.voteStartTime,
        adImg: JSON.parse(row.adImg),
        model: row.model,
        rule: row.rule,
        prize: row.prize
      }
      updateActivity(params).then(res => {
        this.$Message.info('状态修改成功!')
        this.getActivity(this.cpage)
      })
    },

    remarkValChange (event) {
      this.remarkVal = event.target.value
    },

    remarkChange (row) {
      let params = {
        id: row.id,
        activityType: row.activityType,
        giftStatus: row.giftStatus,
        signUpStatus: row.signUpStatus,
        name: row.name,
        note: this.remarkVal,
        content: row.content,
        imgs: JSON.parse(row.img),
        notice: row.notice,
        activityStartTime: row.activityStartTime,
        activityEndTime: row.activityEndTime,
        voteStartTime: row.voteStartTime,
        voteEndTime: row.voteStartTime,
        adImg: JSON.parse(row.adImg),
        model: row.model,
        rule: row.rule,
        prize: row.prize
      }
      updateActivity(params).then(res => {
        this.$Message.info('状态备注成功!')
        this.getActivity(this.cpage)
      })
    },
    // 复制活动
    cloneActivity (id) {
      this.$router.push({
        path: '/release',
        query: { id: id, type: 1 }
      })
    },
    // 编辑活动
    editActivity (id) {
      this.$router.push({
        path: '/release',
        query: { id: id, type: 2 }
      })
    },

    deleteActivity (id) {
      this.$Modal.confirm({
        content: '是否删除该活动， 删除后无法恢复，请谨慎操作？',
        onOk: () => {
          deleteActivity({ id: id }).then(res => {
            this.$Message.info('删除活动成功！')
            this.getActivity(this.cpage)
          })
        }
      })
    },

    updatePage (cpage) {
      this.getActivity(cpage)
    },

    getActivity (cpage) {
      this.isLoading = true
      getAllActivity({
        length: 10,
        page: cpage,
        activityStatus: this.activityStatus,
        name: this.name
      }).then(res => {
        this.tableData = (res.list || []).map(item => {
          return {
            ...item,
            ...item.activity
          }
        })
        this.pageParams = {
          count: res.totalRows,
          rows: 10
        }
      }).finally(() => { this.isLoading = false })
    }

  }
}
</script>
