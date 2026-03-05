const ModelManagement = {
    selectedModel: null,
    currentPage: 1,
    pageSize: 9,

    models: [
        {
            id: 'MDL-001',
            name: 'ECF-Net-v1.0',
            type: '领域缺陷检测',
            version: 'v1.0',
            datasetName: '轴承表面缺陷 v1.0',
            mIoU: 0.8234,
            mAcc: 0.8756,
            mDice: 0.8456,
            mPre: 0.8289,
            trainingTime: '1h 30m',
            fileSize: '128.5 MB',
            createdAt: '2026-03-05 10:30:00',
            status: 'published',
            deployedAt: '2026-03-05 11:00:00',
            deployedTo: '一号产线',
            backbone: 'ResNet50',
            optimizer: 'Adam',
            epoch: 100
        },
        {
            id: 'MDL-002',
            name: 'ECF-Net-v1.1',
            type: '领域缺陷检测',
            version: 'v1.1',
            datasetName: '轴承表面缺陷 v1.1',
            mIoU: 0.8512,
            mAcc: 0.8934,
            mDice: 0.8678,
            mPre: 0.8489,
            trainingTime: '2h 15m',
            fileSize: '132.8 MB',
            createdAt: '2026-03-05 14:20:00',
            status: 'published',
            deployedAt: '2026-03-05 15:00:00',
            deployedTo: '二号产线',
            backbone: 'ResNet50',
            optimizer: 'Adam',
            epoch: 100
        },
        {
            id: 'MDL-003',
            name: 'ECF-Net-v2.0-beta',
            type: '领域缺陷检测',
            version: 'v2.0-beta',
            datasetName: '轴承内圈缺陷 v1.0',
            mIoU: 0.7956,
            mAcc: 0.8578,
            mDice: 0.8234,
            mPre: 0.8045,
            trainingTime: '1h 45m',
            fileSize: '135.2 MB',
            createdAt: '2026-03-06 09:00:00',
            status: 'published',
            deployedAt: '2026-03-06 11:00:00',
            deployedTo: '二号产线',
            backbone: 'ResNet101',
            optimizer: 'AdamW',
            epoch: 150
        },
        {
            id: 'MDL-004',
            name: 'ECF-Net-v2.0-rc1',
            type: '领域缺陷检测',
            version: 'v2.0-rc1',
            datasetName: '轴承滚珠缺陷 v1.0',
            mIoU: 0.8123,
            mAcc: 0.8712,
            mDice: 0.8345,
            mPre: 0.8167,
            trainingTime: '1h 55m',
            fileSize: '137.6 MB',
            createdAt: '2026-03-06 11:30:00',
            status: 'published',
            deployedAt: '2026-03-06 14:00:00',
            deployedTo: '二号产线',
            backbone: 'ResNet101',
            optimizer: 'AdamW',
            epoch: 150
        },
        {
            id: 'MDL-005',
            name: 'ECF-Net-Efficient',
            type: '领域缺陷检测',
            version: 'v1.0',
            datasetName: '轴承保持架缺陷 v1.0',
            mIoU: 0.7889,
            mAcc: 0.8645,
            mDice: 0.8156,
            mPre: 0.8023,
            trainingTime: '2h 05m',
            fileSize: '89.3 MB',
            createdAt: '2026-03-06 14:00:00',
            status: 'trained',
            deployedAt: null,
            deployedTo: null,
            backbone: 'EfficientNet',
            optimizer: 'Adam',
            epoch: 120
        }
    ],

    init() {
        this.render();
    },

    render() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.models.length);
        const pageModels = this.models.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.models.length / this.pageSize);
        const publishedCount = this.models.filter(m => m.status === 'published').length;

        return `
            <div class="card">
                <div class="card-header">
                    <span>模型管理</span>
                    <div class="model-stats">
                        <span class="stat-badge">共 ${this.models.length} 个模型</span>
                        <span class="stat-badge stat-badge-success">${publishedCount} 已发布</span>
                        <span class="stat-badge stat-badge-info">${this.models.length - publishedCount} 待发布</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="model-toolbar">
                        <div class="filter-section">
                            <select class="form-control form-select filter-select" onchange="ModelManagement.filterByStatus(this.value)">
                                <option value="">全部状态</option>
                                <option value="published">已发布</option>
                                <option value="trained">已训练</option>
                                <option value="training">训练中</option>
                            </select>
                            <input type="text" class="search-input" placeholder="搜索模型..." oninput="ModelManagement.searchModels(this.value)">
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-default" onclick="ModelManagement.exportAllModels()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                批量导出
                            </button>
                        </div>
                    </div>

                    <div class="model-grid">
                        ${pageModels.map(model => this.renderModelCard(model)).join('')}
                    </div>

                    ${totalPages > 1 ? `
                        <div class="model-pagination">
                            <button class="btn btn-default btn-sm" onclick="ModelManagement.prevPage()" ${this.currentPage === 1 ? 'disabled' : ''}>
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                上一页
                            </button>
                            <span class="page-info">第 ${this.currentPage} / ${totalPages} 页</span>
                            <button class="btn btn-default btn-sm" onclick="ModelManagement.nextPage()" ${this.currentPage === totalPages ? 'disabled' : ''}>
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                                下一页
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${this.selectedModel ? this.renderModelDetail(this.selectedModel) : ''}
        `;
    },

    renderModelCard(model) {
        const statusClass = model.status === 'published' ? 'model-published' : model.status === 'trained' ? 'model-trained' : 'model-training';

        return `
            <div class="model-card ${statusClass}" onclick="ModelManagement.selectModel('${model.id}')">
                <div class="model-header">
                    <div class="model-title">
                        <strong>${model.name}</strong>
                        <span class="version-tag">${model.version}</span>
                    </div>
                    <span class="status-badge ${model.status === 'published' ? 'status-published' : model.status === 'trained' ? 'status-trained' : 'status-training'}">
                        ${model.status === 'published' ? '已发布' : model.status === 'trained' ? '已训练' : '训练中'}
                    </span>
                </div>

                <div class="model-metrics">
                    <div class="metric-item">
                        <span>mIoU</span>
                        <strong class="metric-value metric-value-high">${(model.mIoU * 100).toFixed(2)}%</strong>
                    </div>
                    <div class="metric-item">
                        <span>mAcc</span>
                        <strong class="metric-value">${(model.mAcc * 100).toFixed(2)}%</strong>
                    </div>
                    <div class="metric-item">
                        <span>mDice</span>
                        <strong class="metric-value">${(model.mDice * 100).toFixed(2)}%</strong>
                    </div>
                    <div class="metric-item">
                        <span>mPre</span>
                        <strong class="metric-value">${(model.mPre * 100).toFixed(2)}%</strong>
                    </div>
                </div>

                <div class="model-info">
                    <div class="info-row">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                            <path d="M3 21v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2v8"></path>
                            <path d="M5 11l7-7 7 7"></path>
                        </svg>
                        ${model.datasetName}
                    </div>
                    <div class="info-row">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        ${model.backbone} | ${model.optimizer}
                    </div>
                    <div class="info-row">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${model.createdAt}
                    </div>
                    <div class="info-row">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        ${model.trainingTime}
                    </div>
                    <div class="info-row">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        ${model.fileSize}
                    </div>
                </div>

                <div class="model-actions">
                    ${model.status === 'published' ? `
                        <div class="deployed-info">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            已部署至 ${model.deployedTo}
                        </div>
                        <button class="btn btn-warning" onclick="ModelManagement.undeployModel('${model.id}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            下线模型
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="ModelManagement.publishModel('${model.id}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                <path d="M12 19l7-7 3 7-7"></path>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                <path d="M2 2l7.586 7.586"></path>
                                <circle cx="11" cy="11" r="2"></circle>
                            </svg>
                            发布
                        </button>
                    `}
                </div>
            </div>
        `;
    },

    renderModelDetail(model) {
        return `
            <div class="model-detail-modal">
                <div class="modal-backdrop" onclick="ModelManagement.closeModelDetail()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${model.name}</h2>
                        <button class="btn-close" onclick="ModelManagement.closeModelDetail()">×</button>
                    </div>

                    <div class="modal-body">
                        <div class="detail-section">
                            <h3>基本信息</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span>模型ID</span>
                                    <strong>${model.id}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>版本</span>
                                    <strong>${model.version}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>模型类型</span>
                                    <strong>${model.type}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>状态</span>
                                    <span class="tag ${model.status === 'published' ? 'tag-success' : 'tag-warning'}">${model.status === 'published' ? '已发布' : '已训练'}</span>
                                </div>
                                <div class="detail-item">
                                    <span>训练时间</span>
                                    <strong>${model.trainingTime}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>文件大小</span>
                                    <strong>${model.fileSize}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>创建时间</span>
                                    <strong>${model.createdAt}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>主干网络</span>
                                    <strong>${model.backbone}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>优化器</span>
                                    <strong>${model.optimizer}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>训练轮数</span>
                                    <strong>${model.epoch}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3>性能指标</h3>
                            <div class="metrics-chart">
                                <div class="metric-bar">
                                    <span>mIoU (平均交并比)</span>
                                    <div class="bar-wrapper">
                                        <div class="bar-fill" style="width: ${model.mIoU * 100}%"></div>
                                        <span class="bar-value">${(model.mIoU * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                                <div class="metric-bar">
                                    <span>mAcc (平均准确率)</span>
                                    <div class="bar-wrapper">
                                        <div class="bar-fill" style="width: ${model.mAcc * 100}%"></div>
                                        <span class="bar-value">${(model.mAcc * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                                <div class="metric-bar">
                                    <span>mDice (平均Dice系数)</span>
                                    <div class="bar-wrapper">
                                        <div class="bar-fill" style="width: ${model.mDice * 100}%"></div>
                                        <span class="bar-value">${(model.mDice * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                                <div class="metric-bar">
                                    <span>mPre (平均精确率)</span>
                                    <div class="bar-wrapper">
                                        <div class="bar-fill" style="width: ${model.mPre * 100}%"></div>
                                        <span class="bar-value">${(model.mPre * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        ${model.status === 'published' ? `
                            <div class="detail-section">
                                <h3>部署信息</h3>
                                <div class="deploy-info-detail">
                                    <div class="deploy-item">
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        <span>部署产线: <strong>${model.deployedTo}</strong></span>
                                    </div>
                                    <div class="deploy-item">
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <span>部署时间: <strong>${model.deployedAt}</strong></span>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-default" onclick="ModelManagement.downloadModel('${model.id}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1 2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            下载模型
                        </button>
                        ${model.status === 'published' ? `
                            <button class="btn btn-warning" onclick="ModelManagement.undeployModel('${model.id}')">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                下线模型
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="ModelManagement.publishModel('${model.id}')">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                    <path d="M12 19l7-7 3 7-7"></path>
                                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                    <path d="M2 2l7.586 7.586"></path>
                                    <circle cx="11" cy="11" r="2"></circle>
                                </svg>
                                发布
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    selectModel(modelId) {
        const model = this.models.find(m => m.id === modelId);
        if (model) {
            this.selectedModel = model;
            this.rerender();
        }
    },

    closeModelDetail() {
        this.selectedModel = null;
        this.rerender();
    },

    publishModel(modelId) {
        const model = this.models.find(m => m.id === modelId);
        if (model) {
            const lineName = prompt('请选择部署产线（一号产线/二号产线/三号产线）:', '一号产线');
            if (lineName) {
                model.status = 'published';
                model.deployedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
                model.deployedTo = lineName;
                this.notify(`模型 ${model.name} 已发布至 ${lineName}`, 'success');
                this.rerender();
            }
        }
    },

    undeployModel(modelId) {
        const model = this.models.find(m => m.id === modelId);
        if (model) {
            if (confirm(`确定要将模型 ${model.name} 从产线下线吗？`)) {
                model.status = 'trained';
                model.deployedAt = null;
                model.deployedTo = null;
                this.notify(`模型 ${model.name} 已下线`, 'info');
                this.rerender();
            }
        }
    },

    downloadModel(modelId) {
        const model = this.models.find(m => m.id === modelId);
        if (model) {
            this.notify(`正在下载模型: ${model.name} (${model.fileSize})`, 'info');
        }
    },

    filterByStatus(status) {
        this.currentPage = 1;
        this.currentFilter = status;
        this.rerender();
    },

    searchModels(keyword) {
        this.currentSearch = keyword;
        this.currentPage = 1;
        this.rerender();
    },

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.rerender();
        }
    },

    nextPage() {
        const totalPages = Math.ceil(this.models.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.rerender();
        }
    },

    exportAllModels() {
        this.notify('正在批量导出模型...', 'info');
    },

    rerender() {
        const container = document.getElementById('page-content');
        if (container) {
            container.innerHTML = this.render();
        }
    },

    notify(message, type = 'info') {
        const colors = {
            success: '#52c41a',
            warning: '#faad14',
            error: '#ff4d4f',
            info: '#1890ff'
        };
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: white;
            border-left: 4px solid ${colors[type]};
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s;
        `;
        div.textContent = message;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.animation = 'slideOut 0.3s';
            setTimeout(() => div.remove(), 300);
        }, 2000);
    }
};
