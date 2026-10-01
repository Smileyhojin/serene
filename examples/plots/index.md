+++
title = "Plots and content blocks"
date = 2026-09-30
[extra]
lang = "ko"
toc = true
+++

## 월별 기록

같은 데이터 파일로 여러 차트를 그릴 수 있습니다.

{{ <echarts js_file="line.js" title="월별 기록" page /> }}

{{ <echarts js_file="line.js" title="월별 기록 비교" height="280px" page /> }}

## 코드와 복사

```python,linenos,hl_lines=2,name=hello.py
# 한국어 주석
print("안녕하세요")

print("줄 번호 없이 복사됩니다")
```

```
  leading spaces stay intact
trailing spaces stay intact  
```

## 표와 인용

| 항목 | 설명 |
| --- | --- |
| 플롯 | 크기와 테마가 자동으로 바뀝니다 |
| 코드 | 줄 번호를 제외하고 복사합니다 |

> 작은 기록을 꾸준히 남겨 봅니다.

> [!NOTE]
> 강조 상자는 배경 없이 얇은 구분선만 사용합니다.

{% <detail title="접힌 차트" > %}
{{ <echarts js_file="line.js" title="접힌 영역의 차트" height="280px" page /> }}
{% </detail> %}
