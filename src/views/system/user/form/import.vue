<script setup lang="ts">
import { ref } from "vue";
import type {
  UploadProgressEvent,
  UploadFile,
  UploadFiles
} from "element-plus";

interface UploadConfig {
  url: string;
  headers: Record<string, string>;
}

const uploadRef = ref();

const props = defineProps({
  uploadConfig: { type: Object as () => UploadConfig, required: true },
  onFileSuccess: {
    type: Function as PropType<
      (response: any, file: UploadFile, files: UploadFiles) => void
    >,
    required: true
  },
  onFileProgress: {
    type: Function as PropType<
      (evt: UploadProgressEvent, file: UploadFile, files: UploadFiles) => void
    >,
    required: true
  },
  updateSupport: {
    type: Boolean,
    required: true
  }
});

const localUpdateSupport = ref(props.updateSupport);
defineExpose({
  submit: () => {
    uploadRef.value?.submit();
  }
});
</script>

<template>
  <el-upload
    ref="uploadRef"
    :limit="1"
    accept=".xlsx, .xls"
    :headers="uploadConfig.headers"
    :action="uploadConfig.url + '?updateSupport=' + localUpdateSupport"
    :on-progress="props.onFileProgress"
    :on-success="props.onFileSuccess"
    :auto-upload="false"
    drag
  >
    <el-icon class="el-icon--upload" />
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip text-center">
        <div class="el-upload__tip">
          <el-checkbox v-model="localUpdateSupport" />是否更新已经存在的用户数据
        </div>
        <span>仅允许导入xls、xlsx格式文件。</span>
        <slot name="template-download" />
      </div>
    </template>
  </el-upload>
</template>
