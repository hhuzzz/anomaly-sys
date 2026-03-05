const ModelTraining = {
    selectedDataset: null,
    selectedTask: null,
    isTraining: false,
    currentLogPath: 'log/20260305_174817.log',
    datasetPage: 1,
    datasetPageSize: 4,

    datasets: [
        {
            id: 'DS-001',
            name: '松树木材表面缺陷数据集 一批',
            version: 'v1.0',
            sampleCount: 156,
            annotatedCount: 120,
            lineName: '一号产线',
            productType: '松树木材',
            createdAt: '2026-03-01',
            status: '已完成'
        },
        {
            id: 'DS-002',
            name: '橡胶木材表面缺陷数据集 一批',
            version: 'v1.1',
            sampleCount: 203,
            annotatedCount: 185,
            lineName: '一号产线',
            productType: '橡胶木材',
            createdAt: '2026-03-03',
            status: '已完成'
        },
        {
            id: 'DS-003',
            name: '热轧带钢表面缺陷',
            version: 'v1.0',
            sampleCount: 89,
            annotatedCount: 45,
            lineName: '二号产线',
            productType: '轴承内圈',
            createdAt: '2026-03-05',
            status: '已完成'
        },

    ],

    trainingTasks: [
    ],

    hyperparameters: {
        learningRate: 0.001,
        batchSize: 16,
        epochs: 100,
        optimizer: 'Adam',
        lossFunction: 'CrossEntropy',
        backbone: 'ResNet50',
        freezeBackbone: true
    },

    init() {
        this.render();
    },

    render() {
        const selectedCount = this.selectedDataset ? 1 : 0;

        return `
            <div class="card">
                <div class="card-header">训练配置</div>
                <div class="card-body">
                    <div class="training-config-row">
                        <!-- 数据集选择 -->
                        <div class="config-section dataset-section">
                            <h3>数据集选择 <span class="dataset-count-badge">${this.datasets.length} 个</span></h3>
                            <div class="dataset-list-horizontal">
                                ${this.renderDatasets()}
                            </div>
                            ${this.datasets.length > this.datasetPageSize ? `
                                <div class="dataset-pagination-small">
                                    <button class="btn-icon" onclick="ModelTraining.prevPage()" ${this.datasetPage === 1 ? 'disabled' : ''}>
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>
                                    <span class="page-info-small">${this.datasetPage}/${Math.ceil(this.datasets.length / this.datasetPageSize)}</span>
                                    <button class="btn-icon" onclick="ModelTraining.nextPage()" ${this.datasetPage === Math.ceil(this.datasets.length / this.datasetPageSize) ? 'disabled' : ''}>
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <!-- 超参数配置 -->
                        <div class="config-section hyperparams-section">
                            <h3>训练超参数</h3>
                            <div class="hyperparams-grid">
                                <div class="param-item">
                                    <label>学习率</label>
                                    <input type="number" class="form-control param-input" value="${this.hyperparameters.learningRate}" step="0.0001" id="mt-learning-rate">
                                </div>
                                <div class="param-item">
                                    <label>批次大小</label>
                                    <select class="form-control param-input" id="mt-batch-size">
                                        <option value="8" ${this.hyperparameters.batchSize === 8 ? 'selected' : ''}>8</option>
                                        <option value="16" ${this.hyperparameters.batchSize === 16 ? 'selected' : ''}>16</option>
                                        <option value="32" ${this.hyperparameters.batchSize === 32 ? 'selected' : ''}>32</option>
                                        <option value="64" ${this.hyperparameters.batchSize === 64 ? 'selected' : ''}>64</option>
                                    </select>
                                </div>
                                <div class="param-item">
                                    <label>迭代轮数</label>
                                    <input type="number" class="form-control param-input" value="${this.hyperparameters.epochs}" min="40000" max="160000" id="mt-epochs">
                                </div>
                                <div class="param-item">
                                    <label>优化器</label>
                                    <select class="form-control param-input" id="mt-optimizer">
                                        <option value="Adam" ${this.hyperparameters.optimizer === 'Adam' ? 'selected' : ''}>Adam</option>
                                        <option value="SGD" ${this.hyperparameters.optimizer === 'SGD' ? 'selected' : ''}>SGD</option>
                                        <option value="AdamW" ${this.hyperparameters.optimizer === 'AdamW' ? 'selected' : ''}>AdamW</option>
                                        <option value="RMSprop" ${this.hyperparameters.optimizer === 'RMSprop' ? 'selected' : ''}>RMSprop</option>
                                    </select>
                                </div>
                                <div class="param-item">
                                    <label>损失函数</label>
                                    <select class="form-control param-input" id="mt-loss-function">
                                        <option value="CrossEntropy" ${this.hyperparameters.lossFunction === 'CrossEntropy' ? 'selected' : ''}>CrossEntropy</option>
                                        <option value="FocalLoss" ${this.hyperparameters.lossFunction === 'FocalLoss' ? 'selected' : ''}>FocalLoss</option>
                                        <option value="DiceLoss" ${this.hyperparameters.lossFunction === 'DiceLoss' ? 'selected' : ''}>DiceLoss</option>
                                    </select>
                                </div>
                                <div class="param-item">
                                    <label>主干网络</label>
                                    <select class="form-control param-input" id="mt-backbone">
                                        <option value="MiT-B0" ${this.hyperparameters.backbone === 'MiT-B0' ? 'selected' : ''}>MiT-B0</option>
                                        <option value="MiT-B1" ${this.hyperparameters.backbone === 'MiT-B1' ? 'selected' : ''}>MiT-B1</option>
                                        <option value="MiT-B2" ${this.hyperparameters.backbone === 'MiT-B2' ? 'selected' : ''}>MiT-B2</option>
                                    </select>
                                </div>
                                <div class="param-item">
                                    <label>冻结主干</label>
                                    <select class="form-control param-input" id="mt-freeze-backbone">
                                        <option value="true" ${this.hyperparameters.freezeBackbone ? 'selected' : ''}>是</option>
                                        <option value="false" ${!this.hyperparameters.freezeBackbone ? 'selected' : ''}>否</option>
                                    </select>
                                </div>
                            </div>
                            <button class="btn btn-primary btn-start-training" onclick="ModelTraining.startTraining()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                开始训练
                            </button>
                        </div>
                    </div>
                </div>
            </div>

                <div class="col-8">
                    <div class="card">
                        <div class="card-header">训练任务列表</div>
                        <div class="card-body">
                            <table class="mt-table">
                                <thead>
                                    <tr>
                                        <th width="150">任务ID</th>
                                        <th width="200">数据集</th>
                                        <th width="100">模型</th>
                                        <th width="120">开始时间</th>
                                        <th width="80">进度</th>
                                        <th width="80">状态</th>
                                        <th width="100">最佳Loss</th>
                                        <th width="100">最佳精度</th>
                                        <th width="150">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="mt-tasks-body">
                                    ${this.renderTrainingTasks(this.trainingTasks)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <span>训练日志</span>
                            ${this.selectedTask ? `<span class="log-path-badge">${this.selectedTask.logPath}</span>` : ''}
                        </div>
                        <div class="card-body">
                            <div class="log-controls">
                                <button class="btn btn-default btn-sm" onclick="ModelTraining.refreshLog()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                        <path d="M23 4v6h-6"></path>
                                        <path d="M1 20v-6h6"></path>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                    刷新日志
                                </button>
                                <button class="btn btn-default btn-sm" onclick="ModelManagement.clearLog()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    清空日志
                                </button>
                                <button class="btn btn-default btn-sm" onclick="ModelManagement.downloadLog()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    下载日志
                                </button>
                            </div>
                            <div class="log-container">
                                <pre class="log-content" id="mt-log-content">${this.logLoading ? '加载日志中...' : this.logContent || '请选择一个训练任务查看日志'}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderTrainingTasks(tasks) {
        if (!tasks.length) {
            return `
                <tr>
                    <td colspan="9">
                        <div class="empty-state" style="padding: 32px 0;">
                            <h3>暂无训练任务</h3>
                            <p>选择数据集并开始训练</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        return tasks.map(task => `
            <tr class="${this.selectedTask && this.selectedTask.id === task.id ? 'selected-row' : ''}">
                <td>${task.id}</td>
                <td>${task.datasetName}</td>
                <td>${task.modelName}</td>
                <td>${task.startTime}</td>
                <td>
                    <div class="progress-wrapper">
                        <div class="progress-bar-small">
                            <div class="progress-fill" style="width: ${task.progress}%"></div>
                        </div>
                        <span class="progress-text">${task.progress}%</span>
                    </div>
                </td>
                <td><span class="tag ${task.status === 'completed' ? 'tag-success' : task.status === 'running' ? 'tag-danger' : 'tag-warning'}">${task.status === 'completed' ? '已完成' : task.status === 'running' ? '训练中' : '等待中'}</span></td>
                <td>${task.bestLoss ? task.bestLoss.toFixed(4) : '-'}</td>
                <td>${task.bestAccuracy ? (task.bestAccuracy * 100).toFixed(2) + '%' : '-'}</td>
                <td>
                    <a href="#" style="color: #1890ff; margin-right: 8px;" onclick="ModelTraining.viewTask('${task.id}'); return false;">查看</a>
                    <a href="#" style="color: #52c41a;" onclick="ModelTraining.downloadModel('${task.id}'); return false;">下载</a>
                </td>
            </tr>
        `).join('');
    },

    renderDatasets() {
        const startIndex = (this.datasetPage - 1) * this.datasetPageSize;
        const endIndex = Math.min(startIndex + this.datasetPageSize, this.datasets.length);
        const pageDatasets = this.datasets.slice(startIndex, endIndex);

        return pageDatasets.map(ds => `
            <div class="dataset-card ${this.selectedDataset && this.selectedDataset.id === ds.id ? 'dataset-card-selected' : ''}" onclick="ModelTraining.selectDataset('${ds.id}')">
                <div class="dataset-name">${ds.name}</div>
                <div class="dataset-meta">
                    <span class="meta-info">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                            <path d="M3 21v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"></path>
                            <path d="M5 11l7-7 7 7"></path>
                        </svg>
                        ${ds.lineName} / ${ds.productType}
                    </span>
                    <span class="meta-info">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        ${ds.sampleCount} (${ds.annotatedCount} 已标注)
                    </span>
                </div>
                <div class="dataset-status">
                    <span class="tag ${ds.status === '已完成' ? 'tag-success' : ds.status === '训练中' ? 'tag-danger' : 'tag-warning'}">${ds.status}</span>
                </div>
            </div>
        `).join('');
    },

    selectDataset(datasetId) {
        const dataset = this.datasets.find(ds => ds.id === datasetId);
        if (dataset) {
            this.selectedDataset = dataset;
            this.rerender();
            this.notify('已选择数据集: ' + dataset.name, 'info');
        }
    },

    prevPage() {
        if (this.datasetPage > 1) {
            this.datasetPage--;
            this.rerender();
        }
    },

    nextPage() {
        const totalPages = Math.ceil(this.datasets.length / this.datasetPageSize);
        if (this.datasetPage < totalPages) {
            this.datasetPage++;
            this.rerender();
        }
    },

    viewTask(taskId) {
        const task = this.trainingTasks.find(t => t.id === taskId);
        if (task) {
            this.selectedTask = task;
            this.currentLogPath = task.logPath;
            this.loadLog(task.logPath);
            this.rerender();
        }
    },

    async loadLog(logPath) {
        this.logLoading = true;
        this.rerender();

        try {
            const response = await fetch(logPath);
            if (response.ok) {
                this.logContent = await response.text();
            } else {
                this.logContent = '日志文件加载失败: ' + logPath;
            }
        } catch (error) {
            this.logContent = '加载日志时发生错误: ' + error.message;
        }

        this.logLoading = false;
        this.rerender();
    },

    refreshLog() {
        if (this.currentLogPath) {
            this.loadLog(this.currentLogPath);
            this.notify('日志已刷新', 'info');
        } else {
            this.notify('请先选择一个训练任务', 'warning');
        }
    },

    clearLog() {
        this.logContent = '';
        const logElement = document.getElementById('mt-log-content');
        if (logElement) {
            logElement.textContent = '日志已清空';
        }
        this.notify('日志已清空', 'info');
    },

    downloadLog() {
        if (!this.logContent) {
            this.notify('没有可下载的日志', 'warning');
            return;
        }

        const blob = new Blob([this.logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.selectedTask ? `${this.selectedTask.id}_log.txt` : 'training_log.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.notify('日志下载中...', 'info');
    },

    downloadModel(taskId) {
        const task = this.trainingTasks.find(t => t.id === taskId);
        if (task && task.status === 'completed') {
            this.notify('正在下载模型: ' + task.id, 'info');
        } else {
            this.notify('该任务尚未完成，无法下载模型', 'warning');
        }
    },

    startTraining() {
        if (!this.selectedDataset) {
            this.notify('请先选择一个数据集', 'warning');
            return;
        }

        if (this.isTraining) {
            this.notify('已有训练任务正在进行中', 'warning');
            return;
        }

        const learningRate = document.getElementById('mt-learning-rate').value;
        const batchSize = document.getElementById('mt-batch-size').value;
        const epochs = document.getElementById('mt-epochs').value;
        const optimizer = document.getElementById('mt-optimizer').value;
        const lossFunction = document.getElementById('mt-loss-function').value;
        const backbone = document.getElementById('mt-backbone').value;
        const freezeBackbone = document.getElementById('mt-freeze-backbone').value === 'true';

        const newTask = {
            id: 'TR-' + Date.now(),
            datasetName: this.selectedDataset.name,
            modelName: 'ECF-Net',
            startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            endTime: null,
            duration: '0h 0m',
            status: 'running',
            progress: 0,
            epoch: 0,
            bestLoss: null,
            bestAccuracy: null,
            logPath: this.currentLogPath
        };

        this.trainingTasks.unshift(newTask);
        this.selectedTask = newTask;
        this.isTraining = true;
        this.rerender();
        this.notify('训练任务已提交: ' + newTask.id, 'success');

        // 模拟训练进度
        this.simulateTraining(newTask);
    },

    simulateTraining(task) {
        let progress = 0;
        let epoch = 0;
        const totalEpochs = parseInt(document.getElementById('mt-epochs').value) || 100;

        const interval = setInterval(() => {
            if (epoch >= totalEpochs) {
                task.status = 'completed';
                task.endTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
                task.progress = 100;
                task.bestLoss = 0.0234;
                task.bestAccuracy = 0.9756;
                this.isTraining = false;
                clearInterval(interval);
                this.rerender();
                this.notify('训练完成: ' + task.id, 'success');
                return;
            }

            epoch++;
            progress = Math.round((epoch / totalEpochs) * 100);
            task.progress = progress;
            task.epoch = epoch;
            task.bestLoss = (0.1 - epoch * 0.0008).toFixed(4);
            task.bestAccuracy = (0.8 + epoch * 0.0018).toFixed(4);

            // 自动加载日志
            if (epoch % 10 === 0) {
                this.loadLog(task.logPath);
            }

            this.rerender();
        }, 500);
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

