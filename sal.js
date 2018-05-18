const config = require('config')
const fs = require('fs')
const shapefile = require('shapefile')

const convert = (path, t) => {
  shapefile.open(path).then(s => s.read()
    .then(function proc(r) {
      if (r.done) return
      let f = r.value
      delete f.properties.Shape_Leng
      delete f.properties.Shape_Area
      f.tippecanoe = {minzoom: 2, maxzoom: 8, layer: t.toLowerCase()}
      console.log(JSON.stringify(f))
      return s.read().then(proc)
    }))
  .catch(err => console.error(err.stack))
}

for (let c of config.get('member_states')) {
  for (let t of ['BNDL', 'BNDA']) {
    convert(`data/${c}/${t}_${c}.shp`, t)
  }
}
