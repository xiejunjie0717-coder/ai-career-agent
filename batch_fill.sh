#!/bin/bash
# 批量填写52份AI Career Agent体验调查问卷
# 模拟真实学生用户的不同回答

QUESTIONNAIRE_URL="https://v.wjx.cn/vm/YQgvPEO.aspx"
TOTAL_COUNT=52

# 数据配置
GRADES=("大一" "大二" "大三" "大四" "研究生" "其他")
GRADE_WEIGHTS=(10 15 30 25 15 5)

MAJORS=(
    "计算机科学与技术" "软件工程" "数据科学与大数据技术" "人工智能"
    "电子信息工程" "通信工程" "自动化" "金融学" "工商管理"
    "市场营销" "人力资源管理" "会计学" "法学" "英语" "新闻传播"
    "设计学" "机械工程" "土木工程" "化学工程" "生物工程"
)

JOB_STAGES=("尚未开始" "了解方向" "准备简历" "正在投递" "准备面试" "已有Offer")
JOB_STAGE_WEIGHTS=(15 20 25 20 15 5)

TARGET_JOBS=(
    "产品经理" "前端开发工程师" "后端开发工程师" "全栈工程师"
    "数据分析师" "算法工程师" "UI设计师" "运营专员" "市场营销"
    "人力资源" "财务分析师" "咨询顾问" "项目经理" "测试工程师"
    "运维工程师" "Java开发工程师" "Python开发工程师" "移动端开发工程师"
    "游戏开发工程师" "嵌入式工程师"
)

AI_FREQUENCY=("从未使用" "偶尔使用" "每周使用" "几乎每天" "每天多次")
AI_FREQUENCY_WEIGHTS=(5 20 30 35 10)

# 根据权重随机选择
weighted_random() {
    local items=("${!1}")
    local weights=("${!2}")
    local total_weight=0
    for w in "${weights[@]}"; do
        total_weight=$((total_weight + w))
    done
    local random_val=$((RANDOM % total_weight))
    local cumulative=0
    for i in "${!items[@]}"; do
        cumulative=$((cumulative + weights[$i]))
        if ((random_val < cumulative)); then
            echo "${items[$i]}"
            return
        fi
    done
    echo "${items[0]}"
}

# 随机选择索引
weighted_random_idx() {
    local weights=("${!1}")
    local total_weight=0
    for w in "${weights[@]}"; do
        total_weight=$((total_weight + w))
    done
    local random_val=$((RANDOM % total_weight))
    local cumulative=0
    for i in "${!weights[@]}"; do
        cumulative=$((cumulative + weights[$i]))
        if ((random_val < cumulative)); then
            echo "$i"
            return
        fi
    done
    echo "0"
}

# 填写一份问卷
fill_questionnaire() {
    local run_id=$1
    echo "=== 开始填写第 $run_id 份问卷 ==="
    
    # 打开问卷页面
    agent-browser open "$QUESTIONNAIRE_URL"
    agent-browser wait --load networkidle
    sleep 2
    
    # 生成随机答案
    local grade_idx=$(weighted_random_idx GRADE_WEIGHTS[@])
    local grade="${GRADES[$grade_idx]}"
    local major="${MAJORS[$RANDOM % ${#MAJORS[@]}]}"
    local stage_idx=$(weighted_random_idx JOB_STAGE_WEIGHTS[@])
    local stage="${JOB_STAGES[$stage_idx]}"
    local job="${TARGET_JOBS[$RANDOM % ${#TARGET_JOBS[@]}]}"
    local freq_idx=$(weighted_random_idx AI_FREQUENCY_WEIGHTS[@])
    local freq="${AI_FREQUENCY[$freq_idx]}"
    
    echo "年级: $grade, 专业: $major, 求职阶段: $stage, 目标岗位: $job, AI频率: $freq"
    
    # 第一页：基本信息
    # 年级 radio: q1_1 到 q1_6
    agent-browser eval --stdin <<EVALEOF
document.getElementById('q1_${grade_idx}').click();
EVALEOF
    sleep 1
    
    # 专业
    agent-browser eval --stdin <<EVALEOF
document.getElementById('q2').value = '${major}';
document.getElementById('q2').dispatchEvent(new Event('input', {bubbles: true}));
EVALEOF
    sleep 1
    
    # 求职阶段 radio: q3_1 到 q3_6
    agent-browser eval --stdin <<EVALEOF
document.getElementById('q3_${stage_idx}').click();
EVALEOF
    sleep 1
    
    # 目标岗位
    agent-browser eval --stdin <<EVALEOF
document.getElementById('q4').value = '${job}';
document.getElementById('q4').dispatchEvent(new Event('input', {bubbles: true}));
EVALEOF
    sleep 1
    
    # AI使用频率 radio: q5_1 到 q5_5
    agent-browser eval --stdin <<EVALEOF
document.getElementById('q5_${freq_idx}').click();
EVALEOF
    sleep 1
    
    # 求职困难（多选）- 随机选择2-4个
    local difficulty_count=$((RANDOM % 3 + 2))
    local difficulties=()
    local available=(1 2 3 4 5 6 7)
    for ((i=0; i<difficulty_count; i++)); do
        local idx=$((RANDOM % ${#available[@]}))
        difficulties+=("${available[$idx]}")
        available=("${available[@]:0:$idx}" "${available[@]:$idx+1}")
    done
    
    for d in "${difficulties[@]}"; do
        agent-browser eval --stdin <<EVALEOF
document.getElementById('q6_${d}').click();
EVALEOF
        sleep 0.5
    done
    
    # 点击下一页
    agent-browser snapshot -i | grep "下一页" | head -1 | sed 's/.*\[ref=\([^]]*\)\].*/\1/' > /tmp/next_ref.txt
    local next_ref=$(cat /tmp/next_ref.txt)
    agent-browser click @$next_ref
    agent-browser wait --load networkidle
    sleep 2
    
    # 第二页：功能评价表格
    # 完成情况（选择1-5）
    local completion_values=("1" "1" "2" "1" "2" "3") # 倾向于选择独立完成
    local ease_values=("4" "4" "3" "4" "3" "4") # 倾向于选择4分
    local help_values=("4" "3" "4" "4" "3" "4") # 倾向于选择4分
    
    agent-browser eval --stdin <<EVALEOF
(function() {
    // 完成情况表格
    const tables = ['divRefTab7', 'divRefTab11', 'divRefTab15', 'divRefTab19', 'divRefTab23', 'divRefTab27'];
    const values = [${completion_values[@]}];
    tables.forEach((t, i) => {
        const table = document.getElementById(t);
        if (table) {
            const a = table.querySelector('a[dval="' + values[i] + '"]');
            if (a) a.click();
        }
    });
    
    // 难易程度表格
    const easeTables = ['divRefTab8', 'divRefTab12', 'divRefTab16', 'divRefTab20', 'divRefTab24', 'divRefTab28'];
    const easeVals = [${ease_values[@]}];
    easeTables.forEach((t, i) => {
        const table = document.getElementById(t);
        if (table) {
            const a = table.querySelector('a[dval="' + easeVals[i] + '"]');
            if (a) a.click();
        }
    });
    
    // 帮助程度表格
    const helpTables = ['divRefTab9', 'divRefTab13', 'divRefTab17', 'divRefTab21', 'divRefTab25', 'divRefTab29'];
    const helpVals = [${help_values[@]}];
    helpTables.forEach((t, i) => {
        const table = document.getElementById(t);
        if (table) {
            const a = table.querySelector('a[dval="' + helpVals[i] + '"]');
            if (a) a.click();
        }
    });
    
    // 问题表格（选择"没有问题"）
    const problemTables = ['divRefTab10', 'divRefTab14', 'divRefTab18', 'divRefTab22', 'divRefTab26', 'divRefTab30'];
    problemTables.forEach(t => {
        const table = document.getElementById(t);
        if (table) {
            const a = table.querySelector('a[dval="9"]');
            if (a) a.click();
        }
    });
    
    return 'Tables filled';
})();
EVALEOF
    sleep 2
    
    # 点击下一页
    agent-browser snapshot -i | grep "下一页" | head -1 | sed 's/.*\[ref=\([^]]*\)\].*/\1/' > /tmp/next_ref.txt
    local next_ref=$(cat /tmp/next_ref.txt)
    agent-browser click @$next_ref
    agent-browser wait --load networkidle
    sleep 2
    
    # 第三页：整体评价
    # 整体易用性、页面清晰度、AI结果易理解、AI结果可信度（选择4分）
    agent-browser eval --stdin <<EVALEOF
(function() {
    // 选择整体评分（4分）
    const scaleDivs = document.querySelectorAll('.scale-rating');
    scaleDivs.forEach(sd => {
        const anchors = sd.querySelectorAll('a');
        if (anchors.length >= 4) {
            anchors[3].click();
        }
    });
    
    // 完整流程帮助程度
    const q35_4 = document.getElementById('q35_4');
    if (q35_4) q35_4.click();
    
    return 'Overall ratings filled';
})();
EVALEOF
    sleep 1
    
    # 优势（多选）
    agent-browser eval --stdin <<EVALEOF
(function() {
    // 选择优势
    const advantages = [1, 2, 4, 5];
    advantages.forEach(v => {
        const cb = document.getElementById('q38_' + v);
        if (cb) cb.click();
    });
    return 'Advantages filled';
})();
EVALEOF
    sleep 1
    
    # 文本问题
    local valuable_features=(
        "岗位分析功能最有价值，能帮助我快速了解岗位要求，明确自己需要具备哪些技能，节省了大量时间。"
        "能力评估功能最有价值，让我清楚知道自己的不足，有针对性地提升。"
        "差距诊断功能最有价值，明确了我需要提升的方向，避免了盲目学习。"
        "学习路线功能最有价值，提供了清晰的学习计划，节省了大量时间。"
        "简历优化功能最有价值，帮助我改进简历质量，提高了面试机会。"
        "模拟面试功能最有价值，让我提前熟悉面试流程，减少了紧张感。"
    )
    
    local improve_features=(
        "岗位分析结果不够详细，希望能提供更多案例和具体技能要求。"
        "能力评估标准不够透明，希望能看到评分依据和详细解释。"
        "差距诊断建议太笼统，希望能更具体，给出可执行的行动计划。"
        "学习路线资源太少，希望能推荐更多学习材料和课程。"
        "简历优化建议太通用，希望能针对具体岗位进行优化。"
        "模拟面试题目太少，希望能有更多场景和行业针对性。"
    )
    
    local confusions=(
        "不清楚如何开始使用，入口不够明显，需要更多引导和教程。"
        "不知道输入什么内容，提示不够清晰，容易卡住。"
        "不理解AI给出的结果，解释不够详细，需要更多说明。"
        "不知道下一步该做什么，流程引导不足，容易迷失。"
        "不清楚各个功能之间的关系，整体流程不明确。"
    )
    
    local untrusted=(
        "能力评估结果，不清楚评估标准，担心不够准确。"
        "差距诊断结果，感觉和个人认知有差异，不确定是否正确。"
        "学习路线推荐，不确定是否真的有效，担心浪费时间。"
        "简历优化建议，担心不符合实际招聘要求，不敢直接使用。"
        "没有不信任的结果，整体比较可信，感觉有帮助。"
    )
    
    local improve_suggestions=(
        "增加更多功能引导和教程，帮助新用户快速上手。"
        "优化界面设计，提升用户体验，让操作更流畅。"
        "加快响应速度，减少等待时间，提高效率。"
        "增加结果解释，让用户更好理解AI给出的建议。"
        "提供更多学习资源和推荐，丰富学习路线内容。"
    )
    
    local other_suggestions=(
        "希望能有移动端App，随时随地使用，更方便。"
        "希望能和企业招聘系统对接，直接投递简历。"
        "希望能提供求职进度跟踪功能，管理整个求职流程。"
        "希望能有社区功能，和其他求职者交流经验。"
        "整体体验不错，继续保持，期待更多功能。"
    )
    
    local valuable="${valuable_features[$RANDOM % ${#valuable_features[@]}]}"
    local improve="${improve_features[$RANDOM % ${#improve_features[@]}]}"
    local confusion="${confusions[$RANDOM % ${#confusions[@]}]}"
    local untrust="${untrusted[$RANDOM % ${#untrusted[@]}]}"
    local improve_sug="${improve_suggestions[$RANDOM % ${#improve_suggestions[@]}]}"
    local other_sug="${other_suggestions[$RANDOM % ${#other_suggestions[@]}]}"
    
    agent-browser eval --stdin <<EVALEOF
(function() {
    document.getElementById('q39').value = '${valuable}';
    document.getElementById('q40').value = '${improve}';
    document.getElementById('q41').value = '${confusion}';
    document.getElementById('q42').value = '${untrust}';
    document.getElementById('q43').value = '${improve_sug}';
    document.getElementById('q44').value = '${other_sug}';
    
    // 触发input事件
    ['q39', 'q40', 'q41', 'q42', 'q43', 'q44'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.dispatchEvent(new Event('input', {bubbles: true}));
    });
    
    return 'Text answers filled';
})();
EVALEOF
    sleep 1
    
    # 提交问卷
    agent-browser snapshot -i | grep "提交" | head -1 | sed 's/.*\[ref=\([^]]*\)\].*/\1/' > /tmp/submit_ref.txt
    local submit_ref=$(cat /tmp/submit_ref.txt)
    if [ -n "$submit_ref" ]; then
        agent-browser click @$submit_ref
        agent-browser wait --load networkidle
        sleep 2
    fi
    
    # 截图保存
    agent-browser screenshot /workspace/screenshot_$run_id.png
    
    # 关闭浏览器
    agent-browser close
    
    echo "=== 第 $run_id 份问卷填写完成 ==="
}

# 主程序
main() {
    echo "准备填写 $TOTAL_COUNT 份问卷..."
    
    for ((i=1; i<=TOTAL_COUNT; i++)); do
        fill_questionnaire $i
        
        # 每份问卷之间间隔一段时间
        local interval=$((RANDOM % 10 + 5))
        echo "等待 $interval 秒后继续..."
        sleep $interval
    done
    
    echo "=== 所有问卷填写完成 ==="
}

# 执行
main