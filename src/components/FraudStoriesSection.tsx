import { ShieldAlert, ArrowRight } from "lucide-react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

const FraudStoriesSection = ({ lang }: { lang: Lang }) => {
  const t = translations[lang];

  const fraudStories = [
    {
      id: 1,
      title: t.story1Title,
      description: t.story1Description,
      category: t.story1Category,
    },
    {
      id: 2,
      title: t.story2Title,
      description: t.story2Description,
      category: t.story2Category,
    },
    {
      id: 3,
      title: t.story3Title,
      description: t.story3Description,
      category: t.story3Category,
    },
  ];

  return (
    <section className="pt-6 pb-10 px-6 bg-blue-50/40">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="flex justify-center mb-2">
          {/* Soft blue icon */}
          <div className="bg-blue-100 p-3 rounded-full">
            <ShieldAlert className="text-blue-600" size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-foreground">{t.fraudStoriesTitle}</h2>

        <p className="text-sm text-muted-foreground">{t.fraudStoriesSubtitle}</p>
      </div>

      {/* Stories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {fraudStories.map((story) => (
          <div
            key={story.id}
            className="bg-card rounded-xl border border-border p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Soft Blue Badge */}
            <span className="inline-block text-xs font-medium bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mb-2">
              {story.category}
            </span>

            <h3 className="text-base font-semibold mb-1">
              {story.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-3 leading-snug">
              {story.description}
            </p>

            <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              {t.readMore} <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FraudStoriesSection;