const option = {
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 24, top: 36, bottom: 40, containLabel: true },
  xAxis: { type: 'category', data: ['1월', '2월', '3월', '4월', '5월'] },
  yAxis: { type: 'value' },
  series: [{ name: '기록', type: 'line', data: [3, 7, 5, 12, 9], smooth: true }]
};

export default option;
