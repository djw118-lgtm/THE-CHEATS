import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { ArrowLeft, Home } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { gameType, setGameType } = useLotteryData();
  
  const goBack = () => window.history.back();

  const navLinks = [
    { path: "/gaps", label: "GAPS" },
    { path: "/streaks", label: "STREAKS" },
    { path: "/repeats", label: "REPEATS" },
    { path: "/watch", label: gameType === 'pick4' ? "QUAD WATCH" : "TRIPLE WATCH" },
    { path: "/calculator", label: "CALCULATOR" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary tracking-tight cursor-pointer" data-testid="logo">
                THE CHEAT
              </h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setGameType('pick3')}
                  className={`px-4 py-1.5 rounded text-sm font-semibold transition-all ${
                    gameType === 'pick3' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:text-primary'
                  }`}
                  data-testid="button-pick3"
                >
                  Pick 3
                </button>
                <button
                  onClick={() => setGameType('pick4')}
                  className={`px-4 py-1.5 rounded text-sm font-semibold transition-all ${
                    gameType === 'pick4' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:text-primary'
                  }`}
                  data-testid="button-pick4"
                >
                  Pick 4
                </button>
              </div>
              <div className="h-6 w-px bg-border"></div>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`nav-link px-3 py-2 text-sm font-medium hover:text-primary transition-colors ${
                    isActive(link.path) ? 'active text-primary' : 'text-foreground'
                  }`}
                  data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-6 w-px bg-border"></div>
              <button
                onClick={goBack}
                className="nav-link px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK
              </button>
              <Link 
                href="/" 
                className={`nav-link px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  location === '/' ? 'active text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
                data-testid="link-home"
              >
                <Home className="w-4 h-4" />
                HOME
              </Link>
            </div>
          </div>
          
          {/* Desktop Upgrade Button */}
          <div className="hidden md:block">
            <button 
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors shadow-lg"
              data-testid="button-upgrade"
            >
              UPGRADE - $9.99/mo
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu md:hidden bg-muted border-t border-border ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="px-4 py-4 space-y-3">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                setGameType('pick3');
                setIsMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded font-semibold text-sm transition-colors ${
                gameType === 'pick3' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card text-foreground'
              }`}
              data-testid="button-mobile-pick3"
            >
              Pick 3
            </button>
            <button
              onClick={() => {
                setGameType('pick4');
                setIsMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded font-semibold text-sm transition-colors ${
                gameType === 'pick4' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card text-foreground'
              }`}
              data-testid="button-mobile-pick4"
            >
              Pick 4
            </button>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 rounded hover:bg-card transition-colors text-foreground"
              data-testid={`link-mobile-${link.label.toLowerCase().replace(' ', '-')}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border my-3"></div>
          <button
            onClick={() => {
              goBack();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            data-testid="button-mobile-back"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            data-testid="link-mobile-home"
          >
            <Home className="w-4 h-4" />
            HOME
          </Link>
          <button 
            className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors mt-3"
            data-testid="button-mobile-upgrade"
          >
            UPGRADE - $9.99/mo
          </button>
        </div>
      </div>
    </nav>
  );
}
