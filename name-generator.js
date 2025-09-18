// 中文取名神器 - 核心算法模块
class ChineseNameGenerator {
    constructor() {
        // 五行属性映射
        this.wuxing = {
            '金': ['刚', '锐', '坚', '毅', '勇', '刀', '剑', '钢', '铁', '金', '银', '铜', '锌', '锦', '钧', '镇', '锋', '铭', '鑫', '钰', '铎', '锐', '钊', '锡', '锌', '锦'],
            '木': ['春', '东', '青', '绿', '林', '森', '树', '枝', '叶', '花', '草', '竹', '松', '柏', '梅', '桂', '梧', '桃', '李', '杨', '柳', '槐', '榆', '桔', '梨', '椿'],
            '水': ['江', '河', '湖', '海', '流', '波', '涛', '泉', '溪', '雨', '雪', '霜', '露', '云', '雾', '池', '潭', '瀑', '清', '澄', '沁', '润', '涵', '溢', '渊', '淼'],
            '火': ['阳', '光', '明', '亮', '照', '辉', '灿', '烂', '焕', '炎', '热', '温', '暖', '红', '赤', '朱', '丹', '彤', '焰', '烽', '炜', '煜', '熠', '烨', '炫', '燊'],
            '土': ['山', '岳', '峰', '岭', '坡', '丘', '原', '野', '田', '地', '土', '石', '岩', '磐', '墨', '尘', '埔', '坤', '培', '增', '墀', '坚', '垒', '城', '堡', '域']
        };

        // 常用美好寓意字典
        this.meaningfulChars = {
            '聪慧': ['智', '慧', '聪', '明', '睿', '敏', '颖', '思', '悟', '哲', '贤', '博', '学', '文', '理', '知'],
            '品德': ['德', '仁', '义', '礼', '诚', '信', '忠', '孝', '谦', '和', '善', '正', '纯', '真', '美', '良'],
            '成功': ['成', '功', '达', '业', '兴', '昌', '盛', '荣', '富', '贵', '顺', '利', '通', '进', '升', '腾'],
            '健康': ['健', '康', '强', '壮', '福', '寿', '安', '宁', '泰', '平', '吉', '祥', '瑞', '庆', '欢', '乐'],
            '美好': ['美', '丽', '雅', '秀', '娟', '婷', '芳', '香', '花', '蕊', '莲', '兰', '梅', '菊', '竹', '松']
        };

        // 笔画数吉凶对照表（简化版）
        this.strokeLuck = {
            '大吉': [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52],
            '中吉': [2, 4, 9, 10, 12, 14, 19, 20, 22, 26, 27, 28, 30, 34, 36, 38, 40, 42, 43, 44, 46, 49, 50, 51],
            '凶': [12, 14, 26, 27, 28, 34, 43, 44, 46]
        };

        // 声母韵母搭配规则
        this.pronunciationRules = {
            '避免': ['zh-zh', 'ch-ch', 'sh-sh', 'z-z', 'c-c', 's-s'], // 避免声母重复
            '推荐': ['b-m', 'p-n', 'f-ng', 'd-l', 't-r', 'n-g'] // 推荐搭配
        };
    }

    // 根据生辰八字计算五行缺失
    calculateWuxingDeficiency(birthDate) {
        // 简化版五行计算，实际应该根据完整的八字计算
        const year = new Date(birthDate).getFullYear();
        const element = ['金', '木', '水', '火', '土'][year % 5];

        // 模拟计算缺失的五行
        const allElements = ['金', '木', '水', '火', '土'];
        const strongElements = [element];
        const weakElements = allElements.filter(e => e !== element);

        return {
            strong: strongElements,
            weak: weakElements,
            recommend: weakElements[0] // 推荐补充最弱的元素
        };
    }

    // 计算汉字笔画数
    getStrokeCount(char) {
        // 简化版笔画计算，实际应该使用完整的笔画字典
        const strokeMap = {
            '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 2,
            '李': 7, '王': 4, '张': 11, '刘': 15, '陈': 16, '杨': 13, '赵': 14, '黄': 12, '周': 8,
            '明': 8, '华': 14, '强': 12, '军': 9, '伟': 11, '文': 4, '建': 9, '国': 11, '平': 5,
            '志': 7, '勇': 9, '峰': 10, '磊': 15, '鑫': 24, '淼': 12, '森': 12, '炎': 8, '垚': 9
        };
        return strokeMap[char] || Math.floor(Math.random() * 20) + 1;
    }

    // 获取字的五行属性
    getCharWuxing(char) {
        for (const [element, chars] of Object.entries(this.wuxing)) {
            if (chars.includes(char)) {
                return element;
            }
        }
        return '土'; // 默认属土
    }

    // 生成候选字符
    generateCandidateChars(wuxingPreference, meaningPreference, gender = 'neutral') {
        let candidates = [];

        // 根据五行偏好筛选
        if (wuxingPreference && this.wuxing[wuxingPreference]) {
            candidates = candidates.concat(this.wuxing[wuxingPreference]);
        }

        // 根据寓意偏好筛选
        if (meaningPreference && this.meaningfulChars[meaningPreference]) {
            candidates = candidates.concat(this.meaningfulChars[meaningPreference]);
        }

        // 性别倾向字符
        if (gender === 'male') {
            candidates = candidates.concat(['强', '刚', '毅', '勇', '雄', '伟', '杰', '豪', '峰', '龙']);
        } else if (gender === 'female') {
            candidates = candidates.concat(['美', '丽', '雅', '娟', '婷', '芳', '蕊', '莲', '兰', '梅']);
        }

        // 去重并返回
        return [...new Set(candidates)];
    }

    // 评估名字质量
    evaluateName(surname, name) {
        let score = 0;
        const analysis = {
            strokeLuck: '',
            wuxingBalance: '',
            pronunciation: '',
            meaning: '',
            overall: 0
        };

        // 笔画数理评估
        const totalStrokes = this.getStrokeCount(surname) + name.split('').reduce((sum, char) => sum + this.getStrokeCount(char), 0);
        if (this.strokeLuck['大吉'].includes(totalStrokes)) {
            score += 25;
            analysis.strokeLuck = '大吉';
        } else if (this.strokeLuck['中吉'].includes(totalStrokes)) {
            score += 15;
            analysis.strokeLuck = '中吉';
        } else {
            score += 5;
            analysis.strokeLuck = '一般';
        }

        // 五行平衡评估
        const surnameElement = this.getCharWuxing(surname);
        const nameElements = name.split('').map(char => this.getCharWuxing(char));
        const uniqueElements = new Set([surnameElement, ...nameElements]);
        score += uniqueElements.size * 5; // 五行种类越多越好
        analysis.wuxingBalance = `五行包含: ${Array.from(uniqueElements).join('、')}`;

        // 发音和谐度评估（简化）
        if (name.length === 2) {
            score += 20; // 双字名加分
            analysis.pronunciation = '读音和谐';
        } else {
            score += 10;
            analysis.pronunciation = '读音尚可';
        }

        // 寓意评估
        let meaningScore = 0;
        name.split('').forEach(char => {
            for (const chars of Object.values(this.meaningfulChars)) {
                if (chars.includes(char)) {
                    meaningScore += 10;
                    break;
                }
            }
        });
        score += Math.min(meaningScore, 30);
        analysis.meaning = meaningScore > 15 ? '寓意美好' : '寓意一般';

        analysis.overall = Math.min(score, 100);
        return analysis;
    }

    // 主要取名函数
    generateNames(options = {}) {
        const {
            surname = '李',
            gender = 'neutral',
            birthDate = new Date(),
            meaningPreference = '聪慧',
            count = 10
        } = options;

        // 计算五行需求
        const wuxingAnalysis = this.calculateWuxingDeficiency(birthDate);

        // 生成候选字符
        const candidates = this.generateCandidateChars(
            wuxingAnalysis.recommend,
            meaningPreference,
            gender
        );

        // 生成名字组合
        const names = [];
        for (let i = 0; i < count && candidates.length > 1; i++) {
            // 随机选择1-2个字组成名字
            const nameLength = Math.random() > 0.3 ? 2 : 1;
            let name = '';

            const usedChars = new Set();
            for (let j = 0; j < nameLength; j++) {
                let char;
                do {
                    char = candidates[Math.floor(Math.random() * candidates.length)];
                } while (usedChars.has(char) && usedChars.size < candidates.length);

                usedChars.add(char);
                name += char;
            }

            // 评估名字
            const evaluation = this.evaluateName(surname, name);

            names.push({
                fullName: surname + name,
                name: name,
                score: evaluation.overall,
                analysis: evaluation,
                wuxing: name.split('').map(char => this.getCharWuxing(char)),
                strokes: this.getStrokeCount(surname) + name.split('').reduce((sum, char) => sum + this.getStrokeCount(char), 0)
            });
        }

        // 按评分排序
        names.sort((a, b) => b.score - a.score);

        return {
            names: names,
            wuxingAnalysis: wuxingAnalysis,
            recommendations: this.getRecommendations(names[0])
        };
    }

    // 生成取名建议
    getRecommendations(bestName) {
        if (!bestName) return [];

        const recommendations = [];

        if (bestName.score >= 80) {
            recommendations.push('这是一个非常优秀的名字，各方面都很协调！');
        } else if (bestName.score >= 60) {
            recommendations.push('这是一个不错的名字，可以考虑使用。');
        } else {
            recommendations.push('建议重新生成，寻找更好的组合。');
        }

        if (bestName.analysis.strokeLuck === '大吉') {
            recommendations.push('笔画数理为大吉，对运势很有帮助。');
        }

        recommendations.push(`五行配置：${bestName.wuxing.join('、')}，有助于平衡命理。`);

        return recommendations;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChineseNameGenerator;
} else {
    window.ChineseNameGenerator = ChineseNameGenerator;
}