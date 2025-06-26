import React, { useState, useEffect } from 'react';
import styles from './CreatePostModal.module.css';
import { Image } from '@/app/components/svgs';
import supadata from '../lib/supabaseclient';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

// Upload image and return public URL or null
async function uploadImage(file: File): Promise<string | null> {
  const filePath = `public/${Date.now()}_${file.name}`;
  const { data, error } = await supadata.storage
    .from('post-images')
    .upload(filePath, file);

  if (error || !data) {
    console.error('Image upload failed:', error?.message);
    return null;
  }

  const { data: publicUrlData } = supadata.storage
    .from('post-images')
    .getPublicUrl(data.path);

  return publicUrlData?.publicUrl || null;
}

// Add post to database
async function addPost(
  content: string,
  image_url: string | null,
  topic: string,
  usernameOrEmail: string
): Promise<boolean> {

  console.log("username: " + usernameOrEmail);
  const { data: userData, error: userError } = await supadata

    .from('Users_Accounts')
    .select('userId')
    .eq('username', usernameOrEmail);

  if (userError || !userData || userData.length === 0) {
    console.error('User lookup failed:', userError?.message);
    return false;
  }

  const user_id = userData[0].userId;
  const updatedAt = new Date().toISOString();

  const { error: postError } = await supadata.from('Posts').insert([
    {
      content: content,
      image_url: image_url,
      topic: topic,
      user_id,
      updated_at: updatedAt,
    },
  ]);

  if (postError) {
    console.error('Post insert error:', postError.message);
    return false;
  }

  return true;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, username }) => {
  if (!isOpen) return null;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        alert('Image upload failed!');
        return;
      }
    }

    const success = await addPost(content, imageUrl, topic, username);

    if (success) {
      alert('Post created!');
      setContent('');
      setTopic('');
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } else {
      alert('Failed to create post. Try again.');
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
                {/* Image preview */}
                {imagePreview && (
                    <div style={{ margin: '1rem', textAlign: 'center' }}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12 }}
                        />
                    </div>
                )}
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
