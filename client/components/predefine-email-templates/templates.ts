import { BuilderComponent } from "@/types/builder";

export const onlineMarketingConferenceLayout: BuilderComponent[] = [
  {
    id: "hero-section-1",
    type: "hero",
    props: {
      title: "Online Marketing Conference",
      subtitle: "26 - 28 Nov, 2021",
      description: "Learn more about internet marketing in london",
      ctaText: "Register Now",
      background: "gradient-teal-orange",
    },
    height: 600,
  },
  {
    id: "section-1",
    type: "section",
    props: {
      backgroundColor: "#ffffff",
      padding: 64,
    },
    children: [
      {
        id: "row-1",
        type: "row",
        props: {},
        children: [
          {
            id: "col-1",
            type: "column",
            width: 6,
            props: {},
            children: [
              {
                id: "heading-1",
                type: "heading",
                props: {
                  text: "Get a fresh perspective",
                  level: 2,
                  fontSize: 36,
                  fontWeight: "bold",
                },
              },
              {
                id: "paragraph-1",
                type: "paragraph",
                props: {
                  text: "Listen to over 10 speakers that have made it in the digital world of marketing, around over 50 scheduled workshops and a lot more at the conference. Get real insights and inspiration you need to take your marketing to the next level.",
                  fontSize: 16,
                  lineHeight: 1.6,
                },
              },
            ],
          },
          {
            id: "col-2",
            type: "column",
            width: 6,
            props: {},
            children: [
              {
                id: "image-1",
                type: "image",
                props: {
                  src: "https://via.placeholder.com/300x300?text=Speaker",
                  alt: "Speaker Image",
                },
                height: 300,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "section-2",
    type: "section",
    props: {
      backgroundColor: "#f9fafb",
      padding: 64,
    },
    children: [
      {
        id: "row-2",
        type: "row",
        props: {},
        children: [
          {
            id: "col-3",
            type: "column",
            width: 4,
            props: {},
            children: [
              {
                id: "card-1",
                type: "card",
                props: {
                  title: "Inborn Street San Francisco",
                  description:
                    "You are organized in a way that is and needs to go beyond the day one's official theme of the same time.",
                },
                height: 250,
              },
            ],
          },
          {
            id: "col-4",
            type: "column",
            width: 4,
            props: {},
            children: [
              {
                id: "card-2",
                type: "card",
                props: {
                  title: "Virtual only stays - Be there!",
                  description:
                    "Suit your own gathering in shore shores worth during the there is no world of online marketing.",
                },
                height: 250,
              },
            ],
          },
          {
            id: "col-5",
            type: "column",
            width: 4,
            props: {},
            children: [
              {
                id: "card-3",
                type: "card",
                props: {
                  title: "The beginners workshop - Learn more!",
                  description:
                    "Suited to people who are going to shore down worth during the world of online marketing.",
                },
                height: 250,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cta-section-1",
    type: "cta",
    props: {
      title: "Register for the Conference 2021",
      description:
        "Register with your details and you'll be registered for the world's leading digital marketing event.",
      ctaText: "Register Now",
      background: "gradient-teal-cyan",
    },
    height: 400,
  },
];

export const templateLayoutMap: Record<string, BuilderComponent[]> = {
  "online-marketing-conference": onlineMarketingConferenceLayout,
};
