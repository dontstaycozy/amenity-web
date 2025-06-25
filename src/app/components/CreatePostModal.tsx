import React from "react";
import Modal from "react-modal";

type CreatePostModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "30px",
    borderRadius: "12px",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onRequestClose,
}) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
    contentLabel="Create Post"
    ariaHideApp={false} // For Next.js, prevents warning
  >
    <h2>Create a Post</h2>
    <textarea
      placeholder="Write something..."
      style={{ width: "100%", height: "100px", marginBottom: "20px" }}
    />
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button onClick={onRequestClose} style={{ marginRight: "10px" }}>
        Cancel
      </button>
      <button>Post</button>
    </div>
  </Modal>
);

export default CreatePostModal;