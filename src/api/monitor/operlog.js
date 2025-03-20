import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询操作日志列表
export const getOperationLogsList = query => {
  return http.request("get", baseUrlApi("monitor/operlog/list"), {
    params: query
  });
};

// 删除操作日志
export const delOperlog = operId => {
  return http.request("delete", baseUrlApi(`monitor/operlog/${operId}`));
};

// 清空操作日志
export const cleanOperlog = () => {
  return http.request("delete", baseUrlApi(`monitor/operlog/clean`));
};
