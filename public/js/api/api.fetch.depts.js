
async function getDepts() {
    try {
        const response = await fetch("/api/depts");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
};

export {
    getDepts
}