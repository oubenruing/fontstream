const Font = require('fonteditor-core').Font;
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000

function make(str){
  let buffer = fs.readFileSync('./sf.ttf');
  // read font data
  const sub = toUnicode(str);
  // await woff2.init()
  // const woff2buffer = woff2.encode(buffer)
  
  let font = Font.create(buffer, {
    type: 'ttf', // support ttf, woff, woff2, eot, otf, svg
    subset: sub, // only read `a`, `b` glyf
    hinting: true, // save font hinting
    compound2simple: true, // transform ttf compound glyf to simple
    inflate: null, // inflate function for woff
    combinePath: false, // for svg path
  });
  let newbuffer = font.write({type: 'ttf',subset: sub});
  return newbuffer
}

function toUnicode(str) {
	return str.split('').map( v => {return v.charCodeAt(0)});
}

app.use(express.static('public'));

app.get('/api', async(req, res) => {
  var now = Date.now()
  const font = await make(req.query.str)
  console.log(Date.now()-now)
  res.send(font)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})