const DomainDetection = {
    selectedModel: null,
    sourceType: 'upload',
    uploadedImages: [],
    datasetImages: [],
    detectionResults: [],
    selectedDatasetImages: [],

    // 模拟已部署的模型数据
    deployedModels: [
        {
            id: 'MDL-001',
            name: 'ECF-Net-v1.0',
            version: 'v1.0',
            datasetName: '轴承表面缺陷 v1.0',
            deployedTo: '一号产线',
            deployedAt: '2026-03-05 11:12'
        },
        {
            id: 'MDL-002',
            name: 'ECF-Net-v1.1',
            version: 'v1.1',
            datasetName: '轴承表面缺陷 v1.1',
            deployedTo: '二号产线',
            deployedAt: '2026-03-05 15:00'
        },
        {
            id: 'MDL-003',
            name: 'ECF-Net-v2.0-beta',
            version: 'v2.0-beta',
            datasetName: '轴承内圈缺陷 v1.0',
            deployedTo: '二号产线',
            deployedAt: '2026-03-06 11:00'
        }
    ],

    // 模拟数据管理中的图像数据
    datasetImages: [
        // { id: 'img-001', name: '001.png', url: 'img/ad/001.png', lineName: '一号产线', productType: '拉链', selected: false },
        // { id: 'img-002', name: '002.png', url: 'img/ad/002.png', lineName: '一号产线', productType: '拉链', selected: false },
        { id: 'img-000000', name: '000000.jpg', url: 'img/000000.jpg', lineName: '二号产线', productType: '橡胶木材', selected: false },
        { id: 'img-000010', name: '000010.jpg', url: 'img/000010.jpg', lineName: '二号产线', productType: '橡胶木材', selected: false },
    ],

    // 模拟缺陷类型
    defectTypes: [
        { id: 'live-knot', name: '活节', color: '#ff4d4f' },
        { id: 'dead-knot', name: '死节', color: '#ff7a45' },
        { id: 'other', name: '其他', color: '#722ed1' }
    ],

    init() {
        this.render();
    },

    render() {
        return `
            <div class="card">
                <div class="card-header">
                    <span>领域缺陷检测</span>
                </div>
                <div class="card-body">
                    <div class="detection-config">
                        <div class="config-section model-section">
                            <h3>
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:8px;">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                                模型选择
                            </h3>
                            <div class="model-selector">
                                <select class="form-control form-select" id="dd-model-select" onchange="DomainDetection.onModelChange(this.value)">
                                    <option value="">请选择已部署模型</option>
                                    ${this.deployedModels.map(model => `
                                        <option value="${model.id}" ${this.selectedModel && this.selectedModel.id === model.id ? 'selected' : ''}>
                                            ${model.name} (${model.version}) - ${model.deployedTo}
                                        </option>
                                    `).join('')}
                                </select>
                                ${this.selectedModel ? `
                                    <div class="model-info-card">
                                        <div class="model-info-row">
                                            <span class="model-info-label">模型名称:</span>
                                            <span class="model-info-value">${this.selectedModel.name}</span>
                                        </div>
                                        <div class="model-info-row">
                                            <span class="model-info-label">版本:</span>
                                            <span class="model-info-value">${this.selectedModel.version}</span>
                                        </div>
                                        <div class="model-info-row">
                                            <span class="model-info-label">训练数据集:</span>
                                            <span class="model-info-value">${this.selectedModel.datasetName}</span>
                                        </div>
                                        <div class="model-info-row">
                                            <span class="model-info-label">部署产线:</span>
                                            <span class="model-info-value">${this.selectedModel.deployedTo}</span>
                                        </div>
                                        <div class="model-info-row">
                                            <span class="model-info-label">部署时间:</span>
                                            <span class="model-info-value">${this.selectedModel.deployedAt}</span>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <div class="config-section data-section">
                            <h3>
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:8px;">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                数据来源
                            </h3>
                            <div class="data-source-selector">
                                <select class="form-control form-select" id="dd-source-select" onchange="DomainDetection.onSourceChange(this.value)">
                                    <option value="upload" ${this.sourceType === 'upload' ? 'selected' : ''}>本地上传</option>
                                    <option value="dataset" ${this.sourceType === 'dataset' ? 'selected' : ''}>从数据管理选择</option>
                                </select>
                            </div>
                            ${this.sourceType === 'upload' ? `
                                <div class="upload-area" id="dd-upload-area">
                                    <div class="upload-content">
                                        <svg class="icon upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        <p>点击或拖拽上传图像文件</p>
                                        <span class="upload-hint">支持 PNG、JPG、JPEG 格式</span>
                                    </div>
                                    <input type="file" id="dd-file-input" accept="image/png,image/jpeg,image/jpg" multiple onchange="DomainDetection.handleFileUpload(event)">
                                </div>
                            ` : `
                                <div class="dataset-grid">
                                    ${this.renderDatasetImages()}
                                </div>
                            `}
                        </div>
                    </div>

                    <div class="action-section">
                        <button class="btn btn-primary btn-lg" onclick="DomainDetection.runDetection()" ${!this.selectedModel || (this.sourceType === 'upload' && this.uploadedImages.length === 0) || (this.sourceType === 'dataset' && this.selectedDatasetImages.length === 0) ? 'disabled' : ''}>
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;margin-right:8px;">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            开始检测
                        </button>
                        <button class="btn btn-default" onclick="DomainDetection.clearResults()">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:6px;">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            清空结果
                        </button>
                    </div>
                </div>
            </div>

            ${this.detectionResults.length > 0 ? this.renderDetectionResults() : ''}
        `;
    },

    renderDatasetImages() {
        return this.datasetImages.map(img => `
            <div class="dataset-image-item ${img.selected ? 'selected' : ''}" onclick="DomainDetection.toggleDatasetImage('${img.id}')">
                <div class="image-wrapper">
                    <img src="${img.url}" alt="${img.name}">
                    ${img.selected ? `
                        <div class="image-overlay">
                            <svg class="icon check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    ` : ''}
                </div>
                <div class="image-info">
                    <div class="image-name">${img.name}</div>
                    <div class="image-meta">
                        <span>${img.lineName}</span>
                        <span>${img.productType}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderDetectionResults() {
        return `
            <div class="card">
                <div class="card-header">
                    <span>检测结果</span>
                    <span class="result-count">共 ${this.detectionResults.length} 张图像</span>
                </div>
                <div class="card-body">
                    <div class="results-grid">
                        ${this.detectionResults.map(result => this.renderResultItem(result)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderResultItem(result) {
        return `
            <div class="result-item">
                <div class="result-header">
                    <div class="result-title">
                        <strong>${result.imageName}</strong>
                        ${result.hasDefect ? `
                            <span class="defect-badge defect-detected">检测到缺陷</span>
                        ` : `
                            <span class="defect-badge defect-normal">正常</span>
                        `}
                    </div>
                    <div class="result-time">${result.timestamp}</div>
                </div>
                <div class="result-content">
                    <div class="result-image">
                        <img src="${result.imageUrl}" alt="${result.imageName}">
                        <img class="mask-overlay" src="${result.maskUrl}" alt="mask" onerror="this.style.display='none'">
                    </div>
                    <div class="result-info">
                        <h4>检测信息</h4>
                        <div class="info-list">
                            <div class="info-item">
                                <span class="info-label">使用模型:</span>
                                <span class="info-value">${result.modelName}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">检测时间:</span>
                                <span class="info-value">${result.timestamp}</span>
                            </div>
                            ${result.hasDefect ? `
                                <div class="defect-details">
                                    <div class="defect-details-title">缺陷详情:</div>
                                    ${result.defects.map((defect, index) => `
                                        <div class="defect-detail-item">
                                            <div class="defect-detail-header">
                                                <span class="defect-detail-number">${index + 1}</span>
                                                <span class="defect-detail-type" style="color: ${defect.color};">${defect.type}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="no-defect-msg">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;margin-right:6px;">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    未检测到缺陷，图像正常
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    onModelChange(modelId) {
        if (modelId) {
            this.selectedModel = this.deployedModels.find(m => m.id === modelId);
        } else {
            this.selectedModel = null;
        }
        this.rerender();
    },

    onSourceChange(sourceType) {
        this.sourceType = sourceType;
        this.selectedDatasetImages = [];
        this.datasetImages.forEach(img => img.selected = false);
        this.rerender();
    },

    toggleDatasetImage(imageId) {
        const image = this.datasetImages.find(img => img.id === imageId);
        if (image) {
            image.selected = !image.selected;
            if (image.selected) {
                this.selectedDatasetImages.push(image);
            } else {
                this.selectedDatasetImages = this.selectedDatasetImages.filter(img => img.id !== imageId);
            }
            this.rerender();
        }
    },

    handleFileUpload(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImages.push({
                        id: `upload-${Date.now()}-${i}`,
                        name: file.name,
                        url: e.target.result
                    });
                    if (this.uploadedImages.length === files.length) {
                        this.rerender();
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    },

    runDetection() {
        if (!this.selectedModel) {
            this.notify('请先选择检测模型', 'warning');
            return;
        }

        const imagesToDetect = this.sourceType === 'upload' ? this.uploadedImages : this.selectedDatasetImages;

        if (imagesToDetect.length === 0) {
            this.notify('请先上传或选择图像', 'warning');
            return;
        }

        this.detectionResults = [];
        imagesToDetect.forEach(img => {
            // 获取对应的mask文件名
            const imageNameWithoutExt = img.name.replace(/\.[^/.]+$/, '');
            const maskUrl = `img/${imageNameWithoutExt}.png`;

            const result = {
                imageName: img.name,
                imageUrl: img.url,
                maskUrl: maskUrl,
                modelName: this.selectedModel.name,
                modelVersion: this.selectedModel.version,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                hasDefect: true, // 都有mask，认为有缺陷
                defects: this.generateDefectsFromMask(imageNameWithoutExt)
            };
            this.detectionResults.push(result);
        });

        this.notify(`检测完成，共处理 ${imagesToDetect.length} 张图像`, 'success');
        this.rerender();
    },

    generateDefectsFromMask(imageName) {
        // 根据图像名称返回预设的缺陷信息
        const defectInfo = {
            '000000': {
                type: '活节',
                color: '#ff4d4f',
                x: 20,
                y: 30,
                width: 40,
                height: 30
            },
            '000010': {
                type: '死节',
                color: '#ff7a45',
                x: 15,
                y: 25,
                width: 50,
                height: 35
            }
        };

        return [defectInfo[imageName] || {
            type: '其他',
            color: '#722ed1',
            x: 10,
            y: 10,
            width: 80,
            height: 80
        }];
    },

    clearResults() {
        this.detectionResults = [];
        this.uploadedImages = [];
        this.selectedDatasetImages = [];
        this.datasetImages.forEach(img => img.selected = false);
        this.notify('已清空检测结果', 'info');
        this.rerender();
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
        }, 3000);
    }
};
