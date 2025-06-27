import React, { useEffect, useState } from 'react';
import supadata from '../lib/supabaseclient';

interface Comment {
  id: number;
  created_at: string;
  content: string;
  post_id: number;
  user_id: string;
}

interface Reply {
  id: number;
  comment_id: number;
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
  const [repliesMap, setRepliesMap] = useState<Record<number, Reply[]>>({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: commentsData, error: commentError } = await supadata
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentError) throw commentError;

      setComments(commentsData || []);

      const commentIds = (commentsData || []).map(c => c.id);
      await fetchReplies(commentIds);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (commentIds: number[]) => {
    if (commentIds.length === 0) return;

    try {
      const { data, error } = await supadata
        .from('comment_replies')
        .select('*')
        .in('comment_id', commentIds)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const map: Record<number, Reply[]> = {};
      (data || []).forEach(reply => {
        if (!map[reply.comment_id]) map[reply.comment_id] = [];
        map[reply.comment_id].push(reply);
      });

      setRepliesMap(map);
    } catch (err) {
      console.error('Failed to fetch replies:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supadata.from('post_comments').insert([
        {
          content: newComment,
          post_id: postId,
          user_id: currentUserId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Insert comment failed:', err);
      setError('Failed to post comment');
    } finally {
      setLoading(false);
    }
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
            replies={repliesMap[comment.id] || []}
            currentUserId={currentUserId}
            onReplyAdded={fetchComments}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{
            flex: 1,
            borderRadius: 6,
            border: '1px solid #333',
            padding: 8,
            background: '#1e2b48',
            color: '#fff',
          }}
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

interface CommentItemProps {
  comment: Comment;
  replies: Reply[];
  currentUserId: string;
  onReplyAdded: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, replies, currentUserId, onReplyAdded }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supadata.from('comment_replies').insert([
        {
          comment_id: comment.id,
          user_id: currentUserId,
          content: replyText,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      setReplyText('');
      setShowReplyInput(false);
      onReplyAdded();
    } catch (err) {
      console.error('Reply insert failed:', err);
      setError('Failed to post reply');
    } finally {
      setLoading(false);
    }
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

      {/* Reply Button and Input */}
      <button
        style={{
          marginTop: 6,
          background: 'none',
          color: '#ffe8a3',
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
        }}
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
            style={{
              flex: 1,
              borderRadius: 6,
              border: '1px solid #333',
              padding: 6,
              background: '#1e2b48',
              color: '#fff',
            }}
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              background: '#ffe8a3',
              color: '#22305a',
              border: 'none',
              borderRadius: 6,
              padding: '0 12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}

      {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
    </div>
  );
};

export default CommentSection;
