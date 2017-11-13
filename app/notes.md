## media

Tracks are the important and relevant part of streams. Streams are an annoying container. Ditch them after you get their tracks, pass the tracks around, make a new stream and put the track(s) in it when you have a track and need a stream.

Streams are garbage collected and don't need to be cleaned up (other than unreferencing them).

Tracks need to be stopped (`track.stop()`) when you are done with them.

Tracks from `mediaStreamDestination.stream` are dependent upon the tracks in the sources that are connected to the destination (as you would expect).

Accessing multiple audio input devices at once seems to work everywhere.

Accessing a video input while there is an active track for a different video input does not work on mobile. Unsure on desktop and unable to test due to only posessing one desktop webcam for now. From what I hear, this should work on desktop, and it technically works on mobile, but most hardware is unable to deliver both at once and results in an error. There are several android phones where this should work.

It would be really sweet to live broadcast 360 video with something like Essential Phone.

## architecture

### stateComponent

Has no concern with the view. An individual component only cares about state. It gives you a stream that emits state trees and actions to do side-effects / change the state.

returns an object with the following properties:

#### `model$: flyd.stream()`

Stream that emits a state tree.

The state tree can be built up from streams of other components models, but should reflect the current, unwrapped state of them.

Streams can be added/replaced/removed lazily and the state tree should discover those streams and emit/update with them as well (./lib/flyd-withStreams)

#### `actions: {}`

Functions that act on the part of the state tree this component created.

Actions that need to modify parts of the tree that were created by other stateComponents should be handed off to those components i.e. `components[thatComponent].actions.doTheThing()` This avoids duplicating behavior and keeps the action logic close to the code that is most relevant to it.
```
