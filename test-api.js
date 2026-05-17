async function check() {
    console.log("Checking API without headers...");
    const PROVIDER_URL = "";
    const PROVIDER_KEY = "";

    const formData = new URLSearchParams();
    formData.append("key", PROVIDER_KEY);
    formData.append("action", "services");

    const response = await fetch(PROVIDER_URL, {
        method: "POST",
        body: formData.toString()
    });

    const responseText = await response.text();
    console.log("Response Text (first 500 chars):", responseText.substring(0, 500));
}

check();
