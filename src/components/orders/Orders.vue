<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="140px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openEditAddressDialog"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="openCheckLogisticsDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <edit-address-dialog ref="editAddressDialogRef"></edit-address-dialog>
    <check-logistics-dialog ref="checkLogisticsDialogRef" :logisticsInfo="logisticsInfo"></check-logistics-dialog>
  </div>
</template>

<script>
import EditAddressDialog from './editAddressDialog'
import CheckLogisticsDialog from './checkLogistics'

export default {
  components: { EditAddressDialog, CheckLogisticsDialog },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      ordersList: [],
      total: 0,
      logisticsInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    openEditAddressDialog() {
      this.$refs.editAddressDialogRef.editAddressDialogVisible = true
    },
    async openCheckLogisticsDialog() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) { return this.$message.error('获取物流信息失败') }
      this.logisticsInfo = res.data
      this.$refs.checkLogisticsDialogRef.checkLogisticsDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
