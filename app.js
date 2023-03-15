if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const axios = require('axios')
const ejsMate = require('ejs-mate')
const path = require('path')
const express = require('express')
const app = express();
const locate = require('./utils/locate')
const meterConv = require('./utils/meterToFeet')
const makeList = require('./utils/makelist')
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))



app.get('/home', async (req, res) => {
    const axio = await axios.get("https://marine-api.open-meteo.com/v1/marine?latitude=32.85&longitude=-117.27&hourly=wave_height")
    const hourlyTime = axio.data.hourly.time.map(arr => {
        return arr.substr(5, 5) + ' ' + arr.substr(11, 5)
    })
    res.render('home')

    // console.log(geoData.body.features[0].center)

})
app.post('/home', async (req, res) => {
    const { search } = req.body
    const arrCoor = await locate(search)
    const axio = await axios.get(`https://marine-api.open-meteo.com/v1/marine?latitude=${arrCoor[1]}&longitude=${arrCoor[0]}&hourly=wave_height`)
    const hourlyTime = axio.data.hourly.time.map(arr => {
        return arr.substr(5, 5) + ' ' + arr.substr(11, 5)
    })
    const hourlyWaveHeight = axio.data.hourly.wave_height
    console.log(arrCoor[0])
    res.render('forecast', { hourlyTime, hourlyWaveHeight, search })
    // console.log(location)
})

app.listen(3000, () => {
    console.log('your getting somewheere app3000')
})