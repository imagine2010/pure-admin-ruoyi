import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Logininfor = {
  infoId: number;
  userName: string;
  ipaddr: string;
  status: string;
  msg: string;
  loginTime: string;
};
type LoginLogs = {
  total: number;
  rows: Logininfor[];
  msg: string;
  code: number;
};
// 查询登录日志列表
export const getLoginLogsList = query => {
  return http.request<LoginLogs>("get", baseUrlApi("monitor/logininfor/list"), {
    params: query
  });
};

// 删除登录日志
export const delLogininfor = infoId => {
  return http.request("delete", baseUrlApi(`monitor/logininfor/${infoId}`));
};

// 解锁用户登录状态
export const unlockLogininfor = userName => {
  return http.request(
    "delete",
    baseUrlApi(`monitor/logininfor/unlock/${userName}`)
  );
};

// 清空登录日志
export const cleanLogininfor = () => {
  return http.request("delete", baseUrlApi(`monitor/logininfor/clean`));
};

// 导出登录日志
export const exportLogininfor = (query?: object) => {
  return http.request("post", baseUrlApi("system/logininfor/export"), {
    params: query,
    responseType: "blob"
  });
};
