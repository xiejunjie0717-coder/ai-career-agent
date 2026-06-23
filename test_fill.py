#!/usr/bin/env python3
"""测试版：填写1份问卷"""

import subprocess
import random
import time
import sys

QUESTIONNAIRE_URL = "https://v.wjx.cn/vm/YQgvPEO.aspx"


def run_eval(js_code):
    """执行JavaScript并返回结果"""
    try:
        result = subprocess.run(
            ['agent-browser', 'eval', js_code],
            capture_output=True, text=True, timeout=30
        )
        return result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return "", str(e)


def test_fill():
    """测试填写一份问卷"""
    print("打开问卷...")
    
    subprocess.run(['agent-browser', 'close'], capture_output=True)
    time.sleep(1)
    
    subprocess.run(['agent-browser', 'open', QUESTIONNAIRE_URL], capture_output=True)
    subprocess.run(['agent-browser', 'wait', '--load', 'networkidle'], capture_output=True)
    time.sleep(2)
    
    # ========== 第一页 ==========
    print("\n--- 第一页 ---")
    
    # Q1: 年级 - 选大二
    out, err = run_eval("document.querySelector('#q1_2 + a.jqradio').click()")
    print(f"Q1年级: {out} err={err}")
    time.sleep(0.5)
    
    # Q2: 专业
    out, err = run_eval("""
        var q2 = document.getElementById('q2');
        q2.value = '软件工程';
        q2.dispatchEvent(new Event('input', {bubbles: true}));
        q2.value;
    """)
    print(f"Q2专业: {out}")
    time.sleep(0.5)
    
    # Q3: 求职阶段 - 准备简历
    out, err = run_eval("document.querySelector('#q3_3 + a.jqradio').click()")
    print(f"Q3求职阶段: {out}")
    time.sleep(0.5)
    
    # Q4: 目标岗位
    out, err = run_eval("""
        var q4 = document.getElementById('q4');
        q4.value = '前端开发工程师';
        q4.dispatchEvent(new Event('input', {bubbles: true}));
        q4.value;
    """)
    print(f"Q4目标岗位: {out}")
    time.sleep(0.5)
    
    # Q5: AI使用频率 - 每周使用
    out, err = run_eval("document.querySelector('#q5_3 + a.jqradio').click()")
    print(f"Q5AI频率: {out}")
    time.sleep(0.5)
    
    # Q6: 求职困难 (多选3个)
    for d in [1, 2, 4]:
        out, err = run_eval(f"document.querySelector('#q6_{d} + a.jqcheck').click()")
        print(f"Q6困难{d}: {out}")
        time.sleep(0.3)
    
    # 检查选中状态
    out, err = run_eval("""
        [1,2,3,4,5,6,7].map(i => document.getElementById('q6_'+i)?.checked).join(',');
    """)
    print(f"Q6选中状态: {out}")
    
    # 下一页
    print("\n点击下一页...")
    out, err = run_eval("document.querySelector('#divNext').click()")
    print(f"下一页: {out} err={err}")
    subprocess.run(['agent-browser', 'wait', '--load', 'networkidle'], capture_output=True)
    time.sleep(2)
    
    # ========== 第二页 ==========
    print("\n--- 第二页 ---")
    
    # 完成情况表格
    comp_tables = ['divRefTab7', 'divRefTab11', 'divRefTab15', 'divRefTab19', 'divRefTab23', 'divRefTab27']
    comp_vals = [1, 1, 2, 1, 2, 3]
    for i, tid in enumerate(comp_tables):
        out, err = run_eval(f"document.getElementById('{tid}').querySelector('a[dval=\"{comp_vals[i]}\"]').click()")
        print(f"完成{i+1}: {out}")
        time.sleep(0.2)
    
    # 难易程度
    ease_tables = ['divRefTab8', 'divRefTab12', 'divRefTab16', 'divRefTab20', 'divRefTab24', 'divRefTab28']
    ease_vals = [4, 4, 3, 4, 3, 4]
    for i, tid in enumerate(ease_tables):
        out, err = run_eval(f"document.getElementById('{tid}').querySelector('a[dval=\"{ease_vals[i]}\"]').click()")
        print(f"难易{i+1}: {out}")
        time.sleep(0.2)
    
    # 帮助程度
    help_tables = ['divRefTab9', 'divRefTab13', 'divRefTab17', 'divRefTab21', 'divRefTab25', 'divRefTab29']
    help_vals = [4, 3, 4, 4, 3, 4]
    for i, tid in enumerate(help_tables):
        out, err = run_eval(f"document.getElementById('{tid}').querySelector('a[dval=\"{help_vals[i]}\"]').click()")
        print(f"帮助{i+1}: {out}")
        time.sleep(0.2)
    
    # 问题表格 - 选"没有问题"
    prob_tables = ['divRefTab10', 'divRefTab14', 'divRefTab18', 'divRefTab22', 'divRefTab26', 'divRefTab30']
    for tid in prob_tables:
        out, err = run_eval(f"document.getElementById('{tid}').querySelector('a[dval=\"9\"]').click()")
        print(f"问题: {out}")
        time.sleep(0.2)
    
    # 下一页
    print("\n点击下一页...")
    out, err = run_eval("document.querySelector('#divNext').click()")
    print(f"下一页: {out} err={err}")
    subprocess.run(['agent-browser', 'wait', '--load', 'networkidle'], capture_output=True)
    time.sleep(2)
    
    # ========== 第三页 ==========
    print("\n--- 第三页 ---")
    
    # scale-rating评分
    out, err = run_eval("""
        var scales = document.querySelectorAll('.scale-rating');
        var count = scales.length;
        scales.forEach(function(s) {
            s.querySelector('a[val="4"]').click();
        });
        count;
    """)
    print(f"scale评分数量: {out}")
    time.sleep(0.5)
    
    # Q35: 帮助程度
    out, err = run_eval("document.querySelector('#q35_4 + a.jqradio').click()")
    print(f"Q35: {out}")
    time.sleep(0.5)
    
    # Q38: 优势
    for a in [1, 2, 4, 5]:
        out, err = run_eval(f"document.querySelector('#q38_{a} + a.jqcheck').click()")
        print(f"Q38优势{a}: {out}")
        time.sleep(0.3)
    
    # 文本问题
    out, err = run_eval("""
        var texts = {
            'q39': '岗位分析功能最有价值，能帮助我快速了解岗位要求，明确自己需要具备哪些技能。',
            'q40': '模拟面试题目太少，希望能有更多场景和行业针对性。',
            'q41': '不清楚如何开始使用，入口不够明显，需要更多引导和教程。',
            'q42': '能力评估结果，不清楚评估标准，担心不够准确。',
            'q43': '增加更多功能引导和教程，帮助新用户快速上手。',
            'q44': '希望能有移动端App，随时随地使用，更方便。'
        };
        for (var id in texts) {
            var el = document.getElementById(id);
            if (el) {
                el.value = texts[id];
                el.dispatchEvent(new Event('input', {bubbles: true}));
                el.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }
        'done';
    """)
    print(f"文本问题: {out}")
    time.sleep(1)
    
    # 滚动到底部
    run_eval("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(0.5)
    
    # 截图
    subprocess.run(['agent-browser', 'screenshot', '/workspace/test_before_submit.png'], capture_output=True)
    
    # 提交
    print("\n提交问卷...")
    out, err = run_eval("document.getElementById('ctlNext').click()")
    print(f"提交: {out} err={err}")
    time.sleep(3)
    
    # 等待结果
    subprocess.run(['agent-browser', 'wait', '--load', 'networkidle'], capture_output=True)
    time.sleep(2)
    
    # 检查结果
    out, err = run_eval("document.body.innerText.substring(0, 200)")
    print(f"\n结果页面: {out}")
    
    # 截图
    subprocess.run(['agent-browser', 'screenshot', '/workspace/test_result.png'], capture_output=True)
    
    # 关闭
    subprocess.run(['agent-browser', 'close'], capture_output=True)
    
    print("\n测试完成！")


if __name__ == "__main__":
    test_fill()