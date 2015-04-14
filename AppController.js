var Self = function ($rootScope, $scope, WeatherProvider, Path) {
  var self = this

  self.Path = Path
  self.WeatherProvider = WeatherProvider
  self.station = WeatherProvider.stations[0]
  WeatherProvider.load(self.station)
}
module.exports = Self
