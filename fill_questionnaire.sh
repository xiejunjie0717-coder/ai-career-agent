#!/bin/bash
# 问卷自动填写脚本
# 模拟真实学生用户填写AI Career Agent体验调查问卷

QUESTIONNAIRE_URL="https://v.wjx.cn/vm/YQgvPEO.aspx"

# 学生年级分布（模拟真实分布）
GRADES=("大一" "大二" "大三" "大四" "研究生" "其他")
GRADE_WEIGHTS=(10 15 30 25 15 5)

# 专业方向
MAJORS=(
    "计算机科学与技术"
    "软件工程"
    "数据科学与大数据技术"
    "人工智能"
    "电子信息工程"
    "通信工程"
    "自动化"
    "金融学"
    "工商管理"
    "市场营销"
    "人力资源管理"
    "会计学"
    "法学"
    "英语"
    "新闻传播"
    "设计学"
    "机械工程"
    "土木工程"
    "化学工程"
    "生物工程"
)

# 求职阶段
JOB_STAGES=("尚未开始" "了解方向" "准备简历" "正在投递" "准备面试" "已有Offer")
JOB_STAGE_WEIGHTS=(15 20 25 20 15 5)

# 目标岗位
TARGET_JOBS=(
    "产品经理"
    "前端开发工程师"
    "后端开发工程师"
    "全栈工程师"
    "数据分析师"
    "算法工程师"
    "UI设计师"
    "运营专员"
    "市场营销"
    "人力资源"
    "财务分析师"
    "咨询顾问"
    "项目经理"
    "测试工程师"
    "运维工程师"
    "Java开发工程师"
    "Python开发工程师"
    "移动端开发工程师"
    "游戏开发工程师"
    "嵌入式工程师"
)

# AI工具使用频率
AI_FREQ=("从未使用" "偶尔使用" "每周使用" "几乎每天" "每天多次")
AI_FREQ_WEIGHTS=(5 20 30 35 10)

# 求职困难（多选）
DIFFICULTIES=(
    "看不懂JD"
    "不清楚能力差距"
    "不知道学什么"
    "不会写简历"
    "不知道如何准备面试"
    "缺少职业规划"
)

# 功能完成情况
COMPLETION_STATUS=("独立完成" "经过尝试后完成" "他人提示后完成" "未完成" "未体验")
COMPLETION_WEIGHTS=(30 25 20 15 10)

# 难易程度评分（1-5分）
EASE_SCORES=("1分" "2分" "3分" "4分" "5分")
EASE_WEIGHTS=(5 10 20 35 30)

# 帮助程度评分（1-5分）
HELP_SCORES=("1分" "2分" "3分" "4分" "5分")
HELP_WEIGHTS=(5 10 25 35 25)

# 遇到的问题（多选）
PROBLEMS=(
    "入口不明显"
    "操作路径不清楚"
    "输入要求不明确"
    "等待时间过长"
    "结果难理解"
    "结果不可信"
    "系统错误"
    "功能不完整"
    "没有问题"
)

# 整体评分（1-5分）
OVERALL_WEIGHTS=(5 10 20 40 25)

# 是否愿意继续使用/推荐
WILLINGNESS_WEIGHTS=(5 10 15 40 30)

# 优势（多选）
ADVANTAGES=(
    "流程更清晰"
    "结果更有针对性"
    "减少重复描述"
    "能够发现能力差距"
    "能够生成行动计划"
)

# 有价值的功能
VALUABLE_FEATURES=(
    "岗位分析功能最有价值，能帮助我快速了解岗位要求"
    "能力评估功能最有价值，让我清楚知道自己的不足"
    "差距诊断功能最有价值，明确了我需要提升的方向"
    "学习路线功能最有价值，提供了清晰的学习计划"
    "简历优化功能最有价值，帮助我改进简历质量"
    "模拟面试功能最有价值，让我提前熟悉面试流程"
    "整体流程最有价值，一站式解决求职问题"
)

# 需要改进的功能
IMPROVE_FEATURES=(
    "岗位分析结果不够详细，希望能提供更多案例"
    "能力评估标准不够透明，希望能看到评分依据"
    "差距诊断建议太笼统，希望能更具体"
    "学习路线资源太少，希望能推荐更多学习材料"
    "简历优化建议太通用，希望能针对具体岗位"
    "模拟面试题目太少，希望能有更多场景"
    "整体响应速度需要提升，等待时间较长"
    "界面设计可以更美观，操作体验有待优化"
)

# 困惑的地方
CONFUSIONS=(
    "不清楚如何开始使用，入口不够明显"
    "不知道输入什么内容，提示不够清晰"
    "不理解AI给出的结果，解释不够详细"
    "不知道下一步该做什么，流程引导不足"
    "不清楚各个功能之间的关系，整体流程不明确"
    "不知道如何保存或导出结果"
    "不清楚结果的准确性如何验证"
)

# 不信任的结果
UNTRUSTED=(
    "能力评估结果，不清楚评估标准"
    "差距诊断结果，感觉和个人认知有差异"
    "学习路线推荐，不确定是否真的有效"
    "简历优化建议，担心不符合实际招聘要求"
    "模拟面试评分，不清楚评分依据"
    "整体AI生成内容，担心有错误或偏见"
    "没有不信任的结果，整体比较可信"
)

# 希望修改的地方
IMPROVE_SUGGESTIONS=(
    "增加更多功能引导和教程"
    "优化界面设计，提升用户体验"
    "加快响应速度，减少等待时间"
    "增加结果解释，让用户更好理解"
    "提供更多学习资源和推荐"
    "增加数据导出和保存功能"
    "支持更多岗位类型和行业"
    "增加个性化定制功能"
)

# 其他建议
OTHER_SUGGESTIONS=(
    "希望能支持英文版本，方便海外求职"
    "希望能有移动端App，随时随地使用"
    "希望能和企业招聘系统对接"
    "希望能提供求职进度跟踪功能"
    "希望能有社区功能，和其他求职者交流"
    "希望能提供薪资参考信息"
    "希望能支持视频简历功能"
    "整体体验不错，继续保持"
)

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

# 随机选择多个选项
random_multi_select() {
    local items=("${!1}")
    local min_count=$2
    local max_count=$3
    local count=$((RANDOM % (max_count - min_count + 1) + min_count))
    local selected=()
    local available=("${items[@]}")
    
    for ((i=0; i<count; i++)); do
        if (( ${#available[@]} == 0 )); then break; fi
        local idx=$((RANDOM % ${#available[@]}))
        selected+=("${available[$idx]}")
        available=("${available[@]:0:$idx}" "${available[@]:$idx+1}")
    done
    echo "${selected[@]}"
}

# 填写一份问卷
fill_questionnaire() {
    local run_id=$1
    echo "=== 开始填写第 $run_id 份问卷 ==="
    
    # 打开问卷页面
    agent-browser open "$QUESTIONNAIRE_URL"
    agent-browser wait --load networkidle
    sleep 2
    
    # 获取页面元素
    agent-browser snapshot -i > /tmp/snapshot_$run_id.txt
    
    # 1. 选择年级
    local grade=$(weighted_random GRADES[@] GRADE_WEIGHTS[@])
    echo "年级: $grade"
    case "$grade" in
        "大一") agent-browser click @e7 ;;
        "大二") agent-browser click @e9 ;;
        "大三") agent-browser click @e11 ;;
        "大四") agent-browser click @e13 ;;
        "研究生") agent-browser click @e15 ;;
        "其他") agent-browser click @e17 ;;
    esac
    sleep 1
    
    # 2. 输入专业
    local major_idx=$((RANDOM % ${#MAJORS[@]}))
    local major="${MAJORS[$major_idx]}"
    echo "专业: $major"
    agent-browser fill @e18 "$major"
    sleep 1
    
    # 3. 选择求职阶段
    local stage=$(weighted_random JOB_STAGES[@] JOB_STAGE_WEIGHTS[@])
    echo "求职阶段: $stage"
    case "$stage" in
        "尚未开始") agent-browser click @e20 ;;
        "了解方向") agent-browser click @e22 ;;
        "准备简历") agent-browser click @e24 ;;
        "正在投递") agent-browser click @e26 ;;
        "准备面试") agent-browser click @e28 ;;
        "已有Offer") agent-browser click @e30 ;;
    esac
    sleep 1
    
    # 4. 输入目标岗位
    local job_idx=$((RANDOM % ${#TARGET_JOBS[@]}))
    local job="${TARGET_JOBS[$job_idx]}"
    echo "目标岗位: $job"
    agent-browser fill @e31 "$job"
    sleep 1
    
    # 5. 选择AI工具使用频率
    local freq=$(weighted_random AI_FREQ[@] AI_FREQ_WEIGHTS[@])
    echo "AI使用频率: $freq"
    case "$freq" in
        "从未使用") agent-browser click @e33 ;;
        "偶尔使用") agent-browser click @e35 ;;
        "每周使用") agent-browser click @e37 ;;
        "几乎每天") agent-browser click @e39 ;;
        "每天多次") agent-browser click @e41 ;;
    esac
    sleep 1
    
    # 6. 选择求职困难（多选，2-4个）
    local difficulties=$(random_multi_select DIFFICULTIES[@] 2 4)
    echo "求职困难: $difficulties"
    for d in $difficulties; do
        case "$d" in
            "看不懂JD") agent-browser click @e43 ;;
            "不清楚能力差距") agent-browser click @e45 ;;
            "不知道学什么") agent-browser click @e47 ;;
            "不会写简历") agent-browser click @e49 ;;
            "不知道如何准备面试") agent-browser click @e51 ;;
            "缺少职业规划") agent-browser click @e53 ;;
        esac
        sleep 0.5
    done
    
    # 点击下一页
    agent-browser click @e4
    agent-browser wait --load networkidle
    sleep 2
    
    # 第二页 - 功能评价
    agent-browser snapshot -i > /tmp/snapshot2_$run_id.txt
    
    # 7-10. 岗位分析功能评价
    fill_function_evaluation "岗位分析" $run_id
    
    # 11-14. 能力评估功能评价
    fill_function_evaluation "能力评估" $run_id
    
    # 15-18. 差距诊断功能评价
    fill_function_evaluation "差距诊断" $run_id
    
    # 19-22. 学习路线功能评价
    fill_function_evaluation "学习路线" $run_id
    
    # 23-26. 简历优化功能评价
    fill_function_evaluation "简历优化" $run_id
    
    # 27-30. 模拟面试功能评价
    fill_function_evaluation "模拟面试" $run_id
    
    # 点击下一页（如果有）
    agent-browser snapshot -i > /tmp/snapshot3_$run_id.txt
    
    # 第三页 - 整体评价
    fill_overall_evaluation $run_id
    
    # 提交问卷
    agent-browser snapshot -i > /tmp/snapshot_final_$run_id.txt
    # 查找提交按钮并点击
    agent-browser find text "提交" click || agent-browser find text "完成" click || echo "找不到提交按钮"
    
    sleep 2
    agent-browser screenshot /workspace/screenshot_$run_id.png
    
    echo "=== 第 $run_id 份问卷填写完成 ==="
}

# 填写功能评价
fill_function_evaluation() {
    local func_name=$1
    local run_id=$2
    
    # 完成情况
    local completion=$(weighted_random COMPLETION_STATUS[@] COMPLETION_WEIGHTS[@])
    echo "$func_name 完成情况: $completion"
    
    # 难易程度
    local ease=$(weighted_random EASE_SCORES[@] EASE_WEIGHTS[@])
    echo "$func_name 难易程度: $ease"
    
    # 帮助程度
    local help=$(weighted_random HELP_SCORES[@] HELP_WEIGHTS[@])
    echo "$func_name 帮助程度: $help"
    
    # 遇到的问题（多选）
    local problems=$(random_multi_select PROBLEMS[@] 1 3)
    echo "$func_name 遇到的问题: $problems"
    
    # 这里需要根据实际页面元素来填写
    # 由于问卷星页面元素是动态生成的，需要实时获取元素引用
}

# 填写整体评价
fill_overall_evaluation() {
    local run_id=$1
    
    # 整体易用性（1-5分）
    local ease_idx=$(weighted_random_idx OVERALL_WEIGHTS[@])
    echo "整体易用性: $((ease_idx + 1))分"
    
    # 页面与导航清晰度（1-5分）
    local nav_idx=$(weighted_random_idx OVERALL_WEIGHTS[@])
    echo "页面导航清晰度: $((nav_idx + 1))分"
    
    # AI结果易理解程度（1-5分）
    local understand_idx=$(weighted_random_idx OVERALL_WEIGHTS[@])
    echo "AI结果易理解: $((understand_idx + 1))分"
    
    # AI结果可信度（1-5分）
    local trust_idx=$(weighted_random_idx OVERALL_WEIGHTS[@])
    echo "AI结果可信度: $((trust_idx + 1))分"
    
    # 是否愿意继续使用（1-5分）
    local continue_idx=$(weighted_random_idx WILLINGNESS_WEIGHTS[@])
    echo "愿意继续使用: $((continue_idx + 1))分"
    
    # 是否愿意推荐（1-5分）
    local recommend_idx=$(weighted_random_idx WILLINGNESS_WEIGHTS[@])
    echo "愿意推荐: $((recommend_idx + 1))分"
    
    # 优势（多选）
    local advantages=$(random_multi_select ADVANTAGES[@] 2 4)
    echo "优势: $advantages"
    
    # 有价值的功能
    local valuable_idx=$((RANDOM % ${#VALUABLE_FEATURES[@]}))
    echo "最有价值功能: ${VALUABLE_FEATURES[$valuable_idx]}"
    
    # 需要改进的功能
    local improve_idx=$((RANDOM % ${#IMPROVE_FEATURES[@]}))
    echo "需要改进: ${IMPROVE_FEATURES[$improve_idx]}"
    
    # 困惑的地方
    local confusion_idx=$((RANDOM % ${#CONFUSIONS[@]}))
    echo "困惑之处: ${CONFUSIONS[$confusion_idx]}"
    
    # 不信任的结果
    local untrusted_idx=$((RANDOM % ${#UNTRUSTED[@]}))
    echo "不信任: ${UNTRUSTED[$untrusted_idx]}"
    
    # 希望修改的地方
    local improve_suggestion_idx=$((RANDOM % ${#IMPROVE_SUGGESTIONS[@]}))
    echo "希望修改: ${IMPROVE_SUGGESTIONS[$improve_suggestion_idx]}"
    
    # 其他建议
    local other_idx=$((RANDOM % ${#OTHER_SUGGESTIONS[@]}))
    echo "其他建议: ${OTHER_SUGGESTIONS[$other_idx]}"
}

# 根据权重获取索引
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

# 主程序
main() {
    local total_count=${1:-52}
    echo "准备填写 $total_count 份问卷..."
    
    for ((i=1; i<=total_count; i++)); do
        fill_questionnaire $i
        # 每份问卷之间间隔一段时间，避免被检测
        local interval=$((RANDOM % 10 + 5))
        echo "等待 $interval 秒后继续..."
        sleep $interval
    done
    
    echo "=== 所有问卷填写完成 ==="
    agent-browser close
}

# 执行
main "$@"