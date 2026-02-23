const PostActionButton = ({ icon: Icon, text, color, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center space-x-2 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-md transition-all group hover:scale-105 duration-200"
    >
      <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform duration-200`} />
      <span className="text-sm hidden md:block">{text}</span>
    </button>
  );
};

export default PostActionButton;