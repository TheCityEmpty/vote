<template>
	<div class="vote-box">
		<BreadcrumbBox title="投票管理"></BreadcrumbBox>
    <div class="box_wrap btns" style="margin-bottom: 20px;">
      <!-- <Button type="primary" @click="exportVote">导出所有</Button> -->
      <!-- <Button type="primary">批量删除</Button> -->
      <p class="lxh-title-2">活动标题：</p>
      <Select v-model="activityId" style="width:400px;margin: 30px 0;">
        <Option v-for="item in activitys" :label="item.name" :value="item.id" :key="item.id">
          <div>
            <img class="img-avtor" :src="item.img" />
            <span class="active-name" :title="item.name">{{ item.name }}</span>
          </div>
        </Option>
      </Select>
      <br />
      <p class="lxh-title-2">时间范围：</p>
      <DatePicker type="daterange" v-model="voteTime" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      <Button type="primary" style="margin-left: 30px;" @click="selectVoteCase">搜索</Button>
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
import './vote.scss'
import axios from 'axios'
import TableList from '@_com/tableList'
import { queryVoteList, getAllActivity, selectVoteCase } from '@/api'
import { timeStampToDate, dateToTimeStamp } from '@/libs/tools.js'
export default {
  name: 'signUp',
  components: {
    TableList
  },
  data () {
    return {
      voteTime: [],
      activityId: '',
      activitys: [],
      tableColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '活动标题',
          key: 'activityName',
          minWidth: 200
        },
        {
          title: '报名商家名',
          key: 'signUpUserName',
          minWidth: 200
        },
        {
          title: '报名商家电话',
          key: 'signUpUserPhone',
          minWidth: 100
        },
        {
          title: '投票时间',
          key: 'time',
          minWidth: 200,
          render: (h, param) => {
            return (<div>
              { timeStampToDate(param.row.time) }
            </div>)
          }
        },
        {
          title: '投票人微信名称',
          key: 'memberName',
          minWidth: 100
        },
        {
          title: '投票类型',
          key: 'ticketType',
          minWidth: 100,
          render: (h, param) => {
            return (<div>
              { Number(param.row.ticketType === 0) ? '每日票' : '钻石' }
            </div>)
          }
        },
        {
          title: '投票数量',
          key: 'sum',
          minWidth: 100
        }
      ],
      tableData: [],
      pageParams: {},
      isLoading: false,
      cpage: 1
    }
  },

  created () {
    this.queryVoteList(this.cpage)
    this.getAllActivityName()
  },

  methods: {

    selectVoteCase () {
      let p = {
        activityId: this.activityId,
        voteStartTime: dateToTimeStamp(this.voteTime[0]),
        voteEndTime: dateToTimeStamp(this.voteTime[1])
      }
      console.log(p)
      selectVoteCase({
        ...p,
        length: 10,
        page: this.cpage
      }).then(res => {
        this.tableData = res.data.list
        this.pageParams = {
          count: res.data.totalRows,
          rows: 10
        }
      })
    },

    exportVote () {
      let formData = new FormData()
      let token = localStorage.getItem('token')
      formData.append('token', token)
      axios.post('http://www.luoxuehui.com/app/exportVote', formData, {
        timeout: 10000 * 60,
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
            img: JSON.parse(item.img || '[]')[0],
            name: item.name,
            id: item.id
          }
        })
      })
    },
    queryVoteList (cpage) {
      queryVoteList({
        length: 10,
        page: cpage
      }).then(res => {
        this.tableData = res.data.list
        this.pageParams = {
          count: res.data.totalRows,
          rows: 10
        }
      })
    },
    updatePage (cpage) {
      this.cpage = cpage
      this.queryVoteList(cpage)
    }
  }
}
</script>
