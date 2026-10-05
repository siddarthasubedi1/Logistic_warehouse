import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import OrderingPuzzleExperience from '../../components/trainee/OrderingPuzzleExperience';

export default function TraineeChallengePage() {
  const { programmeId } = useParams();
  const navigate = useNavigate();

  return <DashboardLayout role="trainee" title="Puzzle-Solving Challenge" subtitle="Practise with image puzzles and Prop Lab activities, then compare trainee high scores.">
    <OrderingPuzzleExperience
      key={programmeId}
      programmeId={programmeId}
      onBack={() => navigate(`/my-training/${programmeId}/environment`)}
      onContinue={() => navigate(`/my-training/${programmeId}/environment`)}
    />
  </DashboardLayout>;
}
