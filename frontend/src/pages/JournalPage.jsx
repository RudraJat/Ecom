const JournalPage = () => {
  const articles = [
    {
      id: 1,
      title: 'The Art of Minimalist Living',
      excerpt: 'How decluttering your physical space can lead to profound mental clarity and elevated productivity.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      date: 'April 12, 2026'
    },
    {
      id: 2,
      title: 'Designing the Perfect Workspace',
      excerpt: 'A curated guide to building an environment that inspires creativity and deep work.',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
      date: 'March 28, 2026'
    },
    {
      id: 3,
      title: 'Behind the Design: The Nova Keyboard',
      excerpt: 'An exclusive look into the engineering and materials that make our flagship keyboard so special.',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
      date: 'February 15, 2026'
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '24px', lineHeight: '1.1' }}>The Journal</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '80px', maxWidth: '600px' }}>
        Thoughts, guides, and inspiration for modern living.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        {articles.map(article => (
          <div key={article.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img 
                src={article.image} 
                alt={article.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{article.date}</span>
              <h3 style={{ fontSize: '1.5rem', margin: '8px 0', cursor: 'pointer' }}>{article.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{article.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
