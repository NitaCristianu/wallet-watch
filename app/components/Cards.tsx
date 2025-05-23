import { CheckCircle } from "lucide-react";

export default function Cards() {
  const Card = [
    {
      title: "ELIMINATE FEAR",
      description: "Make it easier to manage your finances",
    },
    {
      title: "PRACTICAL VISUALIZATIONS",
      description: "You can visualize your goals",
    },
    {
      title: "AI CHAT, CUSTOM IDEAS",
      description: "Make it easier to chat with AI",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-3 py-25">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Card.map((card, index) => (
          <div
            key={index}
            className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-start gap-2 mb-3">
              <CheckCircle className="text-green-500 w-5 h-5" />
              <h3 className="text-base font-semibold text-gray-900">
                {card.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-snug">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
