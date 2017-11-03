import flyd from 'flyd'
const { stream } = flyd
import { normalizeMediaDevices } from '../schemas/media-devices'
import pick from 'ramda/src/pick'
import map from 'ramda/src/map'

const mediaDeviceInfo = {
  deviceId: '',
  groupId: '',
  kind: '',
  label: ''
}
const makeInfoNormalObjects = map(pick(Object.keys(mediaDeviceInfo)))

const mediaDevices$ = stream({
  videoinput: {},
  audioinput: {},
  audiooutput: {}
})

import getMediaDevices from '../lib/get-media-devices'

const updateDevicesInfo = async () => {
  const devices = await getMediaDevices()
  mediaDevices$(normalizeMediaDevices(makeInfoNormalObjects(devices)))
}

window.navigator.mediaDevices.addEventListener('devicechange', updateDevicesInfo)
updateDevicesInfo()

export default mediaDevices$
/* import { */
/*   observable, */
/*   extendObservable, */
/*   computed, */
/*   action, */
/*   runInAction, */
/*   autorun, */
/*   toJS */
/* } from 'mobx' */

/* import pick from 'ramda/src/pick' */
/* import symmetricDifferenceWith from 'ramda/src/symmetricDifferenceWith' */
/* import eqBy from 'ramda/src/eqBy' */
/* import prop from 'ramda/src/prop' */
/* import both from 'ramda/src/both' */
/* const isSameDevice = both(eqBy(prop('kind')), eqBy(prop('deviceId'))) */
/* const diffDevices = symmetricDifferenceWith(isSameDevice) */
/* import { applyPatch, createPatch, createTests } from 'rfc6902' */

/* const mapObj = (object, fn) => Object */
/*   .keys(object) */
/*   .reduce((acc, key, idx) => { */
/*     acc[key] = fn(object[key], key, idx) */
/*     return acc */
/*   }, {}) */

/* const mediaDeviceInfoKeys = [ 'deviceId', 'groupId', 'label', 'kind' ] */

/* import getMediaDevices from '../lib/get-media-devices' */

/* const store = Object.assign( */
/*   { */
/*     list: observable.map({}) */
/*   }, */
/*   /*[ 'videoinput', 'audioinput', 'audiooutput' ] */
/*     .reduce((acc, kind) => { */
/*       acc[kind] = computed(() => mapObj(store.list, */
/*         .filter(device => device.kind === kind) */
/*         .reduce((devices, device) => { */
/*           devices[device.deviceId] = device */
/*           return devices */
/*         }, {})) */
/*       return acc */
/*     }, {}) */
/*       *1/ */
/* ) */

/* const updateDevicesInfo = async () => { */
/*   const devices = (await getMediaDevices()) */
/*     .map(v => pick(mediaDeviceInfoKeys, v)) // make regular objects */
/*   const patch = createPatch(toJS(store.list), Object.assign({}, devices)) */
/*   applyPatch(store.list, patch) */
/*   console.log(store.list) */
/*   return */
/*   runInAction(() => { */
/*     diffDevices(store.list, devices).forEach(diffDevice => { */
/*       const oldItemIndex = store.list */
/*         .findIndex(storedDevice => isSameDevice(storedDevice, diffDevice)) */
/*       oldItemIndex === -1 */
/*         ? store.list.push(diffDevice) */
/*         : store.list.splice(oldItemIndex, 1) */
/*     }) */
/*   }) */
/* } */

/* window.navigator.mediaDevices.addEventListener('devicechange', updateDevicesInfo) */
/* updateDevicesInfo() */

/* autorun(() => { */
/*   console.log(store.list) */
/* }) */

/* export default store */
