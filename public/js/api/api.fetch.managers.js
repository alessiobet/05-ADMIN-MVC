async function getManagers() {
    try {
        const response = await fetch("/api/managers");
        if (!response.ok) { throw new Error(`HTTP error: ${response.status}`); }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
};

// ADD NEW MANAGER --- POST 
async function addNewManager(payload) {
    try {
        const response = await fetch("/api/managers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!response.ok) { throw new Error(`HTTP error: ${response.status}`); }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to add manager:", error);
        throw error;
    }
};

// ADD NEW MANAGER --- POST 
async function modifyManager(id, payload) {
    try {
        const response = await fetch(`/api/managers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!response.ok) { throw new Error(`HTTP error: ${response.status}`); }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to update manager:", error);
        throw error;
    }
};


export {
    getManagers,
    addNewManager,
    modifyManager
}


