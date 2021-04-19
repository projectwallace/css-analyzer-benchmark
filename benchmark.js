import benchmark from 'benchmark'
import analyzeCss from '@projectwallace/css-analyzer'
import cssstats from 'cssstats'
import StyleStats from 'stylestats'
import { readFileSync } from 'fs'
import Parker from 'parker/lib/Parker.js'
import parkerMertrics from 'parker/metrics/All.js'

const parker = new Parker(parkerMertrics)

const smallCss = 'html { font-size: 1em; color: red; background: #000, hsla(0, 20% 30% / .5); border: 3px solid gray }'
const bigCss = readFileSync('./mock-github.css', 'utf-8')

const suite = new benchmark.Suite()

suite
  .add('@projectwallace/css-analyzer - small css', {
    defer: true,
    fn(defer) {
      analyzeCss(smallCss).then(() => {
        defer.resolve()
      })
    }
  })
  .add('cssstats - small css', () => {
    cssstats(smallCss)
  })
  .add('stylestats - small css', {
    defer: true,
    fn(defer) {
      new StyleStats(smallCss).parse().then(() => {
        defer.resolve()
      })
    }
  })
  .add('Parker - small css', () => {
    parker.run(smallCss)
  })
  .add('@projectwallace/css-analyzer - big css', {
    defer: true,
    fn(defer) {
      analyzeCss(bigCss).then(() => {
        defer.resolve()
      })
    }
  })
  .add('cssstats - big css', () => {
    cssstats(bigCss)
  })
  .add('stylestats - big css', {
    defer: true,
    fn(defer) {
      new StyleStats(bigCss).parse().then(() => {
        defer.resolve()
      })
    }
  })
  .add('Parker - big css', () => {
    parker.run(bigCss)
  })
  .on('cycle', event => {
    const name = event.target.name.padStart('@projectwallace/css-analyzer - small css'.length, ' ')
    const ops = event.target.hz.toFixed(0).padStart(6)
    console.log(`${name}: ${ops} ops/sec`)
  })
  .run()