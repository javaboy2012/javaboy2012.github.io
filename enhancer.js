// 用户体验增强功能
class UserExperienceEnhancer {
    constructor() {
        this.favorites = this.loadFavorites();
        this.history = this.loadHistory();
        this.init();
    }

    init() {
        this.setupAdvancedFeatures();
        this.setupAnimations();
        this.setupSharing();
        this.setupTips();
    }

    // 设置高级功能
    setupAdvancedFeatures() {
        // 添加收藏功能
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn')) {
                this.toggleFavorite(e.target);
            }
        });

        // 添加详情展开功能
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('expand-details')) {
                this.toggleDetails(e.target);
            }
        });

        // 添加分享功能
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-btn')) {
                this.shareNames(e.target);
            }
        });
    }

    // 设置动画效果
    setupAnimations() {
        // 添加输入时的实时反馈
        const surnameInput = document.getElementById('surname');
        const preview = this.createPreview();

        surnameInput.addEventListener('input', (e) => {
            this.updatePreview(e.target.value);
        });

        // 添加表单验证动画
        this.setupFormValidation();
    }

    // 创建姓氏预览
    createPreview() {
        const preview = document.createElement('div');
        preview.id = 'surnamePreview';
        preview.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: linear-gradient(135deg, #f0f8ff, #e6f3ff);
            border-radius: 8px;
            border-left: 3px solid #667eea;
            font-size: 0.9rem;
            color: #666;
            display: none;
        `;

        const surnameGroup = document.querySelector('#surname').parentNode;
        surnameGroup.appendChild(preview);
        return preview;
    }

    // 更新姓氏预览
    updatePreview(surname) {
        const preview = document.getElementById('surnamePreview');
        if (!surname.trim()) {
            preview.style.display = 'none';
            return;
        }

        // 模拟生成一个示例名字
        const exampleNames = ['明轩', '思雨', '浩然', '雅琪', '志强'];
        const randomName = exampleNames[Math.floor(Math.random() * exampleNames.length)];

        preview.innerHTML = `
            <div style="margin-bottom: 5px;">
                <strong>预览效果：</strong> ${surname}${randomName}
            </div>
            <small style="color: #999;">💡 这只是示例，实际生成的名字会更加精准</small>
        `;
        preview.style.display = 'block';
    }

    // 设置表单验证
    setupFormValidation() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    // 验证输入
    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let message = '';

        if (input.id === 'surname') {
            if (!value) {
                isValid = false;
                message = '请输入姓氏';
            } else if (!/^[\u4e00-\u9fa5]{1,2}$/.test(value)) {
                isValid = false;
                message = '姓氏只能是1-2个中文字符';
            }
        }

        this.showValidationFeedback(input, isValid, message);
    }

    // 显示验证反馈
    showValidationFeedback(input, isValid, message) {
        // 移除之前的反馈
        const existingFeedback = input.parentNode.querySelector('.validation-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        if (!isValid && message) {
            const feedback = document.createElement('div');
            feedback.className = 'validation-feedback';
            feedback.style.cssText = `
                color: #dc3545;
                font-size: 0.8rem;
                margin-top: 5px;
                animation: shake 0.5s ease-in-out;
            `;
            feedback.textContent = message;
            input.parentNode.appendChild(feedback);

            // 添加错误样式
            input.style.borderColor = '#dc3545';
            input.style.boxShadow = '0 0 0 2px rgba(220, 53, 69, 0.1)';
        } else {
            // 恢复正常样式
            input.style.borderColor = '#e1e5e9';
            input.style.boxShadow = '';
        }
    }

    // 收藏功能
    toggleFavorite(btn) {
        const nameItem = btn.closest('.name-item');
        const fullName = nameItem.querySelector('.name-title').textContent.split('.')[1].split('分')[0].trim();

        if (this.favorites.includes(fullName)) {
            this.removeFavorite(fullName);
            btn.innerHTML = '⭐';
            btn.title = '添加到收藏';
        } else {
            this.addFavorite(fullName);
            btn.innerHTML = '🌟';
            btn.title = '取消收藏';
        }
    }

    addFavorite(name) {
        if (!this.favorites.includes(name)) {
            this.favorites.push(name);
            this.saveFavorites();
            this.showToast(`已收藏"${name}"`);
        }
    }

    removeFavorite(name) {
        const index = this.favorites.indexOf(name);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.showToast(`已取消收藏"${name}"`);
        }
    }

    // 详情展开/折叠
    toggleDetails(btn) {
        const nameItem = btn.closest('.name-item');
        const details = nameItem.querySelector('.name-details');
        const isExpanded = details.style.maxHeight && details.style.maxHeight !== '0px';

        if (isExpanded) {
            details.style.maxHeight = '0px';
            details.style.overflow = 'hidden';
            btn.textContent = '展开详情';
        } else {
            details.style.maxHeight = details.scrollHeight + 'px';
            details.style.overflow = 'visible';
            btn.textContent = '收起详情';
        }
    }

    // 分享功能
    shareNames(btn) {
        const nameItem = btn.closest('.name-item');
        const fullName = nameItem.querySelector('.name-title').textContent.split('.')[1].split('分')[0].trim();
        const score = nameItem.querySelector('.name-score').textContent;

        const shareText = `🎯 取名神器推荐好名字：${fullName} (评分：${score})
💡 基于传统文化与现代算法的智能取名
🌟 点击链接体验：${window.location.href}`;

        if (navigator.share) {
            // 使用原生分享API
            navigator.share({
                title: '中文取名神器',
                text: shareText,
                url: window.location.href
            });
        } else {
            // 降级到复制分享文本
            this.copyToClipboard(shareText);
            this.showToast('分享内容已复制到剪贴板');
        }
    }

    // 设置提示系统
    setupTips() {
        const tips = [
            '💡 建议选择评分80分以上的名字',
            '🌟 五行平衡的名字更有利于孩子发展',
            '📚 可以点击名字查看详细寓意解释',
            '❤️ 喜欢的名字可以收藏起来慢慢考虑',
            '🔄 不满意可以调整条件重新生成'
        ];

        this.showRandomTip(tips);

        // 定时显示提示
        setInterval(() => {
            this.showRandomTip(tips);
        }, 30000); // 每30秒显示一个提示
    }

    showRandomTip(tips) {
        const tip = tips[Math.floor(Math.random() * tips.length)];
        this.showToast(tip, 3000);
    }

    // 通用提示框
    showToast(message, duration = 2000) {
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out forwards;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // 复制功能
    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.cssText = 'position: fixed; opacity: 0; pointer-events: none;';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }

    // 存储功能
    saveFavorites() {
        localStorage.setItem('nameGenerator_favorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const saved = localStorage.getItem('nameGenerator_favorites');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory(searchData) {
        this.history.unshift({
            ...searchData,
            timestamp: new Date().toISOString()
        });

        // 只保留最近10次搜索记录
        this.history = this.history.slice(0, 10);
        localStorage.setItem('nameGenerator_history', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('nameGenerator_history');
        return saved ? JSON.parse(saved) : [];
    }

    // 增强名字项显示
    enhanceNameItem(nameItem, nameInfo) {
        const titleElement = nameItem.querySelector('.name-title');
        const fullName = nameInfo.fullName;

        // 添加收藏按钮
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 10px;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
        `;
        favoriteBtn.innerHTML = this.favorites.includes(fullName) ? '🌟' : '⭐';
        favoriteBtn.title = this.favorites.includes(fullName) ? '取消收藏' : '添加到收藏';

        // 添加分享按钮
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.style.cssText = favoriteBtn.style.cssText;
        shareBtn.innerHTML = '📤';
        shareBtn.title = '分享这个名字';

        titleElement.appendChild(favoriteBtn);
        titleElement.appendChild(shareBtn);

        return nameItem;
    }
}

// 添加相关CSS动画
const enhancerStyle = document.createElement('style');
enhancerStyle.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .favorite-btn:hover, .share-btn:hover {
        background: rgba(102, 126, 234, 0.1) !important;
        transform: scale(1.1);
    }

    .name-details {
        transition: all 0.3s ease;
    }

    .validation-feedback {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(enhancerStyle);

// 初始化用户体验增强器
let enhancer;
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        enhancer = new UserExperienceEnhancer();
        // 将enhancer暴露到全局
        window.enhancer = enhancer;
        console.log('🚀 用户体验增强功能已加载');
    }, 500);
});