import typescript from 'rollup-plugin-ts';
import ttypescript from 'ttypescript';

export default {
  input: 'index.ts',
  output: {
    dir: 'lib',
    format: 'cjs',
    preserveModules: true,
  },
  plugins: [
    typescript({
      typescript: ttypescript,
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
      }),
    }),
  ],
};
