Tracks are the important and relevant part of streams. Streams are an annoying container. Ditch them after you get their tracks, pass the tracks around, make a new stream and put the track(s) in it when you have a track and need a stream.

Streams are garbage collected and don't need to be cleaned up (other than unreferencing them).

Tracks need to be stopped (`track.stop()`) when you are done with them.

Tracks from `mediaStreamDestination.stream` are dependent upon the tracks in the sources that are connected to the destination (as you would expect).

Accessing multiple audio input devices at once seems to be work.

Accessing a video input while there is an active track for a different video input does not work on mobile. Unsure on desktop and unable to test due to only posessing one desktop webcam for now. From what I hear, this should work on desktop, and it technically works on mobile, but most hardware is unable to deliver both at once and results in an error.
