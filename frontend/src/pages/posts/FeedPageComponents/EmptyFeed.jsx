import { Linkedin } from "lucide-react";

const EmptyFeed = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center animate-in fade-in duration-500">
      <Linkedin className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-bounce" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
      <p className="text-gray-500">Follow people to see their posts here</p>
    </div>
  );
};

export default EmptyFeed;