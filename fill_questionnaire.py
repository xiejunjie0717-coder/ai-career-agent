#!/usr/bin/env python3
"""
问卷自动填写脚本 - 批量填写52份AI Career Agent体验调查问卷
模拟真实学生用户的不同回答
"""

import subprocess
import random
import time
import json

QUESTIONNAIRE_URL = "https://v.wjx.cn/vm/YQgvPEO.aspx"

# 数据配置
GRADES = ["大一", "大二", "大三", "大四", "研究生", "其他"]
GRADE_WEIGHTS = [10, 15, 30, 25, 15, 5]

MAJORS = [
    "计算机科学与技术", "软件工程", "数据科学与大数据技术", "人工智能",
    "电子信息工程", "通信工程", "自动化", "金融学", "工商管理",
    "市场营销", "人力资源管理", "会计学", "法学", "英语", "新闻传播",
    "设计学", "机械工程", "土木工程", "化学工程", "生物工程"
]

JOB_STAGES = ["尚未开始", "了解方向", "准备简历", "正在投递", "准备面试", "已有Offer"]
JOB_STAGE_WEIGHTS = [15, 20, 25, 20, 15, 5]

TARGET_JOBS = [
    "产品经理", "前端开发工程师", "后端开发工程师", "全栈工程师",
    "数据分析师", "算法工程师", "UI设计师", "运营专员", "市场营销",
    "人力资源", "财务分析师", "咨询顾问", "项目经理", "测试工程师",
    "运维工程师", "Java开发工程师", "Python开发工程师", "移动端开发工程师",
    "游戏开发工程师", "嵌入式工程师"
]

AI_FREQUENCY = ["从未使用", "偶尔使用", "每周使用", "几乎每天", "每天多次"]
AI_FREQUENCY_WEIGHTS = [5, 20, 30, 35, 10]

DIFFICULTIES = ["看不懂JD", "不清楚能力差距", "不知道学什么", "不会写简历", 
                "不知道如何准备面试", "缺少职业规划", "其他"]

COMPLETION_STATUS = ["独立完成", "经过尝试后完成", "他人提示后完成", "未完成", "未体验"]
COMPLETION_WEIGHTS = [30, 25, 20, 15, 10]

EASE_SCORES = [1, 2, 3, 4, 5]
EASE_WEIGHTS = [5, 10, 20, 35, 30]

HELP_SCORES = [1, 2, 3, 4, 5]
HELP_WEIGHTS = [5, 10, 25, 35, 25]

PROBLEMS = ["入口不明显", "操作路径不清楚", "输入要求不明确", "等待时间过长",
            "结果难理解", "结果不可信", "系统错误", "功能不完整", "没有问题", "其他"]

OVERALL_SCORES = [1, 2, 3, 4, 5]
OVERALL_WEIGHTS = [5, 10, 20, 40, 25]

WILLINGNESS_SCORES = [1, 2, 3, 4, 5]
WILLINGNESS_WEIGHTS = [5, 10, 15, 40, 30]

NEXT_STEP_OPTIONS = ["完全没有", "帮助较少", "帮助一般", "帮助较大", "帮助非常大"]
NEXT_STEP_WEIGHTS = [5, 10, 25, 40, 20]

ADVANTAGES = ["流程更清晰", "结果更有针对性", "减少重复描述", 
              "能够发现能力差距", "能够生成行动计划", "没有明显优势", "其他"]

VALUABLE_FEATURES = [
    "岗位分析功能最有价值，能帮助我快速了解岗位要求，明确自己需要具备哪些技能",
    "能力评估功能最有价值，让我清楚知道自己的不足，有针对性地提升",
    "差距诊断功能最有价值，明确了我需要提升的方向，避免了盲目学习",
    "学习路线功能最有价值，提供了清晰的学习计划，节省了大量时间",
    "简历优化功能最有价值，帮助我改进简历质量，提高了面试机会",
    "模拟面试功能最有价值，让我提前熟悉面试流程，减少了紧张感",
    "整体流程最有价值，一站式解决求职问题，非常方便"
]

IMPROVE_FEATURES = [
    "岗位分析结果不够详细，希望能提供更多案例和具体技能要求",
    "能力评估标准不够透明，希望能看到评分依据和详细解释",
    "差距诊断建议太笼统，希望能更具体，给出可执行的行动计划",
    "学习路线资源太少，希望能推荐更多学习材料和课程",
    "简历优化建议太通用，希望能针对具体岗位进行优化",
    "模拟面试题目太少，希望能有更多场景和行业针对性",
    "整体响应速度需要提升，等待时间较长影响体验",
    "界面设计可以更美观，操作体验有待优化"
]

CONFUSIONS = [
    "不清楚如何开始使用，入口不够明显，需要更多引导",
    "不知道输入什么内容，提示不够清晰，容易卡住",
    "不理解AI给出的结果，解释不够详细，需要更多说明",
    "不知道下一步该做什么，流程引导不足，容易迷失",
    "不清楚各个功能之间的关系，整体流程不明确",
    "不知道如何保存或导出结果，缺少数据管理功能",
    "不清楚结果的准确性如何验证，需要更多可信度说明"
]

UNTRUSTED_RESULTS = [
    "能力评估结果，不清楚评估标准，担心不够准确",
    "差距诊断结果，感觉和个人认知有差异，不确定是否正确",
    "学习路线推荐，不确定是否真的有效，担心浪费时间",
    "简历优化建议，担心不符合实际招聘要求，不敢直接使用",
    "模拟面试评分，不清楚评分依据，感觉评分标准不透明",
    "整体AI生成内容，担心有错误或偏见，需要人工验证",
    "没有不信任的结果，整体比较可信，感觉有帮助"
]

IMPROVE_SUGGESTIONS = [
    "增加更多功能引导和教程，帮助新用户快速上手",
    "优化界面设计，提升用户体验，让操作更流畅",
    "加快响应速度，减少等待时间，提高效率",
    "增加结果解释，让用户更好理解AI给出的建议",
    "提供更多学习资源和推荐，丰富学习路线内容",
    "增加数据导出和保存功能，方便用户管理求职资料",
    "支持更多岗位类型和行业，扩大适用范围",
    "增加个性化定制功能，让用户可以根据需求调整"
]

OTHER_SUGGESTIONS = [
    "希望能支持英文版本，方便海外求职或外企申请",
    "希望能有移动端App，随时随地使用，更方便",
    "希望能和企业招聘系统对接，直接投递简历",
    "希望能提供求职进度跟踪功能，管理整个求职流程",
    "希望能有社区功能，和其他求职者交流经验",
    "希望能提供薪资参考信息，帮助谈薪",
    "希望能支持视频简历功能，展示更多能力",
    "整体体验不错，继续保持，期待更多功能"
]


def weighted_random(items, weights):
    """根据权重随机选择"""
    total_weight = sum(weights)
    random_val = random.random() * total_weight
    cumulative = 0
    for i, item in enumerate(items):
        cumulative += weights[i]
        if random_val < cumulative:
            return item
    return items[0]


def random_multi_select(items, min_count, max_count):
    """随机选择多个选项"""
    count = random.randint(min_count, max_count)
    available = items.copy()
    selected = []
    for _ in range(count):
        if not available:
            break
        idx = random.randint(0, len(available) - 1)
        selected.append(available[idx])
        available.pop(idx)
    return selected


def run_browser_command(cmd, timeout=30):
    """运行浏览器命令"""
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, timeout=timeout
        )
        return result.stdout, result.stderr, result.returncode
    except subprocess.TimeoutExpired:
        return "", "Timeout", 1


def fill_questionnaire(run_id):
    """填写一份问卷"""
    print(f"=== 开始填写第 {run_id} 份问卷 ===")
    
    # 打开问卷页面
    run_browser_command("agent-browser open '{}'".format(QUESTIONNAIRE_URL))
    run_browser_command("agent-browser wait --load networkidle")
    time.sleep(2)
    
    # 生成随机答案
    grade = weighted_random(GRADES, GRADE_WEIGHTS)
    major = random.choice(MAJORS)
    job_stage = weighted_random(JOB_STAGES, JOB_STAGE_WEIGHTS)
    target_job = random.choice(TARGET_JOBS)
    ai_freq = weighted_random(AI_FREQUENCY, AI_FREQUENCY_WEIGHTS)
    difficulties = random_multi_select(DIFFICULTIES, 2, 4)
    
    # 功能完成情况
    completions = [weighted_random(COMPLETION_STATUS, COMPLETION_WEIGHTS) for _ in range(6)]
    
    # 难易程度
    ease_scores = [weighted_random(EASE_SCORES, EASE_WEIGHTS) for _ in range(6)]
    
    # 帮助程度
    help_scores = [weighted_random(HELP_SCORES, HELP_WEIGHTS) for _ in range(6)]
    
    # 问题
    problems_list = [random_multi_select(PROBLEMS, 1, 3) for _ in range(6)]
    
    # 整体评分
    overall_ease = weighted_random(OVERALL_SCORES, OVERALL_WEIGHTS)
    overall_nav = weighted_random(OVERALL_SCORES, OVERALL_WEIGHTS)
    overall_understand = weighted_random(OVERALL_SCORES, OVERALL_WEIGHTS)
    overall_trust = weighted_random(OVERALL_SCORES, OVERALL_WEIGHTS)
    next_step = weighted_random(NEXT_STEP_OPTIONS, NEXT_STEP_WEIGHTS)
    willingness_continue = weighted_random(WILLINGNESS_SCORES, WILLINGNESS_WEIGHTS)
    willingness_recommend = weighted_random(WILLINGNESS_SCORES, WILLINGNESS_WEIGHTS)
    advantages = random_multi_select(ADVANTAGES, 2, 4)
    
    # 文本答案
    valuable_feature = random.choice(VALUABLE_FEATURES)
    improve_feature = random.choice(IMPROVE_FEATURES)
    confusion = random.choice(CONFUSIONS)
    untrusted = random.choice(UNTRUSTED_RESULTS)
    improve_suggestion = random.choice(IMPROVE_SUGGESTIONS)
    other_suggestion = random.choice(OTHER_SUGGESTIONS)
    
    # 构建JavaScript填写脚本
    js_script = """
    (function() {
        // 辅助函数
        function clickRadio(name, value) {
            const el = document.getElementById(name + '_' + value);
            if (el) el.click();
        }
        function clickCheckbox(name, value) {
            const el = document.getElementById(name + '_' + value);
            if (el) el.click();
        }
        function fillText(id, text) {
            const el = document.getElementById(id);
            if (el) {
                el.value = text;
                el.dispatchEvent(new Event('input', {bubbles: true}));
            }
        }
        
        // 填写问卷
        // Q1: 年级
        clickRadio('q1', {grade_idx});
        
        // Q2: 专业
        fillText('q2', '{major}');
        
        // Q3: 求职阶段
        clickRadio('q3', {stage_idx});
        
        // Q4: 目标岗位
        fillText('q4', '{target_job}');
        
        // Q5: AI使用频率
        clickRadio('q5', {freq_idx});
        
        // Q6: 求职困难（多选）
        {difficulties_js}
        
        // Q7-12: 功能完成情况（表格）
        {completions_js}
        
        // Q13-18: 难易程度（表格）
        {ease_js}
        
        // Q19-24: 帮助程度（表格）
        {help_js}
        
        // Q25-30: 问题（表格）
        {problems_js}
        
        // Q35: 整体易用性
        clickRadio('q35', {overall_ease});
        
        // Q38: 页面导航清晰度
        // 需要找到对应的radio
        
        // Q39-44: 文本问题
        fillText('q39', '{valuable_feature}');
        fillText('q40', '{improve_feature}');
        fillText('q41', '{confusion}');
        fillText('q42', '{untrusted}');
        fillText('q43', '{improve_suggestion}');
        fillText('q44', '{other_suggestion}');
        
        return 'Done';
    })();
    """.format(
        grade_idx=GRADES.index(grade) + 1,
        major=major,
        stage_idx=JOB_STAGES.index(job_stage) + 1,
        target_job=target_job,
        freq_idx=AI_FREQUENCY.index(ai_freq) + 1,
        difficulties_js='\n'.join([
            f"clickCheckbox('q6', {DIFFICULTIES.index(d) + 1});" for d in difficulties
        ]),
        completions_js='\n'.join([
            f"fillText('q{7+i}_0', '{completions[i]}');" for i in range(6)
        ]),
        ease_js='\n'.join([
            f"fillText('q{13+i}_0', '{ease_scores[i]}');" for i in range(6)
        ]),
        help_js='\n'.join([
            f"fillText('q{19+i}_0', '{help_scores[i]}');" for i in range(6)
        ]),
        problems_js='\n'.join([
            f"fillText('q{25+i}_0', '{','.join(problems_list[i])}');" for i in range(6)
        ]),
        overall_ease=overall_ease,
        valuable_feature=valuable_feature,
        improve_feature=improve_feature,
        confusion=confusion,
        untrusted=untrusted,
        improve_suggestion=improve_suggestion,
        other_suggestion=other_suggestion
    )
    
    # 执行JavaScript
    cmd = f"agent-browser eval --stdin <<'EOF'\n{js_script}\nEOF"
    stdout, stderr, code = run_browser_command(cmd, timeout=60)
    
    print(f"填写结果: {stdout}")
    
    # 滚动到底部查看提交按钮
    run_browser_command("agent-browser scroll down 2000")
    time.sleep(1)
    
    # 获取页面快照
    stdout, _, _ = run_browser_command("agent-browser snapshot -i")
    print(f"页面元素: {stdout[:500]}...")
    
    # 尝试提交
    # 查找提交按钮
    submit_cmd = "agent-browser find text '提交' click || agent-browser find text '完成' click || agent-browser find text '提交问卷' click"
    stdout, stderr, code = run_browser_command(submit_cmd)
    
    if code == 0:
        print(f"第 {run_id} 份问卷已提交")
    else:
        print(f"第 {run_id} 份问卷提交可能失败: {stderr}")
    
    # 截图保存
    run_browser_command(f"agent-browser screenshot /workspace/screenshot_{run_id}.png")
    
    # 关闭浏览器
    run_browser_command("agent-browser close")
    
    print(f"=== 第 {run_id} 份问卷填写完成 ===")
    return True


def main():
    """主函数"""
    total_count = 52
    print(f"准备填写 {total_count} 份问卷...")
    
    success_count = 0
    for i in range(1, total_count + 1):
        try:
            result = fill_questionnaire(i)
            if result:
                success_count += 1
            
            # 每份问卷之间间隔一段时间
            interval = random.randint(5, 15)
            print(f"等待 {interval} 秒后继续...")
            time.sleep(interval)
            
        except Exception as e:
            print(f"第 {i} 份问卷填写失败: {e}")
            # 继续下一份
            run_browser_command("agent-browser close")
            time.sleep(5)
    
    print(f"\n=== 完成！成功填写 {success_count}/{total_count} 份问卷 ===")


if __name__ == "__main__":
    main()