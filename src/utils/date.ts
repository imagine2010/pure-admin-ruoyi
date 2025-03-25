/**
 * 向请求参数中添加日期范围
 *
 * @param params 请求参数
 * @param dateRange 日期范围数组，格式为 [开始日期, 结束日期]
 * @param propName 可选参数，用于自定义属性名，默认为 undefined
 * @returns 返回添加了日期范围的请求参数
 */
export function addDateRange(params: any, dateRange: any, propName?: any) {
  let search = params;
  search.params =
    typeof search.params === "object" &&
    search.params !== null &&
    !Array.isArray(search.params)
      ? search.params
      : {};

  dateRange = Array.isArray(dateRange) ? dateRange : [];

  if (typeof propName === "undefined") {
    search.params["beginTime"] = dateRange[0];
    search.params["endTime"] = dateRange[1];
  } else {
    search.params["begin" + propName] = dateRange[0];
    search.params["end" + propName] = dateRange[1];
  }
  return search;
}
