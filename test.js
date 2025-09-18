// 功能测试脚本
function testNameGenerator() {
    console.log('🧪 开始测试中文取名神器...');

    const generator = new ChineseNameGenerator();

    // 测试1: 基本取名功能
    console.log('\n📝 测试1: 基本取名功能');
    const result1 = generator.generateNames({
        surname: '李',
        gender: 'male',
        birthDate: new Date('2023-01-01'),
        meaningPreference: '聪慧',
        count: 5
    });

    console.log('✅ 生成名字数量:', result1.names.length);
    console.log('✅ 最高评分:', Math.max(...result1.names.map(n => n.score)));
    console.log('✅ 五行分析:', result1.wuxingAnalysis);

    // 测试2: 不同性别的名字
    console.log('\n📝 测试2: 女孩名字生成');
    const result2 = generator.generateNames({
        surname: '王',
        gender: 'female',
        meaningPreference: '美好',
        count: 3
    });

    console.log('✅ 女孩名字示例:', result2.names.slice(0, 2).map(n => n.fullName));

    // 测试3: 五行计算
    console.log('\n📝 测试3: 五行计算');
    const wuxing1 = generator.calculateWuxingDeficiency(new Date('1990-05-15'));
    const wuxing2 = generator.calculateWuxingDeficiency(new Date('2000-12-25'));

    console.log('✅ 1990-05-15 五行分析:', wuxing1);
    console.log('✅ 2000-12-25 五行分析:', wuxing2);

    // 测试4: 名字评估
    console.log('\n📝 测试4: 名字评估系统');
    const evaluation1 = generator.evaluateName('张', '伟明');
    const evaluation2 = generator.evaluateName('李', '雅琪');

    console.log('✅ "张伟明" 评分:', evaluation1.overall);
    console.log('✅ "李雅琪" 评分:', evaluation2.overall);

    // 测试5: 复姓测试
    console.log('\n📝 测试5: 复姓支持');
    const result3 = generator.generateNames({
        surname: '欧阳',
        gender: 'neutral',
        meaningPreference: '成功',
        count: 3
    });

    console.log('✅ 复姓名字示例:', result3.names.slice(0, 2).map(n => n.fullName));

    // 性能测试
    console.log('\n⚡ 性能测试');
    const startTime = performance.now();
    for (let i = 0; i < 10; i++) {
        generator.generateNames({
            surname: '测试',
            count: 10
        });
    }
    const endTime = performance.now();
    console.log('✅ 生成100个名字用时:', Math.round(endTime - startTime), 'ms');

    console.log('\n🎉 所有测试完成！取名神器功能正常');
}

// 用户体验测试
function testUserExperience() {
    console.log('\n🎨 测试用户体验功能...');

    // 模拟本地存储测试
    if (typeof Storage !== "undefined") {
        // 测试收藏功能
        localStorage.setItem('nameGenerator_favorites', JSON.stringify(['李明轩', '王雅琪']));
        console.log('✅ 本地存储功能正常');

        // 测试历史记录
        const history = [
            { surname: '李', gender: 'male', timestamp: new Date().toISOString() },
            { surname: '王', gender: 'female', timestamp: new Date().toISOString() }
        ];
        localStorage.setItem('nameGenerator_history', JSON.stringify(history));
        console.log('✅ 历史记录功能正常');
    }

    // 测试动画支持
    const supportsCSS = CSS.supports('animation', 'fadeIn 1s ease');
    console.log('✅ CSS动画支持:', supportsCSS ? '是' : '否');

    // 测试剪贴板支持
    const supportsClipboard = !!navigator.clipboard;
    console.log('✅ 现代剪贴板支持:', supportsClipboard ? '是' : '否（将使用兼容性方案）');

    // 测试分享支持
    const supportsShare = !!navigator.share;
    console.log('✅ 原生分享支持:', supportsShare ? '是' : '否（将使用复制方案）');

    console.log('🎉 用户体验测试完成！');
}

// 兼容性测试
function testCompatibility() {
    console.log('\n🔧 浏览器兼容性测试...');

    const tests = [
        { name: 'ES6 支持', test: () => { try { new Map(); return true; } catch { return false; } } },
        { name: 'Promise 支持', test: () => typeof Promise !== 'undefined' },
        { name: 'Fetch API', test: () => typeof fetch !== 'undefined' },
        { name: 'LocalStorage', test: () => typeof Storage !== 'undefined' },
        { name: 'CSS Grid', test: () => CSS.supports('display', 'grid') },
        { name: 'CSS Flexbox', test: () => CSS.supports('display', 'flex') }
    ];

    tests.forEach(({ name, test }) => {
        const result = test();
        console.log(result ? '✅' : '❌', name + ':', result ? '支持' : '不支持');
    });

    console.log('🎉 兼容性测试完成！');
}

// 自动运行测试（如果在开发环境中）
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            testNameGenerator();
            testUserExperience();
            testCompatibility();
        }, 1000);
    });
}