// api.js
export async function getRequest(url) {
  try {
    const response = await fetch(url); // Make the GET request

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse response to JSON
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null or handle the error as needed
  }
}
