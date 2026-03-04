const DomainDetection = {
    init() {
        this.render();
    },

    render() {
        return `
            <div class="card">
                <div class="card-body">
                    <div class="empty-state">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h3>领域缺陷检测模块</h3>
                        <p>此模块正在开发中...</p>
                    </div>
                </div>
            </div>
        `;
    }
};
