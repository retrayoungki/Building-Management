import React, { useState, useEffect } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Submit button state: 'idle', 'loading', 'success'
  const [status, setStatus] = useState('idle');
  
  // Mousemove parallax effect for building image
  const [parallaxStyle, setParallaxStyle] = useState({ transform: 'translate(0px, 0px)' });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      setParallaxStyle({
        transform: `translate(${moveX}px, ${moveY}px)`
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('loading');
    
    // Simulate authentication
    setTimeout(() => {
      setStatus('success');
      
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    }, 1500);
  };

  return (
    <main className="flex h-screen w-full bg-background overflow-hidden">
      {/* Left Side: Login Form */}
      <section className="w-full lg:w-[450px] xl:w-[500px] flex flex-col justify-between p-12 bg-white z-10 shadow-2xl shrink-0">
        {/* Header Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              domain
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">GedungKu</h1>
            <p className="font-label-md text-label-md text-on-surface-variant">Building Management System</p>
          </div>
        </div>

        {/* Login Content */}
        <div className="login-animate-in max-w-sm w-full mx-auto my-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold">Welcome Back</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            Please enter your credentials to access the facility dashboard.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="email">
                Work Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  mail
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface font-body-md"
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="password">
                  Password
                </label>
                <a className="font-label-md text-label-md text-primary hover:underline transition-all" href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface font-body-md"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center justify-center"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Remember this device
              </label>
            </div>

            <button
              className={`w-full py-4 font-headline-md rounded-xl hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white font-semibold ${
                status === 'success'
                  ? 'bg-emerald-600'
                  : 'bg-primary hover:bg-[#001c59]'
              }`}
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'idle' && (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
              {status === 'loading' && (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Authenticating...
                </>
              )}
              {status === 'success' && (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Success! Redirecting...
                </>
              )}
            </button>
          </form>

          {/* SSO Alternative */}
          <div className="mt-8">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-4 text-on-surface-variant font-label-md text-xs uppercase tracking-widest">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            <button
              type="button"
              className="w-full py-3 px-4 border border-outline-variant rounded-lg flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors font-body-md text-on-surface"
              onClick={handleSubmit}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              Enterprise SSO
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <p className="font-label-md text-label-md text-outline">
            © 2024 GedungKu by Professional Systems. All rights reserved.
          </p>
        </footer>
      </section>

      {/* Right Side: Graphic Section */}
      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-[#001c59] items-center justify-center p-12">
        {/* Abstract Building Illustration Overlay */}
        <div className="relative z-10 w-full max-w-2xl" style={parallaxStyle}>
          <div className="float-building">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 glass-panel">
              <div
                className="h-96 w-full relative bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrBQ5Z2431LmTK66xQUT9waw_S3l7NMV87o3LN6AROyjO5Cdi6veF7LtozlnoBOkVDrsUwKXgVCMMOzn9oInw5Tc2b1e0K63wtB0k0Eyu8irLtqIW7XDJw-MXxMPsjF9lm7iOeB9R7-9WcvfopY9NLpm8bgzQEdjLLV4Vi-hfGRiTUMFNPvCQxd1intmrwvKFL2inf_yqTqdyN0l7yT_WjE8oNP4pfW0cm0IXSuJBEEJuLYC2rGTY')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-white font-label-md uppercase tracking-widest text-[10px]">
                      Real-time Monitoring
                    </span>
                  </div>
                  <h3 className="font-display text-display text-white mb-2 text-2xl font-bold">
                    Smart Facility Operations
                  </h3>
                  <p className="text-white/70 font-body-lg text-body-lg text-sm">
                    Integrated solutions for tenant management, maintenance, and building security in one unified platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stats Cards for Decoration */}
          <div className="absolute -top-12 -right-6 glass-panel p-6 rounded-2xl shadow-xl w-48 border-white/10 login-animate-in text-left" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">bolt</span>
              </div>
              <span className="text-white/60 font-label-md text-xs">Energy Savings</span>
            </div>
            <div className="text-white text-2xl font-bold">+24.5%</div>
            <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[70%]"></div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-8 glass-panel p-6 rounded-2xl shadow-xl w-56 border-white/10 login-animate-in text-left" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-[18px]">groups</span>
              </div>
              <span className="text-white/60 font-label-md text-xs">Active Tenants</span>
            </div>
            <div className="text-white text-2xl font-bold">1,280</div>
            <p className="text-white/40 font-label-md mt-1 text-xs">Across 4 locations</p>
          </div>
        </div>

        {/* Geometric Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
      </section>
    </main>
  );
}
