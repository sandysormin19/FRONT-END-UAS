var app = angular.module('evoltActiveApp', []);

app.controller('DashboardController', function ($scope, $window, $http) {
  $scope.isAuthenticated = false;
  $scope.newProduct = {};
  $scope.products = [];
  $scope.searchQuery = ''; // Query untuk pencarian
  $scope.searchBy = 'name'; // Default pencarian berdasarkan nama
  $scope.sortKey = 'name'; // Default pengurutan berdasarkan 'name'
  $scope.sortReverse = false; // Urutan default adalah ascending
  

  const token = localStorage.getItem('token');

  // Load Saved Name
  $scope.getName = function () {
    $scope.savedName = $window.localStorage.getItem('name');
  };
  $scope.getName();

  // Verify Token
  if (token) {
    $http
      .get('http://localhost:8000/api/protected', {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((response) => {
        $scope.isAuthenticated = true;
      })
      .catch((error) => {
        $scope.isAuthenticated = false;
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Session expired. Please log in again.',
          });
          localStorage.removeItem('token');
          window.location.replace('login.html');
        }
      });
  } else {
    window.location.replace('login.html');
  }

  // Logout
  $scope.logout = function () {
    localStorage.removeItem('token');
    window.location.replace('login.html');
  };

  // Fetch Products
  $scope.getProducts = function () {
    $http
      .get('http://127.0.0.1:8000/api/products', {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then(function (response) {
        $scope.products = response.data; // Assume data is an array
      })
      .catch(function (error) {
        console.error('Error fetching products:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch products.',
        });
      });
  };

  // Call getProducts on load
  $scope.getProducts();

  // Add Product Function
  $scope.addProduct = function () {
    if (
      !$scope.newProduct.name ||
      !$scope.newProduct.description ||
      !$scope.newProduct.category ||
      !$scope.newProduct.price ||
      !$scope.newProduct.stock
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all fields.',
      });
      return;
    }

    $http({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/products',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      data: $scope.newProduct,
    })
      .then(function (response) {
        Swal.fire({
          title: 'Good job!',
          text: response.data.message,
          icon: 'success',
        });
        $scope.products.push(response.data.data);
        $scope.newProduct = {};
        const addProductModal = document.getElementById('addProductModal');
        const modalInstance = bootstrap.Modal.getInstance(addProductModal);
        modalInstance.hide();
      })
      .catch(function (error) {
        console.error('Error adding product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to add product. Please try again.',
        });
      });
  };

  // Edit Product
  $scope.editProduct = function (product) {
    $scope.editedProduct = angular.copy(product);
    const editProductModal = new bootstrap.Modal(
      document.getElementById('editProductModal')
    );
    editProductModal.show();
  };

  // Update Product Function
  $scope.updateProduct = function () {
    if (
      !$scope.editedProduct.name ||
      !$scope.editedProduct.category ||
      !$scope.editedProduct.price ||
      !$scope.editedProduct.stock
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all fields.',
      });
      return;
    }

    $http({
      method: 'PUT',
      url: `http://127.0.0.1:8000/api/products/${$scope.editedProduct.id}`,
      data: $scope.editedProduct,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(function (response) {
        Swal.fire({
          title: 'Updated!',
          text: response.data.message,
          icon: 'success',
        });
        const index = $scope.products.findIndex(
          (product) => product.id === $scope.editedProduct.id
        );
        if (index !== -1) {
          $scope.products[index] = response.data.data;
        }
        const editProductModal = document.getElementById('editProductModal');
        const modalInstance = bootstrap.Modal.getInstance(editProductModal);
        modalInstance.hide();
      })
      .catch(function (error) {
        console.error('Error updating product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update product. Please try again.',
        });
      });
  };

  // Delete Product Function
  $scope.deleteProduct = function (productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    $http({
      method: 'DELETE',
      url: `http://127.0.0.1:8000/api/products/${productId}`,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(function (response) {
        Swal.fire({
          title: 'Deleted!',
          text: response.data.message,
          icon: 'success',
        });
        $scope.products = $scope.products.filter(
          (product) => product.id !== productId
        );
      })
      .catch(function (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete product. Please try again.',
        });
      });
  };

  $scope.setSortKey = function (key) {
    if ($scope.sortKey === key) {
      $scope.sortReverse = !$scope.sortReverse; // Toggle arah pengurutan
    } else {
      $scope.sortKey = key; // Set kunci pengurutan baru
      $scope.sortReverse = false; // Default ke ascending
    }
  };
  
  $scope.dynamicFilter = function () {
    return function (product) {
      if (!$scope.searchQuery || $scope.searchQuery.trim() === '') {
        return true; // Tampilkan semua jika input kosong
      }
      const query = $scope.searchQuery.toLowerCase();
      if ($scope.searchBy === 'name') {
        return product.name.toLowerCase().includes(query);
      } else if ($scope.searchBy === 'category') {
        return product.category.toLowerCase().includes(query);
      } else if ($scope.searchBy === 'description') {
        return product.description.toLowerCase().includes(query);
      }
      return false;
    };
  };
  

  

});
