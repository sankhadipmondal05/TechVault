import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, ExternalLink, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-card/40 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="inline-flex items-center group">
              <span className="font-display font-extrabold text-xl tracking-wider text-foreground neu-text-indent-accent uppercase select-none">
                TECHVAULT
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed font-body">
              Curating and organizing world-class computer science and software engineering lectures into structured paths and one-shot revision marathons.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground neu-inset px-3 py-1.5 rounded-full">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span>Zero-Auth & Privacy First</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/courses" className="hover:text-foreground transition-colors">
                  Structured Courses
                </Link>
              </li>
              <li>
                <Link to="/one-shots" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <span>One-Shots & Revision</span>
                  <Sparkles className="h-3 w-3 text-amber-500" />
                </Link>
              </li>
              <li>
                <Link to="/subjects" className="hover:text-foreground transition-colors">
                  All Technical Subjects
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-foreground transition-colors">
                  Full Catalog & Filters
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Features */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/favorites" className="hover:text-foreground transition-colors">
                  Saved Bookmarks (Local)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/60 text-xs">
                  Offline Local Progress Sync
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/60 text-xs">
                  Official YouTube Embeds
                </span>
              </li>
            </ul>
          </div>

          {/* Attribution & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Attribution & Policy
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              All video content is embedded from and hosted by YouTube. Video creators retain all rights, views, and monetization.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Youtube className="h-4 w-4 text-red-500" />
              <span>Powered by YouTube Embeds</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} TechVault. Non-commercial open educational discovery library.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://sankhadipmondal.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Made by Sankhadip
            </a>
            <a
              href="https://sankhadipmondal.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span>Portfolio</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
