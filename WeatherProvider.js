var Self = function ($rootScope, $q, $timeout) {
  var self = this
  self.name = 'Weather'
  self.$q = $q
  self.$rootScope = $rootScope
  self.$timeout = $timeout

  //TODO Convention variable - find better way for providing consumers with choosen station data
  self.loaded = {}

  d3.csv('data/ghcn_units.csv', function (data) {
    self.items = data
  })
}

Self.prototype.stations = [{
    id: 'USW00094728'
  , name: 'New York'
  }, {
    id: 'USW00023234'
  , name: 'San Francisco'
  }, {
    id: 'USW00014922'
  , name: 'Minneapolis'
}]


Self.prototype.dateFormatter = d3.time.format('%Y%m%d')

Self.prototype.load = function (station) {
  var self = this
  var deferred = self.$q.defer()
  if (!station.data) {
    d3.csv('data/' + station.id + '.csv', function (data) {

      //Parse csv
      data = d3.nest()
        .key(function (d) { return d.date })
        .rollup(function (leaves) {
          return leaves.reduce(function (p, d, i, arr) { p[d.attr] = +d.value; return p}, {})
        })
        .entries(data)

      //format data
      for (var i = 0; i < data.length; i++) {
        var result = data[i].values
        result.date = self.dateFormatter.parse(data[i].key)
        var sunr = i < data.length -1 ? result.TMAX - data[i+1].values.TMAX : 0
        result.SUNR = Math.round((sunr + 200)/0.035)

        self.items.forEach(function (item) {
          //TODO not all missing values defaults to zero
          if (result[item.name] === undefined) {
            result[item.name] = 0
          }
          if (item.scale) result[item.name] = result[item.name] * +item.scale
        })
        data[i] = result
      }
      data = data.reverse()

      station.data = data
      self.loaded = data
      self.$timeout(function () {
        self.$rootScope.$broadcast('data-loaded', data, self.items)
      }, 500)
      deferred.resolve(data)
    })
  } else {
    self.$rootScope.$broadcast('data-loaded', station.data, self.items)
    deferred.resolve(station.data)
  }

  return deferred.promise
}

module.exports = angular.module('weather', [])
  .service('WeatherProvider', ['$rootScope', '$q', '$timeout', Self])
