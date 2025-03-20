import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 获取服务信息
export const getServer = query => {
  return http.request("get", baseUrlApi("monitor/server"), {
    params: query
  });
};
