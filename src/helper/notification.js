import { Notify } from 'quasar'

export const notificarSucesso = (msg, opts = {}) => {
  const message = `Tudo certo! <br>${msg}`
  Notify.create({
    type: 'positive',
    progress: true,
    position: 'bottom',
    message,
    classes: 'text-body1',
    timeout: 3000,
    actions: [{
      icon: 'close',
      round: true,
      color: 'white'
    }],
    html: true,
    ...opts
  })
}
export const notificarErro = (msg, opts = {}) => {
  const message = `Ops! ${msg}.`
  Notify.create({
    type: 'negative',
    progress: true,
    position: 'bottom',
    message,
    classes: 'text-body1',
    timeout: 3000,
    actions: [{
      icon: 'close',
      round: true,
      color: 'white'
    }],
    html: true,
    ...opts
  })
}
