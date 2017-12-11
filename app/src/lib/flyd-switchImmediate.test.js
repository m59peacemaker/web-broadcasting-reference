import test from 'tape-catch'
import flyd from 'flyd'
import switchImmediate from './flyd-switchImmediate'

test('flyd-switchImmediate', t => {
  t.test('immediately emits with the current value of the current stream from source', t => {
    const foo = flyd.stream('f')
    const stream = flyd.stream(foo)
    const latest = switchImmediate(stream)
    t.equal(latest(), 'f')

    t.end()
  })

  t.test('emits with the current value of the stream when source emits', t => {
    const foo = flyd.stream('f')
    const bar = flyd.stream('b')
    const stream = flyd.stream(foo)
    const latest = switchImmediate(stream)
    stream(bar)
    t.equal(latest(), 'b')
    stream(foo)
    t.equal(latest(), 'f')

    t.end()
  })

  t.test('emits with the current value of the stream when the current stream emits', t => {
    const foo = flyd.stream('f')
    const bar = flyd.stream('b')
    const stream = flyd.stream(foo)
    const latest = switchImmediate(stream)
    stream(bar)
    t.equal(latest(), 'b')
    bar('bb')
    t.equal(latest(), 'bb')
    stream(foo)
    t.equal(latest(), 'f')
    foo('ff')
    t.equal(latest(), 'ff')
    stream(bar)
    t.equal(latest(), 'bb')

    t.end()
  })
})
