const path = require("path");
const cloneDeep = require("lodash").cloneDeep;
const { compose, getLoader, injectBabelPlugin } = require("react-app-rewired");
const rewireLessModule = require("./react-app-rewire-less-module");

module.exports = function override(config, env) {
  // 使得`@`可用
  config = injectBabelPlugin("transform-decorators-legacy", config);
  // 引入`antd` UI， 并且以less的形式引入
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", style: true }],
    config
  );
  // 启用css模块化
  config = rewireLessModule(config, env, {
    modifyVars: {
      // 需要覆盖的antd主题变量
    }
  });
  return config;
};
