import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import * as parserVue from "vue-eslint-parser";
import configPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineFlatConfig } from "eslint-define-config";
import * as parserTypeScript from "@typescript-eslint/parser";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

/**
 * 定义 ESLint 扁平化配置
 * 文档：https://eslint.org/docs/latest/use/configure/configuration-files-new
 */
export default defineFlatConfig([
  /* ----- 基础配置（适用于所有文件） ----- */
  {
    // 继承 ESLint 推荐规则
    ...js.configs.recommended,

    // 忽略检查的文件/目录模式
    ignores: [
      "**/.*", // 所有隐藏文件/目录
      "dist/*", // 构建输出目录
      "*.d.ts", // TypeScript 声明文件（由下方专门配置处理）
      "public/*", // 静态资源目录
      "src/assets/**", // 项目资源文件
      "src/**/iconfont/**" // 字体图标目录
    ],

    // 语言环境配置
    languageOptions: {
      // 全局变量声明（通常与项目中的 *.d.ts 类型声明匹配）
      globals: {
        RefType: "readonly",
        // ...其他全局类型声明（详见项目中的类型定义）
        ImportMetaEnv: "readonly" // Vite 环境变量类型
      }
    },

    // 插件配置
    plugins: {
      prettier: pluginPrettier // 集成 Prettier
    },

    // 规则配置
    rules: {
      ...configPrettier.rules, // Prettier 兼容规则
      ...pluginPrettier.configs.recommended.rules, // Prettier 推荐配置
      "no-debugger": "off", // 允许调试器语句
      "no-unused-vars": [
        // 未使用变量处理（允许以 _ 开头的变量）
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "prettier/prettier": [
        // Prettier 规则配置
        "error",
        { endOfLine: "auto" } // 自动检测换行符（兼容不同系统）
      ]
    }
  },

  /* ----- TypeScript 文件配置 ----- */
  {
    files: ["**/*.?([cm])ts", "**/*.?([cm])tsx"], // 匹配 ts/tsx/mts/mtsx 等扩展名
    languageOptions: {
      parser: parserTypeScript, // 使用 TypeScript 解析器
      parserOptions: {
        sourceType: "module", // 使用 ES 模块语法
        warnOnUnsupportedTypeScriptVersion: false // 禁用 TS 版本警告
      }
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript // TS 规则插件
    },
    rules: {
      ...pluginTypeScript.configs.strict.rules, // 继承严格规则
      "@typescript-eslint/ban-types": "off", // 允许使用基础类型（如 Object）
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型
      "@typescript-eslint/consistent-type-imports": [
        // 强制类型导入风格
        "error",
        { fixStyle: "inline-type-imports" } // 内联类型导入
      ]
    }
  },

  /* ----- 类型声明文件配置（*.d.ts）----- */
  {
    files: ["**/*.d.ts"],
    rules: {
      "eslint-comments/no-unlimited-disable": "off", // 允许禁用所有规则
      "import/no-duplicates": "off", // 允许重复导入
      "unused-imports/no-unused-vars": "off" // 关闭未使用变量检查
    }
  },

  /* ----- JavaScript 文件配置 ----- */
  {
    files: ["**/*.?([cm])js"], // 匹配 js/mjs/cjs 等扩展名
    rules: {
      "@typescript-eslint/no-require-imports": "off", // 允许 require 语法
      "@typescript-eslint/no-var-requires": "off" // 允许使用 require
    }
  },

  /* ----- Vue 文件配置 ----- */
  {
    files: ["**/*.vue"],
    languageOptions: {
      // Vue 全局编译器宏（如 $ref, $computed）
      globals: {
        /* ... */
      },
      parser: parserVue, // Vue 自定义解析器
      parserOptions: {
        ecmaFeatures: { jsx: true }, // 启用 JSX 支持
        parser: "@typescript-eslint/parser", // 解析 <script> 中的 TS
        sourceType: "module"
      }
    },
    plugins: {
      vue: pluginVue // Vue 规则插件
    },
    processor: pluginVue.processors[".vue"], // Vue 文件处理器
    rules: {
      ...pluginVue.configs.base.rules, // Vue 基础规则
      "vue/multi-word-component-names": "off", // 允许单单词组件名
      "vue/html-self-closing": [
        // 强制自闭合标签风格
        "error",
        { html: { component: "always" } } // 组件始终自闭合
      ]
    }
  }
]);
