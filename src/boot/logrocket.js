import LogRocket from 'logrocket'

if (process.env.APP_ENV === 'prod') {
   LogRocket.init(process.env.LOGROCKET_KEY)
}
