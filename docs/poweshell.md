mkdir controllers, models, routes, services, middleware, config, public, views, docs
mkdir public\js, public\js\api, public\css, public\images
ni server.js, .env, .gitignore -ItemType File

npm -init -y   
npm install express express-session dotenv mssql bcrypt ejs  
npm install --save-dev nodemon

Put this inside .gitignore:
node_modules/
.env
docs/powershell.md

Change your scripts to:
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}

==============================================================================
**make SQL Server listen on TCP/IP** so your Node.js app can connect using `DB_SERVER=127.0.0.1`, you need to enable TCP/IP in SQL Server.

### 1. Open SQL Server Configuration Manager
SQL Server Configuration Manager
└── SQL Server Network Configuration
    └── Protocols for SQLEXPRESS

### 2. Enable TCP/IP
Right-click **TCP/IP** → **Enable**.

### 3. Configure the TCP port
Right-click **TCP/IP** → **Properties** → **IP Addresses**.
Scroll all the way down to:  IPAll
I recommend using a fixed port for your Node application:
IPAll
├── TCP Dynamic Ports:  [leave empty]
└── TCP Port:           1433

### 4. Restart SQL Server
SQL Server Configuration Manager
└── SQL Server Services

Find:
SQL Server (SQLEXPRESS)
Right-click → **Restart**.

### 5. Check whether SQL Server is listening
Open PowerShell:
netstat -ano | findstr :1433
You should see something similar to:
TCP    0.0.0.0:1433       0.0.0.0:0       LISTENING
TCP    [::]:1433          [::]:0          LISTENING

If you only care about your Node application running on the **same computer**, you can also test:
Test-NetConnection 127.0.0.1 -Port 1433
You want:   TcpTestSucceeded : True

### 6. Your `.env`
Then this is fine:

#### PORTA UTILIZZATA
PORT=...

#### PARAMETRI DATABASE
DB_USER=...
DB_PASSWORD=""
DB_SERVER=127.0.0.1
DB_PORT=1433
DB_NAME=...
DB_ENCRYPT=true
DB_TRUST_CERT=true

#### PARAMETRI SESSION E COOKIES
SESSION_SECRET=...

#### false => HTTP
SECURE_SESSION=false
TRUST_PROXY=false

#### true => HTTPS 
#### SECURE_SESSION=true
#### TRUST_PROXY=true
==============================================================================

#### DB CONFIG
const config = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: process.env.DB_TRUST_CERT === "true"
    }
};
==============================================================================