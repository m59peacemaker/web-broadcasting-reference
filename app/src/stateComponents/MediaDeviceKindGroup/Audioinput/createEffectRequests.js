import flyd from 'flyd'

export default ({ sources, model }) => {
  const { messages } = sources

  return {
    deviceConnectionNotifier: flyd.stream({
      kind: 'audioinput',
      onConnect: messages.deviceConnection
    })
  }
}
