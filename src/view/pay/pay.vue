<template>
	<div class="pay-box">
		<BreadcrumbBox title="订单管理"></BreadcrumbBox>
    <div class="box_wrap" style="margin-bottom: 20px;">
      <!-- <Button type="primary" :to="{ path: '/addSignUp' }">自定义添加报名人</Button> -->
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
export default {
  name: 'signUp',
  components: {
    TableList
  },
  data () {
    return {
      tableColumns: [
        {
          title: '订单号',
          key: 'orderNum',
          minWidth: 200
        },
        {
          title: '订单金额',
          key: 'orderMoney',
          minWidth: 200
        },
        {
          title: '产品',
          key: 'topUpType',
          minWidth: 200
        },
        {
          title: '支付时间',
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

  methods: {
    updatePage () {

    },
    deleteVoteRecord () {

    }
  }
}
</script>
