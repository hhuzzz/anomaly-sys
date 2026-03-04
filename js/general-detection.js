const GeneralDetection = {
    init() {
        this.render();
    },

    render() {
        return `
            <div class="card">
                <div class="card-body">
                    <div class="empty-state">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <h3>通用异常检测模块</h3>
                        <p>此模块正在开发中...</p>
                    </div>
                </div>
            </div>
        `;
    }
};
