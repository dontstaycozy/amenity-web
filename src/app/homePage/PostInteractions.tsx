import React, { useEffect, useState } from 'react';
import { Like, Dislike } from '@/app/components/svgs';
import supadata from '../lib/supabaseclient';

interface PostInteractionsProps {
  postId: number;
  currentUserId: string;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({ postId, currentUserId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const [userDislike, setUserDislike] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchInteractionState = async () => {
    const { data: interactions } = await supadata
      .from('post_interactions')
      .select('likes, dislikes, user_id')
      .eq('post_id', postId);

    if (interactions) {
      setLikeCount(interactions.filter(i => i.likes === 1).length);
      setDislikeCount(interactions.filter(i => i.dislikes === 1).length);
      const user = interactions.find(i => i.user_id === currentUserId);
      setUserLike(user?.likes === 1);
      setUserDislike(user?.dislikes === 1);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchInteractionState();
  }, [postId, currentUserId]);

  const handleLike = async () => {
    if (!currentUserId) return;
    setLoading(true);

    const { data: existing } = await supadata
      .from('post_interactions')
      .select('id, likes, dislikes')
      .eq('post_id', postId)
      .eq('user_id', currentUserId)
      .maybeSingle();

    if (existing) {
      if (existing.likes === 1) {
        await supadata.from('post_interactions').delete().eq('id', existing.id);
        setUserLike(false);
        setUserDislike(false);
        setLikeCount(prev => Math.max(prev - 1, 0));
      } else {
        await supadata
          .from('post_interactions')
          .update({ likes: 1, dislikes: 0 })
          .eq('id', existing.id);
        setUserLike(true);
        setUserDislike(false);
        setLikeCount(prev => Math.max(prev + 1, 0));
        setDislikeCount(prev =>
          existing.dislikes === 1 ? Math.max(prev - 1, 0) : prev
        );
      }
    } else {
      await supadata.from('post_interactions').insert([
        { post_id: postId, user_id: currentUserId, likes: 1, dislikes: 0 },
      ]);
      setUserLike(true);
      setUserDislike(false);
      setLikeCount(prev => Math.max(prev + 1, 0));
    }

    setLoading(false);
  };

  const handleDislike = async () => {
    if (!currentUserId) return;
    setLoading(true);

    const { data: existing } = await supadata
      .from('post_interactions')
      .select('id, likes, dislikes')
      .eq('post_id', postId)
      .eq('user_id', currentUserId)
      .maybeSingle();

    if (existing) {
      if (existing.dislikes === 1) {
        await supadata.from('post_interactions').delete().eq('id', existing.id);
        setUserDislike(false);
        setUserLike(false);
        setDislikeCount(prev => Math.max(prev - 1, 0));
      } else {
        await supadata
          .from('post_interactions')
          .update({ dislikes: 1, likes: 0 })
          .eq('id', existing.id);
        setUserDislike(true);
        setUserLike(false);
        setDislikeCount(prev => Math.max(prev + 1, 0));
        setLikeCount(prev =>
          existing.likes === 1 ? Math.max(prev - 1, 0) : prev
        );
      }
    } else {
      await supadata.from('post_interactions').insert([
        { post_id: postId, user_id: currentUserId, likes: 0, dislikes: 1 },
      ]);
      setUserDislike(true);
      setUserLike(false);
      setDislikeCount(prev => Math.max(prev + 1, 0));
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
      <button
        onClick={handleLike}
        disabled={loading}
        style={{
          background: 'none',
          border: 'none',
          color: userLike ? '#ffe8a3' : '#fff',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 16,
        }}
        aria-label="Like"
      >
        <Like style={{ width: 24, height: 24, marginRight: 6 }} />
        <span>{likeCount}</span>
      </button>

      <button
        onClick={handleDislike}
        disabled={loading}
        style={{
          background: 'none',
          border: 'none',
          color: userDislike ? '#ffe8a3' : '#fff',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 16,
        }}
        aria-label="Dislike"
      >
        <Dislike style={{ width: 24, height: 24 }} />
      </button>
    </div>
  );
};

export default PostInteractions;
