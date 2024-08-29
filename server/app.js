import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.json());

// Setup SQLite Database and Migrations
const setupDatabase = async () => {
    const db = await sqlite.open({
        filename: './data_plan.db',
        driver: sqlite3.Database
    });

    await db.migrate({ migrationsPath: './migrations' });

    // Define API Endpoints
    app.get('/api/price_plans', async (req, res) => {
        try {
            const plans = await db.all('SELECT * FROM price_plan');
            res.json(plans);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching price plans' });
        }
    });

    app.post('/api/price_plan/create', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;

        try {
            await db.run('INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)', [name, call_cost, sms_cost]);
            res.json({ message: 'Price plan created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the price plan' });
        }
    });

    app.post('/api/price_plan/update', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;

        try {
            await db.run('UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?', [call_cost, sms_cost, name]);
            res.json({ message: 'Price plan updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the price plan' });
        }
    });

    // Start Express Server
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

// Initialize Database and Server
setupDatabase().catch(err => console.error(err));
