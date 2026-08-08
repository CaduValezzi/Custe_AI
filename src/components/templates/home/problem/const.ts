export interface Problem {
  icon: string;
  titleKey: string;
  contentKey: string;
}

export const problems: Problem[] = [
  { icon: "📂", titleKey: "landing.problem.card1.title", contentKey: "landing.problem.card1.content" },
  { icon: "🚨", titleKey: "landing.problem.card2.title", contentKey: "landing.problem.card2.content" },
  { icon: "📈", titleKey: "landing.problem.card3.title", contentKey: "landing.problem.card3.content" },
  { icon: "🔀", titleKey: "landing.problem.card4.title", contentKey: "landing.problem.card4.content" },
  { icon: "📊", titleKey: "landing.problem.card5.title", contentKey: "landing.problem.card5.content" },
];