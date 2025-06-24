import React from 'react';
import styles from './CreatePostModal.module.css';
import { Image } from '@/app/components/svgs';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, username }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.avatar}></div>
                    <span className={styles.username}>{username}</span>
                    <button className={styles.topicBtn}>+ Topic</button>
                </div>
                <textarea
                    className={styles.textarea}
                    placeholder="Write something..."
                />
                <div className={styles.footer}>
                    <button className={styles.postBtn}>Post</button>
                    <button className={styles.imageBtn}>
                        <span><Image /> </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
