const { logger } = require("./log");
const moment = require("moment");

module.exports = function(err) {
  logger.log({
    level: "error",
    error: err,
    date: moment().format("ddd, MMM DD YYYY, kk:mm:ss")
  });
};
