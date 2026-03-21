const express = require("express");
const cors = require("cors");
const { InfluxDB } = require("@influxdata/influxdb-client");

const app = express();
app.use(cors()); // Allow React frontend to call this API
app.use(express.json());

// InfluxDB client — reads from env vars set in docker-compose.yml
const client = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
});

const queryApi = client.getQueryApi(process.env.INFLUX_ORG);

// GET /api/data — query the last 1 hour of data from your bucket
app.get("/api/data", async (req, res) => {
    const bucket = process.env.INFLUX_BUCKET;

    // Flux query — adjust measurement/field to match your data
    const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "your_measurement")
      |> filter(fn: (r) => r._field == "your_field")
  `;

    const rows = [];

    try {
        await new Promise((resolve, reject) => {
            queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    const obj = tableMeta.toObject(row);
                    rows.push({ time: obj._time, value: obj._value });
                },
                error: reject,
                complete: resolve,
            });
        });

        res.json(rows);
    } catch (err) {
        console.error("InfluxDB query failed:", err);
        res.status(500).json({ error: "Query failed" });
    }
});

app.listen(4000, () => console.log("Backend running on port 4000"));