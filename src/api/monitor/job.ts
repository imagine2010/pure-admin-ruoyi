import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
type ResponseType = {
  code: number;
  rows?: Array<any>;
  total?: number;
  data?: any;
  msg: string;
};
// 查询定时任务调度列表
export const listJob = query => {
  return http.request<ResponseType>("get", baseUrlApi("monitor/job/list"), {
    params: query
  });
};

// 查询定时任务调度详细
export const getJob = jobId => {
  return http.request<ResponseType>("get", baseUrlApi(`monitor/job/${jobId}`));
};

// 新增定时任务调度
export const addJob = data => {
  return http.request<ResponseType>("post", baseUrlApi("monitor/job"), {
    data: data
  });
};

// 修改定时任务调度
export const updateJob = data => {
  return http.request<ResponseType>("put", baseUrlApi("monitor/job"), {
    data: data
  });
};

// 删除定时任务调度
export const delJob = jobId => {
  return http.request<ResponseType>(
    "delete",
    baseUrlApi(`monitor/job/${jobId}`)
  );
};

// 任务状态修改
export function changeJobStatus(jobId, status) {
  const data = {
    jobId,
    status
  };
  return http.request<ResponseType>(
    "put",
    baseUrlApi("monitor/job/changeStatus"),
    {
      data: data
    }
  );
}

// 定时任务立即执行一次
export function runJob(jobId, jobGroup) {
  const data = {
    jobId,
    jobGroup
  };
  return http.request<ResponseType>("put", baseUrlApi("monitor/job/run"), {
    data: data
  });
}
