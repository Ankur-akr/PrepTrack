import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie
} from 'recharts';

const ProgressCharts = ({ problems = [] }) => {

  const difficultyData = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    problems.forEach(p => {
      if (p.difficulty === 'Easy') easy++;
      if (p.difficulty === 'Medium') medium++;
      if (p.difficulty === 'Hard') hard++;
    });

    return [
      { name: 'Easy', value: easy, color: 'var(--diff-easy)' },
      { name: 'Medium', value: medium, color: 'var(--diff-medium)' },
      { name: 'Hard', value: hard, color: 'var(--diff-hard)' },
    ].filter(d => d.value > 0); // Only show segments with data
  }, [problems]);

  const topicData = useMemo(() => {
    const counts = {};
    problems.forEach(p => {
      counts[p.topic] = (counts[p.topic] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 topics
  }, [problems]);

  if (problems.length === 0) {
    return (
      <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Add some problems to see your progress charts!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      
      <div className="chart-card glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Difficulty Breakdown</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          {difficultyData.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: d.color }}></div>
              <span style={{ fontSize: '0.875rem' }}>{d.name} ({d.value})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Top Topics</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'var(--bg-tertiary)' }}
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }}
              />
              <Bar dataKey="value" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ProgressCharts;
