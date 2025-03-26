<script setup lang="ts">
import { reactive, ref, getCurrentInstance, defineExpose } from "vue";
import { importTemplate } from "@/api/system/user";
import { downloadByData } from "@pureadmin/utils";
import { getToken } from "@/utils/auth";
const token = getToken().accessToken || "";

const upload = reactive({
  // 是否更新已经存在的用户数据
  updateSupport: false,
  url: import.meta.env.VITE_BASE_API + "/system/user/importData",
  headers: { Authorization: "Bearer " + token },
  isUploading: false
});
const uploadRef = ref();
const handleFileUploadProgress = () => {
  upload.isUploading = true;
};
const handleFileSuccess = (response, file) => {
  upload.isUploading = false;
  const { proxy } = getCurrentInstance();
  console.log(file);
  // proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
};
const startUpload = () => {
  uploadRef.value.submit();
};
const handleImportTemplate = () => {
  importTemplate().then(res => {
    downloadByData(res as Blob, `user_template_${new Date().getTime()}.xlsx`);
  });
};
defineExpose({
  startUpload
});
</script>

<template>
  <el-upload
    ref="uploadRef"
    :limit="1"
    accept=".xlsx, .xls"
    :headers="upload.headers"
    :action="upload.url + '?updateSupport=' + upload.updateSupport"
    :disabled="upload.isUploading"
    :on-progress="handleFileUploadProgress"
    :on-success="handleFileSuccess"
    :auto-upload="false"
    drag
  >
    <el-icon class="el-icon--upload" />
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip text-center">
        <div class="el-upload__tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
        </div>
        <span>仅允许导入xls、xlsx格式文件。</span>
        <el-link
          type="primary"
          :underline="false"
          style="font-size: 12px; vertical-align: baseline"
          @click="handleImportTemplate"
          >下载模板</el-link
        >
      </div>
    </template>
  </el-upload>
</template>
