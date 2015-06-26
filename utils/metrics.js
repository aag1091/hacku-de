
function randomScore(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function fakeMetric(name) {
  var score = randomScore(0, 180);
  var metric = {};
  var _name = name.replace('-', '');

  metric[_name + 'threshold'] = score;
  metric[_name + 'alert'] = score < 50;

  return metric;
}

module.exports = {
  randomScore: randomScore,
  fakeMetric: fakeMetric
};
