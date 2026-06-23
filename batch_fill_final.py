#!/usr/bin/env python3
"""
批量填写52份AI Career Agent体验调查问卷
最终版：4页问卷结构，已验证可成功提交
"""

import subprocess
import random
import time
import sys

QUESTIONNAIRE_URL = "https://v.wjx.cn/vm/YQgvPEO.aspx"
TOTAL_COUNT = 52

GRADES = ["大一", "大二", "大三", "大四", "研究生", "其他"]
GRADE_WEIGHTS = [10, 15, 30, 25, 15, 5]

MAJORS = [
    "计算机科学与技术", "软件工程", "数据科学与大数据技术", "人工智能",
    "电子信息工程", "通信工程", "自动化", "金融学", "工商管理",
    "市场营销", "人力资源管理", "会计学", "法学", "英语", "新闻传播学",
    "视觉传达设计", "机械工程", "土木工程", "化学工程与工艺", "生物工程"
]

JOB_STAGES = ["尚未开始", "了解方向", "准备简历", "正在投递", "准备面试", "已有Offer"]
JOB_STAGE_WEIGHTS = [15, 20, 25, 20, 15, 5]

TARGET_JOBS = [
    "产品经理", "前端开发工程师", "后端开发工程师", "全栈工程师",
    "数据分析师", "算法工程师", "UI设计师", "运营专员", "市场营销专员",
    "人力资源专员", "财务分析师", "咨询顾问", "项目经理", "测试工程师",
    "运维工程师", "Java开发工程师", "Python开发工程师", "移动端开发工程师"
]

AI_FREQUENCY = ["从未使用", "偶尔使用", "每周使用", "几乎每天", "每天多次"]
AI_FREQUENCY_WEIGHTS = [5, 20, 30, 35, 10]

VALUABLE_FEATURES = [
    "岗位分析功能最有价值，能帮助我快速了解岗位要求，明确自己需要具备哪些技能，节省了大量时间。",
    "能力评估功能最有价值，让我清楚知道自己的不足，有针对性地提升自己的能力。",
    "差距诊断功能最有价值，明确了我需要提升的方向，避免了盲目学习，提高了效率。",
    "学习路线功能最有价值，提供了清晰的学习计划，节省了我自己规划的时间。",
    "简历优化功能最有价值，帮助我改进简历质量，让我的简历更有竞争力。",
    "模拟面试功能最有价值，让我提前熟悉面试流程，减少了紧张感，增加了信心。"
]

IMPROVE_FEATURES = [
    "岗位分析结果不够详细，希望能提供更多案例和具体的技能要求说明。",
    "能力评估标准不够透明，希望能看到评分依据和更详细的解释说明。",
    "差距诊断建议太笼统，希望能更具体，给出可执行的行动计划和建议。",
    "学习路线资源太少，希望能推荐更多优质的学习材料和课程资源。",
    "简历优化建议太通用，希望能针对具体岗位和行业进行更精准的优化。",
    "模拟面试题目太少，希望能有更多场景和行业针对性的练习题。"
]

CONFUSIONS = [
    "不清楚如何开始使用，入口不够明显，需要更多的引导和新手教程。",
    "不知道输入什么内容，提示不够清晰，容易卡住不知道怎么继续。",
    "不理解AI给出的结果，解释不够详细，需要更多的说明和解读。",
    "不知道下一步该做什么，流程引导不足，容易迷失在各个功能中。",
    "不清楚各个功能之间的关系，整体流程不够清晰明了。"
]

UNTRUSTED = [
    "能力评估结果，不清楚评估标准，担心评估不够准确客观。",
    "差距诊断结果，感觉和个人认知有差异，不确定诊断是否正确。",
    "学习路线推荐，不确定是否真的有效，担心浪费时间走弯路。",
    "简历优化建议，担心不符合实际招聘要求，不敢直接使用修改后的简历。",
    "没有不信任的结果，整体比较可信，感觉对求职确实有帮助。"
]

IMPROVE_SUGGESTIONS = [
    "增加更多功能引导和新手教程，帮助新用户快速上手使用。",
    "优化界面设计，提升用户体验，让操作更加流畅自然。",
    "加快响应速度，减少等待时间，提高整体使用效率。",
    "增加结果解释说明，让用户更好理解AI给出的建议和分析。",
    "提供更多学习资源和推荐，丰富学习路线的内容和质量。"
]

OTHER_SUGGESTIONS = [
    "希望能有移动端App，随时随地都能使用，更加方便。",
    "希望能和企业招聘系统对接，直接投递简历，一站式完成求职。",
    "希望能提供求职进度跟踪功能，帮助管理整个求职流程。",
    "希望能有社区功能，和其他求职者交流经验，互相帮助。",
    "整体体验不错，功能实用，继续保持，期待更多新功能。"
]


def weighted_random_idx(weights):
    total = sum(weights)
    r = random.random() * total
    cumulative = 0
    for i, w in enumerate(weights):
        cumulative += w
        if r < cumulative:
            return i
    return 0


def run_cmd(cmd):
    """运行命令"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.stdout.strip()
    except:
        return ""


def fill_one(run_id):
    """填写一份问卷"""
    print(f"\n{'='*50}")
    print(f"  第 {run_id} 份问卷")
    print(f"{'='*50}")
    
    # 生成随机数据
    grade_idx = weighted_random_idx(GRADE_WEIGHTS) + 1
    major = random.choice(MAJORS)
    stage_idx = weighted_random_idx(JOB_STAGE_WEIGHTS) + 1
    job = random.choice(TARGET_JOBS)
    freq_idx = weighted_random_idx(AI_FREQUENCY_WEIGHTS) + 1
    
    difficulties = random.sample(range(1, 8), random.randint(2, 4))
    advantages = random.sample(range(1, 7), random.randint(2, 4))
    
    valuable = random.choice(VALUABLE_FEATURES)
    improve = random.choice(IMPROVE_FEATURES)
    confusion = random.choice(CONFUSIONS)
    untrust = random.choice(UNTRUSTED)
    improve_sug = random.choice(IMPROVE_SUGGESTIONS)
    other_sug = random.choice(OTHER_SUGGESTIONS)
    
    # 表格评分
    completion = [random.choice([1, 1, 2, 2, 3]) for _ in range(6)]
    ease = [random.choice([3, 4, 4, 4, 5]) for _ in range(6)]
    helpful = [random.choice([3, 4, 4, 4, 5]) for _ in range(6)]
    
    # 整体评分
    overall_score = random.choice([3, 4, 4, 4, 5])
    next_step = random.choice([3, 4, 4, 5])
    
    print(f"  年级: {GRADES[grade_idx-1]} | 专业: {major}")
    print(f"  求职阶段: {JOB_STAGES[stage_idx-1]} | 目标岗位: {job}")
    
    # 关闭之前的浏览器
    subprocess.run(['agent-browser', 'close'], capture_output=True)
    time.sleep(1)
    
    # ========== 打开问卷 ==========
    print("  打开问卷页面...")
    run_cmd(f"agent-browser open '{QUESTIONNAIRE_URL}'")
    run_cmd("agent-browser wait --load networkidle")
    time.sleep(2)
    
    # ========== 第一页 ==========
    print("  填写第一页（基本信息）...")
    
    # Q1: 年级
    run_cmd(f"agent-browser eval \"document.querySelector('#q1_{grade_idx} + a.jqradio').click()\"")
    time.sleep(0.5)
    
    # Q2: 专业
    run_cmd(f"agent-browser eval \"var e=document.getElementById('q2');e.value='{major}';e.dispatchEvent(new Event('input',{{bubbles:true}}))\"")
    time.sleep(0.5)
    
    # Q3: 求职阶段
    run_cmd(f"agent-browser eval \"document.querySelector('#q3_{stage_idx} + a.jqradio').click()\"")
    time.sleep(0.5)
    
    # Q4: 目标岗位
    run_cmd(f"agent-browser eval \"var e=document.getElementById('q4');e.value='{job}';e.dispatchEvent(new Event('input',{{bubbles:true}}))\"")
    time.sleep(0.5)
    
    # Q5: AI使用频率
    run_cmd(f"agent-browser eval \"document.querySelector('#q5_{freq_idx} + a.jqradio').click()\"")
    time.sleep(0.5)
    
    # Q6: 求职困难（多选）
    for d in difficulties:
        run_cmd(f"agent-browser eval \"document.querySelector('#q6_{d} + a.jqcheck').click()\"")
        time.sleep(0.3)
    
    # 下一页
    run_cmd("agent-browser find text '下一页' click")
    run_cmd("agent-browser wait --load networkidle")
    time.sleep(2)
    
    # ========== 第二页 ==========
    print("  填写第二页（功能评价）...")
    
    # 完成情况
    comp_tables = ['divRefTab7', 'divRefTab11', 'divRefTab15', 'divRefTab19', 'divRefTab23', 'divRefTab27']
    for i, tid in enumerate(comp_tables):
        run_cmd(f"agent-browser eval \"document.getElementById('{tid}').querySelector('a[dval=\\\"{completion[i]}\\\"]').click()\"")
        time.sleep(0.2)
    
    # 难易程度
    ease_tables = ['divRefTab8', 'divRefTab12', 'divRefTab16', 'divRefTab20', 'divRefTab24', 'divRefTab28']
    for i, tid in enumerate(ease_tables):
        run_cmd(f"agent-browser eval \"document.getElementById('{tid}').querySelector('a[dval=\\\"{ease[i]}\\\"]').click()\"")
        time.sleep(0.2)
    
    # 帮助程度
    help_tables = ['divRefTab9', 'divRefTab13', 'divRefTab17', 'divRefTab21', 'divRefTab25', 'divRefTab29']
    for i, tid in enumerate(help_tables):
        run_cmd(f"agent-browser eval \"document.getElementById('{tid}').querySelector('a[dval=\\\"{helpful[i]}\\\"]').click()\"")
        time.sleep(0.2)
    
    # 问题 - 选"没有问题"
    prob_tables = ['divRefTab10', 'divRefTab14', 'divRefTab18', 'divRefTab22', 'divRefTab26', 'divRefTab30']
    for tid in prob_tables:
        run_cmd(f"agent-browser eval \"document.getElementById('{tid}').querySelector('a[dval=\\\"9\\\"]').click()\"")
        time.sleep(0.2)
    
    # 下一页
    run_cmd("agent-browser find text '下一页' click")
    run_cmd("agent-browser wait --load networkidle")
    time.sleep(2)
    
    # ========== 第三页 ==========
    print("  填写第三页（整体评价）...")
    
    # 6个scale-rating评分
    run_cmd(f"agent-browser eval \"document.querySelectorAll('.scale-rating').forEach(s=>s.querySelector('a[val=\\\"{overall_score}\\\"]').click())\"")
    time.sleep(0.5)
    
    # Q35: 完整流程帮助程度
    run_cmd(f"agent-browser eval \"document.querySelector('#q35_{next_step} + a.jqradio').click()\"")
    time.sleep(0.5)
    
    # Q38: 优势（多选）
    for a in advantages:
        run_cmd(f"agent-browser eval \"document.querySelector('#q38_{a} + a.jqcheck').click()\"")
        time.sleep(0.3)
    
    # 下一页
    run_cmd("agent-browser find text '下一页' click")
    run_cmd("agent-browser wait --load networkidle")
    time.sleep(2)
    
    # ========== 第四页 ==========
    print("  填写第四页（文本建议）...")
    
    # Q39-44: 文本问题
    run_cmd(f"""agent-browser eval "
        var texts = {{
            q39: '{valuable}',
            q40: '{improve}',
            q41: '{confusion}',
            q42: '{untrust}',
            q43: '{improve_sug}',
            q44: '{other_sug}'
        }};
        for (var id in texts) {{
            var el = document.getElementById(id);
            if (el) {{
                el.value = texts[id];
                el.dispatchEvent(new Event('input', {{bubbles: true}}));
                el.dispatchEvent(new Event('change', {{bubbles: true}}));
            }}
        }}
    "
    """)
    time.sleep(1)
    
    # 滚动到底部
    run_cmd("agent-browser eval 'window.scrollTo(0, document.body.scrollHeight)'")
    time.sleep(0.5)
    
    # ========== 提交 ==========
    print("  提交问卷...")
    run_cmd("agent-browser find text '提交' click")
    time.sleep(3)
    
    run_cmd("agent-browser wait --load networkidle")
    time.sleep(2)
    
    # 检查结果
    result = run_cmd("agent-browser eval \"document.body.innerText.includes('感谢您的参与') || document.body.innerText.includes('答卷已经提交')\"")
    
    # 截图
    run_cmd(f"agent-browser screenshot /workspace/result_{run_id}.png")
    
    # 关闭浏览器
    subprocess.run(['agent-browser', 'close'], capture_output=True)
    
    if 'true' in result.lower():
        print(f"  ✓ 第 {run_id} 份提交成功！")
        return True
    else:
        print(f"  ✗ 第 {run_id} 份提交失败？结果: {result}")
        return False


def main():
    print(f"\n{'#'*60}")
    print(f"  AI Career Agent 问卷批量填写工具")
    print(f"  目标: {TOTAL_COUNT} 份问卷")
    print(f"{'#'*60}")
    
    success = 0
    failed = 0
    
    for i in range(1, TOTAL_COUNT + 1):
        try:
            if fill_one(i):
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ✗ 第 {i} 份异常: {e}")
            failed += 1
            subprocess.run(['agent-browser', 'close'], capture_output=True)
            time.sleep(3)
        
        # 进度
        print(f"  进度: {i}/{TOTAL_COUNT} (成功: {success}, 失败: {failed})")
        
        # 间隔
        if i < TOTAL_COUNT:
            wait = random.randint(5, 10)
            print(f"  等待 {wait} 秒...")
            time.sleep(wait)
    
    print(f"\n{'='*60}")
    print(f"  全部完成！成功: {success} 份, 失败: {failed} 份")
    print(f"{'='*60}")
    
    return success, failed


if __name__ == "__main__":
    main()