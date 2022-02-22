module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat', //增加新功能
        'fix', //修复问题/BUG
        'perf', //代码风格相关无影响运行结果的
        'style', //优化/性能提升
        'docs', //重构
        'test', //撤销修改
        'refactor', //测试相关
        'build', //文档/注释
        'ci', //赖更新/脚手架配置修改等
        'chore', //workflow 工作流改进
        'revert', //ci 持续集成
        'wip', //mod 不确定分类的修改
        'workflow', //wip 开发中
        'types', //types 类型修改
        'release',
      ],
    ],
  },
};
//要临时关闭验证，可以在.husky/commit-msg 内注释以下代码即可（npx --no-install commitlint --edit "$1"）
