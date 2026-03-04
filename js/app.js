const pages = {
    'data-management': {
        title: '数据管理',
        module: DataManagement
    },
    'general-detection': {
        title: '通用异常检测',
        module: GeneralDetection
    },
    'sample-management': {
        title: '异常样本管理',
        module: SampleManagement
    },
    'model-training': {
        title: '模型训练',
        module: ModelTraining
    },
    'model-management': {
        title: '模型管理',
        module: ModelManagement
    },
    'domain-detection': {
        title: '领域缺陷检测',
        module: DomainDetection
    },
    'statistics-analysis': {
        title: '统计分析',
        module: StatisticsAnalysis
    }
};

let currentPage = 'data-management';

function init() {
    setupMenuListeners();
    loadPage(currentPage);
}

function setupMenuListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });
}

function loadPage(pageName) {
    currentPage = pageName;

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-page') === pageName);
    });

    const pageConfig = pages[pageName];
    if (!pageConfig) {
        return;
    }

    document.getElementById('page-title').textContent = pageConfig.title;
    const content = document.getElementById('page-content');
    content.innerHTML = pageConfig.module.render();

    if (pageName === 'data-management' && typeof DataManagement.renderTable === 'function') {
        setTimeout(() => {
            DataManagement.renderTable();
        }, 0);
    }
}

document.addEventListener('DOMContentLoaded', init);
