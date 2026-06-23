#!/bin/bash
# 批量填写52份问卷
# 使用agent-browser命令直接执行

URL="https://v.wjx.cn/vm/YQgvPEO.aspx"
COUNT=52

# 数据数组
GRADES=(1 2 3 4 5 6)
GRADE_WEIGHTS=(10 15 30 25 15 5)

MAJORS=("计算机科学与技术" "软件工程" "数据科学与大数据技术" "人工智能" "电子信息工程" "通信工程" "自动化" "金融学" "工商管理" "市场营销" "人力资源管理" "会计学" "法学" "英语" "新闻传播学" "视觉传达设计" "机械工程" "土木工程" "化学工程" "生物工程")

STAGES=(1 2 3 4 5 6)
STAGE_WEIGHTS=(15 20 25 20 15 5)

JOBS=("产品经理" "前端开发工程师" "后端开发工程师" "全栈工程师" "数据分析师" "算法工程师" "UI设计师" "运营专员" "市场营销专员" "人力资源专员" "财务分析师" "咨询顾问" "项目经理" "测试工程师" "运维工程师" "Java开发工程师" "Python开发工程师" "移动端开发工程师")

FREQS=(1 2 3 4 5)
FREQ_WEIGHTS=(5 20 30 35 10)

VALUABLE=("岗位分析功能最有价值，能帮助我快速了解岗位要求" "能力评估功能最有价值，让我清楚知道自己的不足" "差距诊断功能最有价值，明确了我需要提升的方向" "学习路线功能最有价值，提供了清晰的学习计划" "简历优化功能最有价值，帮助我改进简历质量" "模拟面试功能最有价值，让我提前熟悉面试流程")

IMPROVE=("岗位分析结果不够详细，希望能提供更多案例" "能力评估标准不够透明，希望能看到评分依据" "差距诊断建议太笼统，希望能更具体" "学习路线资源太少，希望能推荐更多学习材料" "简历优化建议太通用，希望能针对具体岗位" "模拟面试题目太少，希望能有更多场景")

CONFUSION=("不清楚如何开始使用，入口不够明显" "不知道输入什么内容，提示不够清晰" "不理解AI给出的结果，解释不够详细" "不知道下一步该做什么，流程引导不足" "不清楚各个功能之间的关系")

UNTRUST=("能力评估结果，不清楚评估标准" "差距诊断结果，感觉和个人认知有差异" "学习路线推荐，不确定是否真的有效" "简历优化建议，担心不符合实际招聘要求" "没有不信任的结果，整体比较可信")

SUGGESTION=("增加更多功能引导和教程" "优化界面设计，提升用户体验" "加快响应速度，减少等待时间" "增加结果解释，让用户更好理解" "提供更多学习资源和推荐")

OTHER=("希望能有移动端App" "希望能和企业招聘系统对接" "希望能提供求职进度跟踪功能" "希望能有社区功能" "整体体验不错，继续保持")

# 根据权重随机选择索引
weighted_idx() {
    local weights=("${!1}")
    local total=0
    for w in "${weights[@]}"; do total=$((total + w)); done
    local r=$((RANDOM % total))
    local cum=0
    for i in "${!weights[@]}"; do
        cum=$((cum + weights[$i]))
        if ((r < cum)); then echo $i; return; fi
    done
    echo 0
}

# 填写一份问卷
fill_one() {
    local n=$1
    echo "=== 第 $n 份 ==="
    
    # 随机数据
    local grade=$(weighted_idx GRADE_WEIGHTS[@])
    local major_idx=$((RANDOM % ${#MAJORS[@]}))
    local major="${MAJORS[$major_idx]}"
    local stage=$(weighted_idx STAGE_WEIGHTS[@])
    local job_idx=$((RANDOM % ${#JOBS[@]}))
    local job="${JOBS[$job_idx]}"
    local freq=$(weighted_idx FREQ_WEIGHTS[@])
    
    local val_idx=$((RANDOM % ${#VALUABLE[@]}))
    local imp_idx=$((RANDOM % ${#IMPROVE[@]}))
    local conf_idx=$((RANDOM % ${#CONFUSION[@]}))
    local unt_idx=$((RANDOM % ${#UNTRUST[@]}))
    local sug_idx=$((RANDOM % ${#SUGGESTION[@]}))
    local oth_idx=$((RANDOM % ${#OTHER[@]}))
    
    # 评分
    local comp_vals=($(for i in {1..6}; do echo $((RANDOM % 2 + 1)); done))
    local ease_vals=($(for i in {1..6}; do echo $((RANDOM % 2 + 3)); done))
    local help_vals=($(for i in {1..6}; do echo $((RANDOM % 2 + 3)); done))
    local overall=$((RANDOM % 2 + 3))
    local next=$((RANDOM % 2 + 3))
    
    # 困难（随机2-4个）
    local diff_count=$((RANDOM % 3 + 2))
    local diffs=($(shuf -i 1-7 -n $diff_count))
    
    # 优势（随机2-4个）
    local adv_count=$((RANDOM % 3 + 2))
    local advs=($(shuf -i 1-6 -n $adv_count))
    
    # 打开问卷
    agent-browser open "$URL"
    agent-browser wait --load networkidle
    sleep 2
    
    # 第一页
    agent-browser eval "document.getElementById('q1_${grade}').click()"
    sleep 1
    agent-browser eval "document.getElementById('q2').value='${major}'"
    sleep 1
    agent-browser eval "document.getElementById('q3_${stage}').click()"
    sleep 1
    agent-browser eval "document.getElementById('q4').value='${job}'"
    sleep 1
    agent-browser eval "document.getElementById('q5_${freq}').click()"
    sleep 1
    
    # 困难多选
    for d in "${diffs[@]}"; do
        agent-browser eval "document.getElementById('q6_${d}').click()"
        sleep 0.5
    done
    
    # 下一页
    agent-browser find text "下一页" click
    agent-browser wait --load networkidle
    sleep 2
    
    # 第二页表格
    # 完成情况
    for i in {0..5}; do
        local table=$((7 + i * 4))
        agent-browser eval "document.getElementById('divRefTab${table}')?.querySelector('a[dval=\"${comp_vals[$i]}\"]')?.click()"
        sleep 0.3
    done
    
    # 难易程度
    for i in {0..5}; do
        local table=$((8 + i * 4))
        agent-browser eval "document.getElementById('divRefTab${table}')?.querySelector('a[dval=\"${ease_vals[$i]}\"]')?.click()"
        sleep 0.3
    done
    
    # 帮助程度
    for i in {0..5}; do
        local table=$((9 + i * 4))
        agent-browser eval "document.getElementById('divRefTab${table}')?.querySelector('a[dval=\"${help_vals[$i]}\"]')?.click()"
        sleep 0.3
    done
    
    # 问题（选择没有问题）
    for i in {0..5}; do
        local table=$((10 + i * 4))
        agent-browser eval "document.getElementById('divRefTab${table}')?.querySelector('a[dval=\"9\"]')?.click()"
        sleep 0.3
    done
    
    # 下一页
    agent-browser find text "下一页" click
    agent-browser wait --load networkidle
    sleep 2
    
    # 第三页
    # 整体评分
    agent-browser eval "document.querySelectorAll('.scale-rating').forEach(s=>s.querySelectorAll('a')[${overall}]?.click())"
    sleep 1
    
    # 下一步行动
    agent-browser eval "document.getElementById('q35_${next}')?.click()"
    sleep 1
    
    # 优势多选
    for a in "${advs[@]}"; do
        agent-browser eval "document.getElementById('q38_${a}').click()"
        sleep 0.3
    done
    
    # 文本问题
    agent-browser eval "document.getElementById('q39').value='${VALUABLE[$val_idx]}'"
    agent-browser eval "document.getElementById('q40').value='${IMPROVE[$imp_idx]}'"
    agent-browser eval "document.getElementById('q41').value='${CONFUSION[$conf_idx]}'"
    agent-browser eval "document.getElementById('q42').value='${UNTRUST[$unt_idx]}'"
    agent-browser eval "document.getElementById('q43').value='${SUGGESTION[$sug_idx]}'"
    agent-browser eval "document.getElementById('q44').value='${OTHER[$oth_idx]}'"
    sleep 1
    
    # 提交
    agent-browser find text "提交" click
    agent-browser wait --load networkidle
    sleep 2
    
    # 截图
    agent-browser screenshot "/workspace/screenshot_${n}.png"
    
    # 关闭
    agent-browser close
    
    echo "第 $n 份完成 ✓"
}

# 主循环
echo "开始填写 $COUNT 份问卷..."

success=0
for i in $(seq 1 $COUNT); do
    if fill_one $i; then
        success=$((success + 1))
    fi
    
    # 间隔
    wait=$((RANDOM % 5 + 3))
    echo "等待 ${wait}s..."
    sleep $wait
done

echo ""
echo "完成！成功: $success / $COUNT"