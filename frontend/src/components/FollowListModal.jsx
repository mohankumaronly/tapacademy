const FollowListModal = ({ title, users, onClose, onOpenProfile }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white w-80 rounded-lg shadow-lg">

        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="max-h-80 overflow-y-auto">

          {users.length === 0 && (
            <p className="text-center text-gray-500 p-4">No users</p>
          )}

          {users.map(u => (
            <div
              key={u._id}
              onClick={() => onOpenProfile(u._id)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={u.avatarUrl || "/avatar-placeholder.png"}
                className="w-9 h-9 rounded-full border"
              />
              <p className="font-medium text-sm">
                {u.firstName} {u.lastName}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FollowListModal;
