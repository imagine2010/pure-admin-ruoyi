import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询登录日志列表
export const getLoginLogsList = query => {
  return http.request("get", baseUrlApi("monitor/logininfor/list"), {
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
export function cleanLogininfor() {
  return http.request({
    url: baseUrlApi + "/monitor/logininfor/clean",
    method: "delete"
  });
}
