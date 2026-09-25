async function getManagers() {
    try {
        const response = await fetch("/managers");

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
    getManagers
}