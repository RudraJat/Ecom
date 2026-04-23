const StoryPage = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '24px', lineHeight: '1.1' }}>Our Story</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '60px' }}>
          Born from a desire to elevate the everyday. We believe that the objects you surround yourself with should inspire and endure.
        </p>
        
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
          alt="Studio" 
          style={{ width: '100%', borderRadius: '24px', marginBottom: '60px' }} 
        />
        
        <div style={{ display: 'grid', gap: '40px', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p>
            At AURA., we are obsessed with the intersection of minimalist design and uncompromising quality. Founded in a small studio, our mission has always been simple: to create premium essentials that seamlessly integrate into modern living.
          </p>
          <p>
            We source only the highest quality materials, partnering with artisans and engineers who share our vision. Every curve, every texture, and every function is meticulously considered.
          </p>
          <p>
            We don't just make products; we craft experiences. Welcome to the world of AURA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
