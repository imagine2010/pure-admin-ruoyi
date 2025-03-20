import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询生成表数据
export function listTable(query) {
  return http.get(`${baseUrlApi}/tool/gen/list`, query);
}

// 查询db数据库列表
export function listDbTable(query) {
  return http.get(`${baseUrlApi}/tool/gen/db/list`, query);
}

// 查询表详细信息
export function getGenTable(tableId) {
  return http.get(`${baseUrlApi}/tool/gen/${tableId}`);
}

// 修改代码生成信息
export function updateGenTable(data) {
  return http.put(`${baseUrlApi}/tool/gen`, data);
}

// 导入表
export function importTable(data) {
  return http.post(`${baseUrlApi}/tool/gen/importTable`, data);
}

// 创建表
export function createTable(data) {
  return http.post(`${baseUrlApi}/tool/gen/createTable`, data);
}

// 预览生成代码
export function previewTable(tableId) {
  return http.get(`${baseUrlApi}/tool/gen/preview/${tableId}`);
}

// 删除表数据
export function delTable(tableId) {
  return http.delete(`${baseUrlApi}/tool/gen/${tableId}`);
}

// 生成代码（自定义路径）
export function genCode(tableName) {
  return http.get(`${baseUrlApi}/tool/gen/genCode/${tableName}`);
}

// 同步数据库
export function synchDb(tableName) {
  return http.get(`${baseUrlApi}/tool/gen/synchDb/${tableName}`);
}
