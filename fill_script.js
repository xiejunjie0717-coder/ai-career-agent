// 问卷自动填写脚本
// 模拟真实学生用户填写AI Career Agent体验调查问卷

(function() {
    // 随机选择函数（带权重）
    function weightedRandom(items, weights) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const randomVal = Math.random() * totalWeight;
        let cumulative = 0;
        for (let i = 0; i < items.length; i++) {
            cumulative += weights[i];
            if (randomVal < cumulative) {
                return items[i];
            }
        }
        return items[0];
    }

    // 随机选择多个选项
    function randomMultiSelect(items, minCount, maxCount) {
        const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
        const selected = [];
        const available = [...items];
        
        for (let i = 0; i < count && available.length > 0; i++) {
            const idx = Math.floor(Math.random() * available.length);
            selected.push(available[idx]);
            available.splice(idx, 1);
        }
        return selected;
    }

    // 点击radio按钮
    function clickRadio(name, value) {
        const radio = document.getElementById(`${name}_${value}`);
        if (radio) {
            radio.click();
        }
    }

    // 点击checkbox
    function clickCheckbox(name, value) {
        const checkbox = document.getElementById(`${name}_${value}`);
        if (checkbox) {
            checkbox.click();
        }
    }

    // 填写文本
    function fillText(id, text) {
        const input = document.getElementById(id);
        if (input) {
            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // 填写textarea
    function fillTextarea(id, text) {
        const textarea = document.getElementById(id);
        if (textarea) {
            textarea.value = text;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // 数据配置
    const config = {
        grades: [
            { value: 1, label: '大一', weight: 10 },
            { value: 2, label: '大二', weight: 15 },
            { value: 3, label: '大三', weight: 30 },
            { value: 4, label: '大四', weight: 25 },
            { value: 5, label: '研究生', weight: 15 },
            { value: 6, label: '其他', weight: 5 }
        ],
        majors: [
            '计算机科学与技术',
            '软件工程',
            '数据科学与大数据技术',
            '人工智能',
            '电子信息工程',
            '通信工程',
            '自动化',
            '金融学',
            '工商管理',
            '市场营销',
            '人力资源管理',
            '会计学',
            '法学',
            '英语',
            '新闻传播',
            '设计学',
            '机械工程',
            '土木工程',
            '化学工程',
            '生物工程'
        ],
        jobStages: [
            { value: 1, label: '尚未开始', weight: 15 },
            { value: 2, label: '了解方向', weight: 20 },
            { value: 3, label: '准备简历', weight: 25 },
            { value: 4, label: '正在投递', weight: 20 },
            { value: 5, label: '准备面试', weight: 15 },
            { value: 6, label: '已有Offer', weight: 5 }
        ],
        targetJobs: [
            '产品经理',
            '前端开发工程师',
            '后端开发工程师',
            '全栈工程师',
            '数据分析师',
            '算法工程师',
            'UI设计师',
            '运营专员',
            '市场营销',
            '人力资源',
            '财务分析师',
            '咨询顾问',
            '项目经理',
            '测试工程师',
            '运维工程师',
            'Java开发工程师',
            'Python开发工程师',
            '移动端开发工程师',
            '游戏开发工程师',
            '嵌入式工程师'
        ],
        aiFrequency: [
            { value: 1, label: '从未使用', weight: 5 },
            { value: 2, label: '偶尔使用', weight: 20 },
            { value: 3, label: '每周使用', weight: 30 },
            { value: 4, label: '几乎每天', weight: 35 },
            { value: 5, label: '每天多次', weight: 10 }
        ],
        difficulties: [1, 2, 3, 4, 5, 6, 7], // 看不懂JD, 不清楚能力差距, 不知道学什么, 不会写简历, 不知道如何准备面试, 缺少职业规划, 其他
        completionStatus: [
            { value: 1, label: '独立完成', weight: 30 },
            { value: 2, label: '经过尝试后完成', weight: 25 },
            { value: 3, label: '他人提示后完成', weight: 20 },
            { value: 4, label: '未完成', weight: 15 },
            { value: 5, label: '未体验', weight: 10 }
        ],
        easeScores: [
            { value: 1, weight: 5 },
            { value: 2, weight: 10 },
            { value: 3, weight: 20 },
            { value: 4, weight: 35 },
            { value: 5, weight: 30 }
        ],
        helpScores: [
            { value: 1, weight: 5 },
            { value: 2, weight: 10 },
            { value: 3, weight: 25 },
            { value: 4, weight: 35 },
            { value: 5, weight: 25 }
        ],
        problems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 各种问题选项
        overallScores: [
            { value: 1, weight: 5 },
            { value: 2, weight: 10 },
            { value: 3, weight: 20 },
            { value: 4, weight: 40 },
            { value: 5, weight: 25 }
        ],
        willingnessScores: [
            { value: 1, weight: 5 },
            { value: 2, weight: 10 },
            { value: 3, weight: 15 },
            { value: 4, weight: 40 },
            { value: 5, weight: 30 }
        ],
        nextStepOptions: [
            { value: 1, label: '完全没有', weight: 5 },
            { value: 2, label: '帮助较少', weight: 10 },
            { value: 3, label: '帮助一般', weight: 25 },
            { value: 4, label: '帮助较大', weight: 40 },
            { value: 5, label: '帮助非常大', weight: 20 }
        ],
        advantages: [1, 2, 3, 4, 5, 6, 7],
        valuableFeatures: [
            '岗位分析功能最有价值，能帮助我快速了解岗位要求，明确自己需要具备哪些技能',
            '能力评估功能最有价值，让我清楚知道自己的不足，有针对性地提升',
            '差距诊断功能最有价值，明确了我需要提升的方向，避免了盲目学习',
            '学习路线功能最有价值，提供了清晰的学习计划，节省了大量时间',
            '简历优化功能最有价值，帮助我改进简历质量，提高了面试机会',
            '模拟面试功能最有价值，让我提前熟悉面试流程，减少了紧张感',
            '整体流程最有价值，一站式解决求职问题，非常方便'
        ],
        improveFeatures: [
            '岗位分析结果不够详细，希望能提供更多案例和具体技能要求',
            '能力评估标准不够透明，希望能看到评分依据和详细解释',
            '差距诊断建议太笼统，希望能更具体，给出可执行的行动计划',
            '学习路线资源太少，希望能推荐更多学习材料和课程',
            '简历优化建议太通用，希望能针对具体岗位进行优化',
            '模拟面试题目太少，希望能有更多场景和行业针对性',
            '整体响应速度需要提升，等待时间较长影响体验',
            '界面设计可以更美观，操作体验有待优化'
        ],
        confusions: [
            '不清楚如何开始使用，入口不够明显，需要更多引导',
            '不知道输入什么内容，提示不够清晰，容易卡住',
            '不理解AI给出的结果，解释不够详细，需要更多说明',
            '不知道下一步该做什么，流程引导不足，容易迷失',
            '不清楚各个功能之间的关系，整体流程不明确',
            '不知道如何保存或导出结果，缺少数据管理功能',
            '不清楚结果的准确性如何验证，需要更多可信度说明'
        ],
        untrustedResults: [
            '能力评估结果，不清楚评估标准，担心不够准确',
            '差距诊断结果，感觉和个人认知有差异，不确定是否正确',
            '学习路线推荐，不确定是否真的有效，担心浪费时间',
            '简历优化建议，担心不符合实际招聘要求，不敢直接使用',
            '模拟面试评分，不清楚评分依据，感觉评分标准不透明',
            '整体AI生成内容，担心有错误或偏见，需要人工验证',
            '没有不信任的结果，整体比较可信，感觉有帮助'
        ],
        improveSuggestions: [
            '增加更多功能引导和教程，帮助新用户快速上手',
            '优化界面设计，提升用户体验，让操作更流畅',
            '加快响应速度，减少等待时间，提高效率',
            '增加结果解释，让用户更好理解AI给出的建议',
            '提供更多学习资源和推荐，丰富学习路线内容',
            '增加数据导出和保存功能，方便用户管理求职资料',
            '支持更多岗位类型和行业，扩大适用范围',
            '增加个性化定制功能，让用户可以根据需求调整'
        ],
        otherSuggestions: [
            '希望能支持英文版本，方便海外求职或外企申请',
            '希望能有移动端App，随时随地使用，更方便',
            '希望能和企业招聘系统对接，直接投递简历',
            '希望能提供求职进度跟踪功能，管理整个求职流程',
            '希望能有社区功能，和其他求职者交流经验',
            '希望能提供薪资参考信息，帮助谈薪',
            '希望能支持视频简历功能，展示更多能力',
            '整体体验不错，继续保持，期待更多功能'
        ]
    };

    // 填写问卷
    function fillQuestionnaire() {
        // 1. 年级
        const grade = weightedRandom(
            config.grades.map(g => g.value),
            config.grades.map(g => g.weight)
        );
        clickRadio('q1', grade);

        // 2. 专业
        const major = config.majors[Math.floor(Math.random() * config.majors.length)];
        fillText('q2', major);

        // 3. 求职阶段
        const stage = weightedRandom(
            config.jobStages.map(s => s.value),
            config.jobStages.map(s => s.weight)
        );
        clickRadio('q3', stage);

        // 4. 目标岗位
        const job = config.targetJobs[Math.floor(Math.random() * config.targetJobs.length)];
        fillText('q4', job);

        // 5. AI工具使用频率
        const freq = weightedRandom(
            config.aiFrequency.map(f => f.value),
            config.aiFrequency.map(f => f.weight)
        );
        clickRadio('q5', freq);

        // 6. 求职困难（多选）
        const difficulties = randomMultiSelect(config.difficulties, 2, 4);
        difficulties.forEach(d => clickCheckbox('q6', d));

        // 7-12. 功能完成情况表格（6个功能）
        // 岗位分析(q7), 能力评估(q8), 差距诊断(q9), 学习路线(q10), 简历优化(q11), 模拟面试(q12)
        for (let i = 7; i <= 12; i++) {
            const completion = weightedRandom(
                config.completionStatus.map(c => c.value),
                config.completionStatus.map(c => c.weight)
            );
            fillText(`q${i}_0`, completion);
        }

        // 13-18. 功能难易程度表格
        for (let i = 13; i <= 18; i++) {
            const ease = weightedRandom(
                config.easeScores.map(e => e.value),
                config.easeScores.map(e => e.weight)
            );
            fillText(`q${i}_0`, ease);
        }

        // 19-24. 功能帮助程度表格
        for (let i = 19; i <= 24; i++) {
            const help = weightedRandom(
                config.helpScores.map(h => h.value),
                config.helpScores.map(h => h.weight)
            );
            fillText(`q${i}_0`, help);
        }

        // 25-30. 功能问题表格（多选，用逗号分隔）
        for (let i = 25; i <= 30; i++) {
            const problems = randomMultiSelect(config.problems, 1, 3);
            fillText(`q${i}_0`, problems.join(','));
        }

        // 31-34 是隐藏字段，跳过

        // 35. 整体易用性
        const overall = weightedRandom(
            config.overallScores.map(o => o.value),
            config.overallScores.map(o => o.weight)
        );
        clickRadio('q35', overall);

        // 36-37 是隐藏字段，跳过

        // 38. 页面与导航清晰度（使用相同的评分模式）
        // 这个问题似乎没有直接的radio，可能是表格的一部分
        // 需要根据实际情况调整

        // 39-44. 文本问题
        const valuableIdx = Math.floor(Math.random() * config.valuableFeatures.length);
        fillTextarea('q39', config.valuableFeatures[valuableIdx]);

        const improveIdx = Math.floor(Math.random() * config.improveFeatures.length);
        fillTextarea('q40', config.improveFeatures[improveIdx]);

        const confusionIdx = Math.floor(Math.random() * config.confusions.length);
        fillTextarea('q41', config.confusions[confusionIdx]);

        const untrustedIdx = Math.floor(Math.random() * config.untrustedResults.length);
        fillTextarea('q42', config.untrustedResults[untrustedIdx]);

        const suggestionIdx = Math.floor(Math.random() * config.improveSuggestions.length);
        fillTextarea('q43', config.improveSuggestions[suggestionIdx]);

        const otherIdx = Math.floor(Math.random() * config.otherSuggestions.length);
        fillTextarea('q44', config.otherSuggestions[otherIdx]);

        return '问卷已填写完成';
    }

    // 执行填写
    return fillQuestionnaire();
})();