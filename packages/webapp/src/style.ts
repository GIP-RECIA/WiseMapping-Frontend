/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import useClasses from './theme/useStyles';

export function useStyles() {
  return useClasses({
    root: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      'flex-direction': 'column',
      overflow: 'hidden',
    },
    header: {
      height: '41px',
    },
    main: {
      height: '100%',
      overflow: 'hidden',
    },
  });
}
