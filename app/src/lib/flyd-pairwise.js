import flyd from 'flyd'

const pairwise = source$ => {
  const pair$ = flyd.stream()

  let previousValue

  flyd.on(value => {
    if (previousValue !== undefined) {
      pair$([ previousValue, source$() ])
    }

    previousValue = value
  }, source$)

  flyd.on(pair$.end, source$.end)

  return pair$
}

export default pairwise
