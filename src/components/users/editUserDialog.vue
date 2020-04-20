<template>
  <div>
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    editUserForm: {}
  },
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      editUserDialogVisible: false,
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) { return this.$message.error('更新用户失败') }
        this.editUserDialogVisible = false
        this.$emit('refreshUserList')
        this.$message.success('更新用户成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
