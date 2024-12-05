angular.module('evoltActiveApp', [])
  .controller('ProfileController', function($scope, $window, $http) {
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('id');

    $scope.user = {};

    // Load Saved Name
    $scope.getName = function() {
      $scope.savedName = $window.localStorage.getItem('name');
    };
    $scope.getName();

    // Load Profile Data
    $scope.loadProfile = function() {
      $http.get('http://127.0.0.1:8000/api/profile/' + idUser, {
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(function(response) {
          $scope.user = response.data.data;
        })
        .catch(function(error) {
          console.error('Error loading profile:', error);
          alert('Failed to load profile.');
        });
    };

    // Update Profile
    $scope.updateProfile = function() {
      $http.put('http://127.0.0.1:8000/api/profile/' + idUser, $scope.user, {
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(function(response) {
          alert('Profile updated successfully!');
        })
        .catch(function(error) {
          console.error('Error updating profile:', error);
          console.error(token);
          alert('Failed to update profile.');
        });
    };

    // Initialize
    $scope.loadProfile();
  });