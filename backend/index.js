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
// GET /api/history/:patientName — query unique squat sessions for a specific patient
app.get("/api/history/:patientName", async (req, res) => {
    const { patientName } = req.params;
    const bucket = process.env.INFLUX_BUCKET;

    // Flux query:
    // 1. Filter by patient_name tag
    // 2. Group by session_id to isolate unique sessions
    // 3. Take the 'last' point of each session (contains final stats and video filename)
    // 4. Pivot fields into columns for easier consumption
    const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -30d) 
      |> filter(fn: (r) => r["_measurement"] == "squat_session")
      |> filter(fn: (r) => r["patient_name"] == "${patientName}")
      |> filter(fn: (r) => r["_field"] == "squat_count" or r["_field"] == "max_angle" or r["_field"] == "video_url")
      |> group(columns: ["session_id", "_field"])
      |> last()
      |> map(fn: (r) => ({ r with _value: string(v: r["_value"]) }))
      |> group(columns: ["session_id"])
      |> pivot(rowKey:["session_id", "_time"], columnKey: ["_field"], valueColumn: "_value")
      |> group()
      |> sort(columns: ["_time"], desc: true)
    `;

    const sessions = [];

    try {
        await new Promise((resolve, reject) => {
            queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    sessions.push(tableMeta.toObject(row));
                },
                error: reject,
                complete: resolve,
            });
        });

        // Add mock FMS score to each session for the frontend
        const enrichedSessions = sessions.map(session => ({
            ...session,
            fms_score: Math.floor(Math.random() * 3) + 1 // Mock score 1-3
        }));

        res.json(enrichedSessions);
    } catch (err) {
        console.error("History query failed:", err);
        res.status(500).json({ error: "Failed to fetch patient history" });
    }
});

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