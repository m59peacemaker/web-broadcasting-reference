import test from 'tape-catch'
import { isStream } from 'wark'
import omit from 'ramda/src/omit'
import createSources from './createSources'

const isObj = v => v != undefined && typeof v === 'object'

const arbitraryFlatSourcePlan = {
  foo: null,
  baz: '',
  qux: 0,
  foob: false,
  barb: true
}

const arbitraryNestedSourcePlan = {
  ...arbitraryFlatSourcePlan,
  baztion: arbitraryFlatSourcePlan
}

const flatSourcePlanWithSanitizers = {
  foo: null,
  bar: null,
  setText: v => {
    if (typeof v !== 'string') {
      throw new Error('not string')
    }
    return v.trim()
  }
}

const deepSourcePlanWithSanitizers = {
  ...flatSourcePlanWithSanitizers,
  nest: {
    handleTheTruth: bool => {
      if (bool !== true) {
        throw new Error('I can only handle the truth')
      }
      return bool
    },
    baz: null
  }
}

const assertKeysMatch = (t, objects) => objects.reduce(
  (prevObject, object) => {
    t.deepEqual(Object.keys(prevObject), Object.keys(object))
    Object.keys(prevObject).forEach(key => {
      const value = prevObject[key]
      if (isObj(value)) {
        assertKeysMatch(t, [ prevObject[key], object[key] ])
      }
    })

    return object
  }
)

const assertPropsAreStreams = (t, objects) => objects.forEach(
  object => Object
    .entries(object)
    .forEach(
      ([ key, value ]) => isObj(value)
        ? assertPropsAreStreams(t, [ value ])
        : t.true(isStream(value))
    )
)

test('createSources', t => {
  t.test('makes sources from flat object of meaningless values', t => {
    const sourcePlan = arbitraryFlatSourcePlan
    const { sources, sanitizedSources, sourceRejections } = createSources(sourcePlan)

    assertKeysMatch(t, [ sourcePlan, sources, sanitizedSources ])
    assertPropsAreStreams(t, [ sources, sanitizedSources ])
    t.deepEqual(sourceRejections, {})

    t.end()
  })

  t.test('makes sources from deep object of meaningless values', t => {
    const sourcePlan = arbitraryNestedSourcePlan
    const { sources, sanitizedSources, sourceRejections } = createSources(sourcePlan)

    assertKeysMatch(t, [ sourcePlan, sources, sanitizedSources ])
    assertPropsAreStreams(t, [ sources, sanitizedSources ])
    t.deepEqual(sourceRejections, {})

    t.end()
  })

  t.test('makes sources from flat object that includes sanitizers', t => {
    const sourcePlan = flatSourcePlanWithSanitizers
    const { sources, sanitizedSources, sourceRejections } = createSources(sourcePlan)

    assertKeysMatch(t, [ sourcePlan, sources, sanitizedSources ])
    assertKeysMatch(t, [ sourceRejections, { setText: null } ])
    assertPropsAreStreams(t, [ sources, sanitizedSources, sourceRejections ])

    t.end()
  })

  t.test('makes sources from deep object that includes sanitizers', t => {
    const sourcePlan = deepSourcePlanWithSanitizers
    const { sources, sanitizedSources, sourceRejections } = createSources(sourcePlan)

    assertKeysMatch(t, [ sourcePlan, sources, sanitizedSources ])
    assertKeysMatch(t, [ sourceRejections, { setText: null, nest: { handleTheTruth: null } } ])
    assertPropsAreStreams(t, [ sources, sanitizedSources, sourceRejections ])

    t.end()
  })

  t.test('sanitizer returning error emits to sourceRejection and not to sanitizedSource', t => {
    const sourcePlan = deepSourcePlanWithSanitizers
    const { sources, sanitizedSources, sourceRejections } = createSources(sourcePlan)

    sources.setText(123)

    t.equal(sourceRejections.setText.get().message, 'not string')
    t.false(sourceRejections.nest.handleTheTruth.get())

    sources.nest.handleTheTruth(false)
    const truthRejection = sourceRejections.nest.handleTheTruth.get().message

    t.equal(typeof truthRejection, 'string', truthRejection)
    t.false(sanitizedSources.setText.get())
    t.false(sanitizedSources.nest.handleTheTruth.get())

    t.end()
  })

  t.test('good sources get emitted to sanitizedSources', t => {
    const sourcePlan = deepSourcePlanWithSanitizers
    const { sources, sanitizedSources } = createSources(sourcePlan)

    t.false(sanitizedSources.setText.get())

    sources.setText('the text')

    t.true(sanitizedSources.setText.get())
    t.false(sanitizedSources.nest.handleTheTruth.get())

    sources.nest.handleTheTruth.set(true)

    t.true(sanitizedSources.nest.handleTheTruth.get())

    t.end()
  })

  t.test('value retured from sanitizer is the emitted value', t => {
    const sourcePlan = deepSourcePlanWithSanitizers
    const { sources, sanitizedSources } = createSources(sourcePlan)

    t.false(sanitizedSources.setText.get())

    sources.setText('  the text  ')

    t.equal(sanitizedSources.setText.get(), 'the text')

    t.end()
  })
})
