import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

const InsightsCard = ({ problems = [] }) => {
  const generateInsights = () => {
    if (problems.length === 0) {
      return [{
        id: 0, type: 'suggestion', icon: Lightbulb, color: 'var(--info)',
        text: 'Add some problems to get personalized insights!'
      }];
    }

    const insights = [];
    let id = 1;

    // Check revision
    const needsRevision = problems.filter(p => p.status === 'Revision');
    if (needsRevision.length > 0) {
      insights.push({
        id: id++, type: 'warning', icon: AlertTriangle, color: 'var(--danger)',
        text: `You have ${needsRevision.length} problems marked for revision.`
      });
    }

    // Check difficulty distribution
    const total = problems.length;
    const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
    if (easyCount / total > 0.7) {
      insights.push({
        id: id++, type: 'suggestion', icon: TrendingUp, color: 'var(--info)',
        text: 'You are solving mostly Easy problems. Try attempting more Mediums to challenge yourself.'
      });
    } else if (easyCount / total < 0.2 && total > 5) {
       insights.push({
        id: id++, type: 'positive', icon: Lightbulb, color: 'var(--success)',
        text: 'Great job pushing yourself with harder problems!'
      });
    }

    // Strongest Topic
    const counts = {};
    problems.forEach(p => { counts[p.topic] = (counts[p.topic] || 0) + 1; });
    const sortedTopics = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sortedTopics.length > 0 && sortedTopics[0][1] >= 2) {
      insights.push({
        id: id++, type: 'positive', icon: Lightbulb, color: 'var(--success)',
        text: `Your strongest topic is ${sortedTopics[0][0]}. Keep it up!`
      });
    }

    return insights.slice(0, 3); // Max 3 insights
  };

  const insights = generateInsights();

  return (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Lightbulb className="text-accent" /> Smart Insights
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {insights.map(insight => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div style={{ color: insight.color, marginTop: '0.125rem' }}>
                <Icon size={20} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {insight.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsCard;
