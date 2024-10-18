import { existsSync } from 'node:fs';
// import { runCommand } from 'piral-cli/lib/common/scripts.js';
import { installPackage } from 'piral-cli/lib/npm-clients/npm.js';
// import { ensureDependencyInstalled } from 'nypm';

/* 
| 包管理器 | 更新生产依赖   | 更新开发依赖 | 不更新依赖                                                                                 | 不更新 lockfile                   |
| -------- | -------------- | ------------ | ------------------------------------------------------------------------------------------ | --------------------------------- |
| npm      | '--save-exact' | '--save-dev' | '--no-save'                                                                                | N/A('--no-save'不会更新 lockfile) |
| yarn     | '--exact'      | '--dev'      | N/A(可降级使用 --peer 追加到 devDependencies)(https://github.com/yarnpkg/yarn/issues/1743) | '--frozen-lockfile'               |

npm 适合动态未知依赖安装，在存在情况下会更新 yarn.lock
yarn 适合动态固定依赖安装
*/

const suffixs = ['/dist/umd', '/dist', '/umd'];
export async function copyObjects(depName, version) {
  const moduleName = `${depName}${version}`;
  await installPackage(
    `${moduleName}@npm:${depName}@${version}`,
    './',
    '--production',
    'false',
    '--registry',
    'https://registry.npmmirror.com/',
    '--no-save',
  );
  // await runCommand('npm', ['install', `${moduleName}@npm:${depName}@${version}`, '--production', 'false', '--registry', 'https://registry.npmmirror.com/']);
  // ensureDependencyInstalled([`${moduleName}@npm:${depName}@${version}`, '--production', 'false', '--registry', 'https://registry.npmmirror.com/']);

  let suffix = '/';
  for (let s of suffixs) {
    if (existsSync(`node_modules/${moduleName}${s}`)) {
      suffix = s;
      break;
    }
  }

  // tbd: 嗅探 umd module detecting 找出 umd 入口文件，或从网上找到 umd 入口清单，然后生成 public/map.json
  /* 
  {
    "imports": {
        "axios@1.2.1": "./axios@1.2.1/dist/axios.min.js",
        "axios@1.2.0": "./axios@1.2.0/dist/axios.min.js",
        ...
    }
  }
  */

  return {
    src: `node_modules/${moduleName}` + (suffix || '') + '/*',
    dest: `dist/${depName}@${version}` + (suffix || ''),
  };
}
