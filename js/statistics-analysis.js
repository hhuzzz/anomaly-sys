const StatisticsAnalysis = {
    selectedLine: '',
    selectedProduct: '',
    timeRange: '7d',

    // 所有数值型信息统一放在这里，直接改数字即可生效
    config: {
        lines: ['一号产线', '二号产线'],
        products: ['松树木材', '橡胶木材', '热轧带钢', '路面'],

        // 统计明细基础数据（写死）
        detailRows: [
            { lineName: '一号产线', productType: '松树木材', sampleCount: 1380, abnormalCount: 96 },
            { lineName: '一号产线', productType: '橡胶木材', sampleCount: 1520, abnormalCount: 122 },
            { lineName: '一号产线', productType: '热轧带钢', sampleCount: 1680, abnormalCount: 134 },
            { lineName: '一号产线', productType: '路面', sampleCount: 1420, abnormalCount: 88 },
            { lineName: '二号产线', productType: '松树木材', sampleCount: 1460, abnormalCount: 105 },
            { lineName: '二号产线', productType: '橡胶木材', sampleCount: 1590, abnormalCount: 129 },
            { lineName: '二号产线', productType: '热轧带钢', sampleCount: 1740, abnormalCount: 149 },
            { lineName: '二号产线', productType: '路面', sampleCount: 1510, abnormalCount: 97 }
        ],

        // 按小时缺陷率趋势（写死）
        hourlyDefectRate: {
            default: {
                '7d': [5.6, 6.2, 5.9, 6.8, 7.1, 6.7, 6.3, 7.4, 7.0, 6.5],
                '30d': [6.1, 6.5, 6.3, 7.0, 7.4, 7.1, 6.8, 7.6, 7.3, 6.9],
                '90d': [6.8, 7.1, 6.9, 7.5, 7.8, 7.4, 7.2, 8.0, 7.7, 7.3]
            },
            line: {
                '一号产线': {
                    '7d': [5.1, 5.8, 5.6, 6.3, 6.7, 6.1, 5.9, 6.8, 6.4, 6.0],
                    '30d': [5.7, 6.1, 5.9, 6.6, 7.0, 6.5, 6.2, 7.1, 6.8, 6.3],
                    '90d': [6.2, 6.6, 6.4, 7.0, 7.3, 6.9, 6.6, 7.5, 7.1, 6.8]
                },
                '二号产线': {
                    '7d': [6.0, 6.7, 6.3, 7.2, 7.6, 7.2, 6.9, 7.9, 7.5, 7.0],
                    '30d': [6.5, 7.1, 6.8, 7.6, 8.0, 7.6, 7.3, 8.2, 7.8, 7.4],
                    '90d': [7.0, 7.5, 7.2, 8.0, 8.4, 8.0, 7.7, 8.6, 8.2, 7.8]
                }
            },
            product: {
                '橡胶木材': {
                    '7d': [6.6, 7.1, 6.8, 7.4, 7.9, 7.6, 7.2, 8.0, 7.7, 7.3]
                }
            }
        },

        // 缺陷类型分布（写死计数）
        defectDistribution: {
            default: [
                { name: '划痕', count: 286 },
                { name: '凹陷', count: 219 },
                { name: '裂纹', count: 174 },
                { name: '污渍', count: 128 },
                { name: '其他', count: 96 }
            ],
            product: {
                '橡胶木材': [
                    { name: '活节', count: 12 },
                    { name: '死节', count: 28 },
                    { name: '树芯', count: 42 },
                    { name: '缺边', count: 33 },
                    { name: '划痕', count: 7 }
                ]
            }
        },

        hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    },

    render() {
        const rows = this.getFilteredDetailRows();
        const summary = this.buildSummary(rows);
        const hourlyDefectTrend = this.getHourlyDefectTrend();
        const defectTypeDistribution = this.getDefectDistribution();

        return `
            <div class="card">
                <div class="card-header sa-header">
                    <span>统计分析</span>
                    <div class="analysis-controls sa-controls">
                        <select class="form-control form-select" onchange="StatisticsAnalysis.changeTimeRange(this.value)">
                            <option value="7d" ${this.timeRange === '7d' ? 'selected' : ''}>最近7天</option>
                            <option value="30d" ${this.timeRange === '30d' ? 'selected' : ''}>最近30天</option>
                            <option value="90d" ${this.timeRange === '90d' ? 'selected' : ''}>最近90天</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="sa-filter-row">
                        <div class="form-group">
                            <label>按产线筛选</label>
                            <select class="form-control form-select" onchange="StatisticsAnalysis.changeLine(this.value)">
                                <option value="">全部产线</option>
                                ${this.config.lines.map(line => `<option value="${line}" ${this.selectedLine === line ? 'selected' : ''}>${line}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>按产品型号筛选</label>
                            <select class="form-control form-select" onchange="StatisticsAnalysis.changeProduct(this.value)">
                                <option value="">全部型号</option>
                                ${this.config.products.map(product => `<option value="${product}" ${this.selectedProduct === product ? 'selected' : ''}>${product}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group sa-reset-wrap">
                            <button class="btn btn-default" onclick="StatisticsAnalysis.resetFilters()">重置筛选</button>
                        </div>
                    </div>

                    <div class="sa-kpi-grid">
                        <div class="sa-kpi-card">
                            <span>检测样本总数</span>
                            <strong>${summary.totalSamples}</strong>
                        </div>
                        <div class="sa-kpi-card">
                            <span>异常样本数</span>
                            <strong>${summary.totalDefects}</strong>
                        </div>
                        <div class="sa-kpi-card">
                            <span>缺陷率</span>
                            <strong>${summary.defectRate}%</strong>
                        </div>
                    </div>

                    <div class="sa-chart-grid sa-chart-grid-bottom">
                        <div class="sa-chart-card">
                            <div class="sa-chart-title">缺陷率变化趋势</div>
                            ${this.renderLineChart(hourlyDefectTrend, '#ff4d4f', '%')}
                        </div>
                        <div class="sa-chart-card">
                            <div class="sa-chart-title">缺陷类型分布</div>
                            ${this.renderDonutChart(defectTypeDistribution)}
                        </div>
                    </div>

                    <div class="data-table-section">
                        <div class="section-header">
                            <h3>统计明细</h3>
                        </div>
                        <div class="table-container">
                            <table class="data-table sa-detail-table">
                                <thead>
                                    <tr>
                                        <th>产线</th>
                                        <th>产品型号</th>
                                        <th>样本数</th>
                                        <th>异常样本数</th>
                                        <th>缺陷率</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.renderDetailRows(rows)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getFilteredDetailRows() {
        return this.config.detailRows.filter(row => {
            const matchLine = !this.selectedLine || row.lineName === this.selectedLine;
            const matchProduct = !this.selectedProduct || row.productType === this.selectedProduct;
            return matchLine && matchProduct;
        });
    },

    buildSummary(rows) {
        if (!rows.length) {
            return { totalSamples: 0, totalDefects: 0, defectRate: '0.00' };
        }

        const totalSamples = rows.reduce((sum, row) => sum + row.sampleCount, 0);
        const totalDefects = rows.reduce((sum, row) => sum + row.abnormalCount, 0);
        const defectRate = totalSamples ? (totalDefects / totalSamples) * 100 : 0;

        return {
            totalSamples,
            totalDefects,
            defectRate: defectRate.toFixed(2)
        };
    },

    getHourlyDefectTrend() {
        const labels = this.config.hours;
        const productSeries = this.selectedProduct && this.config.hourlyDefectRate.product[this.selectedProduct];
        const lineSeries = this.selectedLine && this.config.hourlyDefectRate.line[this.selectedLine];
        const values =
            (productSeries && productSeries[this.timeRange]) ||
            (lineSeries && lineSeries[this.timeRange]) ||
            this.config.hourlyDefectRate.default[this.timeRange] ||
            this.config.hourlyDefectRate.default['7d'];

        return labels.map((label, idx) => ({ label, value: values[idx] ?? 0 }));
    },

    getDefectDistribution() {
        const source =
            (this.selectedProduct && this.config.defectDistribution.product[this.selectedProduct]) ||
            this.config.defectDistribution.default;

        const palette = ['#ff4d4f', '#fa8c16', '#13c2c2', '#2f54eb', '#722ed1', '#52c41a'];
        const total = source.reduce((sum, item) => sum + item.count, 0) || 1;
        return source.map((item, idx) => ({
            name: item.name,
            count: item.count,
            percent: ((item.count / total) * 100).toFixed(1),
            color: palette[idx % palette.length]
        }));
    },

    renderLineChart(data, color, unit) {
        if (!data.length) {
            return '<div class="empty-state" style="padding: 36px 0;">无可展示数据</div>';
        }

        const width = 640;
        const height = 220;
        const left = 44;
        const right = 24;
        const top = 24;
        const bottom = 44;
        const innerW = width - left - right;
        const innerH = height - top - bottom;
        const maxValue = Math.max(...data.map(item => item.value), 1);
        const minValue = Math.min(...data.map(item => item.value), 0);
        const span = Math.max(maxValue - minValue, 1);
        const yTicks = 4;

        const points = data.map((item, index) => {
            const x = left + (innerW / Math.max(data.length - 1, 1)) * index;
            const y = top + innerH - ((item.value - minValue) / span) * innerH;
            return { ...item, x, y };
        });
        const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

        return `
            <svg class="sa-line-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
                ${Array.from({ length: yTicks + 1 }).map((_, i) => {
                    const y = top + (innerH / yTicks) * i;
                    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#edf2f7" stroke-dasharray="4 4"></line>`;
                }).join('')}
                <line x1="${left}" y1="${top + innerH}" x2="${width - right}" y2="${top + innerH}" stroke="#e8e8e8"></line>
                <path d="${linePath}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
                ${points.map(point => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="${color}"></circle>`).join('')}
                ${points.map(point => `<text x="${point.x}" y="${height - 16}" text-anchor="middle" class="sa-axis-text">${point.label}</text>`).join('')}
                ${points.map(point => `<text x="${point.x}" y="${point.y - 10}" text-anchor="middle" class="sa-point-text">${point.value}${unit}</text>`).join('')}
            </svg>
        `;
    },

    renderDonutChart(items) {
        const total = items.reduce((sum, item) => sum + item.count, 0) || 1;
        let offset = 0;
        const gradient = items.map(item => {
            const start = ((offset / total) * 100).toFixed(2);
            offset += item.count;
            const end = ((offset / total) * 100).toFixed(2);
            return `${item.color} ${start}% ${end}%`;
        }).join(', ');

        return `
            <div class="sa-donut-wrap">
                <div class="sa-donut" style="background: conic-gradient(${gradient});">
                    <div class="sa-donut-center">
                        <strong>${total}</strong>
                        <span>samples</span>
                    </div>
                </div>
                <div class="sa-legend">
                    ${items.map(item => `
                        <div class="sa-legend-item">
                            <span class="sa-legend-dot" style="background:${item.color}"></span>
                            <span class="sa-legend-name">${item.name}</span>
                            <span class="sa-legend-value">${item.count} (${item.percent}%)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderDetailRows(rows) {
        if (!rows.length) {
            return `
                <tr>
                    <td colspan="5">
                        <div class="empty-state" style="padding: 32px 0;">当前筛选条件下无数据</div>
                    </td>
                </tr>
            `;
        }

        return [...rows]
            .sort((a, b) => b.sampleCount - a.sampleCount)
            .map(row => {
                const defectRate = row.sampleCount ? ((row.abnormalCount / row.sampleCount) * 100).toFixed(2) : '0.00';
                return `
                    <tr>
                        <td>${row.lineName}</td>
                        <td>${row.productType}</td>
                        <td>${row.sampleCount}</td>
                        <td>${row.abnormalCount}</td>
                        <td><span class="rate-badge ${Number(defectRate) > 12 ? 'rate-high' : Number(defectRate) > 7 ? 'rate-medium' : 'rate-low'}">${defectRate}%</span></td>
                    </tr>
                `;
            })
            .join('');
    },

    changeTimeRange(value) {
        this.timeRange = value;
        this.rerender();
    },

    changeLine(value) {
        this.selectedLine = value;
        this.rerender();
    },

    changeProduct(value) {
        this.selectedProduct = value;
        this.rerender();
    },

    resetFilters() {
        this.selectedLine = '';
        this.selectedProduct = '';
        this.timeRange = '7d';
        this.rerender();
    },

    rerender() {
        const content = document.getElementById('page-content');
        if (content) {
            content.innerHTML = this.render();
        }
    }
};
