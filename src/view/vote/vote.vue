<template>
	<div class="vote-box">
		<BreadcrumbBox title="投票管理"></BreadcrumbBox>
    <div class="box_wrap btns" style="margin-bottom: 20px;">
      <Button type="primary">导出</Button>
      <Button type="primary">批量删除</Button>
      <Select v-model="activityName" style="width:400px">
        <span slot="prefix">活动名称</span>
        <Option v-for="item in activitys" :value="item.id" :key="item.id">{{ item.name }}</Option>
    </Select>
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
import TableList from '@_com/tableList'
import { queryVoteList, getAllActivity } from '@/api'
export default {
  name: 'signUp',
  components: {
    TableList
  },
  data () {
    return {
      activityName: '',
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
          minWidth: 200
        },
        {
          title: '投票时间',
          key: 'time',
          minWidth: 200
        },
        {
          title: '投票人微信名称',
          key: 'memberName',
          minWidth: 200
        },
        {
          title: '操作',
          width: 70,
          fixed: 'right',
          render: (h, param) => {
            return (<Button size="small" onClick={ () => { this.deleteVoteRecord(param.row.id) } }>删除</Button>)
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
    this.queryVoteList(this.cpage)
    this.getAllActivityName()
  },

  methods: {
    getAllActivityName () {
      getAllActivity({
        length: 100,
        page: 1
      }).then(res => {
        let tableData = (res.list || []).map(item => {
          return {
            ...item,
            ...item.activity
          }
        })
        this.activitys = tableData.map(item => {
          return {
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
        this.pageParams = {
          count: res.totalRows,
          rows: 10
        }
      })
    },
    updatePage () {

    },
    deleteVoteRecord () {

    }
  }
}
</script>
