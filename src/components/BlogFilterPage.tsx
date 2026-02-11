import { useState, useMemo, useCallback, useEffect } from 'react';
import Fuse from 'fuse.js';

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface PostData {
  title: string;
  description: string;
  slug: string;
  city: string;
  category: string;
  pubDate: string;
  heroImage?: string;
  readingTime: number;
  tags: string[];
  keywords: string[];
  featured?: boolean;
}

interface Props {
  posts: PostData[];
  categories: Category[];
  postsPerPage: number;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop&q=70';

function BlogCard({ post }: { post: PostData }) {
  const formattedDate = new Date(post.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const imgSrc = post.heroImage || PLACEHOLDER_IMAGE;

  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
        <img
          src={imgSrc}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className="pt-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-orange-500 font-medium">{post.category}</span>
          <span className="text-gray-200">&middot;</span>
          <span className="text-xs text-gray-400">{post.readingTime} min read</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors leading-snug line-clamp-2 mb-1">
          {post.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2">{post.description}</p>
      </div>
    </a>
  );
}

export default function BlogFilterPage({ posts, categories, postsPerPage }: Props) {
  // Read initial state from URL params
  const getParams = () => {
    if (typeof window === 'undefined') return { q: '', city: '', category: '', page: 1 };
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      city: params.get('city') || '',
      category: params.get('category') || '',
      page: parseInt(params.get('page') || '1', 10),
    };
  };

  const [searchQuery, setSearchQuery] = useState(() => getParams().q);
  const [cityFilter, setCityFilter] = useState(() => getParams().city);
  const [categoryFilter, setCategoryFilter] = useState(() => getParams().category);
  const [currentPage, setCurrentPage] = useState(() => getParams().page);
  const [searchInput, setSearchInput] = useState(() => getParams().q);

  // Extract unique cities from posts
  const cities = useMemo(
    () => [...new Set(posts.map((p) => p.city))].sort(),
    [posts]
  );

  // Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'description', weight: 0.2 },
          { name: 'city', weight: 0.25 },
          { name: 'tags', weight: 0.1 },
          { name: 'category', weight: 0.05 },
        ],
        threshold: 0.35,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [posts]
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (cityFilter) params.set('city', cityFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (currentPage > 1) params.set('page', String(currentPage));
    const qs = params.toString();
    const newUrl = qs ? `/blog?${qs}` : '/blog';
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, cityFilter, categoryFilter, currentPage]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      result = fuseResults.map((r) => r.item);
    }

    if (cityFilter) {
      result = result.filter((p) => p.city === cityFilter);
    }

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Sort by date (newest first)
    result = [...result].sort(
      (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()
    );

    return result;
  }, [posts, searchQuery, cityFilter, categoryFilter, fuse]);

  // Pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const start = (safePage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(start, start + postsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, cityFilter, categoryFilter]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(searchInput);
    },
    [searchInput]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSearchInput('');
    setCityFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = searchQuery || cityFilter || categoryFilter;

  // Build filter description
  let filterDescription = '';
  if (cityFilter) filterDescription += `${cityFilter} `;
  if (categoryFilter) filterDescription += `${categoryFilter} `;
  if (searchQuery) filterDescription += `matching "${searchQuery}" `;

  return (
    <div className="container-wide py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">Travel Blog</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          {totalPosts} articles to help you plan your perfect trip
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setSearchQuery(searchInput);
                }
              }}
              placeholder="Search articles... (e.g., 'Dubai food', 'visa guide')"
              className="w-full pl-12 pr-20 py-3.5 bg-white border border-gray-300 rounded-xl
                         text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-orange-500 focus:border-orange-500 shadow-sm text-base"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-10">
        {/* City Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            City
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCityFilter('')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !cityFilter
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cityFilter === city
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Category
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('')}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !categoryFilter
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">
            Showing {totalPosts} {filterDescription}articles
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 underline hover:text-blue-800 ml-auto"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Articles Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">No articles found</p>
          <button onClick={clearFilters} className="btn-primary">
            View all articles
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
          {safePage > 1 && (
            <button
              onClick={() => setCurrentPage(safePage - 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
            >
              Previous
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                p === safePage
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}

          {safePage < totalPages && (
            <button
              onClick={() => setCurrentPage(safePage + 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
            >
              Next
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
