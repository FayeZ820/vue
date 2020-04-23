<template>
  <div>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightsTreeList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    rightsTreeList: {},
    defaultKeys: [],
    roleId: String
  },
  data() {
    return {
      setRightsDialogVisible: false,
      treeProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    setRightsDialogClosed() {
      this.$emit('resetDefaultKeys')
    },
    async setRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('分配权限失败') }
      this.$message.success('分配权限成功')
      this.$emit('refreshRolesList')
      this.setRightsDialogVisible = false
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
</style>
