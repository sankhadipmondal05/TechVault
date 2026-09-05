import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { ISubject, ICourse, IOneShot, ICategory } from '../types';
import { CourseCard } from '../components/cards/CourseCard';
import { OneShotCard } from '../components/cards/OneShotCard';
import { SubjectCard } from '../components/cards/SubjectCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useProgress } from '../hooks/useProgress';
import {
  Sparkles,
  ArrowRight,
  Code,
  Database,
  Box,
  Network,
  ShieldCheck,
  Tv,
  ListTree,
  RotateCcw
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredSubjects, setFeaturedSubjects] = useState<ISubject[]>([]);
  const [popularCourses, setPopularCourses] = useState<ICourse[]>([]);
  const [oneShots, setOneShots] = useState<IOneShot[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const { getRecentCourses } = useProgress();
  const recentCourses = getRecentCourses();

  useEffect(() => {
    document.title = 'TechVault — Curated Technical Learning Library';

    const fetchData = async () => {
      try {
        setLoading(true);
        const [subjRes, coursesRes, oneShotsRes, catRes] = await Promise.all([
          apiService.getSubjects({ featured: true }),
          apiService.getCourses({ featured: true, limit: 6 }),
          apiService.getOneShots({ featured: true, limit: 6 }),
          apiService.getCategories()
        ]);

        setFeaturedSubjects(subjRes);
        setPopularCourses(coursesRes.data);
        setOneShots(oneShotsRes.data);
        setCategories(catRes);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-20 md:space-y-24">
      {/* Full-Viewport Hero Section with 50% Submerged Clock Sculpture Flush at Bottom */}
      <section className="relative pt-4 sm:pt-6 xl:pt-4 pb-0 text-center max-w-7xl mx-auto overflow-hidden rounded-3xl min-h-0 xl:min-h-[calc(100vh-92px)] flex flex-col justify-start xl:justify-between">
        {/* Curved Flow Guideline Track */}
        <div className="absolute inset-0 pointer-events-none select-none -z-10 hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 1200 450" fill="none" preserveAspectRatio="none">
            <path
              d="M 60 260 C 130 140, 240 60, 420 140 C 600 220, 780 320, 980 160 C 1080 80, 1140 120, 1160 260"
              stroke="rgba(166, 175, 195, 0.45)"
              strokeWidth="2"
              strokeDasharray="4 6"
              fill="none"
            />
          </svg>
        </div>

        {/* Ambient Violet Glow Spots behind cards */}
        <div className="absolute left-6 top-6 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none select-none -z-10" />
        <div className="absolute right-6 top-6 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none select-none -z-10" />

        {/* --- FLOATING 3D NEUMORPHIC CARDS WITH CLIMBING & BOUNCING SPHERES --- */}
        {/* 1. Top-Left Card: Development */}
        <div className="hidden xl:block absolute left-6 2xl:left-14 top-6 z-20">
          <Link
            to="/subjects?category=computer-science"
            className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-3xl neu-inset p-4 group hover:scale-105 transition-all duration-300 transform -rotate-6"
          >
            <div className="text-accent mb-2 group-hover:scale-110 transition-transform">
              <Code className="h-8 w-8 stroke-[2.5]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground font-display tracking-tight">Development</span>

            {/* Ball: Fixed Shadow Casing + Rolling Inner Core */}
            <div className="absolute w-8 h-8 rounded-full animate-card-bilateral pointer-events-none z-30">
              <div className="w-full h-full rounded-full neu-sphere-casing animate-sphere-squash-bilateral">
                <div className="w-full h-full animate-ball-roll neu-sphere-rolling-core" />
              </div>
            </div>
          </Link>
        </div>

        {/* 2. Bottom-Left Card: Data Science */}
        <div className="hidden xl:block absolute left-12 2xl:left-20 bottom-36 sm:bottom-40 z-20">
          <Link
            to="/subjects?category=data-science-ai"
            className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-3xl neu-inset p-4 group hover:scale-105 transition-all duration-300 transform rotate-3"
          >
            <div className="text-accent mb-2 group-hover:scale-110 transition-transform">
              <Database className="h-8 w-8 stroke-[2.5]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground font-display tracking-tight">Data Science</span>

            {/* Ball: Fixed Shadow Casing + Rolling Inner Core */}
            <div className="absolute w-8 h-8 rounded-full animate-card-bilateral-alt pointer-events-none z-30">
              <div className="w-full h-full rounded-full neu-sphere-casing animate-sphere-squash-bilateral-alt">
                <div className="w-full h-full animate-ball-roll-alt neu-sphere-rolling-core" />
              </div>
            </div>
          </Link>
        </div>

        {/* 3. Top-Right Card: Computer Science */}
        <div className="hidden xl:block absolute right-6 2xl:right-14 top-6 z-20">
          <Link
            to="/subjects?category=core-engineering"
            className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-3xl neu-inset p-4 group hover:scale-105 transition-all duration-300 transform rotate-6"
          >
            <div className="text-accent mb-2 group-hover:scale-110 transition-transform">
              <Network className="h-8 w-8 stroke-[2.5]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground font-display tracking-tight text-center leading-tight">Computer Science</span>

            {/* Ball: Fixed Shadow Casing + Rolling Inner Core */}
            <div className="absolute w-8 h-8 rounded-full animate-card-bilateral-fast pointer-events-none z-30">
              <div className="w-full h-full rounded-full neu-sphere-casing animate-sphere-squash-bilateral-fast">
                <div className="w-full h-full animate-ball-roll-fast neu-sphere-rolling-core" />
              </div>
            </div>
          </Link>
        </div>

        {/* 4. Bottom-Right Card: Engineering */}
        <div className="hidden xl:block absolute right-12 2xl:right-20 bottom-36 sm:bottom-40 z-20">
          <Link
            to="/subjects?category=system-design-devops"
            className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-3xl neu-inset p-4 group hover:scale-105 transition-all duration-300 transform -rotate-3"
          >
            <div className="text-accent mb-2 group-hover:scale-110 transition-transform">
              <Box className="h-8 w-8 stroke-[2.5]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground font-display tracking-tight">Engineering</span>

            {/* Ball: Fixed Shadow Casing + Rolling Inner Core */}
            <div className="absolute w-8 h-8 rounded-full animate-card-bilateral-alt-fast pointer-events-none z-30">
              <div className="w-full h-full rounded-full neu-sphere-casing animate-sphere-squash-bilateral-alt-fast">
                <div className="w-full h-full animate-ball-roll-alt-fast neu-sphere-rolling-core" />
              </div>
            </div>
          </Link>
        </div>

        {/* Center Hero Content (Headline + Subtitle with balanced badge spacing) */}
        <div className="relative z-20 max-w-3xl mx-auto px-4 pt-2 sm:pt-4 xl:pt-2 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-btn text-xs font-semibold text-muted-foreground mb-3 sm:mb-4">
            <span className="flex h-2 w-2 rounded-full neu-accent-glow"></span>
            <span className="font-display tracking-wide uppercase text-[10px]">Curated Technical Learning Library</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-foreground leading-[1.12]">
            Learn technical subjects. <br />
            <span className="bg-gradient-to-r from-accent via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              All in one place.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed font-body mt-2">
            Structured curricula, organized modules, and high-yield one-shot revision videos directly from world-class educators.
          </p>
        </div>

        {/* Center Submerged Clock Sculpture Flush at Bottom */}
        <div className="relative w-full flex justify-center items-end pointer-events-none select-none overflow-hidden h-52 sm:h-64 md:h-80 xl:h-96 mt-6 sm:mt-8 xl:-mt-6">
          <div className="relative w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] md:w-[580px] md:h-[580px] xl:w-[640px] xl:h-[640px] flex items-center justify-center -rotate-90 translate-y-1/2">
            {/* Semicircle Indented Sunken Crescent Groove */}
            <div className="absolute inset-0 rounded-full neu-relief-crescent [clip-path:polygon(50%_0,100%_0,100%_100%,50%_100%)]" />

            {/* Violet Ambient Glowing Backlight */}
            <div className="absolute left-2 w-64 h-64 sm:w-80 sm:h-80 xl:w-[420px] xl:h-[420px] rounded-full neu-accent-glow opacity-85 blur-3xl" />

            {/* Central Raised Floating Convex Plate */}
            <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 xl:w-[420px] xl:h-[420px] rounded-full neu-relief-circle z-10 flex items-center justify-center">
              {/* Inner Core Indented Well */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full neu-inset opacity-60" />
            </div>

            {/* Orbiting Clock Hand / Bead Armature */}
            <div className="absolute inset-0 z-20 animate-neu-orbit-clock flex items-center justify-center pointer-events-none">
              {/* Clean Raised Clay Orbiting Bead */}
              <div className="absolute -top-4 sm:-top-5 xl:-top-6 w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 rounded-full neu-btn shadow-md" />
            </div>
          </div>
        </div>

        {/* Bottom Fade Gradient for seamless hero section transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 xl:h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-20" />
      </section>

      {/* Continue Learning Banner (Neumorphic Card with Inset Progress) */}
      {recentCourses.length > 0 && (
        <section className="p-6 rounded-3xl neu-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider font-display">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Continue Learning</span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                {recentCourses[0].courseTitle}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {recentCourses[0].completedLessonIds.length} lessons completed
                {recentCourses[0].lastLessonTitle && (
                  <span> · Next up: <strong className="text-foreground">{recentCourses[0].lastLessonTitle}</strong></span>
                )}
              </p>
            </div>
            <Link to={`/courses/${recentCourses[0].courseSlug}`}>
              <Button variant="accent" size="sm">
                Resume Course
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured Subjects */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Foundations
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Featured Subjects
            </h2>
          </div>
          <Link
            to="/subjects"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <span>All Subjects</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSubjects.map((subject) => (
              <SubjectCard key={subject._id} subject={subject} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Courses */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Step-by-Step
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Popular Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <span>View All Courses</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* One-Shot Revision Marathons */}
      <section className="space-y-6 p-6 sm:p-8 rounded-3xl border border-border bg-secondary/30">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Exam & Interview Prep</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              High-Yield One-Shot Revisions
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Complete subject marathons and fast crash courses designed for exam revisions, GATE preparation, and technical interviews.
            </p>
          </div>
          <Link
            to="/one-shots"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse All One-Shots</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {oneShots.map((oneShot) => (
              <OneShotCard key={oneShot._id} oneShot={oneShot} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by Category */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Taxonomy
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* Value Prop / Why TechVault */}
      <section className="pt-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-accent uppercase tracking-wider font-display">
            Curated Library
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
            Built for Serious Technical Learning
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We turn scattered YouTube playlists into structured, accessible engineering curricula with local progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-accent flex items-center justify-center">
              <ListTree className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">Structured Curricula</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every course is divided into sequential modules and labeled lessons with key focus topics.
            </p>
          </div>

          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-purple-400 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">One-Shot Discovery</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Quickly find 2–5 hour complete revision marathons before semester exams and technical interviews.
            </p>
          </div>

          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">Zero-Auth Privacy</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No logins, accounts, or cookies required. Your completed lessons and bookmarks stay strictly on your device.
            </p>
          </div>

          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-violet-400 flex items-center justify-center">
              <Tv className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">Official Embeds</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Clean player respecting original YouTube creator attribution and view metrics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
