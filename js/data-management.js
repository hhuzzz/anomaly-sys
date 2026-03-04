const DataManagement = {
    init() {
        this.render();
        this.startSystemMonitor();
    },

    render() {
        return `
            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">相机配置</div>
                        <div class="card-body">
                            <div class="form-group">
                                <label>相机 IP 地址</label>
                                <input type="text" class="form-control" id="camera-ip" value="192.168.1.100" placeholder="192.168.1.100">
                            </div>
                            <div class="form-group">
                                <label>端口号</label>
                                <input type="number" class="form-control" id="camera-port" value="8080" min="1" max="65535">
                            </div>
                            <div class="form-group">
                                <label>分辨率</label>
                                <select class="form-control form-select" id="camera-resolution">
                                    <option value="1920x1080" selected>1920x1080</option>
                                    <option value="1280x720">1280x720</option>
                                    <option value="640x480">640x480</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>帧率 (FPS): <span id="fps-value">30</span></label>
                                <input type="range" class="slider" id="camera-fps" min="1" max="60" value="30" oninput="document.getElementById('fps-value').textContent = this.value">
                                <div class="marks">
                                    <span>1</span>
                                    <span>30</span>
                                    <span>60</span>
                                </div>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-primary" onclick="DataManagement.connectCamera()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                                        <line x1="12" y1="2" x2="12" y2="12"></line>
                                    </svg>
                                    连接相机
                                </button>
                                <button class="btn btn-default" onclick="DataManagement.disconnectCamera()">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                    断开连接
                                </button>
                            </div>
                            <div class="connection-status">
                                <span class="tag tag-warning" id="connection-tag">○ 未连接</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">数据导入</div>
                        <div class="card-body">
                            <div class="upload-area" onclick="document.getElementById('file-input').click()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <p>点击选择图像文件</p>
                                <input type="file" id="file-input" accept="image/*" multiple style="display: none;" onchange="DataManagement.handleFileSelect(event)">
                            </div>
                            <div class="import-info">
                                <p class="info-text">支持的格式: JPG, PNG, BMP, TIFF</p>
                                <p class="info-text">最大文件数: 100</p>
                                <p class="info-text">已选择: <span id="selected-files-count">0</span> 个文件</p>
                            </div>
                            <div id="image-preview-container" style="margin-bottom: 16px; max-height: 200px; overflow-y: auto; display: none;">
                                <div id="image-preview-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
                            </div>
                            <button class="btn btn-success btn-full" onclick="DataManagement.handleImport()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                开始导入
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">预处理配置</div>
                        <div class="card-body">
                            <div class="form-group">
                                <label>目标格式</label>
                                <div class="radio-group">
                                    <label class="radio-label">
                                        <input type="radio" name="format" value="png" checked>
                                        <span>PNG</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="format" value="jpeg">
                                        <span>JPEG</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="format" value="bmp">
                                        <span>BMP</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>统一分辨率</label>
                                <select class="form-control form-select" id="target-resolution">
                                    <option value="1920x1080" selected>1920x1080</option>
                                    <option value="1280x720">1280x720</option>
                                    <option value="640x480">640x480</option>
                                    <option value="original">保持原始</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>存储路径</label>
                                <input type="text" class="form-control" id="storage-path" value="/data/images">
                            </div>
                            <div class="form-group">
                                <label>数据编号规则</label>
                                <select class="form-control form-select" id="naming-rule">
                                    <option value="timestamp" selected>时间戳</option>
                                    <option value="sequence">序号</option>
                                    <option value="uuid">UUID</option>
                                </select>
                            </div>
                            <button class="btn btn-primary btn-full" onclick="DataManagement.savePreprocessConfig()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                </svg>
                                保存配置
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">实时视频读取</div>
                        <div class="card-body">
                            <div class="video-placeholder">
                                <img src="img/000000.jpg" alt="视频预览" style="width: 100%; height: 100%; object-fit: cover; display: block;" id="video-preview">
                            </div>
                            <div class="btn-group" style="justify-content: center;">
                                <button class="btn btn-primary" id="start-btn" onclick="DataManagement.startCollect()" disabled>
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    开始采集
                                </button>
                                <button class="btn btn-danger" id="stop-btn" onclick="DataManagement.stopCollect()" disabled>
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                        <rect x="6" y="4" width="4" height="16"></rect>
                                        <rect x="14" y="4" width="4" height="16"></rect>
                                    </svg>
                                    停止采集
                                </button>
                                <span class="tag tag-warning">已采集: <span id="collected-count">22</span> 张</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">任务监控</div>
                        <div class="card-body">
                            <div class="stat-grid">
                                <div class="stat-card">
                                    <div class="stat-value" id="pending-count">12</div>
                                    <div class="stat-label">待处理</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="processing-count">5</div>
                                    <div class="stat-label">处理中</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="completed-count">234</div>
                                    <div class="stat-label">已完成</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="failed-count">3</div>
                                    <div class="stat-label">失败</div>
                                </div>
                            </div>
                            <div class="system-metrics">
                                <div style="font-weight: 500; margin-bottom: 12px;">系统资源</div>
                                <div class="metric-item">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                        <span>CPU 占用</span>
                                        <span id="cpu-value" style="font-weight: 500; color: #faad14;">45%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 45%;" id="cpu-fill"></div>
                                    </div>
                                </div>
                                <div class="metric-item" style="margin-top: 16px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                        <span>内存占用</span>
                                        <span id="memory-value" style="font-weight: 500; color: #1890ff;">3.2 GB / 8 GB</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 40%; background: #1890ff;" id="memory-fill"></div>
                                    </div>
                                </div>
                                <div class="metric-item" style="margin-top: 16px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                        <span>磁盘使用</span>
                                        <span id="disk-value" style="font-weight: 500; color: #52c41a;">128 GB / 500 GB</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 25.6%; background: #52c41a;" id="disk-fill"></div>
                                    </div>
                                </div>
                                <div class="metric-item" style="margin-top: 16px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                        <span>网络流量</span>
                                        <span id="network-value" style="font-weight: 500; color: #722ed1;">↓ 2.5 MB/s ↑ 1.2 MB/s</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 32%; background: #722ed1;" id="network-fill"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">数据列表</div>
                <div class="card-body">
                    <div class="table-toolbar">
                        <div class="search-box">
                            <input type="text" class="search-input" id="search-input" placeholder="搜索图像名称...">
                            <select class="form-control form-select" id="filter-status" style="width: 140px;">
                                <option value="">状态筛选</option>
                                <option value="normal">正常</option>
                                <option value="abnormal">异常</option>
                                <option value="pending">待处理</option>
                            </select>
                            <button class="btn btn-primary" onclick="DataManagement.handleSearch()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                查询
                            </button>
                            <button class="btn btn-default" onclick="DataManagement.handleReset()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                    <path d="M23 4v6h-6"></path>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                                重置
                            </button>
                        </div>
                        <div class="search-box">
                            <button class="btn btn-default" onclick="DataManagement.handleBatchDelete()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                批量删除
                            </button>
                            <button class="btn btn-default" onclick="DataManagement.handleExport()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                导出数据
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th width="50">
                                    <input type="checkbox" id="select-all" onchange="DataManagement.toggleSelectAll(this)">
                                </th>
                                <th width="120">ID</th>
                                <th width="200">图像名称</th>
                                <th width="180">采集时间</th>
                                <th width="120">文件大小</th>
                                <th width="120">分辨率</th>
                                <th width="100">格式</th>
                                <th width="100">状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="data-table-body">
                        </tbody>
                    </table>
                    <div class="pagination">
                        <button>上一页</button>
                        <button class="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>下一页</button>
                    </div>
                </div>
            </div>
        `;
    },

    cameraConnected: false,
    isCollecting: false,
    collectedCount: 0,
    selectedFiles: [],
    selectedRows: [],

    tableData: [
        { id: '001', name: 'img_001.png', collectTime: '2026-03-04 10:30:12', fileSize: '2.5 MB', resolution: '1920x1080', format: 'PNG', status: 'normal' },
        { id: '002', name: 'img_002.png', collectTime: '2026-03-04 10:30:15', fileSize: '2.4 MB', resolution: '1920x1080', format: 'PNG', status: 'abnormal' },
        { id: '003', name: 'img_003.png', collectTime: '2026-03-04 10:30:18', fileSize: '2.6 MB', resolution: '1920x1080', format: 'PNG', status: 'pending' },
        { id: '004', name: 'img_004.png', collectTime: '2026-03-04 10:30:21', fileSize: '2.3 MB', resolution: '1920x1080', format: 'PNG', status: 'normal' },
        { id: '005', name: 'img_005.png', collectTime: '2026-03-04 10:30:24', fileSize: '2.7 MB', resolution: '1920x1080', format: 'PNG', status: 'normal' }
    ],

    connectCamera() {
        this.cameraConnected = true;
        document.getElementById('connection-tag').className = 'tag tag-success';
        document.getElementById('connection-tag').textContent = '● 已连接';
        document.getElementById('start-btn').disabled = false;
        this.alert('相机连接成功', 'success');
    },

    disconnectCamera() {
        this.cameraConnected = false;
        this.isCollecting = false;
        document.getElementById('connection-tag').className = 'tag tag-warning';
        document.getElementById('connection-tag').textContent = '○ 未连接';
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('preview-status').textContent = '未开始采集';
        this.alert('相机已断开连接', 'info');
    },

    startCollect() {
        if (!this.cameraConnected) {
            this.alert('请先连接相机', 'warning');
            return;
        }
        this.isCollecting = true;
        document.getElementById('stop-btn').disabled = false;
        document.getElementById('preview-status').textContent = '正在采集...';
        this.alert('开始采集数据', 'success');
    },

    stopCollect() {
        this.isCollecting = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('preview-status').textContent = '未开始采集';
        this.alert('已停止采集', 'info');
    },

    handleFileSelect(event) {
        const newFiles = Array.from(event.target.files);
        this.selectedFiles = [...this.selectedFiles, ...newFiles];
        document.getElementById('selected-files-count').textContent = this.selectedFiles.length;
        this.renderImagePreview();
    },

    renderImagePreview() {
        const container = document.getElementById('image-preview-container');
        const grid = document.getElementById('image-preview-grid');

        if (this.selectedFiles.length === 0) {
            container.style.display = 'none';
            grid.innerHTML = '';
            return;
        }

        container.style.display = 'block';

        const displayFiles = this.selectedFiles.slice(0, 3);
        const hasMore = this.selectedFiles.length > 3;

        grid.innerHTML = displayFiles.map((file, index) => {
            const imageUrl = URL.createObjectURL(file);
            const fileSize = this.formatFileSize(file.size);
            return `
                <div class="preview-item" style="position: relative; aspect-ratio: 1; background: #f5f5f5; border-radius: 4px; overflow: hidden; cursor: pointer;" onclick="DataManagement.removeFile(${index})">
                    <img src="${imageUrl}" alt="${file.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div class="preview-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; color: white;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                    <div class="preview-info" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 4px 8px; background: rgba(0,0,0,0.7); color: white; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${file.name}<br>
                        <span style="opacity: 0.8;">${fileSize}</span>
                    </div>
                </div>
            `;
        }).join('');

        if (hasMore) {
            grid.innerHTML += `
                <div class="preview-more" style="position: relative; aspect-ratio: 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: white;" onclick="DataManagement.openPreviewModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 32px; height: 32px; margin-bottom: 8px;">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    <div style="font-size: 24px; font-weight: bold;">+${this.selectedFiles.length - 3}</div>
                    <div style="font-size: 12px; opacity: 0.9;">查看更多</div>
                </div>
            `;
        }

        document.querySelectorAll('.preview-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.preview-overlay').style.display = 'flex';
            });
            item.addEventListener('mouseleave', function() {
                this.querySelector('.preview-overlay').style.display = 'none';
            });
        });
    },

    openPreviewModal() {
        const modal = document.createElement('div');
        modal.className = 'image-preview-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 100000;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.3s;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; font-size: 18px;">已选择 ${this.selectedFiles.length} 个文件</h3>
            <button onclick="DataManagement.closePreviewModal()" style="background: transparent; border: 1px solid white; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">关闭</button>
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        `;

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        `;

        this.selectedFiles.forEach((file, index) => {
            const imageUrl = URL.createObjectURL(file);
            const fileSize = this.formatFileSize(file.size);
            const item = document.createElement('div');
            item.style.cssText = `
                position: relative;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                transition: transform 0.3s, box-shadow 0.3s;
            `;
            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" style="width: 100%; aspect-ratio: 1; object-fit: cover;">
                <div style="padding: 12px;">
                    <div style="font-size: 14px; font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">${file.name}</div>
                    <div style="font-size: 12px; color: #999;">${fileSize}</div>
                </div>
                <button onclick="DataManagement.removeFileFromModal(${index})" style="position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 255, 255, 0.9); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; color: #ff4d4f;">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
            grid.appendChild(item);
        });

        content.appendChild(grid);
        modal.appendChild(header);
        modal.appendChild(content);
        document.body.appendChild(modal);

        document.body.style.overflow = 'hidden';
    },

    closePreviewModal() {
        const modal = document.querySelector('.image-preview-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
            this.renderImagePreview();
        }
    },

    removeFileFromModal(index) {
        event.stopPropagation();
        this.selectedFiles.splice(index, 1);
        document.getElementById('selected-files-count').textContent = this.selectedFiles.length;

        if (this.selectedFiles.length === 0) {
            this.closePreviewModal();
        } else {
            const modal = document.querySelector('.image-preview-modal');
            if (modal) {
                modal.remove();
                this.openPreviewModal();
            }
        }
    },

    removeFile(index) {
        event.stopPropagation();
        this.selectedFiles.splice(index, 1);
        document.getElementById('selected-files-count').textContent = this.selectedFiles.length;
        this.renderImagePreview();
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    handleImport() {
        if (this.selectedFiles.length === 0) {
            this.alert('请先选择图像文件', 'warning');
            return;
        }
        this.alert(`正在导入 ${this.selectedFiles.length} 个文件...`, 'success');
    },

    savePreprocessConfig() {
        this.alert('预处理配置已保存', 'success');
    },

    getStatusText(status) {
        const texts = {
            normal: '正常',
            abnormal: '异常',
            pending: '待处理'
        };
        return texts[status] || '未知';
    },

    getStatusClass(status) {
        const classes = {
            normal: 'tag-success',
            abnormal: 'tag-danger',
            pending: 'tag-warning'
        };
        return classes[status] || '';
    },

    renderTable(data = this.tableData) {
        const tbody = document.getElementById('data-table-body');
        tbody.innerHTML = data.map(item => `
            <tr>
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${item.id}" onchange="DataManagement.toggleRow('${item.id}')">
                </td>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.collectTime}</td>
                <td>${item.fileSize}</td>
                <td>${item.resolution}</td>
                <td>${item.format}</td>
                <td><span class="tag ${this.getStatusClass(item.status)}">${this.getStatusText(item.status)}</span></td>
                <td>
                    <a href="#" style="color: #1890ff; margin-right: 16px;" onclick="DataManagement.viewDetail('${item.id}')">查看</a>
                    <a href="#" style="color: #ff4d4f;" onclick="DataManagement.deleteRow('${item.id}')">删除</a>
                </td>
            </tr>
        `).join('');
    },

    toggleRow(id) {
        const index = this.selectedRows.indexOf(id);
        if (index > -1) {
            this.selectedRows.splice(index, 1);
        } else {
            this.selectedRows.push(id);
        }
    },

    toggleSelectAll(checkbox) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = checkbox.checked);
        if (checkbox.checked) {
            this.selectedRows = this.tableData.map(item => item.id);
        } else {
            this.selectedRows = [];
        }
    },

    handleSearch() {
        this.alert('搜索完成', 'success');
    },

    handleReset() {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-status').value = '';
        this.alert('已重置筛选条件', 'info');
    },

    viewDetail(id) {
        const modal = document.createElement('div');
        modal.className = 'image-detail-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 100000;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.3s;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; font-size: 18px;">图像详情 - ${id}</h3>
            <button onclick="document.querySelector('.image-detail-modal').remove();" style="background: transparent; border: 1px solid white; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">关闭</button>
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 20px;
        `;

        const img = document.createElement('img');
        img.src = 'img/000010.jpg';
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        `;

        content.appendChild(img);
        modal.appendChild(header);
        modal.appendChild(content);
        document.body.appendChild(modal);

        document.body.style.overflow = 'hidden';

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
    },

    editRow(id) {
        this.alert(`编辑: ${id}`, 'info');
    },

    deleteRow(id) {
        if (confirm('确定删除该数据吗？')) {
            this.alert(`已删除: ${id}`, 'success');
        }
    },

    handleBatchDelete() {
        if (this.selectedRows.length === 0) {
            this.alert('请先选择要删除的数据', 'warning');
            return;
        }
        if (confirm(`确定删除 ${this.selectedRows.length} 条数据吗？`)) {
            this.alert(`批量删除 ${this.selectedRows.length} 条数据`, 'success');
        }
    },

    handleExport() {
        this.alert('正在导出数据...', 'success');
    },

    alert(message, type = 'info') {
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
    },

    startSystemMonitor() {
        setInterval(() => {
            this.updateSystemMetrics();
        }, 2000);
    },

    updateSystemMetrics() {
        const cpuUsage = Math.floor(Math.random() * 40) + 30;
        const memoryUsed = (Math.random() * 2 + 2).toFixed(1);
        const memoryTotal = 8;
        const memoryPercent = ((memoryUsed / memoryTotal) * 100).toFixed(0);
        const diskUsed = (Math.random() * 10 + 120).toFixed(0);
        const diskTotal = 500;
        const diskPercent = ((diskUsed / diskTotal) * 100).toFixed(1);
        const networkDown = (Math.random() * 2 + 1.5).toFixed(1);
        const networkUp = (Math.random() * 1 + 0.8).toFixed(1);
        const networkPercent = Math.floor((parseFloat(networkDown) + parseFloat(networkUp)) / 10 * 100);

        document.getElementById('cpu-value').textContent = cpuUsage + '%';
        document.getElementById('cpu-fill').style.width = cpuUsage + '%';

        document.getElementById('memory-value').textContent = `${memoryUsed} GB / ${memoryTotal} GB`;
        document.getElementById('memory-fill').style.width = memoryPercent + '%';

        document.getElementById('disk-value').textContent = `${diskUsed} GB / ${diskTotal} GB`;
        document.getElementById('disk-fill').style.width = diskPercent + '%';

        document.getElementById('network-value').textContent = `↓ ${networkDown} MB/s ↑ ${networkUp} MB/s`;
        document.getElementById('network-fill').style.width = networkPercent + '%';

        if (cpuUsage > 80) {
            document.getElementById('cpu-value').style.color = '#ff4d4f';
        } else if (cpuUsage > 60) {
            document.getElementById('cpu-value').style.color = '#faad14';
        } else {
            document.getElementById('cpu-value').style.color = '#52c41a';
        }
    }
};

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
