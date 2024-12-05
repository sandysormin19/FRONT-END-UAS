function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to meters
    const resultDiv = document.getElementById('result');

    if (weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        let category;
        let tips;

        if (bmi < 18.5) {
            category = "Underweight";
            tips = "It's important to focus on a balanced diet with more nutrient-dense foods. Consider consulting a healthcare professional for personalized advice.";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = "Normal weight";
            tips = "Great job! Maintain a balanced diet and regular exercise to keep your weight in check.";
        } else if (bmi >= 25 && bmi < 29.9) {
            category = "Overweight";
            tips = "Consider incorporating more physical activity into your routine and opt for healthier food choices to help manage your weight.";
        } else {
            category = "Obesity";
            tips = "It's advisable to seek guidance from a healthcare professional. Focus on gradual changes to your diet and exercise routine.";
        }

        resultDiv.innerHTML = `<h2>Your BMI is <strong>${bmi}</strong>.</h2>
                               <p>Category: <strong>${category}</strong></p>
                               <p>${tips}</p>`;
    } else {
        resultDiv.innerHTML = "<p>Please enter valid weight and height.</p>";
    }
}

function calculateCaloricIntake() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const activityLevel = parseFloat(document.getElementById('activity-level').value);
    const goal = document.getElementById('goal').value;

    if (weight > 0 && height > 0 && age > 0) {
        let bmr;

        // Calculate BMR based on gender
        if (gender === "male") {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Adjust BMR based on activity level
        const tdee = bmr * activityLevel; // Total Daily Energy Expenditure (TDEE)
        let caloricIntake;

        // Calculate caloric intake based on goal
        if (goal === "lose") {
            caloricIntake = tdee - 500; // 500 calories deficit for weight loss
        } else if (goal === "maintain") {
            caloricIntake = tdee; // Maintain weight
        } else if (goal === "gain") {
            caloricIntake = tdee + 500; // 500 calories surplus for weight gain
        }

        const resultDiv = document.getElementById('caloric-result');
        resultDiv.innerHTML = `<h2>Your daily caloric intake to ${goal} weight is <strong>${Math.round(caloricIntake)}</strong> calories.</h2>`;
    } else {
        alert("Please enter valid weight, height, age, and select gender.");
    }
}
