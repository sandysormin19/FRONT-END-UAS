// Wait for the DOM to fully load before executing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-meal').addEventListener('click', function() {
        const day = document.getElementById('meal-day').value;
        const mealType = document.getElementById('meal-type').value;
        const mealName = document.getElementById('meal-name').value;

        // Validation to check if meal name is provided
        if (mealName === '') {
            alert('Please enter a meal name');
            return;
        }

        // Create a new meal item
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');
        mealItem.innerText = `${mealType}: ${mealName}`;

        // Append to the selected day's section
        document.getElementById(day).appendChild(mealItem);

        // Clear the input field
        document.getElementById('meal-name').value = '';
    });
});
