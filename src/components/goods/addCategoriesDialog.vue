<template>
  <div>
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoriesDialogVisible"
      width="50%"
      @close="addCategoriesDialogClosed"
    >
      <el-form
        ref="addCategoriesFormRef"
        :model="addCategoriesForm"
        :rules="addCategoriesFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoriesForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCategoriesList"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' }"
            @change="parentCategoriesChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentCategoriesList: [],
      addCategoriesDialogVisible: false,
      addCategoriesForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCategoriesFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      selectedKeys: []
    }
  },
  methods: {
    async getParentCategoriesList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.erroe('获取父级分类数据失败')
      }
      this.parentCategoriesList = res.data
    },
    parentCategoriesChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCategoriesForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCategoriesForm.cat_level = this.selectedKeys.length
      } else {
        this.addCategoriesForm.cat_pid = 0
        this.addCategoriesForm.cat_level = 0
      }
    },
    addCategories() {
      this.$refs.addCategoriesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCategoriesForm
        )
        if (res.meta.status !== 201) { return this.$message.error('添加分类失败') }
        this.$message.success('添加分类成功')
        this.$emit('refreshGetCategoriesLIst')
        this.addCategoriesDialogVisible = false
      })
    },
    addCategoriesDialogClosed() {
      this.$refs.addCategoriesFormRef.resetFields()
      this.selectedKeys = []
      this.addCategoriesForm.cat_pid = 0
      this.addCategoriesForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
