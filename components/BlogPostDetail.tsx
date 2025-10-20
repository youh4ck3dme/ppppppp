
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';

// Fix: The 'blogPosts' constant was removed from constants.ts.
// As this component appears to be unused, providing an empty array
// to resolve the reference error and allow the component to compile.
const blogPosts: any[] = [];

interface BlogPostDetailProps {
    postId: string;
    onNavigate: (intent: NavigationIntent) => void;
}

const StructuredContent: React.FC<{ content: any[] }> = ({ content }) => {
    if (!Array.isArray(content)) {
        return <p>{String(content)}</p>;
    }
    
    return (
        <>
            {content.map((block, index) => {
                switch (block.type) {
                    case 'p':
                        return <p key={index}>{block.content}</p>;
                    case 'h3':
                        return <h3 key={index} className="text-3xl font-serif font-bold text-white mt-10 mb-4">{block.content}</h3>;
                    case 'img':
                        return (
                            <div key={index} className="my-8">
                                <img src={block.src} alt={block.alt || 'Blog image'} className="rounded-lg shadow-lg mx-auto w-full" loading="lazy" />
                            </div>
                        );
                    case 'ol':
                        return (
                            <ol key={index} className="list-decimal list-inside space-y-2">
                                {block.items.map((item: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </ol>
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
};

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ postId, onNavigate }) => {
    const { t, tStructured } = useTranslation();
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return (
            <div className="text-center py-40 min-h-screen flex flex-col items-center justify-center">
                <p className="text-xl text-white">Post not found.</p>
                <button onClick={() => onNavigate({ view: 'main', sectionId: 'blog' })} className="mt-6 text-white hover:underline font-bold">
                    {t('blog_backButton')}
                </button>
            </div>
        );
    }

    const title = t(`blog_${post.id}_title`);
    const category = t(`blog_${post.id}_category`);
    const content = tStructured(`blog_${post.id}_content`);

    return (
        <div className="animate-fade-in-up py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => onNavigate({ view: 'main', sectionId: 'blog' })} className="inline-flex items-center text-gray-300 hover:text-[var(--color-accent)] transition-colors mb-10 group font-bold">
                     <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 mr-2">&larr;</span>
                    {t('blog_backButton')}
                </button>
                
                <article>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">{category}</p>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">{title}</h1>
                    
                    <div className="prose prose-lg text-gray-300 max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-strong:text-gray-200">
                        <StructuredContent content={content} />
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPostDetail;
