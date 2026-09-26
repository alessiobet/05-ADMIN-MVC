admin-managers.js           =>  calls the fetch function with payload
api.fetch.managers.js       =>  calls the API route. The payload is passed in the body
managers.routes.js          =>  calling the route handler in controllers.
                                The payload is passed automatically by Express that pass (req, res) to the controller
managers.controllers.js     =>  do the business logic calling a function in models 
                                and passing the body. The function will call the sql
managers.model.js           =>  destracture the body and calls the sql

---

## MVC Flow — Quick Reference

```text
USER CLICKS "MODIFY"
        │
        ▼
admin-managers.js
Creates payload and calls fetch function
        │
        ▼
api.fetch.managers.js
PUT /api/managers/15
Sends payload as JSON
        │
        ▼
managers.routes.js
Matches the URL and calls controller
        │
        ▼
managers.controllers.js
Reads req.params + req.body
Calls the model
        │
        ▼
managers.model.js
Runs SQL UPDATE
        │
        ▼
SQL SERVER
Updates database
        │
        ▼
Model → Controller → Fetch → Page
```

### 1. `admin-managers.js` — Page logic

Collect the information from the page and create the payload.

```javascript
const id = selectedRow.dataset.idMng;

const payload = {
    deptId: dept,
    mng: managerName,
    isActive: isActive
};

const result = await modifyManager(id, payload);

alert(result.message);
```

**Job:** Handle the page/UI and call the fetch function.

---

### 2. `api.fetch.managers.js` — HTTP request

Send the data to the server.

```javascript
export async function modifyManager(id, payload) {

    const response = await fetch(`/api/managers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    return await response.json();
}
```

The request looks approximately like:

```text
PUT /api/managers/15

BODY:
{
    "deptId": 2,
    "mng": "Mario",
    "isActive": true
}
```

**Job:** Communication between browser and server.

---

### 3. `managers.routes.js` — Route

Decide which controller handles the request.

```javascript
router.put(
    "/api/managers/:id",
    managersController.handleModifyManagers
);
```

Express sees:

```text
/api/managers/15
              ↑
             :id
```

and automatically calls:

```javascript
handleModifyManagers(req, res);
```

**Job:** Connect an HTTP method + URL to a controller.

---

### 4. `managers.controllers.js` — Controller

Read the request and decide what needs to happen.

```javascript
const handleModifyManagers = async (req, res) => {

    try {

        const id = req.params.id;
        const body = req.body;

        const manager = await managersModel.modify(id, body);

        res.status(200).json({
            ok: true,
            message: "Manager updated successfully",
            manager
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: error.message
        });

    }
};
```

Here:

```javascript
req.params.id
// "15"

req.body
// {
//    deptId: 2,
//    mng: "Mario",
//    isActive: true
// }
```

**Job:** Handle the request, business/application logic, call the model, and create the response.

---

### 5. `managers.model.js` — Model

Work with the database.

```javascript
const modify = async (id, payload) => {

    const { deptId, mng, isActive } = payload;

    const pool = await getPool();

    const result = await pool.request()
        .input("id", sql.Int, Number(id))
        .input("deptId", sql.Int, Number(deptId))
        .input("mng", sql.NVarChar, mng.trim().toUpperCase())
        .input("isActive", sql.Bit, isActive)
        .query(`
            UPDATE Booking.managersT

            SET
                deptId = @deptId,
                mng = @mng,
                isActive = @isActive

            OUTPUT
                inserted.idMng,
                inserted.deptId,
                inserted.mng,
                inserted.isActive

            WHERE idMng = @id
        `);

    return result.recordset[0];
};
```

**Job:** Database access and SQL.

---

## The most important part to remember

```text
BROWSER
────────────────────────────────────────────

admin-managers.js
      │
      │ calls
      ▼
api.fetch.managers.js
      │
      │ HTTP PUT
      ▼

SERVER
────────────────────────────────────────────

managers.routes.js
      │
      │ calls
      ▼
managers.controllers.js
      │
      │ calls
      ▼
managers.model.js
      │
      │ SQL
      ▼
SQL SERVER
```

And the response travels **back in the opposite direction**:

```text
SQL Server
    │
    ▼
Model
    │ return manager
    ▼
Controller
    │ res.json(...)
    ▼
Fetch function
    │ return data
    ▼
admin-managers.js
    │
    ▼
Update UI / alert / reload table
```

So a very short memory aid is:

> **Page → Fetch → Route → Controller → Model → Database**  
> **Database → Model → Controller → Fetch → Page**

One small clarification to your description: the **controller normally handles the business/application logic**, while the **model's main responsibility is database access**.