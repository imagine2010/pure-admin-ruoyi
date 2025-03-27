import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
type ResponseType = {
  code: number;
  rows?: Array<any>;
  total?: number;
  data?: any;
  msg: string;
};
// 查询操作日志列表
export const getOperationLogsList = query => {
  return http.request<ResponseType>("get", baseUrlApi("monitor/operlog/list"), {
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

// 导出操作日志
export const exportOperlog = (query?: object) => {
  return http.request("post", baseUrlApi("system/operlog/export"), {
    params: query,
    responseType: "blob"
  });
};
