import type { OptionsType } from "@/components/ReSegmented";

const menuTypeOptions: Array<OptionsType> = [
  {
    label: "目录",
    value: "M"
  },
  {
    label: "菜单",
    value: "C"
  },
  {
    label: "功能项",
    value: "F"
  }
];

const visibleOptions: Array<OptionsType> = [
  {
    label: "显示",
    tip: "会在菜单中显示",
    value: "0"
  },
  {
    label: "隐藏",
    tip: "不会在菜单中显示",
    value: "1"
  }
];
const statusOptions: Array<OptionsType> = [
  {
    label: "启用",
    tip: "启用状态",
    value: "0"
  },
  {
    label: "停用",
    tip: "停用状态",
    value: "1"
  }
];

const keepAliveOptions: Array<OptionsType> = [
  {
    label: "缓存",
    tip: "会保存该页面的整体状态，刷新后会清空状态",
    value: "0"
  },
  {
    label: "不缓存",
    tip: "不会保存该页面的整体状态",
    value: "1"
  }
];

const showParentOptions: Array<OptionsType> = [
  {
    label: "显示",
    tip: "会显示父级菜单",
    value: true
  },
  {
    label: "隐藏",
    tip: "不会显示父级菜单",
    value: false
  }
];

const frameLoadingOptions: Array<OptionsType> = [
  {
    label: "开启",
    tip: "有首次加载动画",
    value: true
  },
  {
    label: "关闭",
    tip: "无首次加载动画",
    value: false
  }
];

export {
  menuTypeOptions,
  visibleOptions,
  statusOptions,
  keepAliveOptions,
  showParentOptions,
  frameLoadingOptions
};
