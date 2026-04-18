const { InfluxDB } = require("@influxdata/influxdb-client");

const INFLUX_URL = "http://localhost:8086";
const INFLUX_TOKEN = "movivo";
const INFLUX_ORG = "movivo";
const INFLUX_BUCKET = "movivo";

const client = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
const queryApi = client.getQueryApi(INFLUX_ORG);

const fluxQuery = `
from(bucket: "${INFLUX_BUCKET}")
  |> range(start: -30d)
  |> filter(fn: (r) => r["_measurement"] == "squat_session")
  |> group(columns: ["_field"])
  |> count()
`;

console.log("Querying for fields and counts...");

queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        console.log(`Field: ${o._field}, Count: ${o._value}`);
    },
    error(error) {
        console.error("Error:", error);
    },
    complete() {
        console.log("Query complete.");
    },
});
