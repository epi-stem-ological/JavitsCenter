import { ComingNext } from "@/components/ui/ComingNext";

export default function SurveysPage() {
  return (
    <ComingNext
      screen="Survey Center"
      description="Short pulse + event-specific surveys with rewards. Tracks participation to inform featured-placement ROI."
      nextPrompt={`Build /surveys: list from seed.surveys showing estMinutes + rewardLabel. Clicking opens a survey player that renders each question by type (rating/single-choice/multi-choice/text). On completion, call useApp.completeSurvey(id), write a SurveyResponse, unlock the Reward, and analytics.track('survey_completed',{id}).`}
    />
  );
}
