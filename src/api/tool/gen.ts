import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type ResponseType = {
  code: number;
  rows?: Array<any>;
  total?: number;
  data?: any;
  msg: string;
};
// 查询生成表数据
export const listTable = query => {
  return http.request<ResponseType>("get", baseUrlApi("tool/gen/list"), {
    params: query
  });
};
// 查询db数据库列表
export const listDbTable = query => {
  return http.request<ResponseType>("get", baseUrlApi("tool/gen/db/list"), {
    params: query
  });
};

// 查询表详细信息
export const getGenTable = tableId => {
  return http.request<ResponseType>("get", baseUrlApi(`tool/gen/${tableId}`));
};

// 修改代码生成信息
export const updateGenTable = data => {
  return http.request<ResponseType>("put", baseUrlApi("tool/gen"), {
    data
  });
};

// 导入表
export const importTable = data => {
  return http.request<ResponseType>(
    "post",
    baseUrlApi("tool/gen/importTable"),
    {
      data
    }
  );
};

// 创建表
export const createTable = data => {
  return http.request<ResponseType>(
    "post",
    baseUrlApi("tool/gen/createTable"),
    {
      data
    }
  );
};

// 预览生成代码
export const previewTable = tableId => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi(`tool/gen/preview/${tableId}`)
  );
};

// 删除表数据
export const delTable = tableId => {
  return http.request<ResponseType>(
    "delete",
    baseUrlApi(`tool/gen/${tableId}`)
  );
};

// 生成代码（自定义路径）
export const genCode = tableName => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi(`tool/gen/genCode/${tableName}`)
  );
};

// 同步数据库
export const synchDb = tableName => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi(`tool/gen/synchDb/${tableName}`)
  );
};
