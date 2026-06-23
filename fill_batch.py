#!/usr/bin/env python3
"""
高效批量填写问卷脚本
使用agent-browser批量执行命令
"""

import subprocess
import random
import time
import json

QUESTIONNAIRE_URL = "https://v.wjx.cn/vm/YQgvPEO.aspx"
TOTAL_COUNT = 52

# 数据配置
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
    "岗位分析功能最有价值，能帮助我快速了解岗位要求，明确自己需要具备哪些技能。",
    "能力评估功能最有价值，让我清楚知道自己的不足，有针对性地提升。",
    "差距诊断功能最有价值，明确了我需要提升的方向，避免了盲目学习。",
    "学习路线功能最有价值，提供了清晰的学习计划，节省了大量时间。",
    "简历优化功能最有价值，帮助我改进简历质量，提高了面试机会。",
    "模拟面试功能最有价值，让我提前熟悉面试流程，减少了紧张感。"
]

IMPROVE_FEATURES = [
    "岗位分析结果不够详细，希望能提供更多案例和具体技能要求。",
    "能力评估标准不够透明，希望能看到评分依据和详细解释。",
    "差距诊断建议太笼统，希望能更具体，给出可执行的行动计划。",
    "学习路线资源太少，希望能推荐更多学习材料和课程。",
    "简历优化建议太通用，希望能针对具体岗位进行优化。",
    "模拟面试题目太少，希望能有更多场景和行业针对性。"
]

CONFUSIONS = [
    "不清楚如何开始使用，入口不够明显，需要更多引导和教程。",
    "不知道输入什么内容，提示不够清晰，容易卡住。",
    "不理解AI给出的结果，解释不够详细，需要更多说明。",
    "不知道下一步该做什么，流程引导不足，容易迷失。",
    "不清楚各个功能之间的关系，整体流程不明确。"
]

UNTRUSTED = [
    "能力评估结果，不清楚评估标准，担心不够准确。",
    "差距诊断结果，感觉和个人认知有差异，不确定是否正确。",
    "学习路线推荐，不确定是否真的有效，担心浪费时间。",
    "简历优化建议，担心不符合实际招聘要求，不敢直接使用。",
    "没有不信任的结果，整体比较可信，感觉有帮助。"
]

IMPROVE_SUGGESTIONS = [
    "增加更多功能引导和教程，帮助新用户快速上手。",
    "优化界面设计，提升用户体验，让操作更流畅。",
    "加快响应速度，减少等待时间，提高效率。",
    "增加结果解释，让用户更好理解AI给出的建议。",
    "提供更多学习资源和推荐，丰富学习路线内容。"
]

OTHER_SUGGESTIONS = [
    "希望能有移动端App，随时随地使用，更方便。",
    "希望能和企业招聘系统对接，直接投递简历。",
    "希望能提供求职进度跟踪功能，管理整个求职流程。",
    "希望能有社区功能，和其他求职者交流经验。",
    "整体体验不错，继续保持，期待更多功能。"
]


def weighted_random_idx(weights):
    """根据权重返回索引"""
    total = sum(weights)
    r = random.random() * total
    cumulative = 0
    for i, w in enumerate(weights):
        cumulative += w
        if r < cumulative:
            return i
    return 0


def run_browser_cmd(cmd):
    """运行浏览器命令"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.stdout, result.returncode
    except:
        return "", 1


def fill_questionnaire(run_id):
    """填写一份问卷"""
    print(f"=== 第 {run_id} 份 ===")
    
    # 生成随机数据
    grade_idx = weighted_random_idx(GRADE_WEIGHTS) + 1
    major = random.choice(MAJORS)
    stage_idx = weighted_random_idx(JOB_STAGE_WEIGHTS) + 1
    job = random.choice(TARGET_JOBS)
    freq_idx = weighted_random_idx(AI_FREQUENCY_WEIGHTS) + 1
    
    # 随机困难（2-4个）
    difficulties = random.sample(range(1, 8), random.randint(2, 4))
    
    # 随机优势（2-4个）
    advantages = random.sample(range(1, 7), random.randint(2, 4))
    
    # 文本答案
    valuable = random.choice(VALUABLE_FEATURES)
    improve = random.choice(IMPROVE_FEATURES)
    confusion = random.choice(CONFUSIONS)
    untrust = random.choice(UNTRUSTED)
    improve_sug = random.choice(IMPROVE_SUGGESTIONS)
    other_sug = random.choice(OTHER_SUGGESTIONS)
    
    # 评分
    completion_scores = [random.choice([1, 1, 2]) for _ in range(6)]
    ease_scores = [random.choice([3, 4, 4, 5]) for _ in range(6)]
    help_scores = [random.choice([3, 4, 4, 5]) for _ in range(6)]
    overall_score = random.choice([3, 4, 4, 5])
    next_step_idx = random.choice([3, 4, 4, 5])
    
    # 构建JavaScript
    js1 = f'''
document.getElementById('q1_{grade_idx}').click();
document.getElementById('q2').value='{major}';
document.getElementById('q3_{stage_idx}').click();
document.getElementById('q4').value='{job}';
document.getElementById('q5_{freq_idx}').click();
[{','.join(str(d) for d in difficulties)}].forEach(d=>document.getElementById('q6_'+d)?.click());
'''
    
    js2 = f'''
const ct=['divRefTab7','divRefTab11','divRefTab15','divRefTab19','divRefTab23','divRefTab27'];
const cv=[{','.join(str(s) for s in completion_scores)}];
ct.forEach((t,i)=>document.getElementById(t)?.querySelector('a[dval="'+cv[i]+'"]')?.click());
const et=['divRefTab8','divRefTab12','divRefTab16','divRefTab20','divRefTab24','divRefTab28'];
const ev=[{','.join(str(s) for s in ease_scores)}];
et.forEach((t,i)=>document.getElementById(t)?.querySelector('a[dval="'+ev[i]+'"]')?.click());
const ht=['divRefTab9','divRefTab13','divRefTab17','divRefTab21','divRefTab25','divRefTab29'];
const hv=[{','.join(str(s) for s in help_scores)}];
ht.forEach((t,i)=>document.getElementById(t)?.querySelector('a[dval="'+hv[i]+'"]')?.click());
['divRefTab10','divRefTab14','divRefTab18','divRefTab22','divRefTab26','divRefTab30'].forEach(t=>document.getElementById(t)?.querySelector('a[dval="9"]')?.click());
'''
    
    js3 = f'''
document.querySelectorAll('.scale-rating').forEach(s=>s.querySelectorAll('a')[{overall_score-1}]?.click());
document.getElementById('q35_{next_step_idx}')?.click();
[{','.join(str(a) for a in advantages)}].forEach(v=>document.getElementById('q38_'+v)?.click());
document.getElementById('q39').value='{valuable}';
document.getElementById('q40').value='{improve}';
document.getElementById('q41').value='{confusion}';
document.getElementById('q42').value='{untrust}';
document.getElementById('q43').value='{improve_sug}';
document.getElementById('q44').value='{other_sug}';
'''
    
    # 执行命令序列
    cmds = [
        ["open", QUESTIONNAIRE_URL],
        ["wait", "--load", "networkidle"],
        ["eval", js1],
        ["find", "text", "下一页", "click"],
        ["wait", "--load", "networkidle"],
        ["eval", js2],
        ["find", "text", "下一页", "click"],
        ["wait", "--load", "networkidle"],
        ["eval", js3],
        ["find", "text", "提交", "click"],
        ["wait", "--load", "networkidle"],
        ["screenshot", f"/workspace/screenshot_{run_id}.png"],
        ["close"]
    ]
    
    # 使用batch执行
    batch_json = json.dumps(cmds)
    stdout, code = run_browser_cmd(f"echo '{batch_json}' | agent-browser batch --json")
    
    if code == 0:
        print(f"第 {run_id} 份完成 ✓")
        return True
    else:
        print(f"第 {run_id} 份失败 ✗")
        run_browser_cmd("agent-browser close")
        return False


def main():
    """主函数"""
    print(f"开始填写 {TOTAL_COUNT} 份问卷...")
    
    success = 0
    for i in range(1, TOTAL_COUNT + 1):
        if fill_questionnaire(i):
            success += 1
        
        # 间隔
        wait = random.randint(3, 8)
        print(f"等待 {wait}s...")
        time.sleep(wait)
    
    print(f"\n完成！成功: {success}/{TOTAL_COUNT}")


if __name__ == "__main__":
    main()