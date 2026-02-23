import { useRef, useEffect } from "react";

const PostMenu = ({ onEdit, onDelete }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const close = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <button 
        onClick={onEdit}
        className="block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors hover:pl-6 duration-200"
      >
        Edit
      </button>
      <button 
        onClick={onDelete}
        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors hover:pl-6 duration-200"
      >
        Delete
      </button>
    </div>
  );
};

export default PostMenu;