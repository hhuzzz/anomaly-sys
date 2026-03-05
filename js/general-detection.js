const GeneralDetection = {
    selectedFiles: [],
    sourceType: 'dataset',
    datasetImages: [
        { id: 'img-001', name: '001.png', url: 'img/ad/001.png', selected: false },
        { id: 'img-002', name: '002.png', url: 'img/ad/002.png', selected: false }
    ],
    records: [
        {
            id: 'GD-20260305-001',
            imageName: '001.png',
            productType: '轴承外壳',
            lineName: '一号产线',
            threshold: 0.6,
            anomalyScore: 0.82,
            decision: 'suspected',
            sampleSaved: true,
            inferenceTimeMs: 241,
            detectedAt: '2026-03-05 09:12:30',
            imageUrl: 'img/ad/001.png',
            heatmapUrl: 'img/ad/001_mask.png'
        },
        {
            id: 'GD-20260305-002',
            imageName: '002.png',
            productType: '轴承外壳',
            lineName: '一号产线',
            threshold: 0.6,
            anomalyScore: 0.34,
            decision: 'normal',
            sampleSaved: false,
            inferenceTimeMs: 226,
            detectedAt: '2026-03-05 09:18:05',
            imageUrl: 'img/ad/002.png',
            heatmapUrl: 'img/ad/002_mask.png'
        }
    ],
    currentResult: null,

    render() {
        const currentResult = this.getCurrentResult();
        const fileSummary = this.selectedFiles.length
            ? `${this.selectedFiles.length} 张待检测图像`
            : '尚未选择图像';
        const sourceType = this.sourceType || 'upload';

        return `
            <div class="card">
                <div class="card-header">冷启动异常初筛</div>
                <div class="card-body">
                    <div class="gd-hero">
                        <div>
                            <h3>通用异常检测</h3>
                            <p>面向未知缺陷的初步筛选，输出异常得分、检测图，并按阈值自动沉淀疑似异常样本。</p>
                        </div>
                        <div class="gd-hero-stats">
                            <div class="gd-stat">
                                <strong>${this.records.length}</strong>
                                <span>累计检测</span>
                            </div>
                            <div class="gd-stat">
                                <strong>${this.records.filter(item => item.sampleSaved).length}</strong>
                                <span>自动入库</span>
                            </div>
                            <div class="gd-stat">
                                <strong>${this.getAverageScore()}</strong>
                                <span>平均得分</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">检测配置</div>
                        <div class="card-body">
                            <div class="form-group">
                                <label>数据来源</label>
                                <select class="form-control form-select" id="gd-source-type" onchange="GeneralDetection.handleSourceTypeChange(this.value)">
                                    <option value="upload" ${sourceType === 'upload' ? 'selected' : ''}>本地上传</option>
                                    <option value="dataset" ${sourceType === 'dataset' ? 'selected' : ''}>从数据管理选择</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>产线</label>
                                <select class="form-control form-select" id="gd-line-name">
                                    <option value="一号产线">一号产线</option>
                                    <option value="二号产线">二号产线</option>
                                    <option value="三号产线">三号产线</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>产品型号</label>
                                <input type="text" class="form-control" id="gd-product-type" value="轴承外壳" placeholder="请输入产品型号">
                            </div>
                            <div class="form-group">
                                <label>批次号</label>
                                <input type="text" class="form-control" id="gd-batch-no" value="BATCH-20260305-01" placeholder="请输入批次号">
                            </div>
                            <div class="form-group">
                                <label>模型选择</label>
                                <select class="form-control form-select" id="gd-model-id">
                                    <option value="zero-shot-anomaly-v1">FA-CLIP-MVTEC</option>
                                    <option value="zero-shot-anomaly-v2">FA-CLIP-VISA</option>
                                    <option value="industrial-foundation-zs">AnomalyCLIP</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>异常阈值: <span id="gd-threshold-value">0.60</span></label>
                                <input
                                    type="range"
                                    class="slider"
                                    id="gd-threshold"
                                    min="0.1"
                                    max="0.95"
                                    step="0.01"
                                    value="0.60"
                                    oninput="GeneralDetection.updateThresholdLabel(this.value)"
                                >
                                <div class="marks">
                                    <span>0.10</span>
                                    <span>0.60</span>
                                    <span>0.95</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>待检测图像</label>
                                ${sourceType === 'upload' ? `
                                    <div class="upload-area" onclick="document.getElementById('gd-file-input').click()">
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        <p>点击选择检测图像</p>
                                        <input type="file" id="gd-file-input" accept="image/*" multiple style="display: none;" onchange="GeneralDetection.handleFileSelect(event)">
                                    </div>
                                    <div class="import-info">
                                        <p class="info-text">${fileSummary}</p>
                                        <p class="info-text">支持 JPG、PNG、BMP，建议单批次不超过 20 张</p>
                                    </div>
                                    ${this.renderFileList()}
                                ` : `
                                    <div class="dataset-grid">
                                        ${this.renderDatasetImages()}
                                    </div>
                                    <div class="import-info">
                                        <p class="info-text">${fileSummary}</p>
                                        <p class="info-text">从数据管理中选择待检测图像，可多选</p>
                                    </div>
                                `}
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-primary" onclick="GeneralDetection.runDetection()">
                                    开始检测
                                </button>
                                <button class="btn btn-default" onclick="GeneralDetection.resetForm()">
                                    重置
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <div class="card">
                        <div class="card-header">检测结果</div>
                        <div class="card-body">
                            <div class="gd-result-grid">
                                <div class="gd-preview-card">
                                    <div class="gd-preview-header">原始图像</div>
                                    <div class="gd-preview-frame">
                                        <img src="${currentResult.imageUrl}" alt="原始图像">
                                    </div>
                                </div>
                                <div class="gd-preview-card">
                                    <div class="gd-preview-header">异常检测图</div>
                                    <div class="gd-preview-frame">
                                        <img src="${currentResult.heatmapUrl}" alt="异常检测图">
                                    </div>
                                </div>
                            </div>

                            <div class="gd-metric-grid">
                                <div class="gd-metric-card">
                                    <span>异常得分</span>
                                    <strong>${currentResult.anomalyScore.toFixed(2)}</strong>
                                </div>
                                <div class="gd-metric-card">
                                    <span>判定阈值</span>
                                    <strong>${currentResult.threshold.toFixed(2)}</strong>
                                </div>
                                <div class="gd-metric-card">
                                    <span>判定结果</span>
                                    <strong class="${currentResult.decision === 'suspected' ? 'gd-text-danger' : 'gd-text-success'}">${this.getDecisionText(currentResult.decision)}</strong>
                                </div>
                                <div class="gd-metric-card">
                                    <span>推理耗时</span>
                                    <strong>${currentResult.inferenceTimeMs} ms</strong>
                                </div>
                            </div>

                            <div class="gd-decision-banner ${currentResult.decision === 'suspected' ? 'gd-banner-danger' : 'gd-banner-success'}">
                                <div>
                                    <strong>${this.getDecisionText(currentResult.decision)}</strong>
                                    <p>${currentResult.decision === 'suspected'
                                        ? '异常得分高于阈值，已标记为疑似异常样本。'
                                        : '异常得分未超过阈值，当前判定为正常样本。'
                                    }</p>
                                </div>
                                <span class="tag ${currentResult.sampleSaved ? 'tag-danger' : 'tag-success'}">
                                    ${currentResult.sampleSaved ? '已自动入库' : '未入样本库'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">历史检测记录</div>
                <div class="card-body">
                    <div class="table-toolbar">
                        <div class="search-box">
                            <input type="text" class="search-input" id="gd-search-input" placeholder="搜索图像名称..." oninput="GeneralDetection.filterRecords()">
                            <select class="form-control form-select" id="gd-filter-decision" style="width: 160px;" onchange="GeneralDetection.filterRecords()">
                                <option value="">全部判定</option>
                                <option value="suspected">疑似异常</option>
                                <option value="normal">正常</option>
                            </select>
                        </div>
                        <div class="search-box">
                            <button class="btn btn-default" onclick="GeneralDetection.loadLatestResult()">
                                定位最新结果
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th width="160">任务编号</th>
                                <th width="200">图像名称</th>
                                <th width="120">产线</th>
                                <th width="120">产品型号</th>
                                <th width="120">异常得分</th>
                                <th width="120">判定结果</th>
                                <th width="120">入库状态</th>
                                <th width="180">检测时间</th>
                                <th width="180">操作</th>
                            </tr>
                        </thead>
                        <tbody id="gd-records-body">
                            ${this.renderRecords(this.records)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderFileList() {
        if (!this.selectedFiles.length) {
            return '<div class="gd-file-list gd-file-list-empty">当前没有待检测图像</div>';
        }

        return `
            <div class="gd-file-list">
                ${this.selectedFiles.map((file, index) => `
                    <div class="gd-file-item">
                        <span title="${file.name}">${file.name}</span>
                        <button type="button" class="gd-file-remove" onclick="GeneralDetection.removeFile(${index})">移除</button>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderDatasetImages() {
        console.log('renderDatasetImages called', this.datasetImages);
        return this.datasetImages.map(img => `
            <div class="dataset-item ${img.selected ? 'dataset-item-selected' : ''}" onclick="GeneralDetection.toggleDatasetImage('${img.id}')">
                <img src="${img.url}" alt="${img.name}" onerror="console.error('Failed to load image:', '${img.url}')">
                <div class="dataset-item-mask">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="dataset-item-name">${img.name}</span>
            </div>
        `).join('');
    },

    renderRecords(records) {
        if (!records.length) {
            return `
                <tr>
                    <td colspan="9">
                        <div class="empty-state" style="padding: 48px 0;">
                            <h3>没有匹配记录</h3>
                            <p>调整筛选条件后重试。</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        return records.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.imageName}</td>
                <td>${item.lineName}</td>
                <td>${item.productType}</td>
                <td>${item.anomalyScore.toFixed(2)}</td>
                <td><span class="tag ${item.decision === 'suspected' ? 'tag-danger' : 'tag-success'}">${this.getDecisionText(item.decision)}</span></td>
                <td><span class="tag ${item.sampleSaved ? 'tag-danger' : 'tag-success'}">${item.sampleSaved ? '已入库' : '未入库'}</span></td>
                <td>${item.detectedAt}</td>
                <td>
                    <a href="#" style="color: #1890ff; margin-right: 16px;" onclick="GeneralDetection.viewRecord('${item.id}'); return false;">查看</a>
                    ${item.sampleSaved
                        ? '<span style="color: #999;">已归档</span>'
                        : `<a href="#" style="color: #52c41a;" onclick="GeneralDetection.saveToSampleLibrary('${item.id}'); return false;">加入样本库</a>`
                    }
                </td>
            </tr>
        `).join('');
    },

    getCurrentResult() {
        return this.currentResult || this.records[0];
    },

    getAverageScore() {
        const total = this.records.reduce((sum, item) => sum + item.anomalyScore, 0);
        return (total / this.records.length).toFixed(2);
    },

    getDecisionText(decision) {
        return decision === 'suspected' ? '疑似异常' : '正常';
    },

    updateThresholdLabel(value) {
        const label = document.getElementById('gd-threshold-value');
        if (label) {
            label.textContent = Number(value).toFixed(2);
        }
    },

    handleFileSelect(event) {
        const files = Array.from(event.target.files || []);
        this.selectedFiles = [...this.selectedFiles, ...files];
        this.rerender();
    },

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.rerender();
    },

    handleSourceTypeChange(value) {
        this.sourceType = value;
        this.selectedFiles = [];
        this.datasetImages.forEach(img => img.selected = false);
        this.rerender();
    },

    toggleDatasetImage(imageId) {
        const img = this.datasetImages.find(item => item.id === imageId);
        if (!img) {
            return;
        }

        img.selected = !img.selected;

        const selectedImages = this.datasetImages.filter(item => item.selected);
        this.selectedFiles = selectedImages.map(img => ({
            name: img.name,
            url: img.url,
            id: img.id
        }));

        this.rerender();
    },

    resetForm() {
        this.selectedFiles = [];
        this.sourceType = 'upload';
        this.datasetImages.forEach(img => img.selected = false);
        this.currentResult = this.records[0];
        this.rerender();
        this.notify('已重置检测配置', 'info');
    },

    runDetection() {
        if (!this.selectedFiles.length) {
            this.notify('请先选择待检测图像', 'warning');
            return;
        }

        const threshold = Number(document.getElementById('gd-threshold').value);
        const lineName = document.getElementById('gd-line-name').value;
        const productType = document.getElementById('gd-product-type').value || '未命名产品';
        const latestFile = this.selectedFiles[0];
        const score = this.generateMockScore();
        const decision = score >= threshold ? 'suspected' : 'normal';

        // 根据图像文件名匹配对应的mask文件
        const imageName = latestFile.name || '001.png';
        const imageNameWithoutExt = imageName.replace(/\.[^/.]+$/, '');
        const imageUrl = latestFile.url || `img/ad/${imageName}`;
        const heatmapUrl = `img/ad/${imageNameWithoutExt}_mask.png`;

        const record = {
            id: `GD-${Date.now()}`,
            imageName,
            productType,
            lineName,
            threshold,
            anomalyScore: score,
            decision,
            sampleSaved: decision === 'suspected',
            inferenceTimeMs: Math.floor(Math.random() * 90) + 180,
            detectedAt: this.formatDate(new Date()),
            imageUrl,
            heatmapUrl
        };

        this.records.unshift(record);
        this.currentResult = record;

        if (record.sampleSaved) {
            this.persistSample(record);
        }

        this.selectedFiles = [];
        this.rerender();
        this.notify(record.sampleSaved ? '检测完成，疑似异常样本已自动入库' : '检测完成，当前样本判定为正常', record.sampleSaved ? 'success' : 'info');
    },

    loadLatestResult() {
        this.currentResult = this.records[0];
        this.rerender();
        this.notify('已定位到最新检测结果', 'info');
    },

    viewRecord(recordId) {
        const record = this.records.find(item => item.id === recordId);
        if (!record) {
            return;
        }

        this.currentResult = record;
        this.rerender();
        this.notify(`已加载记录 ${record.imageName}`, 'info');
    },

    saveToSampleLibrary(recordId) {
        const record = this.records.find(item => item.id === recordId);
        if (!record) {
            return;
        }

        record.sampleSaved = true;
        this.persistSample(record);
        this.currentResult = record;
        this.rerender();
        this.notify('样本已加入异常样本库', 'success');
    },

    persistSample(record) {
        const storageKey = 'anomaly-sample-library';
        const samples = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const exists = samples.some(item => item.id === record.id);
        if (!exists) {
            samples.unshift({
                id: record.id,
                imageName: record.imageName,
                anomalyScore: record.anomalyScore,
                threshold: record.threshold,
                detectedAt: record.detectedAt,
                lineName: record.lineName,
                productType: record.productType
            });
            localStorage.setItem(storageKey, JSON.stringify(samples));
        }
    },

    filterRecords() {
        const keyword = (document.getElementById('gd-search-input')?.value || '').trim().toLowerCase();
        const decision = document.getElementById('gd-filter-decision')?.value || '';
        const filtered = this.records.filter(item => {
            const matchKeyword = !keyword || item.imageName.toLowerCase().includes(keyword);
            const matchDecision = !decision || item.decision === decision;
            return matchKeyword && matchDecision;
        });

        const tbody = document.getElementById('gd-records-body');
        if (tbody) {
            tbody.innerHTML = this.renderRecords(filtered);
        }
    },

    rerender() {
        const container = document.getElementById('page-content');
        if (!container) {
            return;
        }

        container.innerHTML = this.render();
    },

    generateMockScore() {
        return Number((Math.random() * 0.7 + 0.2).toFixed(2));
    },

    formatDate(date) {
        const pad = value => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
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
