import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询缓存详细
export const getCache = query => {
  return http.request("get", baseUrlApi("monitor/cache"), {
    params: query
  });
};

// 查询缓存名称列表
export const listCacheName = () => {
  return http.request("get", baseUrlApi("monitor/cache/getNames"));
};

// 查询缓存键名列表
export const listCacheKey = cacheName => {
  return http.request("get", baseUrlApi(`monitor/cache/getKeys/${cacheName}`));
};

// 查询缓存内容
export const getCacheValue = (cacheName, cacheKey) => {
  return http.request(
    "get",
    baseUrlApi(`monitor/cache/getValue/${cacheName}/${cacheKey}`)
  );
};

// 清理指定名称缓存
export const clearCacheName = cacheName => {
  return http.request(
    "delete",
    baseUrlApi(`monitor/cache/clearCacheName/${cacheName}`)
  );
};

// 清理指定键名缓存
export const clearCacheKey = cacheKey => {
  return http.request(
    "delete",
    baseUrlApi(`monitor/cache/clearCacheKey/${cacheKey}`)
  );
};

// 清理全部缓存
export const clearCacheAll = () => {
  return http.request("delete", baseUrlApi(`monitor/cache/clearCacheAll`));
};
