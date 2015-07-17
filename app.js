var Path = {
  root: ''
, ta: 'node_modules/TemporalAnalysis/src/'
, angularStrap: 'node_modules/angular-strap/'
}
require('./WeatherProvider')
var temporalAnalysis = require('TemporalAnalysis')

var app = angular.module('cityweather', [
  'mgcrea.ngStrap'
, 'weather'
, 'temporalAnalysis'
])
app.value('Path', Path)

temporalAnalysis.value('ta.Path', {
  root: Path.ta
, angularStrap: Path.angularStrap
})
app.controller('AppController', [
  '$rootScope'
, '$scope'
, 'WeatherProvider'
, 'Path'
, require('./AppController')
])
