/* ========================================================================== */
/* FILE: src/pages/LandingPage.js (FINAL & COMPLETE VERSION)                  */
/* This is the final, professionally designed marketing page in React/JSX.    */
/* ========================================================================== */
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Eye, TrendingUp, Cpu } from 'lucide-react';

const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-indigo-500/10 p-2 rounded-full">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{children}</p>
    </div>
);

const TestimonialCard = ({ quote, name, title, avatar }) => (
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-8 h-full flex flex-col">
        <div className="flex-grow">
            <p className="text-gray-300 italic">"{quote}"</p>
        </div>
        <div className="flex items-center mt-6 pt-6 border-t border-gray-700">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4"/>
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-gray-400 text-sm">{title}</p>
            </div>
        </div>
    </div>
);

const PricingTier = ({ plan, price, description, features, isFeatured = false }) => (
    <div className={`bg-gray-800/50 backdrop-blur-md border rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300 relative ${isFeatured ? 'border-primary shadow-2xl shadow-primary/20' : 'border-gray-700'}`}>
        {isFeatured && <div className="absolute top-0 right-8 -mt-4 bg-primary text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</div>}
        <h3 className="text-2xl font-bold text-white">{plan}</h3>
        <p className="mt-4 text-4xl font-extrabold text-white">{price}<span className="text-base font-medium text-gray-400">/mo</span></p>
        <p className="mt-4 text-gray-400 h-12">{description}</p>
        <Link to="/auth" className={`mt-8 block w-full text-center rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300 ${isFeatured ? 'bg-primary text-white hover:bg-indigo-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
            Get Started
        </Link>
        <ul className="mt-8 space-y-4 text-gray-400">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
    </div>
);


export default function LandingPage() {
    const imageContainerRef = useRef(null);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add('landing-page-body');

        const canvas = document.getElementById('hero-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = '#4a5568';
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;

                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        this.x -= dx / 20;
                        this.y -= dy / 20;
                    }
                }
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            setCanvasSize();
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        let animationFrameId;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                                   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(100, 116, 139, ${opacityValue})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        const handleMouseMove = (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };
        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };
        
        const handleScroll = () => {
            if (imageContainerRef.current) {
                const scrollY = window.scrollY;
                const rotation = Math.max(0, 20 - (scrollY / 30));
                const translateY = Math.min(100, scrollY / 5);
                imageContainerRef.current.style.transform = `perspective(1200px) rotateX(${rotation}deg) translateY(-${translateY}px)`;
            }
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const elementsToAnimate = document.querySelectorAll('.scroll-animate');

        init();
        animate();
        elementsToAnimate.forEach(el => scrollObserver.observe(el));
        window.addEventListener('resize', init);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('scroll', handleScroll);

        return () => {
             body.classList.remove('landing-page-body');
             window.removeEventListener('resize', init);
             window.removeEventListener('mousemove', handleMouseMove);
             window.removeEventListener('mouseout', handleMouseOut);
             window.removeEventListener('scroll', handleScroll);
             cancelAnimationFrame(animationFrameId);
             elementsToAnimate.forEach(el => scrollObserver.unobserve(el));
        }
    }, []);

    return (
        <div className="text-white font-sans overflow-x-hidden">
            <canvas id="hero-background" className="absolute top-0 left-0 w-full h-full z-0 opacity-20"></canvas>

            <header className="fixed top-0 left-0 right-0 z-20 p-4 bg-transparent">
                 <div className="container mx-auto flex justify-between items-center px-4">
                     <div className="flex items-center gap-3">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#6366F1" /><path d="M16 6L26 16L16 26L6 16L16 6Z" fill="white" /></svg>
                        <h1 className="text-xl font-bold text-white">Pulse</h1>
                    </div>
                     <Link to="/auth" className="font-semibold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm">Sign In</Link>
                 </div>
            </header>

            <main className="relative z-10">
                <section className="relative min-h-screen flex items-center justify-center text-center pt-20 pb-20 px-4">
                    <div className="relative z-10">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white">
                            The unfair advantage<br/>your business needs.
                        </h1>
                         <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
                            Pulse gives you the complete competitive picture. Stop guessing, start winning, and leave your rivals wondering what happened.
                        </p>
                        <Link to="/auth" className="mt-8 inline-block bg-indigo-600 text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-indigo-500 transition-transform hover:scale-105 duration-300 shadow-2xl shadow-indigo-600/30">
                            Get Started - It's Free
                        </Link>
                         <p className="mt-4 text-sm text-gray-500">No credit card required.</p>
                    </div>
                </section>

                <section className="pb-24 -mt-32">
                    <div className="container mx-auto px-4">
                        <div ref={imageContainerRef} className="relative rounded-xl shadow-2xl transition-transform duration-300 ease-out" style={{transformStyle: 'preserve-3d', transform: 'perspective(1200px) rotateX(20deg)'}}>
                            <div className="absolute inset-0 bg-indigo-600/20 rounded-xl blur-3xl"></div>
                            <img 
                                src="https://raw.githubusercontent.com/vibhu-thankii/pulse-dashboard/refs/heads/main/pulse.png" 
                                alt="Pulse Dashboard Preview" 
                                className="relative rounded-xl border border-white/10" 
                                 onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x785/020617/6366F1?text=Pulse+Dashboard'; }}
                            />
                        </div>
                    </div>
                </section>
                
                <section className="py-24 bg-slate-950">
                    <div className="container mx-auto px-4">
                         <div className="text-center mb-16 scroll-animate">
                             <h2 className="text-4xl font-bold text-white">From Raw Data to Actionable Strategy</h2>
                             <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">Pulse connects the dots, so you can focus on what matters most: outmaneuvering the competition.</p>
                         </div>
                         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="scroll-animate">
                                <FeatureCard icon={<Eye size={24} className="text-indigo-400" />} title="Competitor Watchlist">
                                    Live-track your rivals' key metrics, from website size to estimated ad spend, all in one place.
                                </FeatureCard>
                            </div>
                            <div className="scroll-animate" style={{transitionDelay: '100ms'}}>
                                 <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4M4 9h16M4 15h16M10 3v18"></path></svg>} title="Real-Time News">
                                    Get a curated feed of every news article mentioning the companies you track. Never miss a beat.
                                </FeatureCard>
                            </div>
                            <div className="scroll-animate" style={{transitionDelay: '200ms'}}>
                                <FeatureCard icon={<TrendingUp size={24} className="text-indigo-400" />} title="Market Trends">
                                    Visualize news volume and market sentiment with interactive charts that reveal the bigger picture.
                                </FeatureCard>
                            </div>
                            <div className="scroll-animate" style={{transitionDelay: '300ms'}}>
                                <FeatureCard icon={<Cpu size={24} className="text-indigo-400" />} title="AI-Powered Summaries">
                                    Our Pro plan unlocks AI-generated executive summaries, turning raw data into actionable intelligence.
                                </FeatureCard>
                            </div>
                         </div>
                    </div>
                </section>
                
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 scroll-animate">
                             <h2 className="text-4xl font-bold text-white">Built for teams that refuse to lose.</h2>
                         </div>
                         <div className="grid lg:grid-cols-3 gap-8">
                             <div className="scroll-animate">
                                <TestimonialCard 
                                    quote="Pulse is our command center. We've saved hundreds of hours on manual research and made smarter decisions because of it. I can't imagine working without it."
                                    name="Sarah Johnson"
                                    title="CMO, Innovate Inc."
                                    avatar="https://i.pravatar.cc/150?u=sarah"
                                />
                             </div>
                             <div className="scroll-animate" style={{transitionDelay: '150ms'}}>
                                <TestimonialCard 
                                    quote="The AI summaries alone are worth the price. It's like having a dedicated market analyst on our team, 24/7."
                                    name="David Chen"
                                    title="Founder, NextGen Ltd."
                                    avatar="https://i.pravatar.cc/150?u=david"
                                />
                             </div>
                              <div className="scroll-animate" style={{transitionDelay: '300ms'}}>
                                <TestimonialCard 
                                    quote="We identified a major competitor move three weeks before it was public knowledge, all thanks to the news feed. That's an insane advantage."
                                    name="Maria Garcia"
                                    title="Head of Strategy, Visionary Tech"
                                    avatar="https://i.pravatar.cc/150?u=maria"
                                />
                             </div>
                         </div>
                    </div>
                </section>

                <section id="pricing" className="py-24 bg-slate-950">
                     <div className="container mx-auto px-4">
                         <div className="text-center mb-16 scroll-animate">
                             <h2 className="text-4xl font-bold text-white">Simple, powerful pricing.</h2>
                             <p className="mt-4 text-lg text-gray-400">Start for free, then scale as you grow.</p>
                         </div>
                         <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto scroll-animate">
                            <PricingTier 
                                plan="Starter"
                                price="$0"
                                description="For individuals and small teams just getting started with competitive analysis."
                                features={[
                                    "Track up to 3 competitors",
                                    "Daily news monitoring",
                                    "Basic market trends"
                                ]}
                            />
                             <PricingTier 
                                plan="Pro"
                                price="$49"
                                isFeatured={true}
                                description="For growing teams that need the full power of automated intelligence."
                                features={[
                                    "Track up to 50 competitors",
                                    "Advanced analytics & charts",
                                    "Weekly AI-Powered summaries",
                                    "Priority email support"
                                ]}
                            />
                         </div>
                     </div>
                </section>
            </main>

            <footer className="py-12">
                 <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Pulse Inc. All rights reserved.</p>
                 </div>
            </footer>
        </div>
    );
}
