import Card from "./Card";

export default function PlaceholderPage({ title, cardTitle, message }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#E8594F] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      <Card title={cardTitle}>
        <p className="text-sm text-[#a09488]">{message}</p>
      </Card>
    </div>
  );
}
