async function test(req, res) {
  res.json({
    message: "Api route working",
  });
}

module.exports = {
  test,
};
