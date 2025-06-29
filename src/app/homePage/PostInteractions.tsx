import React, { useEffect, useState } from 'react';
import { Like, Dislike } from '@/app/components/svgs';
import supadata from '../lib/supabaseclient';

interface PostInteractionsProps {
    postId: number;
    currentUserId: string;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({ postId, currentUserId }: PostInteractionsProps) => {
    const [likeCount, setLikeCount] = useState(0);
    const [userLike, setUserLike] = useState(false);
    const [userDislike, setUserDislike] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch like count and user interaction
    useEffect(() => {
        const fetchData = async () => {
            // Total likes for this post
            const { data: likeRows } = await supadata
                .from('post_interactions')
                .select('likes')
                .eq('post_id', postId);
            setLikeCount(likeRows ? likeRows.reduce((sum: number, row: any) => sum + (row.likes || 0), 0) : 0);

            // User's interaction
            if (currentUserId) {
                const { data: userRows } = await supadata
                    .from('post_interactions')
                    .select('id, likes, dislikes')
                    .eq('post_id', postId)
                    .eq('user_id', currentUserId)
                    .maybeSingle();
                if (!userRows) {
                    setUserLike(false);
                    setUserDislike(false);
                } else {
                    setUserLike(userRows.likes === 1);
                    setUserDislike(userRows.dislikes === 1);
                }
            }
        };
        fetchData();
    }, [postId, currentUserId]);

    // Handle Like/Dislike
    const handleLike = async () => {
        if (!currentUserId) return;
        setLoading(true);
        // Check if user already has a row
        const { data: userRow } = await supadata
            .from('post_interactions')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUserId)
            .maybeSingle();
        if (userRow) {
            if (userRow.likes === 1) {
                // Unlike: delete the row
                await supadata
                    .from('post_interactions')
                    .delete()
                    .eq('id', userRow.id);
            } else {
                // Set like, remove dislike
                await supadata
                    .from('post_interactions')
                    .update({ likes: 1, dislikes: 0 })
                    .eq('id', userRow.id);
            }
        } else {
            // Insert new row
            await supadata
                .from('post_interactions')
                .insert([{ post_id: postId, user_id: currentUserId, likes: 1, dislikes: 0 }]);
        }
        // Refresh
        const { data: likeRows } = await supadata
            .from('post_interactions')
            .select('likes')
            .eq('post_id', postId);
        setLikeCount(likeRows ? likeRows.reduce((sum: number, row: any) => sum + (row.likes || 0), 0) : 0);
        setUserLike((prev: boolean) => !prev);
        setUserDislike(false);
        setLoading(false);
    };

    const handleDislike = async () => {
        if (!currentUserId) return;
        setLoading(true);
        // Check if user already has a row
        const { data: userRow } = await supadata
            .from('post_interactions')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUserId)
            .maybeSingle();
        if (userRow) {
            if (userRow.dislikes === 1) {
                // Undislike: delete the row
                await supadata
                    .from('post_interactions')
                    .delete()
                    .eq('id', userRow.id);
            } else {
                // Set dislike, remove like
                await supadata
                    .from('post_interactions')
                    .update({ likes: 0, dislikes: 1 })
                    .eq('id', userRow.id);
            }
        } else {
            // Insert new row
            await supadata
                .from('post_interactions')
                .insert([{ post_id: postId, user_id: currentUserId, likes: 0, dislikes: 1 }]);
        }
        // Refresh
        const { data: likeRows } = await supadata
            .from('post_interactions')
            .select('likes')
            .eq('post_id', postId);
        setLikeCount(likeRows ? likeRows.reduce((sum: number, row: any) => sum + (row.likes || 0), 0) : 0);
        setUserDislike((prev: boolean) => !prev);
        setUserLike(false);
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
                <Dislike style={{ width: 24, height: 24, marginRight: 0 }} />
            </button>
        </div>
    );
};

export default PostInteractions; 