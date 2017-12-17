import * as W from 'wark'

export default ({ sources, model }) => {
  const { messages } = sources

  return {
    deviceConnectionNotifier: W.Stream({
      kind: 'audioinput',
      onConnect: messages.deviceConnection
    })
  }
}
