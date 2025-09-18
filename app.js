// 前端交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const nameForm = document.getElementById('nameForm');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('resultsSection');
    const nameResults = document.getElementById('nameResults');
    const recommendationList = document.getElementById('recommendationList');
    const birthDateInput = document.getElementById('birthDate');

    // 初始化生成器
    const generator = new ChineseNameGenerator();

    // 设置默认生日为今天
    const today = new Date();
    birthDateInput.value = today.toISOString().split('T')[0];

    // 表单提交处理
    nameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateNames();
    });

    // 生成名字的主函数
    async function generateNames() {
        // 显示加载状态
        showLoading();

        // 获取表单数据
        const formData = new FormData(nameForm);
        const options = {
            surname: formData.get('surname').trim(),
            gender: formData.get('gender'),
            birthDate: new Date(formData.get('birthDate')),
            meaningPreference: formData.get('meaningPreference'),
            count: parseInt(formData.get('count'))
        };

        // 验证输入
        if (!options.surname) {
            alert('请输入姓氏');
            hideLoading();
            return;
        }

        if (options.surname.length > 2) {
            alert('姓氏不能超过2个字');
            hideLoading();
            return;
        }

        try {
            // 模拟网络延迟，增加真实感
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 生成名字
            const result = generator.generateNames(options);

            // 显示结果
            displayResults(result, options.surname);

        } catch (error) {
            console.error('生成名字时出错:', error);
            alert('生成名字时出现错误，请重试');
            hideLoading();
        }
    }

    // 显示加载状态
    function showLoading() {
        resultsSection.style.display = 'none';
        loading.style.display = 'block';

        // 平滑滚动到加载区域
        loading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 隐藏加载状态
    function hideLoading() {
        loading.style.display = 'none';
    }

    // 显示结果
    function displayResults(result, surname) {
        hideLoading();

        // 清空之前的结果
        nameResults.innerHTML = '';
        recommendationList.innerHTML = '';

        // 显示名字列表
        result.names.forEach((nameInfo, index) => {
            const nameItem = createNameItem(nameInfo, index + 1);
            nameResults.appendChild(nameItem);
        });

        // 显示建议
        result.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationList.appendChild(li);
        });

        // 添加五行分析说明
        if (result.wuxingAnalysis) {
            const wuxingInfo = document.createElement('li');
            wuxingInfo.innerHTML = `根据生辰分析，建议补充<strong>${result.wuxingAnalysis.recommend}</strong>属性的字`;
            recommendationList.appendChild(wuxingInfo);
        }

        // 显示结果区域
        resultsSection.style.display = 'block';

        // 平滑滚动到结果区域
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 添加统计信息
        addStatistics(result.names.length, surname);
    }

    // 创建名字项元素
    function createNameItem(nameInfo, rank) {
        const item = document.createElement('div');
        item.className = 'name-item';

        // 生成五行标签
        const wuxingTags = nameInfo.wuxing.map(element =>
            `<span class="wuxing-tag wuxing-${element}">${element}</span>`
        ).join('');

        // 评分颜色
        let scoreClass = 'name-score';
        if (nameInfo.score >= 80) scoreClass += ' score-excellent';
        else if (nameInfo.score >= 60) scoreClass += ' score-good';
        else scoreClass += ' score-average';

        item.innerHTML = `
            <div class="name-title">
                ${rank}. ${nameInfo.fullName}
                <span class="${scoreClass}">${nameInfo.score}分</span>
            </div>
            <div class="name-details">
                <div class="detail-item">
                    <span class="detail-label">笔画：</span>${nameInfo.strokes}画 (${nameInfo.analysis.strokeLuck})
                </div>
                <div class="detail-item">
                    <span class="detail-label">五行：</span>${nameInfo.analysis.wuxingBalance}
                </div>
                <div class="detail-item">
                    <span class="detail-label">读音：</span>${nameInfo.analysis.pronunciation}
                </div>
                <div class="detail-item">
                    <span class="detail-label">寓意：</span>${nameInfo.analysis.meaning}
                </div>
                <div class="wuxing-tags">
                    ${wuxingTags}
                </div>
            </div>
        `;

        // 添加点击复制功能
        item.addEventListener('click', function(e) {
            // 避免与按钮点击冲突
            if (!e.target.classList.contains('favorite-btn') && !e.target.classList.contains('share-btn')) {
                copyToClipboard(nameInfo.fullName);
                showCopyToast(nameInfo.fullName);
            }
        });

        // 如果enhancer已初始化，增强名字项
        if (window.enhancer) {
            return window.enhancer.enhanceNameItem(item, nameInfo);
        }

        return item;
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            // 兼容性方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    // 显示复制提示
    function showCopyToast(name) {
        // 移除已存在的提示
        const existingToast = document.querySelector('.copy-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新提示
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = `已复制"${name}"到剪贴板`;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out forwards;
        `;

        document.body.appendChild(toast);

        // 2秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 2000);
    }

    // 添加统计信息
    function addStatistics(nameCount, surname) {
        const existingStats = document.querySelector('.name-stats');
        if (existingStats) {
            existingStats.remove();
        }

        const stats = document.createElement('div');
        stats.className = 'name-stats';
        stats.style.cssText = `
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
            border-radius: 10px;
            border: 1px solid #b3d9ff;
        `;

        stats.innerHTML = `
            <p style="color: #666; margin: 0;">
                📊 已为"${surname}"姓生成 <strong style="color: #667eea;">${nameCount}</strong> 个精选好名
                <br>
                <small style="color: #999;">💡 点击任意名字可复制到剪贴板</small>
            </p>
        `;

        nameResults.appendChild(stats);
    }

    // 添加样式动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }

        .name-item {
            cursor: pointer;
            position: relative;
        }

        .name-item:hover::after {
            content: "点击复制";
            position: absolute;
            top: 10px;
            right: 15px;
            background: #667eea;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            opacity: 0.9;
        }

        .score-excellent {
            background: linear-gradient(135deg, #28a745, #20c997) !important;
        }

        .score-good {
            background: linear-gradient(135deg, #ffc107, #fd7e14) !important;
        }

        .score-average {
            background: linear-gradient(135deg, #6c757d, #495057) !important;
        }
    `;
    document.head.appendChild(style);

    // 输入验证
    const surnameInput = document.getElementById('surname');
    surnameInput.addEventListener('input', function(e) {
        const value = e.target.value;
        // 只允许中文字符
        const cleanValue = value.replace(/[^\u4e00-\u9fa5]/g, '');
        if (cleanValue !== value) {
            e.target.value = cleanValue;
        }
        // 限制长度
        if (cleanValue.length > 2) {
            e.target.value = cleanValue.substring(0, 2);
        }
    });

    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            if (nameForm.style.display !== 'none') {
                nameForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    console.log('🎉 中文取名神器初始化完成！');
    console.log('💡 提示：按 Ctrl+Enter 可快速生成名字');
});