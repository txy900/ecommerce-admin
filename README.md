# 电商后台管理系统

基于 [v3-admin-vite](https://github.com/un-pany/v3-admin-vite) 模板搭建的电商后台管理前端项目，提供商品、订单、用户等核心业务模块的增删改查与数据可视化。

## 功能特性

- **控制台**：商品 / 订单 / 用户统计概览，ECharts 库存排行图表
- **商品管理**：商品列表 CRUD、分类、评价、入库记录、商品数据
- **订单管理**：订单列表查询与状态维护
- **用户管理**：用户列表 CRUD
- **系统能力**：登录鉴权、路由守卫、主题切换、响应式布局、Pinia 状态持久化

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Vue 3.5+、TypeScript |
| 构建 | Vite 7+ |
| UI | Element Plus、UnoCSS |
| 状态 / 路由 | Pinia、Vue Router |
| 请求 | Axios |
| 图表 / 表格 | ECharts、VXE Table |
| 规范 | ESLint、Husky |

## 环境要求

- Node.js >= 18
- pnpm（推荐）

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动 Mock 接口服务

开发环境通过 Express 提供 `/api/v1` 接口，默认监听 **3000** 端口：

```bash
pnpm dev:server
```

### 3. 启动前端开发服务

另开终端执行（默认 **3333** 端口，已配置代理转发至 Mock 服务）：

```bash
pnpm dev
```

浏览器访问：<http://localhost:3333>

### 登录账号

| 字段 | 值 |
| --- | --- |
| 用户名 | `admin` |
| 密码 | `12345678` |
| 验证码 | 任意填写（Mock 不校验） |

> Mock 登录接口仅校验用户名、密码非空，任意合法账号均可登录。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Vite 开发服务 |
| `pnpm dev:server` | 启动 Mock API 服务 |
| `pnpm build` | 生产环境构建 |
| `pnpm build:staging` | 预发布环境构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm lint` | ESLint 检查并自动修复 |
| `pnpm test` | 运行单元测试（Vitest） |

## 项目结构

```text
├── json-server-middleware.js   # 开发环境 Mock API（Express）
├── db.json                       # 示例数据（与 Mock 服务数据一致，可作参考）
├── src
│   ├── common/                   # 通用资源（组件、工具、常量等）
│   ├── http/apis/                # 业务接口封装
│   ├── layouts/                  # 布局组件
│   ├── pages/                    # 页面
│   │   ├── dashboard/            # 控制台
│   │   ├── login/                # 登录
│   │   ├── product/              # 商品管理
│   │   ├── order/                # 订单管理
│   │   └── user/                 # 用户管理
│   ├── pinia/stores/             # 状态管理
│   └── router/                   # 路由与导航守卫
├── .env                          # 公共环境变量
├── .env.development              # 开发环境变量
└── vite.config.ts                # Vite 配置（含 /api/v1 代理）
```

## 接口说明

### 开发环境

- 前端请求前缀：`/api/v1`（见 `.env.development` 中 `VITE_BASE_URL`）
- Vite 将 `/api/v1` 代理至 `http://localhost:3000`
- Mock 服务实现见 `json-server-middleware.js`，支持：

  - 认证：`GET /auth/captcha`、`POST /auth/login`、`GET /users/me`
  - 商品 / 订单 / 用户：标准 RESTful CRUD

### 生产环境

生产构建请在 `.env.production` 中配置真实后端地址 `VITE_BASE_URL`，并视部署路径调整 `VITE_PUBLIC_PATH`。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `VITE_APP_TITLE` | 系统标题 |
| `VITE_ROUTER_HISTORY` | 路由模式：`hash` / `html5` |
| `VITE_BASE_URL` | API 基础路径 |
| `VITE_PUBLIC_PATH` | 静态资源公共路径 |

