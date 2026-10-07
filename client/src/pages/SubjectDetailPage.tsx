import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { ISubject, ICourse, IOneShot } from '../types';
import { CourseCard } from '../components/cards/CourseCard';
import { OneShotCard } from '../components/cards/OneShotCard';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import {
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const SubjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [subject, setSubject] = useState<ISubject | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [oneShots, setOneShots] = useState<IOneShot[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'one-shots'>('courses');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const subj = await apiService.getSubjectBySlug(slug);
        setSubject(subj);
        document.title = `${subj.name} Courses & One-Shots | TechVault`;

        const [coursesData, oneShotsData] = await Promise.all([
          apiService.getCoursesBySubject(slug),
          apiService.getOneShotsBySubject(slug)
        ]);

        setCourses(coursesData);
        setOneShots(oneShotsData);
      } catch (err) {
        console.error('Failed to load subject details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <EmptyState
        title="Subject Not Found"
        description="The subject you are looking for does not exist or has been moved."
        actionLabel="Browse Subjects"
        onAction={() => (window.location.href = '/subjects')}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/subjects" className="hover:text-foreground">Subjects</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{subject.name}</span>
      </nav>

      {/* Subject Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-accent/10 text-accent">
            {subject.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {courses.length} Courses · {oneShots.length} One-Shots
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {subject.name}
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {subject.description}
        </p>

        {/* Popular Topics Pill Grid */}
        {subject.popularTopics && subject.popularTopics.length > 0 && (
          <div className="pt-3 border-t border-border/60">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Popular Core Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {subject.popularTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-secondary text-foreground border border-border/40"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors border-b-2 -mb-3.5 ${
              activeTab === 'courses'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Full Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('one-shots')}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors border-b-2 -mb-3.5 ${
              activeTab === 'one-shots'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>One-Shot Revisions ({oneShots.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'courses' && (
        <div>
          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No Courses Available"
              description="Courses for this subject are currently being curated."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'one-shots' && (
        <div>
          {oneShots.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No One-Shots Found"
              description="One-shot revision videos for this subject will be added soon."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {oneShots.map((oneShot) => (
                <OneShotCard key={oneShot._id} oneShot={oneShot} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
