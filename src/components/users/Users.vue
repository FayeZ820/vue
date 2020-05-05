<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="name" width="100"></el-table-column>
        <el-table-column prop="email" label="email" width="140"></el-table-column>
        <el-table-column prop="mobile" label="phonenumber"></el-table-column>
        <el-table-column prop="role_name" label="role"></el-table-column>
        <el-table-column label="state" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="opration">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="openEditUserDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="info"
                icon="el-icon-setting"
                circle
                @click="openSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <add-user-dialog ref="addUserDialogRef" @refreshUserList="getUserList"></add-user-dialog>
    <edit-user-dialog
      ref="editUserDialogRef"
      :editUserForm="editForm"
      @refreshUserList="getUserList"
    ></edit-user-dialog>
    <set-role-dialog
      ref="setRoleDialogRef"
      :userInfo="userInfo"
      :rolesList="rolesList"
      @refreshUserList="getUserList"
    ></set-role-dialog>
  </div>
</template>

<script>
import AddUserDialog from './addUserDialog'
import EditUserDialog from './editUserDialog'
import SetRoleDialog from './setRoleDialog'

export default {
  components: { AddUserDialog, EditUserDialog, SetRoleDialog },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      usersList: [],
      total: 0,
      editForm: {},
      userInfo: {},
      rolesList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    openAddUserDialog() {
      this.$refs.addUserDialogRef.addUserDialogVisible = true
    },
    async openSetRoleDialog(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.$refs.setRoleDialogRef.setRoleDialogVisible = true
    },
    async openEditUserDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.$refs.editUserDialogRef.editUserDialogVisible = true
    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
