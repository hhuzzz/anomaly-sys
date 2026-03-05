const SampleManagement = {
    selectedSamples: [],
    currentSample: null,
    currentVersion: 'v1.0',
    datasets: [
        {
            id: 1,
            name: '轴承表面缺陷',
            version: 'v1.0',
            createdAt: '2026-03-01',
            sampleCount: 156,
            status: '已归档'
        },
        {
            id: 2,
            name: '轴承表面缺陷',
            version: 'v1.1',
            createdAt: '2026-03-03',
            sampleCount: 203,
            status: '已归档'
        }
    ],
    lines: ['一号产线', '二号产线', '三号产线'],
    productTypes: ['拉链', '轴承外壳', '轴承保持架'],
    samples: [
        {
            id: 'SM-20260305-001',
            imageName: '001.png',
            imageUrl: 'img/ad/001.png',
            maskUrl: 'img/ad/001_mask.png',
            labelmePath: 'annotations/001.json',
            lineName: '一号产线',
            productType: '拉链',
            defectType: '未分类',
            severity: '-',
            annotated: false,
            annotationType: 'labelme',
            createdAt: '2026-03-05 10:30:00',
            source: '通用异常检测'
        },
        {
            id: 'SM-20260305-002',
            imageName: '002.png',
            imageUrl: 'img/ad/002.png',
            maskUrl: 'img/ad/002_mask.png',
            labelmePath: 'annotations/002.json',
            lineName: '一号产线',
            productType: '拉链',
            defectType: '未分类',
            severity: '-',
            annotated: false,
            annotationType: 'labelme',
            createdAt: '2026-03-05 11:15:00',
            source: '通用异常检测'
        },
        {
            id: 'SM-20260305-003',
            imageName: '001.png',
            imageUrl: 'img/ad/001.png',
            maskUrl: 'img/ad/001_mask.png',
            labelmePath: '',
            lineName: '一号产线',
            productType: '拉链',
            defectType: '未分类',
            severity: '-',
            annotated: false,
            annotationType: '-',
            createdAt: '2026-03-05 14:20:00',
            source: '通用异常检测'
        }
    ],
    defectTypes: ['划痕', '凹陷', '裂纹', '气泡', '污渍', '其他'],
    severityLevels: ['轻微', '中等', '严重'],

    init() {
        this.render();
    },

    render() {
        const currentSample = this.currentSample || this.samples[0];
        const selectedCount = this.selectedSamples.length;

        return `
            <div class="card">
                <div class="card-header">数据集版本管理</div>
                <div class="card-body">
                    <div class="dataset-version-section">
                        <div class="version-header">
                            <div class="version-info">
                                <span class="version-badge">当前版本: ${this.currentVersion}</span>
                                <span class="version-date">创建时间: 2026-03-05</span>
                            </div>
                            <div class="version-actions">
                                <button class="btn btn-primary btn-sm" onclick="SampleManagement.createVersion()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                        <path d="M12 5v14M5 12h14"></path>
                                    </svg>
                                    新建版本
                                </button>
                                <button class="btn btn-default btn-sm" onclick="SampleManagement.showVersionHistory()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    版本历史
                                </button>
                            </div>
                        </div>
                        <div class="version-stats">
                            <div class="version-stat">
                                <strong>${this.samples.length}</strong>
                                <span>样本总数</span>
                            </div>
                            <div class="version-stat">
                                <strong>${this.samples.filter(s => s.annotated).length}</strong>
                                <span>已标注</span>
                            </div>
                            <div class="version-stat">
                                <strong>${this.samples.filter(s => !s.annotated).length}</strong>
                                <span>待标注</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">样本筛选</div>
                        <div class="card-body">
                            <div class="filter-group">
                                <div class="form-group">
                                    <label>产线</label>
                                    <select class="form-control form-select" id="sm-line-filter">
                                        <option value="">全部产线</option>
                                        ${this.lines.map(line => `
                                            <option value="${line}">${line}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>产品型号</label>
                                    <select class="form-control form-select" id="sm-product-filter">
                                        <option value="">全部产品</option>
                                        ${this.productTypes.map(type => `
                                            <option value="${type}">${type}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>标注状态</label>
                                    <select class="form-control form-select" id="sm-annotation-filter">
                                        <option value="">全部状态</option>
                                        <option value="annotated">已标注</option>
                                        <option value="unannotated">待标注</option>
                                    </select>
                                </div>
                                <button class="btn btn-primary btn-full" onclick="SampleManagement.filterSamples()">
                                    应用筛选
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">样本列表 <span class="badge badge-primary">${selectedCount > 0 ? `已选 ${selectedCount}` : ''}</span></div>
                        <div class="card-body">
                            <div class="table-toolbar">
                                <input type="text" class="search-input" placeholder="搜索样本..." oninput="SampleManagement.searchSamples(this.value)">
                                <button class="btn btn-default" onclick="SampleManagement.batchAnnotate()">
                                    批量标注
                                </button>
                            </div>
                            <table class="sm-table">
                                <thead>
                                    <tr>
                                        <th width="40"><input type="checkbox" onchange="SampleManagement.toggleAll(this)"></th>
                                        <th width="150">图像名称</th>
                                        <th width="100">产线</th>
                                        <th width="120">产品型号</th>
                                        <th width="80">缺陷类型</th>
                                        <th width="80">标注</th>
                                        <th width="150">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="sm-samples-body">
                                    ${this.renderSamples(this.samples)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <div class="card">
                        <div class="card-header">图像标注工具</div>
                        <div class="card-body">
                            <div class="annotation-workspace">
                                <div class="annotation-preview">
                                    <div class="preview-tabs">
                                        <button class="tab-btn ${currentSample ? 'active' : ''}" onclick="SampleManagement.switchPreview('original')">原始图像</button>
                                        <button class="tab-btn" onclick="SampleManagement.switchPreview('mask')">异常分割</button>
                                    </div>
                                    <div class="preview-container">
                                        <img src="${currentSample ? currentSample.imageUrl : 'img/ad/001.png'}" alt="样本图像" class="preview-image" id="sm-preview-image">
                                        <div class="annotation-overlays" id="sm-annotation-overlays"></div>
                                    </div>
                                </div>

                                <div class="annotation-controls">
                                    <div class="control-section">
                                        <h4>LabelMe 标注工具</h4>
                                        <div class="labelme-info">
                                            <p>使用 LabelMe 进行像素级缺陷区域标注</p>
                                            <ul class="labelme-features">
                                                <li>支持多边形、矩形、圆形标注</li>
                                                <li>自动保存为 JSON 格式</li>
                                                <li>可导出为 Pascal VOC、COCO 等格式</li>
                                                <li>支持标注数据版本管理</li>
                                            </ul>
                                        </div>
                                        <button class="btn btn-primary btn-full" onclick="SampleManagement.openLabelMe('${currentSample ? currentSample.id : ''}')">
                                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                            启动 LabelMe
                                        </button>
                                    </div>

                                    <div class="control-section">
                                        <h4>标注状态</h4>
                                        <div class="annotation-status">
                                            <div class="status-item">
                                                <span>标注文件:</span>
                                                <strong>${currentSample && currentSample.labelmePath ? currentSample.labelmePath : '未生成'}</strong>
                                            </div>
                                            <div class="status-item">
                                                <span>标注时间:</span>
                                                <strong>${currentSample ? currentSample.createdAt : '-'}</strong>
                                            </div>
                                        </div>
                                        <button class="btn btn-default btn-full" onclick="SampleManagement.viewLabelMeJson()">
                                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                            查看 JSON
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">样本信息</div>
                        <div class="card-body">
                            <div class="sample-info-grid">
                                <div class="info-item">
                                    <span>样本ID</span>
                                    <strong>${currentSample ? currentSample.id : '-'}</strong>
                                </div>
                                <div class="info-item">
                                    <span>图像名称</span>
                                    <strong>${currentSample ? currentSample.imageName : '-'}</strong>
                                </div>
                                <div class="info-item">
                                    <span>产线</span>
                                    <strong>${currentSample ? currentSample.lineName : '-'}</strong>
                                </div>
                                <div class="info-item">
                                    <span>产品型号</span>
                                    <strong>${currentSample ? currentSample.productType : '-'}</strong>
                                </div>
                                <div class="info-item">
                                    <span>数据来源</span>
                                    <strong>${currentSample ? currentSample.source : '-'}</strong>
                                </div>
                                <div class="info-item">
                                    <span>缺陷类型</span>
                                    <strong class="${currentSample && currentSample.defectType !== '未分类' ? 'text-danger' : 'text-muted'}">
                                        ${currentSample ? currentSample.defectType : '-'}
                                    </strong>
                                </div>
                                <div class="info-item">
                                    <span>标注状态</span>
                                    <span class="tag ${currentSample && currentSample.annotated ? 'tag-success' : 'tag-warning'}">
                                        ${currentSample ? (currentSample.annotated ? '已标注' : '待标注') : '-'}
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span>标注方式</span>
                                    <strong>${currentSample ? (currentSample.annotationType === 'labelme' ? 'LabelMe' : '-') : '-'}</strong>
                                </div>
                                <div class="info-item">
                                    <span>数据版本</span>
                                    <strong>${currentSample ? currentSample.datasetVersion : '-'}</strong>
                                </div>
                                <div class="info-item">
                                    <span>创建时间</span>
                                    <strong>${currentSample ? currentSample.createdAt : '-'}</strong>
                                </div>
                            </div>
                            <div class="annotation-actions">
                                <button class="btn btn-default" onclick="SampleManagement.exportAnnotation()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    导出标注
                                </button>
                                <button class="btn btn-danger" onclick="SampleManagement.deleteSample()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    删除样本
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderSamples(samples) {
        if (!samples.length) {
            return `
                <tr>
                    <td colspan="7">
                        <div class="empty-state" style="padding: 32px 0;">
                            <h3>没有匹配的样本</h3>
                            <p>调整筛选条件或添加新的样本。</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        return samples.map(sample => `
            <tr class="${this.selectedSamples.includes(sample.id) ? 'selected-row' : ''}">
                <td><input type="checkbox" ${this.selectedSamples.includes(sample.id) ? 'checked' : ''} onchange="SampleManagement.toggleSelect('${sample.id}')"></td>
                <td>${sample.imageName}</td>
                <td>${sample.lineName}</td>
                <td>${sample.productType}</td>
                <td><span class="tag ${sample.defectType === '未分类' ? 'tag-warning' : 'tag-info'}">${sample.defectType}</span></td>
                <td><span class="tag ${sample.annotated ? 'tag-success' : 'tag-warning'}">${sample.annotated ? '已标注' : '待标注'}</span></td>
                <td>
                    <a href="#" style="color: #1890ff; margin-right: 8px;" onclick="SampleManagement.viewSample('${sample.id}'); return false;">查看</a>
                    <a href="#" style="color: #52c41a;" onclick="SampleManagement.openLabelMe('${sample.id}'); return false;">打开LabelMe</a>
                </td>
            </tr>
        `).join('');
    },

    viewSample(sampleId) {
        const sample = this.samples.find(s => s.id === sampleId);
        if (sample) {
            this.currentSample = sample;
            this.rerender();
        }
    },

    openLabelMe(sampleId) {
        const sample = this.samples.find(s => s.id === sampleId);
        if (sample) {
            this.currentSample = sample;
            this.rerender();

            // 模拟调用labelme命令
            const labelmePath = '/usr/local/bin/labelme'; // labelme的安装路径
            const imagePath = `/home/huhuan/anomaly/sys/anomaly-sys/${sample.imageUrl}`;

            // 在实际应用中，这里会调用后端API来启动labelme
            // 这里我们模拟操作
            this.notify(`正在启动LabelMe标注工具: ${sample.imageName}`, 'info');

            // 实际调用示例（需要后端支持）：
            // fetch('/api/labelme/open', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ imagePath })
            // });
        }
    },

    annotateSample(sampleId) {
        const sample = this.samples.find(s => s.id === sampleId);
        if (sample) {
            this.currentSample = sample;
            this.rerender();
            this.notify('正在标注样本: ' + sample.imageName, 'info');
        }
    },

    toggleSelect(sampleId) {
        const index = this.selectedSamples.indexOf(sampleId);
        if (index > -1) {
            this.selectedSamples.splice(index, 1);
        } else {
            this.selectedSamples.push(sampleId);
        }
        this.rerender();
    },

    toggleAll(checkbox) {
        if (checkbox.checked) {
            this.selectedSamples = this.samples.map(s => s.id);
        } else {
            this.selectedSamples = [];
        }
        this.rerender();
    },

    filterSamples() {
        const lineFilter = document.getElementById('sm-line-filter').value;
        const productFilter = document.getElementById('sm-product-filter').value;
        const annotationFilter = document.getElementById('sm-annotation-filter').value;
        const versionFilter = document.getElementById('sm-version-filter').value;

        const filtered = this.samples.filter(sample => {
            const matchLine = !lineFilter || sample.lineName === lineFilter;
            const matchProduct = !productFilter || sample.productType === productFilter;
            const matchAnnotation = !annotationFilter ||
                (annotationFilter === 'annotated' && sample.annotated) ||
                (annotationFilter === 'unannotated' && !sample.annotated);
            const matchVersion = !versionFilter || sample.datasetVersion === versionFilter;
            return matchLine && matchProduct && matchAnnotation && matchVersion;
        });

        const tbody = document.getElementById('sm-samples-body');
        if (tbody) {
            tbody.innerHTML = this.renderSamples(filtered);
        }
        this.notify(`筛选完成，共 ${filtered.length} 个样本`, 'info');
    },

    searchSamples(keyword) {
        const filtered = this.samples.filter(s =>
            s.imageName.toLowerCase().includes(keyword.toLowerCase()) ||
            s.defectType.toLowerCase().includes(keyword.toLowerCase()) ||
            s.lineName.toLowerCase().includes(keyword.toLowerCase()) ||
            s.productType.toLowerCase().includes(keyword.toLowerCase())
        );
        const tbody = document.getElementById('sm-samples-body');
        if (tbody) {
            tbody.innerHTML = this.renderSamples(filtered);
        }
    },

    createVersion() {
        const newVersion = prompt('请输入新版本号（如 v1.2）:');
        if (newVersion) {
            this.datasets.push({
                id: this.datasets.length + 1,
                name: '轴承表面缺陷',
                version: newVersion,
                createdAt: new Date().toISOString().split('T')[0],
                sampleCount: this.samples.length,
                status: '草稿'
            });
            this.currentVersion = newVersion;
            this.notify('新版本已创建: ' + newVersion, 'success');
            this.rerender();
        }
    },

    showVersionHistory() {
        this.notify('显示版本历史功能开发中...', 'info');
    },

    batchAnnotate() {
        if (this.selectedSamples.length === 0) {
            this.notify('请先选择要标注的样本', 'warning');
            return;
        }
        this.notify(`开始批量标注 ${this.selectedSamples.length} 个样本`, 'info');
    },

    switchPreview(type) {
        this.notify('切换显示模式: ' + (type === 'original' ? '原始图像' : type === 'mask' ? '异常分割' : '叠加显示'), 'info');
    },

    selectTool(tool) {
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        event.target.closest('.tool-btn').classList.add('active');
        this.notify('已选择工具: ' + tool, 'info');
    },

    updateBrushSize(size) {
        document.getElementById('brush-size-value').textContent = size;
    },

    saveImageAnnotation() {
        if (!this.currentSample) return;
        const defectType = document.getElementById('sm-defect-type').value;
        const severity = document.getElementById('sm-severity').value;
        
        if (!defectType || !severity) {
            this.notify('请选择缺陷类型和严重程度', 'warning');
            return;
        }

        const sample = this.samples.find(s => s.id === this.currentSample.id);
        if (sample) {
            sample.defectType = defectType;
            sample.severity = severity;
            sample.annotated = true;
            sample.annotationType = 'image';
            this.notify('图像级标注已保存', 'success');
            this.rerender();
        }
    },

    savePixelAnnotation() {
        if (!this.currentSample) return;
        const sample = this.samples.find(s => s.id === this.currentSample.id);
        if (sample) {
            sample.annotated = true;
            sample.annotationType = 'pixel';
            this.notify('像素级标注已保存', 'success');
            this.rerender();
        }
    },

    clearAnnotations() {
        const overlays = document.getElementById('sm-annotation-overlays');
        if (overlays) {
            overlays.innerHTML = '';
            this.notify('标注已清除', 'info');
        }
    },

    exportAnnotation() {
        if (!this.currentSample) return;
        this.notify('标注数据导出中...', 'info');
        setTimeout(() => {
            this.notify('标注已导出', 'success');
        }, 1000);
    },

    viewLabelMeJson() {
        if (!this.currentSample || !this.currentSample.labelmePath) {
            this.notify('暂无标注文件', 'warning');
            return;
        }

        // 模拟显示JSON内容
        const sampleJson = {
            version: '5.0.1',
            flags: {},
            shapes: [
                {
                    label: '划痕',
                    points: [[100, 100], [200, 150], [150, 200]],
                    group_id: null,
                    shape_type: 'polygon',
                    flags: {}
                }
            ],
            imagePath: this.currentSample.imageName,
            imageData: null,
            imageHeight: 1024,
            imageWidth: 1024
        };

        console.log('LabelMe JSON:', JSON.stringify(sampleJson, null, 2));
        this.notify('JSON内容已在控制台显示', 'info');
    },

    deleteSample() {
        if (!this.currentSample) return;
        if (confirm('确定要删除此样本吗？')) {
            this.samples = this.samples.filter(s => s.id !== this.currentSample.id);
            this.currentSample = this.samples[0] || null;
            this.notify('样本已删除', 'success');
            this.rerender();
        }
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

