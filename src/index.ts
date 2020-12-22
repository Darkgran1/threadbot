import { router } from 'microrouter'

/* tslint:disable no-var-requires */
export default router(
  ...require('./routes/index').default,
  ...require('./routes/actions').default,
  ...require('./routes/commands').default,
  ...require('./routes/events').default,
  ...require('./routes/oauth').default,
  ...require('./routes/ping').default,
)
