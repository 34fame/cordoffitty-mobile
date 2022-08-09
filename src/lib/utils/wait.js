export const waitFor = async ({
   intervalInMillis = 500,
   maxWait = 10000,
   fn,
}) => {
   return new Promise(async (res, rej) => {
      const attempts = Math.round(maxWait / intervalInMillis)
      const interval = setInterval(() => {
         for (let attempt = 1; attempt < attempts; attempt++) {
            if (fn()) {
               clearInterval(interval)
               return res()
            }
         }
         clearInterval(interval)
         rej('waitFor did not resolve')
      }, intervalInMillis)
   })
}
