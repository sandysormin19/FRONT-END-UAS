app.controller('DashboardController', function($scope, $http) {
    $scope.products = [];
    $scope.newProduct = {};

    // Fetch products
    function loadProducts() {
        $http.get('http://localhost:8000/api/products').then(function(response) {
            $scope.products = response.data;
        });
    }
    loadProducts();

    // Add product
    $scope.addProduct = function() {
        $http.post('http://localhost:8000/api/products', $scope.newProduct).then(function(response) {
            alert(response.data);
            $scope.newProduct = {};
            loadProducts();
        });
    };

    // Edit product
    $scope.editProduct = function(product) {
        const updatedProduct = prompt('Edit Product', JSON.stringify(product));
        if (updatedProduct) {
            const parsedProduct = JSON.parse(updatedProduct);
            $http.put(`http://localhost:8000/api/products/${product.id}`, parsedProduct).then(function(response) {
                alert(response.data);
                loadProducts();
            });
        }
    };

    // Delete product
    $scope.deleteProduct = function(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            $http.delete(`http://localhost:8000/api/products/${id}`).then(function(response) {
                alert(response.data);
                loadProducts();
            });
        }
    };
});
