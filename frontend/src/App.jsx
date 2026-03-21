import { useEffect, useState } from "react";

export default function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Calls your Express backend, NOT InfluxDB directly
        fetch("http://localhost:4000/api/data")
            .then((res) => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then((rows) => {
                setData(rows);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>InfluxDB Data</h1>
            <table border="1" cellPadding="8">
                <thead>
                    <tr><th>Time</th><th>Value</th></tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="2" style={{ textAlign: "center" }}>No data available in InfluxDB</td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr key={i}>
                                <td>{new Date(row.time).toLocaleString()}</td>
                                <td>{row.value}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}