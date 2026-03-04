# 工业表面缺陷检测系统

纯 HTML 实现的工业表面缺陷检测系统界面。

## 项目结构

```
anomaly-detection-system/
├── index.html              # 主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── data-management.js     # 数据管理模块
│   ├── general-detection.js   # 通用异常检测模块
│   ├── sample-management.js   # 异常样本管理模块
│   ├── model-training.js      # 模型训练模块
│   ├── model-management.js    # 模型管理模块
│   ├── domain-detection.js    # 领域缺陷检测模块
│   └── statistics-analysis.js # 统计分析模块
└── README.md              # 说明文档
```

## 功能模块

1. **数据管理模块** (完整实现)
   - 相机配置：IP、端口、分辨率、帧率设置
   - 数据导入：批量上传图像文件
   - 预处理配置：格式、分辨率、存储路径、命名规则
   - 实时数据预览：模拟摄像头采集界面
   - 队列监控：待处理、处理中、已完成、失败、缓存占用
   - 数据列表：表格展示、搜索、筛选、分页、批量操作

2. **通用异常检测模块** (占位)
3. **异常样本管理模块** (占位)
4. **模型训练模块** (占位)
5. **模型管理模块** (占位)
6. **领域缺陷检测模块** (占位)
7. **统计分析模块** (占位)

## 使用方法

直接在浏览器中打开 `index.html` 文件即可使用。

无需安装 Node.js 或运行构建命令。

## 技术栈

- 纯 HTML/CSS/JavaScript
- SVG 图标
- 响应式布局

## 浏览器兼容性

支持所有现代浏览器（Chrome、Firefox、Safari、Edge）。
