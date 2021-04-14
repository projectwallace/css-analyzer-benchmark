import benchmark from 'benchmark'
import analyzeCss from '@projectwallace/css-analyzer'
import cssstats from 'cssstats'

const css = `html {
  font-size: 1em;
}`

const suite = new benchmark.Suite()

suite
  .add('@projectwallace/css-analyzer', {
    defer: true,
    fn(defer) {
      analyzeCss(css).then(() => {
        defer.resolve()
      })
    }
  })
  .add('cssstats', () => {
    cssstats(css)
  })
  .on('cycle', event => {
    const name = event.target.name.padStart('@projectwallace/css-analyzer'.length, ' ')
    const ops = event.target.hz.toFixed(0).padStart(6)
    process.stdout.write(`${name}: ${ops} ops/sec\n`)
  })
  .run()