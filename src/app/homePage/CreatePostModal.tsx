import React, { useState } from 'react';
import styles from './CreatePostModal.module.css';
import { Image } from '@/app/components/svgs';
import { supabase } from '../lib/supabaseclient';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, username }) => {
    if (!isOpen) return null;

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let imageUrl = null;
        if (imageFile) {
            const { data, error } = await supabase.storage
                .from('post-images') // your bucket name
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

            if (error) {
                alert('Image upload failed!');
                return;
            }
            // Get the public URL
            const { data: publicUrlData } = supabase
                .storage
                .from('post-images')
                .getPublicUrl(data.path);
            imageUrl = publicUrlData.publicUrl;
        }
        // Handle form submission

        const { error } = await supabase
            .from('Posts')
            .insert([
                {
                    topic,
                    content,
                    image_url: imageUrl,
                    user_id: userId,
                    updated_at: new Date().toISOString()
                }
            ]);
        if (!error) {
            setTopic('');
            setContent('');
            setImageFile(null);
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.avatar}></div>
                    <span className={styles.username}>{username}</span>
                    <button className={styles.topicBtn}>+ Topic</button>
                </div>
                <input
                    type="text"
                    placeholder="Topic"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className={styles.topicInput}
                />
                <textarea
                    className={styles.textarea}
                    placeholder="Write something..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    onChange={handleImageChange}
                />
                <div className={styles.footer}>
                    <button className={styles.postBtn} onClick={handleSubmit}>Post</button>
                    <button
                        className={styles.imageBtn}
                        onClick={() => {
                            const input = document.getElementById('image-upload') as HTMLInputElement | null;
                            if (input) input.click();
                        }}
                    >
                        <span><Image /></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
