import React, { useEffect, useState } from 'react';
import supadata from '../lib/supabaseclient';

interface Comment {
    id: number;
    created_at: string;
    content: string;
    replies: string | null;
    post_id: number;
    user_id: string;
}

interface CommentSectionProps {
    postId: number;
    currentUserId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUserId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch comments for this post
    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            const { data, error } = await supadata
                .from('post_comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });
            if (error) {
                setError('Failed to fetch comments');
            } else {
                setComments(data || []);
            }
            setLoading(false);
        };
        fetchComments();
    }, [postId]);

    // Handle new comment submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setLoading(true);
        const { error } = await supadata
            .from('post_comments')
            .insert([
                {
                    content: newComment,
                    post_id: postId,
                    user_id: currentUserId,
                    created_at: new Date().toISOString(),
                    replies: null,
                },
            ]);
        if (error) {
            setError('Failed to post comment');
        } else {
            setNewComment('');
            // Refetch comments
            const { data } = await supadata
                .from('post_comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });
            setComments(data || []);
        }
        setLoading(false);
    };

    return (
        <div style={{ marginTop: '1rem', background: '#18213a', borderRadius: 8, padding: '1rem' }}>
            <h4 style={{ marginBottom: 8 }}>Comments</h4>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                {comments.length === 0 && <div>No comments yet.</div>}
                {comments.map(comment => (
                    <div key={comment.id} style={{ marginBottom: 12, padding: 8, background: '#22305a', borderRadius: 6 }}>
                        <div style={{ fontSize: 14, color: '#ffe8a3' }}>
                            <span style={{ marginRight: 8 }}>[User]</span>
                            <span style={{ color: '#aaa', fontSize: 12 }}>{new Date(comment.created_at).toLocaleString()}</span>
                        </div>
                        <div style={{ marginTop: 4 }}>{comment.content}</div>
                        {/* Replies will be handled in the next step */}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ flex: 1, borderRadius: 6, border: '1px solid #333', padding: 8, background: '#1e2b48', color: '#fff' }}
                    disabled={loading}
                />
                <button
                    type="submit"
                    style={{
                        background: '#ffe8a3',
                        color: '#22305a',
                        border: 'none',
                        borderRadius: 6,
                        padding: '0 16px',
                        fontWeight: 600,
                        cursor: 'pointer', // <-- Add this line!
                    }}
                    disabled={loading}
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
