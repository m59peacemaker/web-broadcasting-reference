import { Stream } from 'wark'

export default ({ sources, model }) => {
  const { messages } = sources

  return {
    deviceConnectionNotifier: Stream({
      kind: 'audioinput',
      onConnect: messages.deviceConnection
    })
  }
}
