# 知伴AI - H5 版本

## 项目说明

本项目是将微信小程序版本的知伴AI学习平台迁移为 H5 网页版本，完全保留原有样式和功能。

## 目录结构

```
Knowpals-fe-h5/
├── index.html          # 入口页面
├── pages/              # 页面目录
│   ├── login.html      # 登录页面
│   ├── register.html   # 注册页面
│   ├── forgot-password.html  # 忘记密码
│   ├── index.html      # 首页
│   ├── me.html         # 我的页面
│   ├── class-detail.html    # 班级详情
│   ├── class-course.html    # 班级课程
│   ├── join-class.html      # 加入班级
│   ├── video-play.html     # 视频播放
│   ├── ai-chat.html        # AI 聊天
│   ├── study-data.html      # 学习数据
│   ├── pending-tasks.html   # 待完成任务
│   └── quiz-practice.html   # 习题练习
├── css/                # 样式目录
├── js/                 # 脚本目录
└── README.md
```

## 功能列表

- ✅ 用户登录/注册
- ✅ 找回密码
- ✅ 班级管理（加入/查看）
- ✅ 视频学习
- ✅ AI 智能答疑
- ✅ 学习数据统计
- ✅ 待完成任务
- ✅ 习题练习

## 部署说明

### 方式一：上传到 GitHub

1. 将整个 `Knowpals-fe-h5` 文件夹内容推送到 GitHub 仓库
2. 后端服务已统一部署
3. H5 页面部署后可手机浏览器直接访问

### 方式二：使用静态服务器

```bash
# 使用 npx serve
npx serve .

# 或使用 http-server
npx http-server -p 3000
```

### 方式三：部署到云服务

- **Vercel**: `vercel --prod`
- **Netlify**: 直接拖拽文件夹到 Netlify
- **Cloudflare Pages**: 连接 GitHub 仓库自动部署

## API 配置

后端地址: `https://knowpals.xyz`

所有 API 请求会携带 Bearer Token 进行认证。

## 开发说明

- 所有页面均为纯静态 HTML，可直接在浏览器打开
- 使用原生 JavaScript，无框架依赖
- 样式完全按照原小程序设计稿转换
- 支持移动端浏览器访问

## 注意事项

1. 部分功能需要登录后才能使用
2. 视频播放功能需要网络连接
3. AI 聊天功能依赖后端 AI 服务
"# Knowpals-fe-mobile-H5" 
"# Knowpals-fe--H5-mobile" 
