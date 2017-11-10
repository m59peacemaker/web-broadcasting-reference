export default component => {
  const { fire } = component
  component.fire = (eventName, data) => {
    fire.call(component, eventName, data)
    ;(component._handlers['*'] || [])
      .forEach(handler => handler.call(component, eventName, data))
  }
}
