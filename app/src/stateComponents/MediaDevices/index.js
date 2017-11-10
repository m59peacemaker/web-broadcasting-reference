import flyd from 'flyd'
import flydObj from 'flyd/module/obj'
import assoc from 'ramda/src/assoc'
import over from 'ramda/src/over'
import lensProp from 'ramda/src/lensProp'
import lensPath from 'ramda/src/lensPath'
import append from 'ramda/src/append'
import not from 'ramda/src/not'
import pipe from 'ramda/src/pipe'
import ConnectedMediaDevicesStream from '../../lib/connected-media-devices-stream'
import { KindSettings } from './schema/Settings'
import kinds from './schema/kinds'
import prepareAndGroupDevices from './lib/prepare-and-group-devices'
import Actions from './actions/Shared'

const nest = (path, updateFn) =>
  function nestedUpdate (mapFn) {
    return updateFn(over(lensPath(path), mapFn))
  }

const LOCAL_STORAGE_KEY = 'mediaDeviceSettings'
const saveSettings = settings => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
const loadSettings = () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))

const MediaDevices = ({ connectedDevices$ }) => {
  const kindGroups$ = connectedDevices$
    .map(prepareAndGroupDevices)

  //const settings$ = Settings$({
  //  initialValue: loadSettings(), connectedDevices$: connected$ })

/*  const active$ = flyd.stream(KINDS.reduce((o, kind) => assoc(kind, [], o), {}))
  const masterSettings$ = flyd.stream(
    KINDS.reduce((o, kind) => assoc(kind, KindSettings[kind](), o))
  )

  const master$ = flyd.stream(
    KINDS.reduce((o, kind) => assoc(kind, ActiveState[kind](), o))
  )

  flyd.on(saveSettings, settings$)
*/
  /*const model = flydObj.stream({
    connected: connected$,
    active: active$,
    master: master$,
    settings: settings$,
    masterSettings: masterSettings$
  })*/
  const model = kindGroups$

  /* without `update`, actions would have to be more verbose:
   * ```
   * model(
   *   over(lensPath(path), operation, model())
   * )
   */
  const update = mappingFn => model(mappingFn(model()))

  const actions = kinds.reduce(
    (actions, kind) => assoc(kind, Actions(nest([ kind ], update)), actions),
    {}
  )

  // TODO: this can/should be reorganized such that a pre-lensed update function can be passed for each device kind, eliminating the need for the kind in the lens path in every function. The model should have kinds at the top i.e. audioinput.connected, audioinput.active, NOT connected.audioinput, etc

  // TODO: separate model and actions into their own files, just pass in what is needed to them
  return {
    model,
    actions
  }
}

export default MediaDevices
