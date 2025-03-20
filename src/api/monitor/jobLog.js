import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询调度日志列表
export const listJobLog = query => {
  return http.request("get", baseUrlApi("monitor/jobLog/list"), {
    params: query
  });
};

// 删除调度日志
export const delJobLog = jobLogId => {
  return http.request("delete", baseUrlApi(`monitor/jobLog/${jobLogId}`));
};

// 清空调度日志
export const cleanJobLog = () => {
  return http.request("delete", baseUrlApi(`monitor/jobLog/clean`));
};
