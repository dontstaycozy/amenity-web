import React, { useEffect, useState } from 'react';
import supadata from '../lib/supabaseclient';

interface Comment {
    id: number;
    created_at: string;
    content: string;
    replies: string | null; // will be parsed as Reply[]
    post_id: number;
    user_id: string;
}

interface Reply {
    id: string; // unique id for reply (can use Date.now() or uuid)
    user_id: string;
    content: string;
    created_at: string;
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

    // Refetch comments (for replies)
    const refetchComments = async () => {
        const { data } = await supadata
            .from('post_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });
        setComments(data || []);
    };

    return (
        <div style={{ marginTop: '1rem', background: '#18213a', borderRadius: 8, padding: '1rem' }}>
            <h4 style={{ marginBottom: 8 }}>Comments</h4>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                {comments.length === 0 && <div>No comments yet.</div>}
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={currentUserId}
                        onReplyAdded={refetchComments}
                    />
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
                        cursor: 'pointer',
                    }}
                    disabled={loading}
                >
                    Post
                </button>
            </form>
        </div>
    );
};

const CommentItem: React.FC<{
    comment: Comment;
    currentUserId: string;
    onReplyAdded: () => void;
}> = ({ comment, currentUserId, onReplyAdded }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    let replies: Reply[] = [];
    if (comment.replies) {
        try {
            replies = JSON.parse(comment.replies);
        } catch {
            replies = [];
        }
    }

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newReply: Reply = {
            id: Date.now().toString(),
            user_id: currentUserId,
            content: replyText,
            created_at: new Date().toISOString(),
        };

        const updatedReplies = [...replies, newReply];

        await supadata
            .from('post_comments')
            .update({ replies: JSON.stringify(updatedReplies) })
            .eq('id', comment.id);

        setReplyText('');
        setShowReplyInput(false);
        onReplyAdded();
    };

    return (
        <div style={{ marginBottom: 12, padding: 8, background: '#22305a', borderRadius: 6 }}>
            <div style={{ fontSize: 14, color: '#ffe8a3' }}>
                <span style={{ marginRight: 8 }}>[User]</span>
                <span style={{ color: '#aaa', fontSize: 12 }}>{new Date(comment.created_at).toLocaleString()}</span>
            </div>
            <div style={{ marginTop: 4 }}>{comment.content}</div>
            {/* Replies */}
            <div style={{ marginLeft: 24, marginTop: 8 }}>
                {replies.map(reply => (
                    <div key={reply.id} style={{ background: '#2d3a5a', borderRadius: 6, padding: 6, marginBottom: 6 }}>
                        <div style={{ fontSize: 13, color: '#ffe8a3' }}>
                            <span style={{ marginRight: 8 }}>[User]</span>
                            <span style={{ color: '#aaa', fontSize: 11 }}>{new Date(reply.created_at).toLocaleString()}</span>
                        </div>
                        <div style={{ marginTop: 2 }}>{reply.content}</div>
                    </div>
                ))}
            </div>
            {/* Reply button and input */}
            <button
                style={{ marginTop: 6, background: 'none', color: '#ffe8a3', border: 'none', cursor: 'pointer', fontSize: 13 }}
                onClick={() => setShowReplyInput(!showReplyInput)}
            >
                Reply
            </button>
            {showReplyInput && (
                <form onSubmit={handleReplySubmit} style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        style={{ flex: 1, borderRadius: 6, border: '1px solid #333', padding: 6, background: '#1e2b48', color: '#fff' }}
                    />
                    <button
                        type="submit"
                        style={{ background: '#ffe8a3', color: '#22305a', border: 'none', borderRadius: 6, padding: '0 12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Post
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommentSection; 