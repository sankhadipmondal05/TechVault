import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { IOneShot } from '../types';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { OneShotCard } from '../components/cards/OneShotCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useFavorites } from '../hooks/useFavorites';
import {
  Bookmark,
  ChevronRight,
  Clock,
  ExternalLink,
  Share2,
  Sparkles
} from 'lucide-react';

export const OneShotDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [oneShot, setOneShot] = useState<IOneShot | null>(null);
  const [related, setRelated] = useState<IOneShot[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const { isOneShotFavorite, toggleFavoriteOneShot } = useFavorites();

  useEffect(() => {
    if (!slug) return;

    const fetchOneShot = async () => {
      try {
        setLoading(true);
        const res = await apiService.getOneShotBySlug(slug);
        setOneShot(res.data);
        setRelated(res.related || []);
        document.title = `${res.data.title} | TechVault`;
      } catch (err) {
        console.error('Failed to load one shot', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOneShot();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <Skeleton className="aspect-video rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!oneShot) {
    return (
      <EmptyState
        title="One-Shot Video Not Found"
        description="The revision marathon you are looking for does not exist."
        actionLabel="Explore One-Shots"
        onAction={() => (window.location.href = '/one-shots')}
      />
    );
  }

  const isFav = isOneShotFavorite(oneShot._id);
  const subjectName = typeof oneShot.subject === 'object' && oneShot.subject !== null
    ? oneShot.subject.name
    : oneShot.subjectSlug.replace('-', ' ');

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/one-shots" className="hover:text-foreground">One-Shots</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium line-clamp-1 max-w-md">
            {oneShot.title}
          </span>
        </nav>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copiedLink ? 'Copied' : 'Share'}
          </Button>

          <Button
            variant={isFav ? 'accent' : 'outline'}
            size="sm"
            onClick={() => toggleFavoriteOneShot(oneShot)}
            className="text-xs"
          >
            <Bookmark className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`} />
            {isFav ? 'Saved' : 'Favorite'}
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <VideoPlayer
        videoId={oneShot.youtubeVideoId}
        title={oneShot.title}
        autoPlay={false}
      />

      {/* Details Box inside Neumorphic Container */}
      <div className="p-6 sm:p-8 rounded-3xl neu-card space-y-6">
        {/* Inner Sunken Header Tray */}
        <div className="p-5 rounded-2xl neu-inset space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider neu-accent-glow text-white flex items-center gap-1 font-display shadow-sm">
              <Sparkles className="h-3 w-3" />
              ONE-SHOT MARATHON
            </span>
            <Link
              to={`/subjects/${oneShot.subjectSlug}`}
              className="text-xs font-bold px-3 py-1 rounded-full neu-btn text-muted-foreground hover:text-accent font-display uppercase tracking-wider"
            >
              {subjectName}
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground leading-snug">
            {oneShot.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Taught by <span className="font-semibold text-foreground/80">{oneShot.instructor}</span>
          </p>
        </div>

        {/* Inner Sunken Overview Tray */}
        <div className="p-5 rounded-2xl neu-inset space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed font-body">
            {oneShot.description}
          </p>

          {/* Metadata stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                Total Duration
              </span>
              <span className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {oneShot.duration}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                Target Level
              </span>
              <span className="text-sm font-semibold text-foreground mt-0.5 block">
                {oneShot.level}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                Language
              </span>
              <span className="text-sm font-semibold text-foreground mt-0.5 block">
                {oneShot.language}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                Discipline
              </span>
              <span className="text-sm font-semibold text-foreground mt-0.5 block">
                {subjectName}
              </span>
            </div>
          </div>

          {/* Tags */}
          {oneShot.tags && oneShot.tags.length > 0 && (
            <div className="pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
              {oneShot.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full bg-background/80 text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* More One-Shots */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              More One-Shots in {subjectName}
            </h3>
            <Link
              to={`/subjects/${oneShot.subjectSlug}`}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View Subject</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((item) => (
              <OneShotCard key={item._id} oneShot={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
