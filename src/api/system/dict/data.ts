import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询字典数据列表
export const listData = query => {
  return http.request("get", baseUrlApi("system/dict/data/list"), {
    params: query
  });
};

// 查询字典数据详细
export const getData = dictCode => {
  return http.request("get", baseUrlApi(`system/dict/data/${dictCode}`));
};

// 根据字典类型查询字典数据信息
export const getDicts = dictType => {
  return http.request("get", baseUrlApi(`system/dict/data/type/${dictType}`));
};

// 新增字典数据
export const addData = data => {
  return http.request("post", baseUrlApi("system/dict/data"), {
    data
  });
};

// 修改字典数据
export const updateData = data => {
  return http.request("put", baseUrlApi("system/dict/data"), {
    data
  });
};

// 删除字典数据
export const delData = dictCode => {
  return http.request("delete", baseUrlApi(`system/dict/data/${dictCode}`));
};
