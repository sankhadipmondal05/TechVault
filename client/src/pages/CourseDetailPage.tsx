import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { ICourse, ILesson } from '../types';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { CourseCurriculum } from '../components/course/CourseCurriculum';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useProgress } from '../hooks/useProgress';
import { useFavorites } from '../hooks/useFavorites';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  FileText,
  Share2
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const { progressMap, toggleLessonCompleted, markLessonCompleted, setLastWatchedLesson } = useProgress();
  const { isCourseFavorite, toggleFavoriteCourse } = useFavorites();

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCourseBySlug(slug);
        setCourse(data);
        document.title = `${data.title} | TechVault`;

        // Check if user has last watched lesson
        const savedProgress = progressMap[data._id];
        let defaultLesson = data.modules?.[0]?.lessons?.[0] || null;

        if (savedProgress?.lastLessonId) {
          for (const m of data.modules) {
            const found = m.lessons.find((l) => l._id === savedProgress.lastLessonId);
            if (found) {
              defaultLesson = found;
              break;
            }
          }
        }

        setCurrentLesson(defaultLesson);
      } catch (err) {
        console.error('Failed to load course details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  // Flatten lessons to handle next / prev navigation easily
  const allLessons = React.useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((m) => m.lessons);
  }, [course]);

  const currentLessonIndex = allLessons.findIndex(
    (l) => l._id === currentLesson?._id
  );

  const [autoPlay, setAutoPlay] = useState(false);

  const handleLessonSelect = (lesson: ILesson, shouldAutoPlay = false) => {
    setCurrentLesson(lesson);
    setAutoPlay(shouldAutoPlay);
    if (course) {
      setLastWatchedLesson(course, lesson._id, lesson.title);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      handleLessonSelect(allLessons[currentLessonIndex - 1], true);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      handleLessonSelect(allLessons[currentLessonIndex + 1], true);
    }
  };

  const handleLessonEnded = () => {
    if (course && currentLesson) {
      markLessonCompleted(course, currentLesson._id);
      // Automatically advance to next lesson in the curriculum
      if (currentLessonIndex < allLessons.length - 1) {
        handleLessonSelect(allLessons[currentLessonIndex + 1], true);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 animate-pulse bg-secondary rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 aspect-video bg-secondary animate-pulse rounded-2xl" />
          <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        title="Course Not Found"
        description="The course you are looking for does not exist or has been removed."
        actionLabel="Explore All Courses"
        onAction={() => (window.location.href = '/courses')}
      />
    );
  }

  const courseProgress = progressMap[course._id];
  const completedIds = courseProgress?.completedLessonIds || [];
  const percent = course.totalLessons > 0
    ? Math.round((completedIds.length / course.totalLessons) * 100)
    : 0;

  const isFav = isCourseFavorite(course._id);
  const subjectName = typeof course.subject === 'object' && course.subject !== null
    ? course.subject.name
    : course.subjectSlug.replace('-', ' ');

  const isCurrentCompleted = currentLesson ? completedIds.includes(currentLesson._id) : false;

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/subjects/${course.subjectSlug}`} className="hover:text-foreground">
            {subjectName}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium line-clamp-1 max-w-[200px] sm:max-w-md">
            {course.title}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copiedLink ? 'Copied Link' : 'Share'}
          </Button>
          <Button
            variant={isFav ? 'accent' : 'outline'}
            size="sm"
            onClick={() => toggleFavoriteCourse(course)}
            className="text-xs"
          >
            <Bookmark className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`} />
            {isFav ? 'Saved' : 'Favorite'}
          </Button>
        </div>
      </div>

      {/* Main Learning Layout: Left Player + Right Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Player & Lesson Details */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          {currentLesson ? (
            <VideoPlayer
              key={currentLesson.youtubeVideoId}
              videoId={currentLesson.youtubeVideoId}
              title={currentLesson.title}
              autoPlay={autoPlay}
              onComplete={handleLessonEnded}
            />
          ) : (
            <div className="aspect-video bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground">
              No lesson selected
            </div>
          )}

          {/* Lesson Actions & Progress Bar inside Neumorphic Container */}
          {currentLesson && (
            <div className="p-6 rounded-3xl neu-card space-y-4">
              {/* Inner Sunken Tray for Lesson Header */}
              <div className="p-4 rounded-2xl neu-inset space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent font-display">
                        Lesson {currentLessonIndex + 1} of {allLessons.length}
                      </span>
                      {currentLesson.important && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full neu-accent-glow text-white">
                          HIGH YIELD TOPIC
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-display font-bold text-foreground">
                      {currentLesson.title}
                    </h2>
                  </div>

                  {/* Mark as Completed Button */}
                  <Button
                    variant={isCurrentCompleted ? 'accent' : 'outline'}
                    size="sm"
                    onClick={() => toggleLessonCompleted(course, currentLesson._id)}
                    className="shrink-0 text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isCurrentCompleted ? 'Completed' : 'Mark as Done'}
                  </Button>
                </div>

                {currentLesson.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                    {currentLesson.description}
                  </p>
                )}
              </div>

              {/* Lesson Resource Links */}
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <div className="p-4 rounded-2xl neu-inset">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-display">
                    <FileText className="h-3.5 w-3.5 text-accent" />
                    Lesson References & Reading
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentLesson.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold neu-btn text-foreground hover:text-accent transition-colors"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Lesson Step Navigation Bar */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentLessonIndex === 0}
                  onClick={handlePreviousLesson}
                  className="text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Lesson
                </Button>

                <div className="text-xs text-muted-foreground font-semibold hidden sm:block">
                  {completedIds.length} of {course.totalLessons} lessons marked complete ({percent}%)
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentLessonIndex >= allLessons.length - 1}
                  onClick={handleNextLesson}
                  className="text-xs"
                >
                  Next Lesson
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Course Overview & Details */}
          <div className="p-6 rounded-3xl neu-card space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">About This Course</h3>
            
            {/* Inner Sunken Overview Tray */}
            <div className="p-4 rounded-2xl neu-inset space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-body">
                {course.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                    Instructor
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {course.instructor}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                    Difficulty Level
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {course.level}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                    Duration
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {course.totalDuration}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block font-display">
                    Language
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {course.language}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
                  {course.tags.map((tag, i) => (
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
        </div>

        {/* Right Column: Course Curriculum Sidebar */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6 sticky top-20">
          {/* Progress Tracker Card */}
          <div className="p-5 rounded-3xl neu-card space-y-3">
            <div className="p-4 rounded-2xl neu-inset space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold font-display">
                <span className="text-foreground">Course Completion</span>
                <span className="text-accent">{percent}%</span>
              </div>
              <ProgressBar value={percent} />
              <p className="text-[11px] text-muted-foreground font-medium">
                Stored locally on your browser. No account needed.
              </p>
            </div>
          </div>

          <CourseCurriculum
            modules={course.modules}
            currentLesson={currentLesson}
            completedLessonIds={completedIds}
            onSelectLesson={handleLessonSelect}
            onToggleComplete={(id) => toggleLessonCompleted(course, id)}
          />
        </div>
      </div>
    </div>
  );
};
