var app = angular.module('evoltActiveApp', []);

app.controller('DashboardController', function($scope, $window, $http) {
  $scope.isAuthenticated = false;
  $scope.newProduct = {};
  $scope.products = [];

  const token = localStorage.getItem('token');

  // Load Saved Name
  $scope.getName = function() {
    $scope.savedName = $window.localStorage.getItem('name');
  };
  $scope.getName();

  // Verify Token
  if (token) {
    $http.get('http://localhost:8000/api/protected', {
      headers: { Authorization: 'Bearer ' + token }
    }).then((response) => {
      $scope.isAuthenticated = true;
    }).catch((error) => {
      $scope.isAuthenticated = false;
      if (error.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Session expired. Please log in again.",
        });
        localStorage.removeItem('token');
        window.location.replace('login.html');
      }
    });
  } else {
    window.location.replace('login.html');
  }

  // Logout
  $scope.logout = function() {
    localStorage.removeItem('token');
    window.location.replace('login.html');
  };

  // Fetch Products
  $scope.getProducts = function () {
    $http.get('http://127.0.0.1:8000/api/products', {
      headers: { Authorization: 'Bearer ' + token}
    })
      .then(function (response) {
        $scope.products = response.data; // Asumsikan data langsung berupa array
      })
      .catch(function (error) {
        console.error('Error fetching products:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch products.",
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
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields.",
      });
      return;
    }

    // Assuming the token is stored in a variable or can be retrieved from localStorage
    const token = localStorage.getItem('token') || ''; // Replace with your token retrieval logic

    $http({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/products',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      data: $scope.newProduct
    })
      .then(function (response) {
        Swal.fire({
          title: "Good job!",
          text: response.data.message,
          icon: "success"
        });
        $scope.products.push(response.data.data); // Add to products list
        $scope.newProduct = {}; // Reset form
        // Hide modal
        const addProductModal = document.getElementById('addProductModal');
        const modalInstance = bootstrap.Modal.getInstance(addProductModal);
        modalInstance.hide();
      })
      .catch(function (error) {
        console.error('Error adding product:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add product. Please try again.",
        });
      });
  };

  // Edit Product (dummy implementation)
  // Open Edit Modal and Load Product Data
  $scope.editProduct = function (product) {
    $scope.editedProduct = angular.copy(product); // Load the selected product into a scoped variable
    const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editProductModal.show(); // Show the modal
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
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields.",
      });
      return;
    }

    const token = localStorage.getItem('token') || '';

    $http({
      method: 'PUT',
      url: `http://127.0.0.1:8000/api/products/${$scope.editedProduct.id}`,
      data: $scope.editedProduct,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(function (response) {
        alert(response.data.message); // Notify success

        // Update the product in the list
        const index = $scope.products.findIndex(product => product.id === $scope.editedProduct.id);
        if (index !== -1) {
          $scope.products[index] = response.data.data; // Update with the new data
        }

        // Hide the modal
        const editProductModal = document.getElementById('editProductModal');
        const modalInstance = bootstrap.Modal.getInstance(editProductModal);
        modalInstance.hide();
      })
      .catch(function (error) {
        console.error('Error updating product:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update product. Please try again.",
        });
      });
  };

  // Delete Product Function
  $scope.deleteProduct = function (productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return; // Cancel deletion
    }

    const token = localStorage.getItem('token') || '';

    $http({
      method: 'DELETE',
      url: `http://127.0.0.1:8000/api/products/${productId}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(function (response) {
        console.log('Delete Response:', response.data);
        Swal.fire({
          title: "Good job!",
          text: response.data.message,
          icon: "success"
        });

        // Remove the deleted product from the table
        $scope.products = $scope.products.filter(product => product.id !== productId);
      })
      .catch(function (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to delete product. Please try again.",
        });
      });
  };
});