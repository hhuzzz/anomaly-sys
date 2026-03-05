const StatisticsAnalysis = {
    selectedLine: null, // 选中的产线
    selectedProduct: null, // 选中的工业材料
    timeRange: '7d', // 7d, 30d, 90d

    // 产线数据
    productionLines: [
        { id: 'line-1', name: '一号产线', total: 1580, defects: 98, defectRate: 6.20, accuracy: 93.2 },
        { id: 'line-2', name: '二号产线', total: 1420, defects: 115, defectRate: 8.10, accuracy: 91.5 },
        { id: 'line-3', name: '三号产线', total: 1890, defects: 128, defectRate: 6.77, accuracy: 94.3 }
    ],

    // 工业材料数据
    products: [
        { id: 'rubber-wood', name: '橡胶木材', total: 1250, defects: 87, defectRate: 6.96, accuracy: 92.3 },
        { id: 'pine-wood', name: '松树木材', total: 980, defects: 65, defectRate: 6.63, accuracy: 91.8 },
        { id: 'hot-rolled-steel', name: '热轧带钢', total: 1560, defects: 124, defectRate: 7.95, accuracy: 93.5 },
        { id: 'road', name: '路面', total: 2100, defects: 156, defectRate: 7.43, accuracy: 94.1 }
    ],

    // 缺陷类型数据
    defectTypes: [
        { name: '活节', count: 112, percentage: 32.6, color: '#ff4d4f' },
        { name: '死节', count: 98, percentage: 28.5, color: '#ff7a45' },
        { name: '裂纹', count: 78, percentage: 22.7, color: '#ffa940' },
        { name: '孔洞', count: 35, percentage: 10.2, color: '#73d13d' },
        { name: '其他', count: 20, percentage: 5.8, color: '#722ed1' }
    ],

    // 缺陷率趋势数据（最近7天）
    defectRateTrend: [
        { date: '02-27', rate: 7.2 },
        { date: '02-28', rate: 6.8 },
        { date: '03-01', rate: 7.5 },
        { date: '03-02', rate: 6.5 },
        { date: '03-03', rate: 7.1 },
        { date: '03-04', rate: 6.9 },
        { date: '03-05', rate: 7.3 }
    ],

    // 检测准确率趋势
    accuracyTrend: [
        { date: '02-27', accuracy: 91.5 },
        { date: '02-28', accuracy: 92.0 },
        { date: '03-01', accuracy: 92.8 },
        { date: '03-02', accuracy: 92.5 },
        { date: '03-03', accuracy: 93.2 },
        { date: '03-04', accuracy: 93.8 },
        { date: '03-05', rate: 94.1 }
    ],

    // 时段分布数据
    timeDistribution: [
        { period: '8:00-10:00', count: 185, defects: 15 },
        { period: '10:00-12:00', count: 198, defects: 18 },
        { period: '12:00-14:00', count: 156, defects: 12 },
        { period: '14:00-16:00', count: 212, defects: 20 },
        { period: '16:00-18:00', count: 178, defects: 14 }
    ],

    init() {
        this.render();
    },

    render() {
        const selectedLineData = this.selectedLine ? this.productionLines.find(l => l.id === this.selectedLine) : null;
        const selectedProductData = this.selectedProduct ? this.products.find(p => p.id === this.selectedProduct) : null;

        // 计算统计数据
        let totalSamples = 0;
        let totalDefects = 0;
        let avgDefectRate = 0;
        let avgAccuracy = 0;

        if (this.selectedLine && this.selectedProduct) {
            // 同时选择了产线和材料（模拟数据）
            if (selectedLineData && selectedProductData) {
                totalSamples = Math.floor((selectedLineData.total + selectedProductData.total) / 2);
                totalDefects = Math.floor((selectedLineData.defects + selectedProductData.defects) / 2);
            }
        } else if (this.selectedLine && selectedLineData) {
            // 只选择了产线
            totalSamples = selectedLineData.total;
            totalDefects = selectedLineData.defects;
        } else if (this.selectedProduct && selectedProductData) {
            // 只选择了材料
            totalSamples = selectedProductData.total;
            totalDefects = selectedProductData.defects;
        } else {
            // 没有选择，显示所有数据
            totalSamples = this.productionLines.reduce((sum, item) => sum + item.total, 0);
            totalDefects = this.productionLines.reduce((sum, item) => sum + item.defects, 0);
        }

        avgDefectRate = (totalDefects / totalSamples * 100).toFixed(2);
        avgAccuracy = this.selectedLine ? selectedLineData.accuracy : this.selectedProduct ? selectedProductData.accuracy : 93.3;

        return `
            <div class="card">
                <div class="card-header">
                    <span>统计分析</span>
                    <div class="analysis-controls">
                        <select class="form-control form-select" onchange="StatisticsAnalysis.changeTimeRange(this.value)">
                            <option value="7d" ${this.timeRange === '7d' ? 'selected' : ''}>最近7天</option>
                            <option value="30d" ${this.timeRange === '30d' ? 'selected' : ''}>最近30天</option>
                            <option value="90d" ${this.timeRange === '90d' ? 'selected' : ''}>最近90天</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <!-- 筛选区域 -->
                    <div class="filter-section">
                        <div class="filter-group filter-group-left">
                            <label>按产线</label>
                            <select class="form-control form-select" onchange="StatisticsAnalysis.changeLine(this.value)">
                                <option value="">全部产线</option>
                                ${this.productionLines.map(line => `
                                    <option value="${line.id}" ${this.selectedLine === line.id ? 'selected' : ''}>${line.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="filter-group filter-group-right">
                            <label>按工业材料</label>
                            <select class="form-control form-select" onchange="StatisticsAnalysis.changeProduct(this.value)">
                                <option value="">全部材料</option>
                                ${this.products.map(product => `
                                    <option value="${product.id}" ${this.selectedProduct === product.id ? 'selected' : ''}>${product.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <!-- 统计概览 -->
                    <div class="stats-overview">
                        <div class="stat-card stat-card-primary">
                            <div class="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${totalSamples}</div>
                                <div class="stat-label">检测样本总数</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card-danger">
                            <div class="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${totalDefects}</div>
                                <div class="stat-label">缺陷总数</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card-warning">
                            <div class="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${avgDefectRate}%</div>
                                <div class="stat-label">平均缺陷率</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card-success">
                            <div class="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${avgAccuracy}%</div>
                                <div class="stat-label">平均准确率</div>
                            </div>
                        </div>
                    </div>

                    <!-- 图表区域 -->
                    <div class="charts-grid">
                        <!-- 缺陷率趋势图 -->
                        <div class="chart-card chart-card-full">
                            <div class="chart-header">
                                <h3>缺陷率变化趋势</h3>
                            </div>
                            <div class="chart-body">
                                <div class="line-chart">
                                    ${this.renderLineChart(this.defectRateTrend, '缺陷率', '#ff4d4f')}
                                </div>
                            </div>
                        </div>

                        <!-- 检测准确率趋势图 -->
                        <div class="chart-card chart-card-full">
                            <div class="chart-header">
                                <h3>检测准确率趋势</h3>
                            </div>
                            <div class="chart-body">
                                <div class="line-chart">
                                    ${this.renderLineChart(this.accuracyTrend, '准确率', '#52c41a')}
                                </div>
                            </div>
                        </div>

                        <!-- 缺陷类型分布图 -->
                        <div class="chart-card">
                            <div class="chart-header">
                                <h3>缺陷类型分布</h3>
                            </div>
                            <div class="chart-body">
                                <div class="pie-chart">
                                    ${this.renderPieChart(this.defectTypes)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 详细数据表格 -->
                    <div class="data-table-section">
                        <div class="section-header">
                            <h3>详细统计数据</h3>
                        </div>
                        <div class="table-container">
                            ${this.selectedLine || this.selectedProduct ? `
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>项目名称</th>
                                            <th>检测样本数</th>
                                            <th>缺陷数</th>
                                            <th>缺陷率</th>
                                            <th>检测准确率</th>
                                            <th>状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.selectedLineData ? `
                                            <tr>
                                                <td><strong>${selectedLineData.name}</strong></td>
                                                <td>${selectedLineData.total.toLocaleString()}</td>
                                                <td>${selectedLineData.defects}</td>
                                                <td><span class="rate-badge ${selectedLineData.defectRate > 7 ? 'rate-high' : selectedLineData.defectRate > 6 ? 'rate-medium' : 'rate-low'}">${selectedLineData.defectRate}%</span></td>
                                                <td>${selectedLineData.accuracy}%</td>
                                                <td>
                                                    <span class="status-indicator ${selectedLineData.accuracy >= 93 ? 'status-good' : selectedLineData.accuracy >= 91 ? 'status-normal' : 'status-poor'}">
                                                        ${selectedLineData.accuracy >= 93 ? '优秀' : selectedLineData.accuracy >= 91 ? '良好' : '一般'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ` : ''}
                                        ${this.selectedProductData ? `
                                            <tr>
                                                <td><strong>${selectedProductData.name}</strong></td>
                                                <td>${selectedProductData.total.toLocaleString()}</td>
                                                <td>${selectedProductData.defects}</td>
                                                <td><span class="rate-badge ${selectedProductData.defectRate > 7 ? 'rate-high' : selectedProductData.defectRate > 6 ? 'rate-medium' : 'rate-low'}">${selectedProductData.defectRate}%</span></td>
                                                <td>${selectedProductData.accuracy}%</td>
                                                <td>
                                                    <span class="status-indicator ${selectedProductData.accuracy >= 93 ? 'status-good' : selectedProductData.accuracy >= 91 ? 'status-normal' : 'status-poor'}">
                                                        ${selectedProductData.accuracy >= 93 ? '优秀' : selectedProductData.accuracy >= 91 ? '良好' : '一般'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ` : ''}
                                    </tbody>
                                </table>
                            ` : `
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>产线名称</th>
                                            <th>检测样本数</th>
                                            <th>缺陷数</th>
                                            <th>缺陷率</th>
                                            <th>检测准确率</th>
                                            <th>状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.productionLines.map(item => `
                                            <tr>
                                                <td><strong>${item.name}</strong></td>
                                                <td>${item.total.toLocaleString()}</td>
                                                <td>${item.defects}</td>
                                                <td><span class="rate-badge ${item.defectRate > 7 ? 'rate-high' : item.defectRate > 6 ? 'rate-medium' : 'rate-low'}">${item.defectRate}%</span></td>
                                                <td>${item.accuracy}%</td>
                                                <td>
                                                    <span class="status-indicator ${item.accuracy >= 93 ? 'status-good' : item.accuracy >= 91 ? 'status-normal' : 'status-poor'}">
                                                        ${item.accuracy >= 93 ? '优秀' : item.accuracy >= 91 ? '良好' : '一般'}
                                                    </span>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}