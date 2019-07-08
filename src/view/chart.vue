<template>
	<div class="chart-box">
		<div>
			<div class="money">
				<span class="icon">
					<Icon type="logo-yen" style="font-size: 35px;"  />
				</span>
				<p class="num">
					累积收入: {{ charts.allActualMoney }} 元
				</p>
			</div>

			<div class="active money">
				<span class="icon">
					<Icon type="ios-settings" style="font-size: 35px;" />
				</span>
				<div class="active-list">
					<p class="all">投票活动总数: {{ charts.allActivity }}</p>
					<span>
						未开始: {{ charts.waitingActivity }}
					</span>
					<span>
						进行中:{{ charts.startingActivity }}
					</span>
					<span>
						已结束:{{ charts.endActivity }}
					</span>
				</div>
			</div>
		</div>

		<div class="charts-start" style="margin-top: 20px;background: #fff;padding: 10px;">
			<p style="font-size: 24px;font-weight: 600;">最近30天交易额数据</p>
			<div id="charts" style="height: 300px;"></div>
			<ul>
				<li>总实际收入: {{ charts.allActualMoney }}</li>
				<li>总投票数: {{ charts.allVote }}</li>
				<li>充值钻石总数: {{ charts.allDiamond }}</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { queryStatistics } from '@/api'
export default {
  data () {
    return {
      charts: {},
      myChart: null
    }
  },
  mounted () {
    this.myChart = this.$echarts.init(document.getElementById('charts'))
    queryStatistics().then(res => {
      this.charts = res.data
      this.drawLine(res.data.timeList)
    })
  },

  methods: {
    drawLine (option) {
      this.myChart.setOption({
        legend: {
          data: ['最近三十天交易额数据', 'sad']
        },
        xAxis: {
          type: 'category',
          name: '日期',
          data: (option || []).map(item => item.time)
        },
        yAxis: {
          type: 'value',
          name: '金额'
        },
        series: [{
          data: (option || []).map(item => item.thisDayActualMoney),
          type: 'line'
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.charts-start {
	ul {
		display: flex;
    justify-content: space-around;
		li {
			list-style: none;
			vertical-align: top;
			height: 40px;
			background: #1a4c33;
			line-height: 20px;
			padding: 10px;
			color: #fff;
			font-weight: 600;
			border-radius: 5px;
		}
	}
}
.active.money {
	margin-left: 50px;
	.icon {
		background: #12f394;
	}
	.active-list {
		display: inline-block;
		background: #fff;
		height: 60px;
		vertical-align: top;
		width: 450px;
		padding: 10px;
		line-height: 40px;
		position: relative;
		.all {
			position: absolute;
			top: 5px;
			left: 5px;
			height: 20px;
  line-height: 20px;
		}
		span {
			color: #427ff2;
			cursor: pointer;
			margin: 10px 40px 0;
			display: inline-block;
		}
	}
}
.money {
	display: inline-block;
	.icon {
		display: inline-block;
    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #f39c12;
    color: #fff;
	}
}
.num {
	display: inline-block;
	background: #fff;
	height: 60px;
	vertical-align: top;
	width: 250px;
	padding: 10px;
	line-height: 40px;
}
</style>
