<template>
	<div class="pay-box">
		<BreadcrumbBox title="订单管理"></BreadcrumbBox>
    <div class="box_wrap" style="margin-bottom: 20px;">
      <p class="lxh-title-2">时间范围：</p>
      <DatePicker v-model="dates" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      <Button type="primary" style="margin-left: 30px;" @click="search">搜索</Button>
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
import './pay.scss'
import TableList from '@_com/tableList'
import { getAllActivity, selectOrderCase } from '@/api'
import { timeStampToDate, dateToTimeStamp } from '@/libs/tools.js'
import { Button } from 'iview'
export default {
  name: 'signUp',
  components: {
    TableList
  },
  data () {
    return {
      dates: '',
      activityId: '',
      activitys: [],
      tableColumns: [
        {
          title: '订单号',
          key: 'orderNum',
          minWidth: 200
        },
        {
          title: '订单金额',
          key: 'orderMoney',
          minWidth: 200,
          render: (h, param) => {
            return (<span style="color:#ed4014;font-weight: 600;">{ param.row.orderMoney }</span>)
          }
        },
        {
          title: '充值产品',
          key: 'topUpType',
          minWidth: 200,
          render: (h, param) => {
            return (<span>{ Number(param.row.topUpType) === 0 ? '充值钻石' : '' }</span>)
          }

        },
        {
          title: '支付时间',
          key: 'time',
          minWidth: 200,
          render: (h, param) => {
            return (<div>
              { timeStampToDate(param.row.time) }
            </div>)
          }
        },
        {
          title: '支付人微信名称',
          key: 'memberName',
          minWidth: 200
        },
        {
          title: '状态',
          key: 'orderStatus',
          minWidth: 200,
          render: (h, param) => {
            let status = Number(param.row.orderStatus) === 0
            let statusDOM = status
              ? (<Button size="small" type="success">已支付</Button>)
              : (<Button size="small" type="error">未支付</Button>)
            return (<div>
              { statusDOM }
            </div>)
          }
        }
      ],
      tableData: [],
      pageParams: {},
      isLoading: false,
      cpage: 1
    }
  },

  created () {
    this.queryOrderList(this.cpage)
  },

  methods: {
    search () {
      let d = this.dates
      let p = {
        startTime: dateToTimeStamp(d[0]),
        endTime: dateToTimeStamp(d[1])
      }
      this.queryOrderList(this.cpage, p)
      console.log(p)
    },
    updatePage (cpage) {
      this.queryOrderList(cpage)
    },
    queryOrderList (cpage, p = {}) {
      this.isLoading = true
      selectOrderCase({
        length: 30,
        page: cpage,
        ...p
      }).then(res => {
        this.tableData = res.data.list || []
        this.pageParams = {
          count: res.data.totalRows,
          rows: 30
        }
      }).finally(() => { this.isLoading = false })
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
    }
  }
}
</script>
