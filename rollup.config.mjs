import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import { copyObjects } from './rollup/utils.js';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
    },
    plugins: [
      clear({
        targets: ['dist'],
      }),
      copy({
        targets: [
          await copyObjects('axios', '1.2.1'),
          await copyObjects('axios', '1.2.0'),
          await copyObjects('dayjs', '1.11.7'),
          await copyObjects('react', '18.2.0'),
          await copyObjects('react-dom', '18.2.0'),
          await copyObjects('i18next', '22.4.5'),
          await copyObjects('react-i18next', '12.1.1'),
          await copyObjects('react-router', '6.5.0'),
          await copyObjects('react-router-dom', '6.5.0'),
        ],
      }),
    ],
  },
];
