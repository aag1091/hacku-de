
exports.random = function(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
};
