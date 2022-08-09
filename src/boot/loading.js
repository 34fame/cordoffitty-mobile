import { Loading, QSpinnerOval } from 'quasar'

import useMessage from 'src/lib/messages'
const message = useMessage()

Loading.setDefaults({
   backgroundColor: 'grey-8',
   messageColor: 'secondary',
   message: message.loading(),
   spinner: QSpinnerOval,
   spinnerColor: 'secondary',
   spinnerSize: '140',
})
