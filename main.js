document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#currency-converter").addEventListener("submit", async (event) => {
        event.preventDefault();
        const { from, to, amount } = event.target.elements;
        const fromError = document.getElementById('from-error');
        const toError = document.getElementById('to-error');
        let valid = true;

        // Clear previous errors
        fromError.textContent = '';
        toError.textContent = '';

        // Simple validation for currency codes
        if (!/^[A-Z]{3}$/.test(from.value)) {
            fromError.textContent = 'Invalid currency code. Use 3 uppercase letters.';
            valid = false;
        }

        if (!/^[A-Z]{3}$/.test(to.value)) {
            toError.textContent = 'Invalid currency code. Use 3 uppercase letters.';
            valid = false;
        }

        if (!valid) return;

        // Check API Key
        const apiKey = import.meta.env.VITE_API_KEY;
        if (!apiKey) {
            console.error("API Key is not defined.");
            document.querySelector(".result").textContent = 'Error: API Key is not defined.';
            document.querySelector(".result").classList.add('show');
            return;
        }

        let headers = new Headers();
        headers.append("apikey", apiKey);

        const requestOptions = {
            method: "GET",
            headers,
        };

        try {
            // Fetch conversion rate
            let response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${amount.value}`, requestOptions);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            let { info, date, query: { to: convertedTo }, result } = data;

            // Display the result
            document.querySelector(".result").textContent = `As per exchange rate: ${info.rate.toFixed(2)} for ${date} => converted value in ${convertedTo} is ${result.toFixed(2)}`;
            document.querySelector(".result").classList.add('show');
        } catch (error) {
            console.error(error);  // Log error details for debugging
            document.querySelector(".result").textContent = 'Error: Unable to fetch conversion rate.';
            document.querySelector(".result").classList.add('show');
        }
    });
});
