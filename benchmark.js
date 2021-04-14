import benchmark from 'benchmark'
import analyzeCss from '@projectwallace/css-analyzer'
import cssstats from 'cssstats'
import { readFileSync } from 'fs'

const css = readFileSync('./mock-github.css', 'utf-8')

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